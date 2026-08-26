#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");
const {spawnSync} = require("node:child_process");
const {allPassed, readJson, runVerification, validateGoal, verificationFingerprint, writeJson} = require("./lib.cjs");

const args = process.argv.slice(2);
const valueAfter = (flag) => {
  const index = args.indexOf(flag);
  return index === -1 ? undefined : args[index + 1];
};
const verifyOnly = args.includes("--verify-only");
const reset = args.includes("--reset");
const requestedAgent = valueAfter("--agent") ?? process.env.LOOP_AGENT ?? undefined;
const workspaceRoot = path.resolve(process.env.LOOP_WORKSPACE_ROOT ?? path.join(__dirname, "../.."));

const configPath = path.join(workspaceRoot, ".loop/config.local.json");
const exampleConfigPath = path.join(workspaceRoot, ".loop/config.example.json");
const config = fs.existsSync(configPath) ? readJson(configPath) : fs.existsSync(exampleConfigPath) ? readJson(exampleConfigPath) : {};
const goalPath = path.resolve(workspaceRoot, valueAfter("--goal") ?? config.goal ?? ".loop/active-goal.json");

const fail = (message) => {
  console.error(message);
  process.exit(1);
};

if (!fs.existsSync(goalPath)) fail(`Goal file not found: ${goalPath}\nCopy .loop/goal.example.json to .loop/active-goal.json and edit it first.`);
const goal = readJson(goalPath);
const validationErrors = validateGoal(goal);
if (validationErrors.length) fail(`Invalid goal:\n${validationErrors.map((error) => `- ${error}`).join("\n")}`);

const runtimeRoot = path.join(workspaceRoot, ".loop/runtime", goal.id);
const statePath = path.join(runtimeRoot, "state.json");
const ledgerPath = path.join(runtimeRoot, "attempts.jsonl");
const reportPath = path.join(runtimeRoot, "final-report.md");
fs.mkdirSync(runtimeRoot, {recursive: true});

if (reset) {
  for (const entry of fs.readdirSync(runtimeRoot)) fs.rmSync(path.join(runtimeRoot, entry), {recursive: true, force: true});
}

const startedAt = fs.existsSync(statePath) ? readJson(statePath).startedAt : new Date().toISOString();
let state = fs.existsSync(statePath) ? readJson(statePath) : {
  goalId: goal.id,
  status: "running",
  startedAt,
  updatedAt: startedAt,
  attempts: 0,
  consecutiveNoProgress: 0,
  lastFingerprint: null,
  lastVerification: null,
};

const elapsedMinutes = () => (Date.now() - Date.parse(state.startedAt)) / 60000;
const appendLedger = (entry) => fs.appendFileSync(ledgerPath, `${JSON.stringify(entry)}\n`);
const saveState = () => {
  state.updatedAt = new Date().toISOString();
  writeJson(statePath, state);
};
const writeReport = () => {
  const checks = state.lastVerification ?? [];
  const lines = [
    `# Loop report: ${goal.id}`,
    "",
    `- Status: ${state.status}`,
    `- Objective: ${goal.objective}`,
    `- Attempts: ${state.attempts}/${goal.limits.maxAttempts}`,
    `- Started: ${state.startedAt}`,
    `- Updated: ${state.updatedAt}`,
    `- Elapsed minutes: ${elapsedMinutes().toFixed(2)}`,
    `- Human gates: ${goal.humanGates.join(", ") || "none"}`,
    "",
    "## Acceptance criteria",
    "",
    ...goal.acceptance.map((criterion) => `- ${criterion}`),
    "",
    "## Latest verification evidence",
    "",
    ...checks.flatMap((check) => [
      `### ${check.name}: ${check.exitCode === 0 && !check.error ? "PASS" : "FAIL"}`,
      "",
      `Command: \`${check.command}\``,
      "",
      check.error ? `Error: ${check.error}` : "",
      check.stdout ? `\n\`\`\`text\n${check.stdout}\n\`\`\`` : "",
      check.stderr ? `\n\`\`\`text\n${check.stderr}\n\`\`\`` : "",
      "",
    ]),
  ];
  fs.writeFileSync(reportPath, `${lines.filter((line) => line !== "").join("\n")}\n`);
};
const finish = (status, reason, exitCode) => {
  state.status = status;
  state.reason = reason;
  saveState();
  appendLedger({at: state.updatedAt, type: "terminal", status, reason, attempts: state.attempts});
  writeReport();
  console.log(`${status}: ${reason}`);
  console.log(`Evidence: ${reportPath}`);
  process.exit(exitCode);
};
const verify = (attempt) => {
  const results = runVerification(goal, workspaceRoot);
  const evidencePath = path.join(runtimeRoot, `verification-${attempt}.json`);
  writeJson(evidencePath, results);
  state.lastVerification = results;
  const fingerprint = verificationFingerprint(results);
  if (fingerprint === state.lastFingerprint) state.consecutiveNoProgress += 1;
  else state.consecutiveNoProgress = 0;
  state.lastFingerprint = fingerprint;
  saveState();
  for (const result of results) console.log(`${result.exitCode === 0 && !result.error ? "PASS" : "FAIL"} ${result.name}`);
  return results;
};

if (verifyOnly) {
  state.status = "running";
  const results = verify("manual");
  if (allPassed(results)) finish("complete", "All verification commands passed without an agent run.", 0);
  finish("verification_failed", "One or more verification commands failed.", 1);
}

if (["complete", "needs_human"].includes(state.status) && !reset) fail(`Goal is already ${state.status}. Use --reset to start it again.`);

const initialResults = verify("initial");
if (allPassed(initialResults)) finish("complete", "The goal was already satisfied when verification began.", 0);

const selectedAgent = requestedAgent ?? config.agent;
const adapterSetting = process.env.LOOP_AGENT_ADAPTER ?? (selectedAgent ? config.adapters?.[selectedAgent] : undefined) ?? config.adapter;
if (!adapterSetting) {
  const availableAgents = Object.keys(config.adapters ?? {});
  const hint = availableAgents.length ? ` Available agents: ${availableAgents.join(", ")}.` : "";
  fail(`No agent adapter configured. Use --agent, LOOP_AGENT, LOOP_AGENT_ADAPTER, or .loop/config.local.json.${hint}`);
}
const adapterPath = path.resolve(workspaceRoot, adapterSetting);
if (!fs.existsSync(adapterPath)) fail(`Agent adapter not found: ${adapterPath}`);

while (true) {
  if (state.attempts >= goal.limits.maxAttempts) finish("budget_exhausted", "Maximum attempt count reached.", 2);
  if (elapsedMinutes() >= goal.limits.maxMinutes) finish("budget_exhausted", "Maximum elapsed time reached.", 2);
  if (state.consecutiveNoProgress >= goal.limits.maxConsecutiveNoProgress) finish("blocked", "Verification evidence repeated without measurable progress.", 3);

  const attempt = state.attempts + 1;
  const promptPath = path.join(runtimeRoot, `prompt-${attempt}.md`);
  const responsePath = path.join(runtimeRoot, `agent-${attempt}.md`);
  const failingEvidence = (state.lastVerification ?? []).filter((check) => check.exitCode !== 0 || check.error).map((check) => `### ${check.name}\nCommand: ${check.command}\nExit: ${check.exitCode}\n${check.stdout}\n${check.stderr}\n${check.error ?? ""}`).join("\n");
  const prompt = `# Autonomous repository goal\n\n${goal.objective}\n\n## Acceptance criteria\n${goal.acceptance.map((item) => `- ${item}`).join("\n")}\n\n## Allowed paths\n${(goal.allowedPaths ?? ["Repository files required by the goal"]).map((item) => `- ${item}`).join("\n")}\n\n## Forbidden actions\n${(goal.forbiddenActions ?? []).map((item) => `- ${item}`).join("\n")}\n\n## Human approval gates\n${goal.humanGates.map((item) => `- ${item}`).join("\n")}\n\nRead AGENTS.md and .loop/policies/remotion-composition.md. Make one focused attempt toward the goal. Preserve unrelated worktree changes. Do not perform gated actions. Do not claim completion; the runner verifies independently. If human judgment is required, write NEEDS_HUMAN and the reason in your response.\n\n## Current failing evidence\n${failingEvidence || "No failing evidence was captured."}\n`;
  fs.writeFileSync(promptPath, prompt);

  console.log(`Attempt ${attempt}/${goal.limits.maxAttempts}`);
  const agentResult = spawnSync(adapterPath, [promptPath, responsePath, workspaceRoot], {
    cwd: workspaceRoot,
    encoding: "utf8",
    timeout: Math.max(60000, goal.limits.maxMinutes * 60000),
    env: {...process.env, LOOP_GOAL_ID: goal.id, LOOP_ATTEMPT: String(attempt)},
  });
  state.attempts = attempt;
  appendLedger({at: new Date().toISOString(), type: "agent", attempt, exitCode: agentResult.status, signal: agentResult.signal, error: agentResult.error?.message ?? null});
  saveState();

  const response = fs.existsSync(responsePath) ? fs.readFileSync(responsePath, "utf8") : "";
  if (/\bNEEDS_HUMAN\b/i.test(response)) finish("needs_human", response.trim() || "The adapter requested human input.", 4);
  if (agentResult.status !== 0 || agentResult.error) finish("blocked", `Agent adapter failed: ${agentResult.error?.message ?? `exit ${agentResult.status}`}`, 3);

  const results = verify(attempt);
  appendLedger({at: new Date().toISOString(), type: "verification", attempt, passed: allPassed(results), fingerprint: state.lastFingerprint});
  if (allPassed(results)) finish("complete", "All configured verification commands passed.", 0);
}

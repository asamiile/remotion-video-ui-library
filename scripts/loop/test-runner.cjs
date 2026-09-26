#!/usr/bin/env node
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const {spawnSync} = require("node:child_process");

const repositoryRoot = path.join(__dirname, "../..");
const gates = ["delete", "commit", "push", "merge", "publish", "external-write", "full-render"];

const runScenario = ({id, adapter, expectedStatus, expectedExit, maxNoProgress = 1, target, selectByAgent = false}) => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "remotion-loop-test-"));
  fs.mkdirSync(path.join(workspace, ".loop"), {recursive: true});
  const goal = {
    id,
    objective: "Exercise one bounded autonomous runner terminal state with independent verification.",
    acceptance: ["The runner reaches the expected terminal state."],
    allowedPaths: ["done.txt"],
    forbiddenActions: ["Do not modify external files."],
    verification: [{name: "marker-exists", command: "test -f done.txt", timeoutSeconds: 10}],
    limits: {maxAttempts: 3, maxMinutes: 2, maxConsecutiveNoProgress: maxNoProgress},
    humanGates: gates,
  };
  fs.writeFileSync(path.join(workspace, ".loop/goal.json"), `${JSON.stringify(goal, null, 2)}\n`);
  if (selectByAgent) {
    const config = {adapters: {mock: path.join(repositoryRoot, `scripts/loop/adapters/${adapter}`)}};
    fs.writeFileSync(path.join(workspace, ".loop/config.local.json"), `${JSON.stringify(config, null, 2)}\n`);
  }
  const runArgs = [path.join(repositoryRoot, "scripts/loop/run.cjs"), "--goal", ".loop/goal.json"];
  if (selectByAgent) runArgs.push("--agent", "mock");
  const environment = {...process.env, LOOP_WORKSPACE_ROOT: workspace, LOOP_MOCK_TARGET: target ?? ""};
  delete environment.LOOP_AGENT;
  delete environment.LOOP_AGENT_ADAPTER;
  if (!selectByAgent) environment.LOOP_AGENT_ADAPTER = path.join(repositoryRoot, `scripts/loop/adapters/${adapter}`);
  const result = spawnSync(process.execPath, runArgs, {
    cwd: workspace,
    encoding: "utf8",
    env: environment,
  });
  const state = JSON.parse(fs.readFileSync(path.join(workspace, `.loop/runtime/${id}/state.json`), "utf8"));
  if (result.status !== expectedExit || state.status !== expectedStatus) {
    console.error(result.stdout);
    console.error(result.stderr);
    console.error(`Unexpected result for ${id}: exit=${result.status}, state=${JSON.stringify(state)}`);
    process.exit(1);
  }
  return {state, workspace};
};

const success = runScenario({id: "mock-loop-success", adapter: "mock-success.sh", expectedStatus: "complete", expectedExit: 0, target: "done.txt", selectByAgent: true});
if (success.state.attempts !== 1 || !fs.existsSync(path.join(success.workspace, "done.txt"))) process.exit(1);
runScenario({id: "mock-loop-blocked", adapter: "mock-no-progress.sh", expectedStatus: "blocked", expectedExit: 3});
runScenario({id: "mock-loop-human", adapter: "mock-needs-human.sh", expectedStatus: "needs_human", expectedExit: 4});
console.log("Loop runner tests passed: complete, blocked-on-no-progress, and needs-human terminal states.");

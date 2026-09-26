const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const {spawnSync} = require("node:child_process");

const readJson = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const writeJson = (file, value) => {
  fs.mkdirSync(path.dirname(file), {recursive: true});
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
};

const validateGoal = (goal) => {
  const errors = [];
  if (!goal || typeof goal !== "object" || Array.isArray(goal)) errors.push("goal must be an object");
  if (!/^[a-z0-9][a-z0-9-]{2,63}$/.test(goal?.id ?? "")) errors.push("id must be 3-64 lowercase letters, numbers, or hyphens");
  if (typeof goal?.objective !== "string" || goal.objective.length < 10) errors.push("objective must contain at least 10 characters");
  if (!Array.isArray(goal?.acceptance) || goal.acceptance.length === 0 || goal.acceptance.some((item) => typeof item !== "string" || item.length < 3)) errors.push("acceptance must be a non-empty string array");
  if (!Array.isArray(goal?.verification) || goal.verification.length === 0) errors.push("verification must be a non-empty array");
  for (const [index, check] of (goal?.verification ?? []).entries()) {
    if (typeof check?.name !== "string" || !check.name) errors.push(`verification[${index}].name is required`);
    if (typeof check?.command !== "string" || !check.command) errors.push(`verification[${index}].command is required`);
    if (check?.timeoutSeconds !== undefined && (!Number.isInteger(check.timeoutSeconds) || check.timeoutSeconds < 1 || check.timeoutSeconds > 1800)) errors.push(`verification[${index}].timeoutSeconds must be 1-1800`);
  }
  const limits = goal?.limits;
  if (!limits || !Number.isInteger(limits.maxAttempts) || limits.maxAttempts < 1 || limits.maxAttempts > 50) errors.push("limits.maxAttempts must be 1-50");
  if (!limits || !Number.isInteger(limits.maxMinutes) || limits.maxMinutes < 1 || limits.maxMinutes > 1440) errors.push("limits.maxMinutes must be 1-1440");
  if (!limits || !Number.isInteger(limits.maxConsecutiveNoProgress) || limits.maxConsecutiveNoProgress < 1 || limits.maxConsecutiveNoProgress > 10) errors.push("limits.maxConsecutiveNoProgress must be 1-10");
  if (!Array.isArray(goal?.humanGates)) errors.push("humanGates must be an array");
  for (const field of ["allowedPaths", "forbiddenActions"]) if (goal?.[field] !== undefined && (!Array.isArray(goal[field]) || goal[field].some((item) => typeof item !== "string" || !item))) errors.push(`${field} must be a string array`);
  return errors;
};

const runVerification = (goal, cwd) => goal.verification.map((check) => {
  const startedAt = new Date().toISOString();
  const result = spawnSync("/bin/zsh", ["-lc", check.command], {
    cwd,
    encoding: "utf8",
    timeout: (check.timeoutSeconds ?? 120) * 1000,
    maxBuffer: 4 * 1024 * 1024,
  });
  return {
    name: check.name,
    command: check.command,
    startedAt,
    exitCode: result.status ?? (result.error ? 1 : 0),
    signal: result.signal ?? null,
    stdout: (result.stdout ?? "").slice(-12000),
    stderr: (result.stderr ?? "").slice(-12000),
    error: result.error?.message ?? null,
  };
});

const verificationFingerprint = (results) => crypto.createHash("sha256").update(JSON.stringify(results.map(({name, exitCode, signal, stdout, stderr, error}) => ({name, exitCode, signal, stdout, stderr, error})))).digest("hex");
const allPassed = (results) => results.every((result) => result.exitCode === 0 && !result.error);

module.exports = {allPassed, readJson, runVerification, validateGoal, verificationFingerprint, writeJson};

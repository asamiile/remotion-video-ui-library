#!/usr/bin/env node
const path = require("node:path");
const {readJson, validateGoal} = require("./lib.cjs");

const goalArgument = process.argv.slice(2).find((argument) => argument !== "--");
const goalPath = path.resolve(goalArgument ?? ".loop/active-goal.json");
try {
  const errors = validateGoal(readJson(goalPath));
  if (errors.length) {
    console.error(`Invalid loop goal: ${goalPath}`);
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }
  console.log(`Valid loop goal: ${goalPath}`);
} catch (error) {
  console.error(`Could not read loop goal: ${error.message}`);
  process.exit(1);
}

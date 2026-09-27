#!/usr/bin/env node
// CLI for scripts/lib/drive-upload.cjs, used by render.sh.
//
//   node scripts/upload-renders.cjs --enabled        exit 0 if uploads are on
//   node scripts/upload-renders.cjs --list-remote    print Drive paths (relative to the output folder)
//   node scripts/upload-renders.cjs <file|dir>...    move these outputs to Drive
//   node scripts/upload-renders.cjs --all            move everything in the output folder to Drive
const drive = require("./lib/drive-upload.cjs");

const args = process.argv.slice(2);

if (args[0] === "--enabled") {
  process.exit(drive.isEnabled() ? 0 : 1);
}

if (args[0] === "--list-remote") {
  for (const entry of drive.listRemote()) console.log(entry);
  process.exit(0);
}

const targets = args[0] === "--all" ? drive.pendingFiles() : args;
if (targets.length === 0) {
  console.log("Nothing to upload.");
  process.exit(0);
}
if (!drive.isEnabled()) {
  console.error(
    `Upload skipped: set REMOTION_UPLOAD_REMOTE to an rclone "remote:path" that rclone knows (and REMOTION_UPLOAD is not 0). Outputs stay in ${drive.outDir}.`,
  );
  process.exit(0);
}

console.log(`Uploading ${targets.length} item(s) to ${drive.remote} ...`);
const { moved, kept } = drive.upload(targets);
console.log(`Moved ${moved.length} file(s) to ${drive.remote}.`);
for (const { file, reason } of kept) {
  console.error(`Kept locally (${reason}): ${file}`);
}
process.exit(kept.length ? 1 : 0);

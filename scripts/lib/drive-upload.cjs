// Moves finished renders from the output folder (REMOTION_OUTPUT_DIR,
// default out/; see output-dir.cjs) to Google Drive with rclone, keeping the
// same folder layout, and answers "does this output already exist?" for
// files that now only live on Drive.
//
// Remote:  REMOTION_UPLOAD_REMOTE (rclone "remote:path"; uploads are off when unset)
// Disable: REMOTION_UPLOAD=0 (outputs then stay in the output folder)
// Setup:   see README.md (Render > "Google Driveへの自動アップロード").
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { execFileSync, spawnSync } = require("node:child_process");

const { outDir } = require("./output-dir.cjs");
// No default: uploads happen only when a destination is configured.
const remote = process.env.REMOTION_UPLOAD_REMOTE || "";
const VIDEO_EXTENSION = /\.(mp4|mov)$/i;

// The recursive Drive listing outgrows spawnSync's 1 MB default buffer, which
// kills rclone and looks like a failed listing.
const RCLONE_MAX_BUFFER = 256 * 1024 * 1024;

function rclone(args, options = {}) {
  return spawnSync("rclone", args, {
    encoding: "utf8",
    maxBuffer: RCLONE_MAX_BUFFER,
    ...options,
  });
}

/** Upload is on when a destination is set, not disabled, and known to rclone. */
function isEnabled() {
  if (!remote || process.env.REMOTION_UPLOAD === "0") return false;
  const result = rclone(["listremotes"]);
  if (result.error || result.status !== 0) return false;
  const name = remote.split(":")[0] + ":";
  return result.stdout.split("\n").includes(name);
}

/** Paths relative to the output folder that already exist on Drive. */
function listRemote() {
  const result = rclone(["lsf", "-R", "--files-only", "--fast-list", remote]);
  if (result.status !== 0) {
    // A missing remote folder just means nothing has been uploaded yet.
    if (/directory not found/i.test(result.stderr)) return new Set();
    throw new Error(`rclone lsf failed: ${result.stderr.trim()}`);
  }
  return new Set(result.stdout.split("\n").filter(Boolean));
}

function relativeToOut(file) {
  const relative = path.relative(outDir, path.resolve(file));
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Not inside the output folder (${outDir}): ${file}`);
  }
  return relative.split(path.sep).join("/");
}

/**
 * True if the output exists locally or on Drive. A directory (PNG
 * sequence) counts as present when Drive has any file inside it.
 */
function outputExists(file, remoteFiles) {
  if (fs.existsSync(file)) return true;
  if (!remoteFiles) return false;
  const relative = relativeToOut(file);
  if (remoteFiles.has(relative)) return true;
  const prefix = relative + "/";
  for (const entry of remoteFiles) if (entry.startsWith(prefix)) return true;
  return false;
}

/** Every uploadable file in the output folder (skips export runs and partial renders). */
function pendingFiles(dir = outDir) {
  const files = [];
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue; // .export, .DS_Store
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...pendingFiles(full));
    else if (!/\.partial\./.test(entry.name)) files.push(full);
  }
  return files;
}

function isReadableVideo(file) {
  try {
    // Header check only (fast even for multi-GB ProRes); catches truncated files.
    const out = execFileSync(
      "ffprobe",
      [
        "-v",
        "error",
        "-select_streams",
        "v:0",
        "-show_entries",
        "stream=codec_name:format=duration",
        "-of",
        "csv=p=0",
        file,
      ],
      { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
    );
    return out.trim().length > 0;
  } catch {
    return false;
  }
}

/**
 * Moves files (paths or directories inside the output folder) to Drive. rclone verifies
 * each upload by checksum and deletes the local copy only after it
 * succeeds. Unreadable videos stay local. Returns { moved, kept }.
 */
function upload(paths) {
  // Empty folders left behind by an interrupted upload are removed first;
  // this run's own leftovers are removed after the move below.
  removeEmptyDirectories(outDir);
  const files = paths.flatMap((p) =>
    fs.existsSync(p) && fs.statSync(p).isDirectory() ? pendingFiles(p) : [p],
  );
  const kept = [];
  const moving = [];
  for (const file of files) {
    if (!fs.existsSync(file)) continue;
    if (VIDEO_EXTENSION.test(file) && !isReadableVideo(file)) {
      kept.push({ file, reason: "ffprobe could not read it" });
      continue;
    }
    moving.push(relativeToOut(file));
  }
  if (moving.length === 0) return { moved: [], kept };

  const listFile = path.join(
    os.tmpdir(),
    `remotion-upload-${process.pid}-${Date.now()}.txt`,
  );
  fs.writeFileSync(listFile, moving.join("\n") + "\n");
  try {
    const result = rclone(
      [
        "move",
        outDir,
        remote,
        "--files-from",
        listFile,
        "--transfers",
        "2",
        "--retries",
        "3",
        "--stats-one-line",
        "--stats",
        "30s",
        "-v",
      ],
      { stdio: ["ignore", "inherit", "inherit"] },
    );
    const moved = moving.filter(
      (relative) => !fs.existsSync(path.join(outDir, relative)),
    );
    for (const relative of moving) {
      if (!moved.includes(relative))
        kept.push({
          file: path.join(outDir, relative),
          reason: `rclone exit ${result.status}`,
        });
    }
    removeEmptyDirectories(outDir);
    return { moved, kept };
  } finally {
    fs.rmSync(listFile, { force: true });
  }
}

function removeEmptyDirectories(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    removeEmptyDirectories(full);
    if (fs.readdirSync(full).filter((n) => n !== ".DS_Store").length === 0) {
      fs.rmSync(full, { recursive: true, force: true });
    }
  }
}

module.exports = {
  outDir,
  remote,
  isEnabled,
  listRemote,
  outputExists,
  pendingFiles,
  upload,
};

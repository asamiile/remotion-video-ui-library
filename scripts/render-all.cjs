// Full-library export from the runtime registration, with resumable, verified outputs.
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const { createRequire } = require("node:module");
const renderer = createRequire(require.resolve("@remotion/cli"))(
  "@remotion/renderer",
);
const root = path.resolve(__dirname, "..");
const format = process.argv[2] || "mp4";
const planOnly = process.argv.includes("--plan");
const overlaysOnly = process.argv.includes("--overlays");
const alphaFormat = format === "alpha" || format === "stock-alpha";
if (overlaysOnly) assert(alphaFormat, "Use --alpha with overlays");
assert(["mp4", "alpha", "stock-alpha", "stock", "png"].includes(format));
const run = path.resolve(
  process.env.REMOTION_EXPORT_RUN ||
    path.join(
      root,
      "out",
      ".export",
      new Date().toISOString().replace(/[:.]/g, "-"),
    ),
);
fs.mkdirSync(run, { recursive: true });
const statusFile = path.join(run, "status.json");
const serveUrl = path.join(run, "bundle");
const state = {
  status: "preparing",
  format,
  total: 0,
  completed: [],
  failed: [],
  skipped: [],
  pid: process.pid,
  active: null,
};
function save() {
  fs.writeFileSync(statusFile + ".tmp", JSON.stringify(state, null, 2));
  fs.renameSync(statusFile + ".tmp", statusFile);
}
function log(message) {
  console.log(new Date().toISOString() + " " + message);
}
function verify(file, c) {
  const info = JSON.parse(
    execFileSync(
      "ffprobe",
      [
        "-v",
        "error",
        "-select_streams",
        "v:0",
        "-show_entries",
        "stream=codec_name,profile,width,height,avg_frame_rate,nb_frames,pix_fmt:format=duration",
        "-of",
        "json",
        file,
      ],
      { encoding: "utf8" },
    ),
  );
  const v = info.streams[0];
  assert(v, `${c.id}: missing video stream`);
  assert.equal(v.width, c.width);
  assert.equal(v.height, c.height);
  const [a, b] = v.avg_frame_rate.split("/").map(Number);
  assert(Math.abs(a / b - c.fps) < 0.001);
  assert(
    Math.abs(Number(info.format.duration) - c.durationInFrames / c.fps) < 0.1,
    `${c.id}: incorrect duration`,
  );
  if (v.nb_frames) assert.equal(Number(v.nb_frames), c.durationInFrames);
  if (format === "mp4") assert.equal(v.codec_name, "h264");
  if (alphaFormat) {
    assert.equal(v.codec_name, "prores");
    assert(v.pix_fmt.startsWith("yuva"));
    assert.equal(v.profile, "4444");
  }
  return fs.statSync(file).size;
}
function contentFrame(c) {
  const p = c.props,
    id = c.id.replace(/-10s$/, "");
  if (id.startsWith("BloomFlashTransition-"))
    return Math.max(1, Math.floor(p.peakFrame - p.flashFrames * 0.5));
  if (id === "RackFocusBokehTransition") return Math.floor(p.rampFrames);
  const active =
    id.startsWith("ScanEchoTransition-") ||
    id.startsWith("DistressTransition-") ||
    (p.effectType && id.endsWith("Transition"))
      ? p.durationFrames
      : id.startsWith("HologramFragmentTransition-")
        ? 90
        : id === "ZoomBlurTransition"
          ? 22
          : null;
  if (active)
    return (
      Math.floor(c.durationInFrames / 2) -
      Math.floor(active / 2) +
      Math.floor(active * 0.28)
    );
  return Math.floor(c.durationInFrames * 0.4);
}
async function inspectAlpha(c, browser) {
  const previewDir = path.join(run, "alpha-previews");
  fs.mkdirSync(previewDir, { recursive: true });
  const samples = [
    contentFrame(c),
    Math.floor(c.durationInFrames * 0.7),
    Math.floor(c.durationInFrames * 0.2),
  ];
  let visible = false;
  for (const frame of [...new Set(samples)]) {
    const output = path.join(previewDir, `${c.id}-${frame}.png`);
    const isMap = c.id.startsWith("MiniMap-");
    const previewBrowser = isMap
      ? await renderer.openBrowser("chrome", {
          chromiumOptions: { gl: "angle" },
        })
      : browser;
    try {
      await renderer.renderStill({
        serveUrl,
        composition: c,
        frame,
        output,
        imageFormat: "png",
        scale: 0.125,
        puppeteerInstance: previewBrowser,
        logLevel: "error",
        onBrowserLog: () => {},
      });
    } finally {
      if (isMap) await previewBrowser.close({ silent: true });
    }
    const pixels = execFileSync("ffmpeg", [
      "-v",
      "error",
      "-i",
      output,
      "-vf",
      "format=rgba,alphaextract",
      "-f",
      "rawvideo",
      "-pix_fmt",
      "gray",
      "-",
    ]);
    let min = 255,
      max = 0;
    for (const a of pixels) {
      min = Math.min(min, a);
      max = Math.max(max, a);
    }
    visible ||= max > 0;
    if (min < 255 && max > 0)
      return { usable: true, frame, minAlpha: min, maxAlpha: max };
  }
  return {
    usable: false,
    reason: visible
      ? "Fully opaque at content samples"
      : "No visible overlay at content samples",
  };
}
(async () => {
  save();
  if (!fs.existsSync(path.join(serveUrl, "index.html"))) {
    execFileSync(
      "npx",
      ["remotion", "bundle", "src/export-index.ts", "--out-dir=" + serveUrl],
      { cwd: root, stdio: "inherit" },
    );
  }
  // GL must be selected when launching the shared browser, not per render.
  const browser = await renderer.openBrowser("chrome", {
    chromiumOptions: { gl: "angle" },
  });
  let folders = null;
  let finishFolders;
  const folderPromise = new Promise((resolve) => {
    finishFolders = resolve;
  });
  const original = browser.newPage.bind(browser);
  browser.newPage = async (options) => {
    const page = await original(options);
    const close = page.close.bind(page);
    page.close = async (...args) => {
      if (!folders) {
        try {
          const value = await page.evaluate(() => window.getExportFolders?.());
          if (value?.length) {
            folders = value;
            finishFolders(value);
          }
        } catch {
          /* Metadata errors are reported by getCompositions. */
        }
      }
      return close(...args);
    };
    return page;
  };
  try {
    const allComps = await renderer.getCompositions(serveUrl, {
      puppeteerInstance: browser,
      logLevel: "error",
      onBrowserLog: () => {},
    });
    if (!folders)
      await Promise.race([
        folderPromise,
        new Promise((_, reject) => {
          const timer = setTimeout(
            () => reject(Error("No runtime folder manifest")),
            30000,
          );
          timer.unref();
        }),
      ]);
    assert(folders?.length, "No runtime folder manifest");
    const byId = new Map(folders.map((x) => [x.id, x.folder]));
    const comps = overlaysOnly
      ? allComps.filter(
          (c) =>
            !["Intro", "Placeholder", "Motion"].includes(
              byId.get(c.id)?.split("/")[0],
            ),
        )
      : allComps;
    const manifest = comps.map((c) => {
      const folder = byId.get(c.id);
      assert(folder !== undefined, c.id);
      assert(folder.split("/").length <= 3 && !folder.includes(".."));
      const directory = path.join(root, "out", folder, c.id);
      const file =
        format === "png"
          ? path.join(directory, "png")
          : path.join(
              directory,
              c.id +
                (alphaFormat
                  ? "-alpha.mov"
                  : format === "stock"
                    ? "-60s.mov"
                    : ".mp4"),
            );
      return {
        id: c.id,
        folder,
        width: c.width,
        height: c.height,
        fps: c.fps,
        frames: c.durationInFrames,
        file,
      };
    });
    fs.writeFileSync(
      path.join(run, "manifest.json"),
      JSON.stringify(manifest, null, 2),
    );
    state.total = comps.length;
    state.status = planOnly ? "planned" : "rendering";
    save();
    log(
      `${comps.length} compositions, ${Math.round(comps.reduce((n, c) => n + c.durationInFrames / c.fps, 0) / 60)} minutes of video; manifest ${run}`,
    );
    if (planOnly) return;
    const archiveMarker = path.join(run, "archive.json");
    if (!fs.existsSync(archiveMarker) && format === "mp4" && !overlaysOnly) {
      const archive = path.join(run, "previous-library");
      fs.mkdirSync(archive, { recursive: true });
      const moved = [];
      for (const name of fs.readdirSync(path.join(root, "out"))) {
        if (name === ".export") continue;
        const destination = path.join(archive, name);
        assert(!fs.existsSync(destination), `Archive collision: ${name}`);
        fs.renameSync(path.join(root, "out", name), destination);
        moved.push(name);
      }
      fs.writeFileSync(
        archiveMarker,
        JSON.stringify({ archive, moved }, null, 2),
      );
      log(`Preserved previous outputs in ${archive}`);
    }

    const completedFile = path.join(run, "completed.json");
    const skippedFile = path.join(run, "skipped.json");
    const skipped = fs.existsSync(skippedFile)
      ? JSON.parse(fs.readFileSync(skippedFile))
      : {};
    const completed = fs.existsSync(completedFile)
      ? JSON.parse(fs.readFileSync(completedFile))
      : {};
    for (let i = 0; i < comps.length; i++) {
      const c = comps[i],
        m = manifest[i];
      if (skipped[c.id]) {
        state.skipped.push({ id: c.id, ...skipped[c.id] });
        save();
        continue;
      }
      if (
        format === "mp4" &&
        fs.existsSync(path.join(path.dirname(m.file), c.id + "-alpha.mov"))
      ) {
        log(`SKIPPED ${c.id}: transparent overlay already covers this composition, mp4 no longer maintained`);
        state.skipped.push({
          id: c.id,
          reason: "Transparent overlay already covers this composition",
        });
        save();
        continue;
      }
      if (completed[c.id] && fs.existsSync(m.file)) {
        try {
          verify(m.file, c);
          state.completed.push(c.id);
          save();
          continue;
        } catch {
          /* Re-render invalid output. */
        }
      }
      state.active = { id: c.id, index: i + 1, progress: 0 };
      save();
      log(`[${i + 1}/${comps.length}] ${c.id}`);
      try {
        const available = fs.statfsSync(root);
        assert(
          available.bavail * available.bsize > 5 * 1024 ** 3,
          "Less than 5 GB of disk space remains",
        );
        if (overlaysOnly) {
          state.active.phase = "alpha-preflight";
          save();
          const result = await inspectAlpha(c, browser);
          if (!result.usable) {
            skipped[c.id] = result;
            fs.writeFileSync(skippedFile, JSON.stringify(skipped, null, 2));
            state.skipped.push({ id: c.id, ...result });
            log(`SKIPPED ${c.id}: ${result.reason}`);
            save();
            continue;
          }
          state.active.alpha = result;
          state.active.phase = "rendering";
          save();
        }
        fs.mkdirSync(path.dirname(m.file), { recursive: true });
        if (fs.existsSync(m.file)) {
          const backup = path.join(
            run,
            "previous",
            path.relative(path.join(root, "out"), m.file),
          );
          fs.mkdirSync(path.dirname(backup), { recursive: true });
          if (!fs.existsSync(backup)) fs.renameSync(m.file, backup);
        }
        if (format === "png")
          throw Error(
            "Use --png-sequence with specific IDs; full-library batch expects video output",
          );
        const temp = m.file.replace(/\.(mp4|mov)$/, ".partial.$1");
        let lastSave = 0;
        const isMap = c.id.startsWith("MiniMap-");
        const renderBrowser = isMap
          ? await renderer.openBrowser("chrome", {
              chromiumOptions: { gl: "angle" },
            })
          : browser;
        try {
          await renderer.renderMedia({
            serveUrl,
            composition: c,
            outputLocation: temp,
            puppeteerInstance: renderBrowser,
            codec: format === "mp4" ? "h264" : "prores",
            pixelFormat:
              format === "mp4"
                ? "yuv420p"
                : alphaFormat
                  ? "yuva444p10le"
                  : "yuv422p10le",
            ...(format === "mp4"
              ? {}
              : {
                  proResProfile: alphaFormat ? "4444" : "hq",
                  muted: true,
                }),
            ...(c.id.startsWith("MiniMap-")
              ? {
                  timeoutInMilliseconds: 120000,
                }
              : {}),
            ...(c.id.startsWith("AudioSpectrum-") ? { muted: true } : {}),
            imageFormat: alphaFormat ? "png" : "jpeg",
            concurrency: isMap ? 1 : 4,
            overwrite: true,
            logLevel: "error",
            onBrowserLog: () => {},
            onProgress: (p) => {
              if (Date.now() - lastSave > 5000) {
                state.active.progress = p.progress;
                save();
                lastSave = Date.now();
              }
            },
          });
        } finally {
          if (isMap) await renderBrowser.close({ silent: true });
        }
        const bytes = verify(temp, c);
        fs.renameSync(temp, m.file);
        completed[c.id] = { bytes, finished: new Date().toISOString() };
        fs.writeFileSync(completedFile, JSON.stringify(completed, null, 2));
        state.completed.push(c.id);
        log(`verified ${c.id} (${Math.round(bytes / 1024)} KB)`);
      } catch (error) {
        state.failed.push({ id: c.id, error: error.message });
        log(`FAILED ${c.id}: ${error.message}`);
      }
      save();
    }
    state.active = null;
    state.status = state.failed.length ? "incomplete" : "complete";
    save();
    log(
      `${state.completed.length} verified, ${state.skipped.length} non-overlay compositions skipped, ${state.failed.length} failed`,
    );
    if (state.failed.length) process.exitCode = 1;
  } finally {
    await browser.close({ silent: true });
  }
})().catch((error) => {
  state.status = "failed";
  state.error = error.message;
  save();
  console.error(error);
  process.exitCode = 1;
});

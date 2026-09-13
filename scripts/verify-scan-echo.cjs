// Integration verification: registered IDs, representative stills, and alpha at cut boundaries.
// Requires a current Remotion bundle and ffmpeg. This does not render full videos.
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const { createRequire } = require("node:module");
const root = path.resolve(__dirname, "..");
const localRequire = createRequire(path.join(root, "package.json"));
const rendererRequire = createRequire(localRequire.resolve("@remotion/cli"));
const { openBrowser, getCompositions, selectComposition, renderStill } =
  rendererRequire("@remotion/renderer");
const { execFileSync } = require("node:child_process");
const stock = process.argv.includes("--stock");
const bundleArg = process.argv.find((arg) => arg.startsWith("--bundle="));
const serveUrl = path.resolve(
  bundleArg ? bundleArg.slice(9) : path.join(root, "build"),
);
const outputArg = process.argv.find((arg) => arg.startsWith("--output="));
const out = outputArg
  ? path.resolve(outputArg.slice(9))
  : fs.mkdtempSync(path.join(require("node:os").tmpdir(), "scan-echo-check-"));
console.log(`Review output: ${out}`);
fs.mkdirSync(out, { recursive: true });
function alphaRange(file) {
  const raw = execFileSync("ffmpeg", [
    "-v",
    "error",
    "-i",
    file,
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
  for (const byte of raw) {
    min = Math.min(min, byte);
    max = Math.max(max, byte);
  }
  return [min, max];
}
(async () => {
  const browser = await openBrowser("chrome");
  try {
    const all = await getCompositions(serveUrl, {
      puppeteerInstance: browser,
      logLevel: "error",
      onBrowserLog: () => {},
    });
    const policies = require("../src/composition/duration-variants.json");
    for (const c of all) {
      assert((!c.id.endsWith("-10s") && policies.some(p => p.prefix ? c.id.startsWith(p.prefix) : p.ids.includes(c.id))) || c.durationInFrames >= Math.ceil(c.fps * 10), `${c.id}: shorter than 10 seconds`);
    }
    console.log(`${all.length} compositions meet the duration policy (short variants excluded)`);
    const comps = all.filter((c) => c.id.startsWith("ScanEchoTransition-") && !/-10s$/.test(c.id));
    assert(comps.length > 0, "No ScanEchoTransition compositions in bundle");
    const listed = execFileSync(
      "node",
      ["scripts/list-effect-composition-ids.cjs"],
      { encoding: "utf8", cwd: root },
    )
      .trim()
      .split("\n")
      .filter((id) => id.startsWith("ScanEchoTransition-") && !/-10s$/.test(id));
    assert.deepEqual(comps.map((c) => c.id).sort(), listed.sort());
    const groups = new Map();
    for (const c of comps) {
      assert.equal(c.durationInFrames, c.props.durationFrames);
      if (!groups.has(c.props.mode)) groups.set(c.props.mode, c);
    }
    fs.writeFileSync(
      path.join(out, "compositions.json"),
      JSON.stringify(comps, null, 2),
    );
    console.log(
      `${comps.length} registered patterns; ${groups.size} modes; enumeration matches`,
    );
    const modesArg = process.argv.find((arg) => arg.startsWith("--modes="));
    const requestedModes = modesArg ? modesArg.slice(8).split(",") : null;
    if (requestedModes)
      for (const mode of requestedModes)
        assert(groups.has(mode), `Unknown mode: ${mode}`);
    const cutsArg = process.argv.find((arg) => arg.startsWith("--cut-styles="));
    const requestedCuts = cutsArg ? cutsArg.slice(13).split(",") : null;
    if (requestedCuts)
      for (const style of requestedCuts)
        assert(
          comps.some((c) => c.props.cutStyle === style),
          `Unknown cut style: ${style}`,
        );
    const samples = stock
      ? []
      : comps.filter(
          (c) =>
            (!requestedModes || requestedModes.includes(c.props.mode)) &&
            (!requestedCuts || requestedCuts.includes(c.props.cutStyle)),
        );
    for (const c of samples) {
      const mode = c.props.mode;
      const file = path.join(out, `${c.id}.png`);
      await renderStill({
        serveUrl,
        composition: c,
        puppeteerInstance: browser,
        frame: Math.floor(c.durationInFrames / 2) - Math.floor(c.props.durationFrames / 2) + Math.floor(c.props.durationFrames * 0.36),
        scale: 0.25,
        output: file,
        logLevel: "error",
        onBrowserLog: () => {},
      });
      const [min, max] = alphaRange(file);
      assert(max > min, `${mode} has no visible geometry`);
      console.log(`visual sample: ${c.id}`);
    }
    const boundaryCases = [
      ...[24, 25, 48, 49, 119, 120].map((duration) => ({
        duration,
        cutStyle: "solid",
      })),
      ...[...new Set(comps.map((c) => c.props.cutStyle))]
        .filter((style) => style !== "solid")
        .map((cutStyle) => ({
          duration: 49,
          cutStyle,
        })),
    ];
    for (const { duration, cutStyle } of boundaryCases) {
      const inputProps = {
        durationFrames: duration,
        cutStyle,
        coverColor: "#071322",
      };
      const c = await selectComposition({
        serveUrl,
        id: "ScanEchoTransition-CyanSweep",
        inputProps,
        puppeteerInstance: browser,
        logLevel: "error",
        onBrowserLog: () => {},
      });
      assert.equal(c.durationInFrames, duration);
      const cut = Math.floor(c.durationInFrames / 2);
      for (const frame of [0, cut - 1, cut, c.durationInFrames - 1]) {
        const file = path.join(
          out,
          `boundary-${cutStyle}-${duration}-${frame}.png`,
        );
        await renderStill({
          serveUrl,
          composition: c,
          inputProps,
          puppeteerInstance: browser,
          frame,
          scale: 0.125,
          output: file,
          logLevel: "error",
          onBrowserLog: () => {},
        });
        assert.deepEqual(
          alphaRange(file),
          frame === cut || frame === cut - 1 ? [255, 255] : [0, 0],
        );
      }
      console.log(
        `duration ${duration}, ${cutStyle}: transparent endpoints, opaque cut`,
      );
    }
    if (samples.length > 0) {
      const composition = samples[0];
      const repeatFile = path.join(out, "determinism-repeat.png");
      await renderStill({
        serveUrl,
        composition,
        puppeteerInstance: browser,
        frame: Math.floor(composition.durationInFrames / 2) - Math.floor(composition.props.durationFrames / 2) + Math.floor(composition.props.durationFrames * 0.36),
        scale: 0.25,
        output: repeatFile,
        logLevel: "error",
      });
      const pixels = (file) =>
        execFileSync("ffmpeg", [
          "-v",
          "error",
          "-i",
          file,
          "-f",
          "rawvideo",
          "-pix_fmt",
          "rgba",
          "-",
        ]);
      assert.deepEqual(
        pixels(repeatFile),
        pixels(path.join(out, `${composition.id}.png`)),
      );
      console.log(
        "Deterministic frame: identical pixels after out-of-order rendering",
      );
    }
  } finally {
    await browser.close({ silent: true });
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});

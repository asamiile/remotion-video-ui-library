// Metadata and paired still verification; never renders full videos.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {createRequire} = require('node:module');
const {execFileSync} = require('node:child_process');
const renderer = createRequire(require.resolve('@remotion/cli'))('@remotion/renderer');
const policies = require('../src/composition/duration-variants.json');
const {paddedSeconds, paddedSuffix} = require('../src/composition/duration-variant-config.json');
const isPadded = id => id.endsWith(paddedSuffix);
const serveUrl = path.resolve(process.argv[2] || 'build');
const out = fs.mkdtempSync('/tmp/duration-variants-');
(async () => {
 const browser = await renderer.openBrowser('chrome', {chromiumOptions: {gl: 'angle'}});
 try {
  const all = await renderer.getCompositions(serveUrl, {puppeteerInstance: browser, onBrowserLog: () => {}, logLevel: 'error'});
  assert(!all.some(c => c.id.endsWith('-Shortest')), 'Obsolete suffix remains');
  const byId = new Map(all.map(c => [c.id, c]));
  assert.equal(byId.size, all.length);
  const bases = all.filter(c => !isPadded(c.id) && policies.some(p => p.prefix ? c.id.startsWith(p.prefix) : p.ids.includes(c.id)));
  for (const c of bases) {
   const short = c, ten = byId.get(c.id + paddedSuffix);
   assert(short && ten, c.id);
   assert.equal(ten.durationInFrames, paddedSeconds * ten.fps);
   assert(short.durationInFrames < ten.durationInFrames, c.id);
   assert.deepEqual(short.props, c.props);
   assert.deepEqual(ten.props, c.props);
  }
  // Padded versions are checked above; everything else keeps the 10-second minimum.
  for (const c of all) if (!isPadded(c.id) && !bases.some(base => base.id === c.id)) assert(c.durationInFrames >= c.fps * 10, c.id);
  const effectIds = execFileSync('node', ['scripts/list-effect-composition-ids.cjs'], {encoding:'utf8'}).trim().split('\n');
  for (const id of effectIds) assert(byId.has(id), `Missing enumerated ID: ${id}`);
  console.log(`${all.length} compositions; ${bases.length} complete base/padded pairs; ${effectIds.length} effect IDs match`);
  const cases = [
   ['ScanEchoTransition-CyanSweep', {durationFrames:25}, 25, 12, 75],
   ['PhaseDesyncTransition', {durationFrames:39}, 39, 19, 74],
   ['HologramFragmentTransition-Dissolve', {}, 90, 45, 75],
   ['ZoomBlurTransition', {}, 22, 11, 75],
   ['PlasmaVeilShaderTransition', {durationFrames:51}, 51, 25, 74],
   ['CodecCorruptTransition-GreenMagenta', {}, 48, 24, 75],
   ['PixelSortTransition-SunsetMelt', {}, 60, 30, 75],
   ['CrtPowerOffTransition-Classic', {}, 36, 18, 75],
   ['SuminagashiTransition-SumiSwirl', {}, 72, 36, 75],
   ['DryBrushTransition-CharcoalStrokes', {}, 60, 30, 75],
   ['WaterRippleTransition-AquaFlood', {}, 60, 30, 75],
   ['InkBleedTransition-SumiDrop', {}, 60, 30, 75],
   ['VolumetricSmokeTransition-EmberBillow', {}, 54, 27, 75],
   ['BloomFlashTransition-CyanOverexposure', {peakFrame:80, flashFrames:30}, 61, 30, 80],
   ['RackFocusBokehTransition', {rampFrames:16, holdFrames:7}, 40, 16, 16],
  ];
  const pixels = file => execFileSync('ffmpeg',['-v','error','-i',file,'-f','rawvideo','-pix_fmt','rgba','-']);
  for (const [id, inputProps, frames, shortFrame, tenFrame] of cases) {
   const files = [];
   for (const [suffix, frame] of [['',shortFrame],[paddedSuffix,tenFrame]]) {
    const c = await renderer.selectComposition({serveUrl,id:id+suffix,inputProps,puppeteerInstance:browser, onBrowserLog:()=>{},logLevel:'error'});
    assert.equal(c.durationInFrames, suffix===''?frames:paddedSeconds*30);
    const file = path.join(out,id+suffix+'.png');files.push(file);
    await renderer.renderStill({serveUrl,composition:c,inputProps,puppeteerInstance:browser,output:file,frame,scale:0.25,imageFormat:'png',onBrowserLog:()=>{},logLevel:'error'});
   }
   assert(pixels(files[0]).equals(pixels(files[1])), `${id}: animation differs between versions`);
   console.log(`${id}: ${frames} vs ${paddedSeconds*30} frames; matching animation pixels`);
  }
  console.log(`Passed; stills: ${out}`);
 } finally {await browser.close({silent:true});}
})().catch(e=>{console.error(e);process.exitCode=1;});

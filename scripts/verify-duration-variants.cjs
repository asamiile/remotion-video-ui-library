// Metadata and paired still verification; never renders full videos.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {createRequire} = require('node:module');
const {execFileSync} = require('node:child_process');
const renderer = createRequire(require.resolve('@remotion/cli'))('@remotion/renderer');
const policies = require('../src/composition/duration-variants.json');
const serveUrl = path.resolve(process.argv[2] || 'build');
const out = fs.mkdtempSync('/tmp/duration-variants-');
(async () => {
 const browser = await renderer.openBrowser('chrome');
 try {
  const all = await renderer.getCompositions(serveUrl, {puppeteerInstance: browser, onBrowserLog: () => {}, logLevel: 'error'});
  assert(!all.some(c => c.id.endsWith('-Shortest')), 'Obsolete suffix remains');
  const byId = new Map(all.map(c => [c.id, c]));
  assert.equal(byId.size, all.length);
  const bases = all.filter(c => !/-10s$/.test(c.id) && policies.some(p => p.prefix ? c.id.startsWith(p.prefix) : p.ids.includes(c.id)));
  for (const c of bases) {
   const short = c, ten = byId.get(c.id + '-10s');
   assert(short && ten, c.id);
   assert.equal(ten.durationInFrames, 10 * ten.fps);
   assert(short.durationInFrames < ten.durationInFrames, c.id);
   assert.deepEqual(short.props, c.props);
   assert.deepEqual(ten.props, c.props);
  }
  for (const c of all) if (!bases.some(base => base.id === c.id)) assert(c.durationInFrames >= c.fps * 10, c.id);
  const effectIds = execFileSync('node', ['scripts/list-effect-composition-ids.cjs'], {encoding:'utf8'}).trim().split('\n');
  for (const id of effectIds) assert(byId.has(id), `Missing enumerated ID: ${id}`);
  console.log(`${all.length} compositions; ${bases.length} complete base/10s pairs; ${effectIds.length} effect IDs match`);
  const cases = [
   ['ScanEchoTransition-CyanSweep', {durationFrames:25}, 25, 12, 150],
   ['PhaseDesyncTransition', {durationFrames:39}, 39, 19, 149],
   ['HologramFragmentTransition-Dissolve', {}, 90, 45, 150],
   ['ZoomBlurTransition', {}, 22, 11, 150],
   ['BloomFlashTransition-CyanOverexposure', {peakFrame:80, flashFrames:30}, 61, 30, 80],
   ['RackFocusBokehTransition', {rampFrames:16, holdFrames:7}, 40, 16, 16],
  ];
  const pixels = file => execFileSync('ffmpeg',['-v','error','-i',file,'-f','rawvideo','-pix_fmt','rgba','-']);
  for (const [id, inputProps, frames, shortFrame, tenFrame] of cases) {
   const files = [];
   for (const [suffix, frame] of [['',shortFrame],['-10s',tenFrame]]) {
    const c = await renderer.selectComposition({serveUrl,id:id+suffix,inputProps,puppeteerInstance:browser, onBrowserLog:()=>{},logLevel:'error'});
    assert.equal(c.durationInFrames, suffix===''?frames:300);
    const file = path.join(out,id+suffix+'.png');files.push(file);
    await renderer.renderStill({serveUrl,composition:c,inputProps,puppeteerInstance:browser,output:file,frame,scale:0.25,imageFormat:'png',onBrowserLog:()=>{},logLevel:'error'});
   }
   assert(pixels(files[0]).equals(pixels(files[1])), `${id}: animation differs between versions`);
   console.log(`${id}: ${frames} vs 300 frames; matching animation pixels`);
  }
  console.log(`Passed; stills: ${out}`);
 } finally {await browser.close({silent:true});}
})().catch(e=>{console.error(e);process.exitCode=1;});

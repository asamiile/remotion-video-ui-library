// Verify procedural transition stills, not full video exports.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const {createRequire} = require('node:module');
const {execFileSync} = require('node:child_process');
const renderer = createRequire(require.resolve('@remotion/cli'))('@remotion/renderer');
const serveUrl = path.resolve(process.argv[2] || 'build');
const out = fs.mkdtempSync('/tmp/distress-transition-review-');
const raw = file => execFileSync('ffmpeg',['-v','error','-i',file,'-f','rawvideo','-pix_fmt','rgba','-']);
function alpha(file) {
 const data=raw(file);let min=255,max=0;
 for(let i=3;i<data.length;i+=4){min=Math.min(min,data[i]);max=Math.max(max,data[i]);}
 return [min,max];
}
(async()=>{
 const browser=await renderer.openBrowser('chrome');
 try {
  const all=await renderer.getCompositions(serveUrl,{puppeteerInstance:browser,logLevel:'error',onBrowserLog:()=>{}});
  const comps=all.filter(c=>c.id.startsWith('DistressTransition-'));
  const bases=comps.filter(c=>!c.id.endsWith('-10s'));
  const listed=execFileSync('node',['scripts/list-effect-composition-ids.cjs'],{encoding:'utf8'}).trim().split('\n').filter(id=>id.startsWith('DistressTransition-'));
  assert.deepEqual(comps.map(c=>c.id).sort(),listed.sort());
  assert.equal(new Set(bases.map(c=>c.props.mode)).size,6);
  async function still(c,frame,name,inputProps) {
   const file=path.join(out,name+'.png');
   await renderer.renderStill({serveUrl,composition:c,inputProps,frame,output:file,imageFormat:'png',scale:.25,puppeteerInstance:browser,logLevel:'error',onBrowserLog:()=>{}});
   return file;
  }
  for(const c of bases){
   const ten=comps.find(x=>x.id===c.id+'-10s');assert(ten);
   assert.equal(c.durationInFrames,c.props.durationFrames);assert.equal(ten.durationInFrames,300);
   const local=Math.floor(c.durationInFrames*.28);
   const short=await still(c,local,c.id);
   const long=await still(ten,150-Math.floor(c.durationInFrames/2)+local,ten.id);
   const [min,max]=alpha(short);assert(max>0 && (c.props.mode==='crtSnow' || max>min),`${c.id}: missing texture`);
   assert(raw(short).equals(raw(long)),`${c.id}: duration variants differ`);
   if(c.props.mode==='crtSnow') {
    const pixels=raw(short);const width=Math.round(c.width*.25);let edges=0;
    for(let y=70;y<190;y++)for(let x=150;x<330;x++){
     const a=(y*width+x)*4,b=a+4;
     if(Math.abs(pixels[a]-pixels[b])+Math.abs(pixels[a+1]-pixels[b+1])+Math.abs(pixels[a+2]-pixels[b+2])>60)edges++;
    }
    assert(edges>500, `${c.id}: missing visible fine-grained snow (${edges} edges)`);
   }
   console.log(`sample: ${c.id}; paired pixels match`);
  }
  const modes=[...new Set(bases.map(c=>c.props.mode))];
  for(const [i,mode] of modes.entries()){
   const base=bases.find(c=>c.props.mode===mode);
   const duration=[24,25,48,49,119,120][i];
   const inputProps={durationFrames:duration,grainSize:i%2?.6:8,density:i%2?2:.5,noiseHoldFrames:i%2?4:1,roughness:i%2?1:0};
   for(const suffix of ['', '-10s']){
    const c=await renderer.selectComposition({serveUrl,id:base.id+suffix,inputProps,puppeteerInstance:browser,logLevel:'error',onBrowserLog:()=>{}});
    assert.equal(c.durationInFrames,suffix?300:duration);
    const cut=Math.floor(c.durationInFrames/2);
    for(const frame of [0,cut-1,cut,c.durationInFrames-1]){
     const file=await still(c,frame,`${mode}${suffix}-${duration}-${frame}`,inputProps);
     assert.deepEqual(alpha(file),frame===0||frame===c.durationInFrames-1?[0,0]:[255,255],file);
    }
   }
   console.log(`boundary: ${mode}; duration ${duration}; transparent ends and opaque cut`);
  }
  const c=bases[0], f=Math.floor(c.durationInFrames*.28);
  const rerender=await still(c,f,'determinism');
  assert(raw(rerender).equals(raw(path.join(out,c.id+'.png'))));
  console.log(`Passed ${comps.length} compositions; deterministic pixels; stills: ${out}`);
 }finally{await browser.close({silent:true});}
})().catch(e=>{console.error(e);process.exitCode=1;});

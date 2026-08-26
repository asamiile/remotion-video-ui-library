import React from "react";
import {AbsoluteFill, Easing, interpolate, random, useCurrentFrame, useVideoConfig} from "remotion";
import type {SciFiTransitionsProps} from "./sci-fi-transitions.schema";

const TAU = Math.PI * 2;
const range = (count: number) => Array.from({length: Math.max(0, Math.round(count))}, (_, i) => i);
const clamp = (value: number) => Math.max(0, Math.min(1, value));
const point = (cx: number, cy: number, radius: number, angle: number) => ({x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius});

export const SciFiTransitionsTemplate: React.FC<SciFiTransitionsProps> = ({
  effectType, primaryColor, secondaryColor, accentColor, intensity, density, direction, randomSeed, durationFrames: animationDurationFrames,
}) => {
  const frame = useCurrentFrame();
  const {width, height, durationInFrames} = useVideoConfig();
  const animationStartFrame = Math.floor((durationInFrames - animationDurationFrames) / 2);
  const animationFrame = frame - animationStartFrame;
  const isAnimationActive = animationFrame >= 0 && animationFrame < animationDurationFrames;
  const progress = interpolate(animationFrame, [0, animationDurationFrames - 1], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.45, 0, 0.55, 1)});
  const peak = 1 - Math.abs(progress * 2 - 1);
  const burst = Math.pow(Math.sin(progress * Math.PI), 1.5);
  const r = (key: string) => random(`${randomSeed}-${key}`);
  const directionSign = direction === "right-to-left" ? -1 : 1;

  const phaseDesync = () => <>{range(18 * density).map((i) => {const y = i * height / (18 * density); const bandH = height / (18 * density) + 2; const shift = (r(`phase-${i}`) - .5) * width * .22 * peak * intensity; return <g key={i}><rect x={shift - width * .05} y={y} width={width * 1.1} height={bandH} fill={i % 2 ? primaryColor : secondaryColor} opacity={.04 + peak * .18}/><line x1={shift} x2={width + shift} y1={y + bandH / 2} y2={y + bandH / 2} stroke={i % 3 ? primaryColor : accentColor} strokeWidth={1 + peak * 3} opacity={peak * .75}/></g>;})}<rect x={0} y={height * (.48 + (r(`sync-${frame}`)-.5)*.05)} width={width} height={2 + peak * 8} fill={accentColor} opacity={peak}/></>;

  const packetLossCascade = () => {const cols = 16, rows = 9; return <>{range(cols * rows).map((i) => {const col=i%cols,row=Math.floor(i/cols); const order=clamp((progress*1.55)-(col/cols*.45+row/rows*.18+r(`packet-${i}`)*.2)); const alpha=Math.sin(order*Math.PI)*.58; return <g key={i}><rect x={col*width/cols+2} y={row*height/rows+2} width={width/cols-4} height={height/rows-4} fill={i%7===0?accentColor:i%2?primaryColor:secondaryColor} opacity={alpha*.2}/><path d={`M ${col*width/cols+8} ${row*height/rows+8} h ${20+order*55}`} stroke={accentColor} strokeWidth="2" opacity={alpha}/></g>;})}</>};

  const signalFold = () => <>{range(9).map((i) => {const offset=(i-4)*height*.075*(1-peak); const y=height/2+offset; return <React.Fragment key={i}><rect x={0} y={y-2-peak*2} width={width} height={4+peak*4} fill={i%2?primaryColor:secondaryColor} opacity={.2+peak*.5}/><path d={`M 0 ${y} Q ${width*.25} ${y+(i%2?1:-1)*28*peak} ${width*.5} ${y} T ${width} ${y}`} fill="none" stroke={accentColor} strokeWidth={1+peak*2} opacity={peak}/></React.Fragment>;})}</>;

  const lidarDepthGate = () => {const scanX=directionSign>0?(-width*.08+progress*width*1.16):(width*1.08-progress*width*1.16); return <><defs><linearGradient id="lidar-beam"><stop stopColor={primaryColor} stopOpacity="0"/><stop offset="1" stopColor={primaryColor} stopOpacity=".35"/></linearGradient></defs><rect x={directionSign>0?scanX-width*.16:scanX} y={0} width={width*.16} height={height} fill="url(#lidar-beam)" opacity={burst}/><line x1={scanX} x2={scanX} y2={height} stroke={accentColor} strokeWidth={2+intensity*2} opacity={burst}/>{range(52*density).map((i)=>{const x=r(`lx-${i}`)*width,y=r(`ly-${i}`)*height;const active=directionSign>0?x<scanX:x>scanX;return active?<circle key={i} cx={x} cy={y} r={1+r(`lr-${i}`)*4} fill={i%5?primaryColor:accentColor} opacity={burst*(.25+r(`lo-${i}`)*.7)}/>:null;})}{range(7).map((i)=><ellipse key={i} cx={scanX-directionSign*(80+i*55)} cy={height*(.18+i*.105)} rx={55+i*18} ry={16+i*5} fill="none" stroke={i%2?primaryColor:secondaryColor} strokeWidth="1.5" opacity={burst*(1-i*.09)}/>)}</>};

  const vectorLock = () => {const cx=width/2,cy=height/2, radius=(1-peak)*Math.max(width,height)*.55+peak*150;const pts=range(7).map((i)=>point(cx,cy,radius,i/7*TAU+r(`va-${i}`)*.25));return <><polygon points={pts.map(p=>`${p.x},${p.y}`).join(" ")} fill={primaryColor} fillOpacity={peak*.06} stroke={primaryColor} strokeWidth={2} opacity={burst}/>{pts.map((p,i)=><g key={i}><line x1={i%2?0:width} y1={r(`vy-${i}`)*height} x2={p.x} y2={p.y} stroke={i%3?primaryColor:accentColor} opacity={burst*.6}/><circle cx={p.x} cy={p.y} r={5+peak*5} fill={accentColor} opacity={burst}/></g>)}</>};

  const diagnosticCurtain = () => <>{range(34*density).map((i)=>{const lane=i/(34*density);const x=directionSign>0?((progress*(1.4+r(`ds-${i}`)*.35)+lane*.25)%1.35-.15)*width:(1.15-((progress*(1.4+r(`ds-${i}`)*.35)+lane*.25)%1.35))*width;return <g key={i}><line x1={x} x2={x} y2={height} stroke={i%6===0?accentColor:primaryColor} strokeWidth={i%6===0?2:1} opacity={burst*(.2+r(`do-${i}`)*.6)}/><circle cx={x} cy={r(`dy-${i}`)*height} r={2+i%4} fill={secondaryColor} opacity={burst}/></g>;})}</>;

  const voxelMaterialize = () => <>{range(88*density).map((i)=>{const a=r(`v-a-${i}`)*TAU,rad=r(`v-r-${i}`)*Math.min(width,height)*.65*peak;const cx=width/2+Math.cos(a)*rad,cy=height/2+Math.sin(a)*rad;const size=8+r(`v-s-${i}`)*32;const rot=(r(`v-o-${i}`)-.5)*45*peak;return <g key={i} transform={`translate(${cx} ${cy}) rotate(${rot})`} opacity={burst*(.25+r(`v-p-${i}`)*.7)}><rect x={-size/2} y={-size/2} width={size} height={size} fill={i%4===0?secondaryColor:primaryColor} fillOpacity=".12" stroke={i%7===0?accentColor:primaryColor}/><path d={`M ${-size/2} ${-size/2} l ${size*.25} ${-size*.2} h ${size} l ${-size*.25} ${size*.2}`} fill="none" stroke={accentColor} opacity=".45"/></g>;})}</>;

  const quantumDustTunnel = () => <>{range(120*density).map((i)=>{const local=(progress+r(`q-p-${i}`)*.34)%1;const convergence=Math.sin(local*Math.PI);const radius=(1-convergence)*Math.min(width,height)*(.1+r(`q-r-${i}`)*.72);const angle=r(`q-a-${i}`)*TAU+local*TAU*(1.5+r(`q-t-${i}`)*2);const p=point(width/2,height/2,radius,angle);return <circle key={i} cx={p.x} cy={p.y} r={1+r(`q-s-${i}`)*4} fill={i%9===0?accentColor:i%2?primaryColor:secondaryColor} opacity={burst*(.25+r(`q-o-${i}`)*.7)}/>;})}</>;

  const holographicMembrane = () => {const baseX=-width*.25+progress*width*1.5;return <>{range(16*density).map((i)=>{let d=`M ${baseX+i*10} 0`;for(let y=0;y<=height;y+=45){const x=baseX+i*10+Math.sin(y*.018+progress*TAU*2+i*.22)*70*intensity;d+=` L ${x} ${y}`;}return <path key={i} d={d} fill="none" stroke={i%5===0?accentColor:i%2?primaryColor:secondaryColor} strokeWidth={i%5===0?2:1} opacity={burst*(.12+(i%5===0?.48:.18))}/>;})}<rect x={baseX-80} y={0} width={240} height={height} fill={primaryColor} opacity={burst*.045}/></>};

  const photonShear = () => {const x=-width*.2+progress*width*1.4;return <><defs><linearGradient id="photon" x1="0" x2="1"><stop stopColor={primaryColor} stopOpacity="0"/><stop offset=".5" stopColor={accentColor}/><stop offset="1" stopColor={secondaryColor} stopOpacity="0"/></linearGradient></defs><g transform={`skewX(-18) translate(${x} 0)`}><rect x={-90} width={180} height={height} fill="url(#photon)" opacity={burst*.35}/><line y2={height} stroke={accentColor} strokeWidth={3+intensity*3} opacity={burst}/><line x1={-22} x2={-22} y2={height} stroke={primaryColor} strokeWidth="2" opacity={burst*.8}/><line x1={22} x2={22} y2={height} stroke={secondaryColor} strokeWidth="2" opacity={burst*.8}/></g></>};

  const plasmaVeil = () => {const opening=(1-peak)*width*.5;const edge=(side:number)=>{let d=`M ${width/2+(side?1:-1)*opening} 0`;for(let y=0;y<=height;y+=32){const jitter=(r(`pv-${side}-${Math.floor(y/32)}-${Math.floor(frame/2)}`)-.5)*55*intensity;d+=` L ${width/2+(side?1:-1)*opening+(side?1:-1)*jitter} ${y}`;}return d;};return <>{[0,1].map(side=><g key={side}><path d={edge(side)} fill="none" stroke={secondaryColor} strokeWidth={16} opacity={burst*.12}/><path d={edge(side)} fill="none" stroke={side?primaryColor:accentColor} strokeWidth={2.5} opacity={burst}/></g>)}</>};

  const neutrinoFlashRing = () => {const radius=progress*Math.hypot(width,height)*.75;return <><defs><radialGradient id="neutrino"><stop stopColor={accentColor} stopOpacity={burst*.65}/><stop offset="1" stopColor={primaryColor} stopOpacity="0"/></radialGradient></defs><circle cx={width*.42} cy={height*.48} r={40+burst*190} fill="url(#neutrino)" opacity={burst}/>{range(4).map(i=><ellipse key={i} cx={width*.42} cy={height*.48} rx={Math.max(0,radius-i*38)} ry={Math.max(0,(radius-i*38)*.52)} fill="none" stroke={i%2?primaryColor:accentColor} strokeWidth={1+(3-i)*1.4} opacity={burst*(1-i*.17)}/>)}</>};

  const gravityLens = () => {const radius=30+progress*Math.hypot(width,height)*.68;return <><defs><radialGradient id="gravity"><stop offset=".52" stopColor={primaryColor} stopOpacity="0"/><stop offset=".7" stopColor={primaryColor} stopOpacity=".2"/><stop offset=".82" stopColor={secondaryColor} stopOpacity=".08"/><stop offset="1" stopColor={primaryColor} stopOpacity="0"/></radialGradient></defs><circle cx={width/2} cy={height/2} r={radius} fill="url(#gravity)" opacity={burst}/>{range(6).map(i=><ellipse key={i} cx={width/2+(i-3)*3*peak} cy={height/2} rx={radius*(.7+i*.055)} ry={radius*(.7+i*.055)*(.82+i*.02)} fill="none" stroke={i%3===0?accentColor:i%2?primaryColor:secondaryColor} strokeWidth={1+i%2} opacity={burst*(.65-i*.07)}/>)}</>};

  const hyperplaneFlip = () => <>{range(12).map((i)=>{const local=clamp(progress*1.35-i*.035);const scaleX=Math.abs(Math.cos(local*Math.PI));const x=i*width/12;return <g key={i} transform={`translate(${x+width/24} ${height/2}) scale(${Math.max(.02,scaleX)} 1)`} opacity={burst}><rect x={-width/24+3} y={-height/2} width={width/12-6} height={height} fill={i%2?primaryColor:secondaryColor} fillOpacity=".055" stroke={i%3===0?accentColor:primaryColor} strokeOpacity=".62"/><line y1={-height/2} y2={height/2} stroke={accentColor} opacity={1-scaleX}/></g>;})}</>;

  const spatialSeam = () => {let d=`M ${width/2} 0`;for(let y=0;y<=height;y+=35){const wobble=(r(`seam-${Math.floor(y/35)}`)-.5)*95*intensity*burst;d+=` L ${width/2+wobble} ${y}`;}return <><path d={d} fill="none" stroke={secondaryColor} strokeWidth={25+peak*75} opacity={burst*.08}/><path d={d} fill="none" stroke={primaryColor} strokeWidth={5+peak*8} opacity={burst*.55}/><path d={d} fill="none" stroke={accentColor} strokeWidth={1.5} opacity={burst}/></>};

  const dataCellAuthorization = () => {const cols=12,rows=7;return <>{range(cols*rows).map(i=>{const col=i%cols,row=Math.floor(i/cols),threshold=(col+row*.7)/(cols+rows*.7)*.72+r(`dc-${i}`)*.22;const active=clamp((progress-threshold)*12);return <g key={i} opacity={Math.sin(active*Math.PI)*burst}><rect x={col*width/cols+5} y={row*height/rows+5} width={width/cols-10} height={height/rows-10} fill={primaryColor} fillOpacity=".055" stroke={i%8===0?accentColor:primaryColor}/><path d={`M ${col*width/cols+14} ${row*height/rows+22} h ${18+active*40}`} stroke={secondaryColor} strokeWidth="2"/></g>;})}</>};

  const neuralRoute = () => {const nodes=range(34*density).map(i=>({x:r(`nx-${i}`)*width,y:r(`ny-${i}`)*height,active:clamp(progress*1.45-r(`nt-${i}`)*.8)}));return <>{nodes.map((p,i)=><g key={i}>{nodes.slice(i+1).map((q,j)=>{const dist=Math.hypot(p.x-q.x,p.y-q.y);return dist<240?<line key={j} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke={i%3?primaryColor:secondaryColor} strokeWidth="1" opacity={Math.min(p.active,q.active)*burst*.35}/>:null;})}<circle cx={p.x} cy={p.y} r={2+p.active*6} fill={i%7===0?accentColor:primaryColor} opacity={p.active*burst}/></g>)}</>};

  const coordinateRemap = () => {const cols=10,rows=6;return <>{range(cols*rows).map(i=>{const col=i%cols,row=Math.floor(i/cols),local=clamp(progress*1.3-r(`cr-${i}`)*.3),shift=(r(`cs-${i}`)-.5)*90*Math.sin(local*Math.PI);return <g key={i} transform={`translate(${shift} ${-shift*.35}) skewX(${(1-local)*12})`} opacity={burst}><rect x={col*width/cols+3} y={row*height/rows+3} width={width/cols-6} height={height/rows-6} fill={i%2?primaryColor:secondaryColor} fillOpacity={.02+local*.055} stroke={i%9===0?accentColor:primaryColor} strokeOpacity={.25+local*.55}/><circle cx={col*width/cols+9} cy={row*height/rows+9} r="2.5" fill={accentColor}/></g>;})}</>};

  const renderEffect = () => {
    switch (effectType) {
      case "phaseDesync": return phaseDesync(); case "packetLossCascade": return packetLossCascade(); case "signalFold": return signalFold();
      case "lidarDepthGate": return lidarDepthGate(); case "vectorLock": return vectorLock(); case "diagnosticCurtain": return diagnosticCurtain();
      case "voxelMaterialize": return voxelMaterialize(); case "quantumDustTunnel": return quantumDustTunnel(); case "holographicMembrane": return holographicMembrane();
      case "photonShear": return photonShear(); case "plasmaVeil": return plasmaVeil(); case "neutrinoFlashRing": return neutrinoFlashRing();
      case "gravityLens": return gravityLens(); case "hyperplaneFlip": return hyperplaneFlip(); case "spatialSeam": return spatialSeam();
      case "dataCellAuthorization": return dataCellAuthorization(); case "neuralRoute": return neuralRoute(); case "coordinateRemap": return coordinateRemap();
    }
  };

  return <AbsoluteFill style={{backgroundColor: "transparent", overflow: "hidden", pointerEvents: "none"}}>{isAnimationActive ? <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{position: "absolute", inset: 0, overflow: "hidden"}}>{renderEffect()}</svg> : null}</AbsoluteFill>;
};

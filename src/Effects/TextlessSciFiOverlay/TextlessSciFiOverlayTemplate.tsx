import React from "react";
import {AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig} from "remotion";
import {TextlessSciFiOverlaySchemaType} from "./textless-sci-fi-overlay.schema";

const TAU = Math.PI * 2;
const range = (count: number) => Array.from({length: count}, (_, index) => index);
const polar = (cx: number, cy: number, radius: number, angle: number) => ({x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius});

export const TextlessSciFiOverlayTemplate: React.FC<TextlessSciFiOverlaySchemaType> = ({
  effectType, primaryColor, secondaryColor, accentColor, opacity, intensity, density, speed, safeAreaPercent, randomSeed,
}) => {
  const frame = useCurrentFrame();
  const {width, height, durationInFrames} = useVideoConfig();
  const t = ((frame * speed) % durationInFrames) / durationInFrames;
  const pulse = 0.5 + 0.5 * Math.sin(t * TAU * 3);
  const safeX = width * safeAreaPercent / 100;
  const safeY = height * safeAreaPercent / 100;
  const seed = (key: string) => `${randomSeed}-${key}`;
  const r = (key: string) => random(seed(key));
  const common = {fill: "none", stroke: primaryColor, strokeWidth: Math.max(1, intensity * 1.5), vectorEffect: "non-scaling-stroke" as const};

  const scannerSweep = () => {
    const x = interpolate(t, [0, 1], [-width * 0.15, width * 1.15]);
    return <>
      <defs><linearGradient id="sweep" x1="0" x2="1"><stop stopColor={primaryColor} stopOpacity="0"/><stop offset=".7" stopColor={primaryColor} stopOpacity=".12"/><stop offset="1" stopColor={primaryColor}/></linearGradient></defs>
      <rect x={x - width * .16} width={width * .16} height={height} fill="url(#sweep)" opacity={opacity}/>
      <line x1={x} x2={x} y2={height} stroke={primaryColor} strokeWidth={2 * intensity} opacity={opacity}/>
      {range(Math.round(10 * density)).map((i) => {const y = safeY + r(`sy${i}`) * (height - safeY * 2); const len = 30 + r(`sl${i}`) * 150; return <line key={i} x1={x - len} x2={x - 8} y1={y} y2={y} stroke={i % 2 ? secondaryColor : primaryColor} opacity={Math.max(0, .65 - Math.abs(x - width * r(`sx${i}`)) / 280) * opacity}/>;})}
    </>;
  };

  const chromaticSignalTear = () => <>{range(Math.round(13 * density)).map((i) => {
    const active = r(`ct-a${i}`) > .42 && Math.sin(t * TAU * (2 + i % 4) + r(`ct-p${i}`) * TAU) > .45;
    const y = r(`ct-y${i}`) * height; const h = 2 + r(`ct-h${i}`) * 26; const shift = (r(`ct-s${i}`) - .5) * 160 * intensity;
    return active ? <React.Fragment key={i}><rect x={safeX + shift} y={y} width={width - safeX * 2} height={h} fill={primaryColor} opacity={.12 * opacity}/><rect x={safeX + shift - 8} y={y + 2} width={width - safeX * 2} height={Math.max(1, h - 4)} fill={accentColor} opacity={.1 * opacity}/></React.Fragment> : null;
  })}</>;

  const circuitTracePulse = () => <>{range(Math.round(14 * density)).map((i) => {
    const fromLeft = i % 2 === 0; const y = safeY + r(`cy${i}`) * (height - safeY * 2); const x0 = fromLeft ? safeX : width - safeX; const dir = fromLeft ? 1 : -1; const length = width * (.18 + r(`cl${i}`) * .5); const bend = (r(`cb${i}`) - .5) * 150; const progress = (t * (1.2 + r(`cs${i}`)) + r(`cp${i}`)) % 1;
    const path = `M ${x0} ${y} H ${x0 + dir * length * .42} L ${x0 + dir * length * .54} ${y + bend} H ${x0 + dir * length}`;
    const dot = polar(x0 + dir * length * progress, y + bend * Math.sin(progress * Math.PI), 0, 0);
    return <g key={i}><path d={path} {...common} opacity={.32 * opacity}/><circle cx={dot.x} cy={dot.y} r={2 + intensity * 2} fill={i % 3 ? primaryColor : accentColor} opacity={opacity}/></g>;
  })}</>;

  const hologramDepthSlices = () => <g style={{transformOrigin: "50% 55%", transform: "perspective(800px) rotateX(62deg)"}}>{range(Math.round(18 * density)).map((i) => {
    const p = (i / 18 + t) % 1; const rx = width * (.08 + p * .42); const ry = height * (.025 + p * .16);
    return <ellipse key={i} cx={width / 2} cy={height * .55} rx={rx} ry={ry} stroke={i % 4 ? primaryColor : secondaryColor} strokeWidth={1 + pulse} fill={primaryColor} fillOpacity={.012 * (1-p)} opacity={opacity * (1-p)}/>;
  })}</g>;

  const targetBracketSwarm = () => <>{range(Math.round(9 * density)).map((i) => {
    const phase = (t * (1 + r(`bs${i}`)) + r(`bp${i}`)) % 1; const converge = Math.sin(phase * Math.PI); const cx = width / 2 + (r(`bx${i}`) - .5) * width * .75 * (1 - converge); const cy = height / 2 + (r(`by${i}`) - .5) * height * .7 * (1 - converge); const size = 22 + r(`bz${i}`) * 70; const d = size * .35;
    return <path key={i} d={`M ${cx-size/2+d} ${cy-size/2} H ${cx-size/2} V ${cy-size/2+d} M ${cx+size/2-d} ${cy-size/2} H ${cx+size/2} V ${cy-size/2+d} M ${cx-size/2} ${cy+size/2-d} V ${cy+size/2} H ${cx-size/2+d} M ${cx+size/2} ${cy+size/2-d} V ${cy+size/2} H ${cx+size/2-d}`} {...common} stroke={i % 3 ? primaryColor : accentColor} opacity={opacity * (.25 + .75 * converge)}/>;
  })}</>;

  const perspectiveGridPulse = () => <g opacity={opacity}>
    {range(17).map((i) => {const x = width / 2 + (i - 8) * width / 16; return <line key={`v${i}`} x1={width/2} y1={height*.38} x2={x} y2={height-safeY} stroke={primaryColor} strokeWidth={i === 8 ? 1.8 : 1} opacity={.2 + .35 * pulse}/>;})}
    {range(14).map((i) => {const p = (i / 14 + t) % 1; const eased = p * p; const y = height * .38 + eased * (height * .62 - safeY); return <line key={`h${i}`} x1={safeX + (width/2-safeX)*(1-eased)} x2={width-safeX-(width/2-safeX)*(1-eased)} y1={y} y2={y} stroke={i % 4 ? primaryColor : secondaryColor} opacity={.15 + .55 * eased}/>;})}
  </g>;

  const energyContourLines = () => <>{range(Math.round(12 * density)).map((i) => {
    const y = safeY + i * (height - safeY * 2) / 11; const amp = 18 + r(`ea${i}`) * 48; let d = `M ${safeX} ${y}`; for (let x = safeX; x <= width-safeX; x += 60) d += ` L ${x} ${y + Math.sin(x / 115 + t * TAU * 2 + i) * amp}`;
    return <path key={i} d={d} stroke={i % 5 ? primaryColor : secondaryColor} fill="none" strokeWidth={1 + (i % 3 === 0 ? pulse : 0)} opacity={opacity * (.18 + .28 * pulse)}/>;
  })}</>;

  const glitchBlockDisplacement = () => <>{range(Math.round(20 * density)).map((i) => {
    const burst = Math.sin(t * TAU * (3 + i % 3) + r(`gbp${i}`) * TAU) > .68; if (!burst) return null; const x = r(`gbx${i}`) * width; const y = r(`gby${i}`) * height; const w = 30 + r(`gbw${i}`) * 280; const h = 3 + r(`gbh${i}`) * 48;
    return <g key={i} translate={`${(r(`gbs${i}`)-.5)*90*intensity} 0`}><rect x={x} y={y} width={w} height={h} fill={i % 3 === 0 ? accentColor : primaryColor} opacity={.1 * opacity}/><line x1={x} x2={x+w} y1={y+h/2} y2={y+h/2} stroke={secondaryColor} opacity={.5 * opacity}/></g>;
  })}</>;

  const particleConnectionField = () => {
    const count = Math.round(28 * density); const points = range(count).map((i) => ({x: safeX + ((r(`px${i}`) + t * (.08 + r(`pv${i}`) * .1)) % 1) * (width-safeX*2), y: safeY + ((r(`py${i}`) + Math.sin(t*TAU+r(`pp${i}`)*TAU)*.04) % 1) * (height-safeY*2)}));
    return <>{points.map((p, i) => <React.Fragment key={i}><circle cx={p.x} cy={p.y} r={1.5 + r(`pr${i}`)*3} fill={i%5 ? primaryColor : accentColor} opacity={opacity*(.35+.65*pulse)}/>{points.slice(i+1).map((q,j) => {const dist=Math.hypot(p.x-q.x,p.y-q.y); return dist < 165 ? <line key={j} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke={primaryColor} opacity={opacity*(1-dist/165)*.35}/> : null;})}</React.Fragment>)}</>;
  };

  const lensSensorArtifacts = () => <>
    <defs><radialGradient id="flare"><stop stopColor={primaryColor} stopOpacity=".5"/><stop offset="1" stopColor={primaryColor} stopOpacity="0"/></radialGradient></defs>
    <circle cx={width*(.18+.64*t)} cy={height*.35} r={height*.28} fill="url(#flare)" opacity={opacity*.35}/>
    {range(7).map((i) => <circle key={i} cx={width*(.2+i*.1)} cy={height*(.4+i*.025)} r={8+i*7} fill="none" stroke={i%2?primaryColor:accentColor} opacity={opacity*(.08+.06*i)}/>)}
    <line x1={safeX} x2={width-safeX} y1={height*(.15+.7*t)} y2={height*(.15+.7*t)} stroke={primaryColor} opacity={opacity*.25}/>
  </>;

  const volumetricLightScan = () => <>
    <defs><linearGradient id="beam" x1="0" y1="0" x2="0" y2="1"><stop stopColor={primaryColor} stopOpacity=".5"/><stop offset="1" stopColor={primaryColor} stopOpacity="0"/></linearGradient><filter id="beamBlur"><feGaussianBlur stdDeviation="18"/></filter></defs>
    {range(4).map((i) => {const angle=-34+68*((t+i*.25)%1); const cx=width*(.18+i*.22); return <polygon key={i} points={`${cx-12},${safeY} ${cx+12},${safeY} ${cx+height*.8},${height-safeY} ${cx-height*.3},${height-safeY}`} fill="url(#beam)" opacity={opacity*(.12+.12*i)} filter="url(#beamBlur)" style={{transformOrigin:`${cx}px ${safeY}px`,rotate:`${angle}deg`}}/>;})}
  </>;

  const digitalFragmentDrift = () => <>{range(Math.round(26*density)).map((i) => {const z=.2+r(`fz${i}`)*.8; const x=safeX+((r(`fx${i}`)+t*z*.35)%1)*(width-safeX*2); const y=safeY+((r(`fy${i}`)+t*z*.2)%1)*(height-safeY*2); const size=6+z*34; const rot=(t*180*z+r(`fr${i}`)*360); return <polygon key={i} points={`${x},${y-size} ${x+size*.7},${y+size*.5} ${x-size*.7},${y+size*.35}`} fill={i%4===0?accentColor:primaryColor} fillOpacity={opacity*.08*z} stroke={i%3?primaryColor:secondaryColor} strokeOpacity={opacity*.45*z} style={{transformOrigin:`${x}px ${y}px`,rotate:`${rot}deg`}}/>;})}</>;

  const plasmaEdgeArc = () => <>{[0,1].map((side) => {let d=`M ${side?width-safeX:safeX} ${safeY}`; for(let i=1;i<=28;i++){const y=safeY+i*(height-safeY*2)/28; const jitter=(r(`aj${side}-${i}-${Math.floor(frame/2)}`)-.5)*34*intensity; d+=` L ${(side?width-safeX:safeX)+(side?-1:1)*jitter} ${y}`;} return <g key={side}><path d={d} stroke={primaryColor} strokeWidth={7*intensity} opacity={opacity*.12} fill="none"/><path d={d} stroke={side?secondaryColor:primaryColor} strokeWidth={1.4*intensity} opacity={opacity} fill="none"/></g>;})}</>;

  const radialInterfacePulse = () => <g translate={`${width/2} ${height/2}`} opacity={opacity}>
    {range(6).map((i)=><circle key={i} r={70+i*42+pulse*8*(i%2)} fill="none" stroke={i%2?primaryColor:secondaryColor} strokeWidth={i%3===0?2:1} strokeDasharray={`${8+i*4} ${10+i*6}`} style={{rotate:`${(i%2?1:-1)*t*120}deg`}}/>)}
    {range(16).map((i)=>{const a=i/16*TAU+t*TAU*.2; const p1=polar(0,0,55,a),p2=polar(0,0,75+pulse*12,a); return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={i%4?primaryColor:accentColor} opacity={.55}/>;})}
  </g>;

  const compressionNoiseBurst = () => <>{range(Math.round(44*density)).map((i)=>{const gate=Math.sin(t*TAU*5+r(`nbp${i}`)*TAU)>.76;if(!gate)return null;const cell=28+Math.floor(r(`nbs${i}`)*5)*18;const x=Math.floor(r(`nbx${i}`)*width/cell)*cell;const y=Math.floor(r(`nby${i}`)*height/cell)*cell;return <rect key={i} x={x} y={y} width={cell*(1+Math.floor(r(`nbw${i}`)*5))} height={cell} fill={[primaryColor,secondaryColor,accentColor][i%3]} opacity={opacity*(.025+r(`nbo${i}`)*.11)*intensity}/>;})}</>;

  const syntheticFilmGrain = () => <>{range(Math.round(160*density)).map((i)=>{const x=r(`gx${i}-${frame}`)*width;const y=r(`gy${i}-${frame}`)*height;const bright=r(`go${i}-${frame}`);return <rect key={i} x={x} y={y} width={1+r(`gw${i}`)*5} height={1+r(`gh${i}`)*3} fill={i%7===0?accentColor:primaryColor} opacity={opacity*(.05+bright*.32)}/>;})}<rect x={0} y={(frame*7*speed)%height} width={width} height={1} fill={primaryColor} opacity={opacity*.3}/></>;

  const refractiveWaveDistortion = () => {const cx=width*(.15+.7*t),cy=height*(.5+.16*Math.sin(t*TAU));return <><defs><radialGradient id="refraction"><stop offset=".55" stopColor={primaryColor} stopOpacity="0"/><stop offset=".76" stopColor={primaryColor} stopOpacity=".18"/><stop offset=".9" stopColor={secondaryColor} stopOpacity=".03"/><stop offset="1" stopColor={primaryColor} stopOpacity="0"/></radialGradient><filter id="ripple"><feTurbulence baseFrequency=".015 .05" numOctaves="2" seed="7"/><feDisplacementMap in="SourceGraphic" scale={35*intensity}/></filter></defs>{range(4).map((i)=><ellipse key={i} cx={cx} cy={cy} rx={90+i*70+pulse*25} ry={45+i*35+pulse*12} fill="url(#refraction)" stroke={primaryColor} strokeWidth={1} opacity={opacity*(.5-i*.08)} filter="url(#ripple)"/>)}</>};

  const apertureIrisOverlay = () => {const open=.38+.45*(.5+.5*Math.sin(t*TAU));const cx=width/2,cy=height/2,outer=Math.min(width,height)*.42,inner=outer*open;return <g opacity={opacity}>{range(9).map((i)=>{const a=i/9*TAU+t*TAU*.08;const p1=polar(cx,cy,inner,a),p2=polar(cx,cy,outer,a+.45),p3=polar(cx,cy,outer,a+TAU/9+.45),p4=polar(cx,cy,inner,a+TAU/9);return <polygon key={i} points={`${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y} ${p4.x},${p4.y}`} fill={i%2?primaryColor:secondaryColor} fillOpacity={.035} stroke={primaryColor} strokeOpacity={.35}/>})}<circle cx={cx} cy={cy} r={inner} fill="none" stroke={accentColor} strokeWidth={2} opacity={.65}/></g>};

  const renderEffect = () => {
    switch(effectType) {
      case "scannerSweep": return scannerSweep(); case "chromaticSignalTear": return chromaticSignalTear(); case "circuitTracePulse": return circuitTracePulse(); case "hologramDepthSlices": return hologramDepthSlices(); case "targetBracketSwarm": return targetBracketSwarm(); case "perspectiveGridPulse": return perspectiveGridPulse(); case "energyContourLines": return energyContourLines(); case "glitchBlockDisplacement": return glitchBlockDisplacement(); case "particleConnectionField": return particleConnectionField(); case "lensSensorArtifacts": return lensSensorArtifacts(); case "volumetricLightScan": return volumetricLightScan(); case "digitalFragmentDrift": return digitalFragmentDrift(); case "plasmaEdgeArc": return plasmaEdgeArc(); case "radialInterfacePulse": return radialInterfacePulse(); case "compressionNoiseBurst": return compressionNoiseBurst(); case "syntheticFilmGrain": return syntheticFilmGrain(); case "refractiveWaveDistortion": return refractiveWaveDistortion(); case "apertureIrisOverlay": return apertureIrisOverlay();
    }
  };

  return <AbsoluteFill style={{backgroundColor:"transparent",pointerEvents:"none",overflow:"hidden"}}><svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{position:"absolute",inset:0,overflow:"hidden"}}>{renderEffect()}</svg></AbsoluteFill>;
};

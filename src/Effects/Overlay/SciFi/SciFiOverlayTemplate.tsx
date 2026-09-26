import React from "react";
import {AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig} from "remotion";
import {SciFiOverlaySchemaType, sciFiOverlayDurationFrames} from "./sci-fi-overlay.schema";
import "../../../helpers/font-jetbrains-mono";

const mono = "JetBrains Mono, monospace";
const mod = (value: number, divisor: number) => ((value % divisor) + divisor) % divisor;

export const SciFiOverlayTemplate: React.FC<SciFiOverlaySchemaType> = (props) => {
  const rawFrame = useCurrentFrame();
  const frame = rawFrame % sciFiOverlayDurationFrames;
  const {width, height} = useVideoConfig();
  const local = frame - props.initialDelayFrames;
  if (local < 0 || local >= props.activeDurationFrames) return null;
  const alpha = props.opacity * Math.min(
    props.fadeInFrames === 0 ? 1 : interpolate(local, [0, props.fadeInFrames], [0, 1], {extrapolateRight: "clamp"}),
    props.fadeOutFrames === 0 ? 1 : interpolate(local, [props.activeDurationFrames - props.fadeOutFrames, props.activeDurationFrames], [1, 0], {extrapolateLeft: "clamp"}),
  );
  const safe = props.safeAreaPercent;
  const seed = props.randomSeed;
  const scanY = mod(local * props.speed * 5, height);
  const common: React.CSSProperties = {position: "absolute", inset: 0, opacity: alpha, color: props.primaryColor, pointerEvents: "none"};

  const scanlines = <div style={{position:"absolute",inset:0,opacity:0.08*props.intensity,backgroundImage:`repeating-linear-gradient(0deg, transparent 0px, transparent 5px, ${props.primaryColor}66 6px)`}}/>;

  const renderEffect = () => {
    if (props.effectType === "tacticalScan") return <>
      {scanlines}<svg width="100%" height="100%" style={{position:"absolute"}}>
        <g fill="none" stroke={props.primaryColor} strokeWidth="2">
          <path d={`M ${width*.18} ${height*.28} h 90 M ${width*.18} ${height*.28} v 70 M ${width*.82} ${height*.28} h -90 M ${width*.82} ${height*.28} v 70 M ${width*.18} ${height*.72} h 90 M ${width*.18} ${height*.72} v -70 M ${width*.82} ${height*.72} h -90 M ${width*.82} ${height*.72} v -70`}/>
          <circle cx="50%" cy="50%" r={85 + Math.sin(local*.08)*8}/><path d={`M ${width*.5-130} ${height*.5} h 260 M ${width*.5} ${height*.5-130} v 260`}/>
          <line x1={`${safe}%`} y1={scanY} x2={`${100-safe}%`} y2={scanY} opacity=".7"/>
        </g>
      </svg><div style={{position:"absolute",left:`${safe+2}%`,top:`${safe+2}%`,fontFamily:mono,fontSize:18}}>TRACKING // VECTOR 07<br/>RANGE 0248.6m</div><div style={{position:"absolute",right:`${safe+2}%`,bottom:`${safe+2}%`,fontFamily:mono,fontSize:16}}>LOCK {Math.floor(local/3)%2?"87":"92"}%</div>
    </>;
    if (props.effectType === "signalInterference") return <>{scanlines}{Array.from({length:Math.round(14*props.density)}).map((_,i)=>{const y=random(`${seed}-y-${i}`)*100;const active=random(`${seed}-a-${i}-${Math.floor(local/3)}`)<.28*props.intensity;return active?<div key={i} style={{position:"absolute",left:`${random(`${seed}-l-${i}`)*20}%`,top:`${y}%`,width:`${55+random(`${seed}-w-${i}`)*45}%`,height:2+random(`${seed}-h-${i}`)*12,background: i%2?props.primaryColor:props.secondaryColor,opacity:.18,translate:`${(random(`${seed}-x-${i}-${Math.floor(local/3)}`)-.5)*80}px 0`}}/>:null})}<div style={{position:"absolute",inset:0,opacity:.12*props.intensity,backgroundImage:`linear-gradient(90deg,${props.secondaryColor} 0 1px,transparent 1px 99%,${props.primaryColor} 99%)`}}/></>;
    if (props.effectType === "dataAcquisitionLines") return <svg width="100%" height="100%" style={{position:"absolute",fontFamily:mono,fontSize:16}}>{Array.from({length:Math.round(6*props.density)}).map((_,i)=>{const x=width*(.15+random(`${seed}-x-${i}`)*.7);const y=height*(.15+random(`${seed}-y-${i}`)*.7);const dx=(i%2?1:-1)*(100+random(`${seed}-d-${i}`)*180);return <g key={i} opacity={interpolate(mod(local-i*12,90),[0,12,70,90],[0,1,1,0])}><circle cx={x} cy={y} r="7" fill="none" stroke={props.primaryColor}/><path d={`M${x},${y} l${dx*.35},${-35} h${dx*.65}`} fill="none" stroke={props.primaryColor}/><text x={x+dx} y={y-40} textAnchor={dx>0?"end":"start"} fill={props.primaryColor}>NODE_{String(i+1).padStart(2,"0")}  {Math.floor(random(`${seed}-n-${i}`)*999)}</text></g>})}</svg>;
    if (props.effectType === "holographicNoise") return <>{scanlines}<div style={{position:"absolute",left:0,right:0,top:scanY,height:70,background:`linear-gradient(180deg,transparent,${props.primaryColor}33,transparent)`}}/>{Array.from({length:18}).map((_,i)=><div key={i} style={{position:"absolute",left:`${random(`${seed}-x-${i}`)*100}%`,top:`${random(`${seed}-y-${i}`)*100}%`,width:20+random(`${seed}-w-${i}`)*160,height:1,background:props.primaryColor,opacity:random(`${seed}-v-${i}-${Math.floor(local/4)}`)<.35?.8:0}}/>)}<div style={{position:"absolute",inset:0,boxShadow:`inset 0 0 90px ${props.primaryColor}22`}}/></>;
    if (props.effectType === "reticleTracking") {const x=width*(.5+Math.sin(local*.025*props.speed)*.18);const y=height*(.5+Math.cos(local*.019*props.speed)*.12);return <svg width="100%" height="100%" style={{position:"absolute",fontFamily:mono}}><g transform={`translate(${x} ${y})`} fill="none" stroke={props.primaryColor}><circle r="82" strokeDasharray="20 10"/><circle r="54"/><path d="M-120 0h55M65 0h55M0-120v55M0 65v55"/></g><text x={x+100} y={y-80} fill={props.primaryColor}>TRACKING</text><text x={x+100} y={y-58} fill={props.secondaryColor}>{Math.floor(70+20*Math.abs(Math.sin(local*.07)))}% CONF</text></svg>}
    if (props.effectType === "cinematicDiagnosticFrame") return <>{scanlines}<div style={{position:"absolute",inset:`${safe}%`,border:`1px solid ${props.primaryColor}66`,clipPath:"polygon(0 0,14% 0,14% 1px,86% 1px,86% 0,100% 0,100% 100%,86% 100%,86% calc(100% - 1px),14% calc(100% - 1px),14% 100%,0 100%)"}}/><div style={{position:"absolute",left:`${safe}%`,top:`${safe-2}%`,fontFamily:mono,fontSize:14}}>REC ●  FRAME {String(frame).padStart(4,"0")}  SYNC OK</div><div style={{position:"absolute",right:`${safe}%`,bottom:`${safe-2}%`,fontFamily:mono,fontSize:14}}>SIGNAL {Math.floor(96+Math.sin(local)*3)}%</div></>;
    if (props.effectType === "volumetricGrid") return <svg width="100%" height="100%" style={{position:"absolute"}}><g stroke={props.primaryColor} fill="none" opacity=".65">{Array.from({length:12}).map((_,i)=><line key={`r${i}`} x1={width/2} y1={height*.42} x2={i*width/11} y2={height}/>) }{Array.from({length:10}).map((_,i)=>{const p=mod(i/10+local*.002*props.speed,1);const y=height*.42+(height*.58)*p*p;return <line key={`h${i}`} x1="0" y1={y} x2={width} y2={y}/>})}<line x1="0" y1={height*.42} x2={width} y2={height*.42} strokeWidth="2"/></g></svg>;
    if (props.effectType === "digitalDebris") return <>{Array.from({length:Math.round(50*props.density)}).map((_,i)=>{const travel=mod(random(`${seed}-s-${i}`)*width+local*props.speed*(4+random(`${seed}-v-${i}`)*12),width+240)-120;const y=random(`${seed}-y-${i}`)*height;return <div key={i} style={{position:"absolute",left:travel,top:y,width:8+random(`${seed}-w-${i}`)*65,height:i%5===0?3:1,background:i%4===0?props.secondaryColor:props.primaryColor,opacity:.25+random(`${seed}-o-${i}`)*.6}}/>})}</>;
    if (props.effectType === "biometricScan") return <>{scanlines}<div style={{position:"absolute",left:"32%",top:"15%",width:"36%",height:"70%",border:`1px solid ${props.primaryColor}88`,clipPath:"polygon(0 0,18% 0,18% 2px,82% 2px,82% 0,100% 0,100% 100%,82% 100%,82% calc(100% - 2px),18% calc(100% - 2px),18% 100%,0 100%)"}}/><div style={{position:"absolute",left:"30%",right:"30%",top:scanY,boxShadow:`0 0 6px ${props.primaryColor}`,height:1,background:props.primaryColor}}/><div style={{position:"absolute",right:`${safe+2}%`,top:"25%",fontFamily:mono,fontSize:17,lineHeight:1.8}}>BIOMETRIC SCAN<br/>TEMP 36.4 C<br/>PULSE 072<br/>IDENT {Math.floor(local/5)%2?"MATCH":"VERIFY"}</div></>;
    return <svg width="100%" height="100%" style={{position:"absolute"}}>{Array.from({length:Math.round(38*props.density)}).map((_,i)=>{const x=width*random(`${seed}-x-${i}`);const y=height*random(`${seed}-y-${i}`);const drift=Math.sin(local*.02*props.speed+i)*18;return <circle key={i} cx={x+drift} cy={y+Math.cos(local*.015+i)*12} r={1+random(`${seed}-r-${i}`)*3} fill={i%5===0?props.secondaryColor:props.primaryColor} opacity={.25+random(`${seed}-o-${i}`)*.65}/>})}{Array.from({length:12}).map((_,i)=>{const x1=width*random(`${seed}-lx-${i}`),y1=height*random(`${seed}-ly-${i}`),x2=x1+(random(`${seed}-dx-${i}`)-.5)*250,y2=y1+(random(`${seed}-dy-${i}`)-.5)*180;return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={props.primaryColor} opacity=".22"/>})}</svg>;
  };

  return <AbsoluteFill style={common}>{renderEffect()}</AbsoluteFill>;
};

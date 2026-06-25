import { useRef, useState, useMemo, useEffect, Suspense, Component } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment, ContactShadows } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

/* ============================================================
   DATA / CONSTANTS
   ============================================================ */
const MODEL_SCALE = 0.6;

const CAMERA_STOPS = [
  { id:"intro",      position:[0,1.5,6.5],    lookAt:[0,1.0,0],      textAnchor:[1.6,1.5,1.2],  fov:38, label:"ROCK JACKET",             spec:"Mid-poly tactical shell — built for the long haul." },
  { id:"orbit-left", position:[-4.2,1.4,4.4], lookAt:[0,1.0,0],      textAnchor:[-1.8,1.6,1.0], fov:36, label:"SHELL",                    spec:"Reinforced panel construction across the torso and shoulders." },
  { id:"zipper",     position:[-1.0,1.3,2.0], lookAt:[-0.2,1.1,0.3], textAnchor:[0.9,1.2,0.6],  fov:28, label:"HARDWARE",                 spec:"Heavy-gauge zip pulls, rated for repeated field use." },
  { id:"back",       position:[0.5,1.6,-5.5],  lookAt:[0,1.0,0],      textAnchor:[1.5,1.7,-1.0], fov:36, label:"BACK PANEL",               spec:"Articulated rear yoke for full range of motion." },
  { id:"cuff",       position:[2.4,0.7,1.4],   lookAt:[1.6,0.6,0.6],  textAnchor:[0.5,1.0,0.6],  fov:26, label:"CUFF",                    spec:"Adjustable cuff straps lock out wind and debris." },
  { id:"hero-rest",  position:[0,1.3,6.0],     lookAt:[0,1.0,0],      textAnchor:[1.7,1.4,1.0],  fov:34, label:"New Style // ROCK JACKET", spec:"Engineered for the terrain that breaks everything else." },
];

const MARQUEE_ROWS = [
  { text:"FW26",        size:"4.5rem",  rowOpacity:0.07, duration:85, dir:1,  accent:false },
  { text:"TERRAIN",     size:"6.5rem",  rowOpacity:0.13, duration:62, dir:-1, accent:false },
  { text:"Rockstar",    size:"10rem",   rowOpacity:1,    duration:42, dir:1,  accent:true  },
  { text:"ROCK JACKET", size:"6.5rem",  rowOpacity:0.13, duration:62, dir:-1, accent:false },
  { text:"FW26",        size:"4.5rem",  rowOpacity:0.07, duration:85, dir:1,  accent:false },
];

const FIELD_SPEC_CARDS_ROW_1 = [
  { eyebrow:"FW26",     title:"ROCK JACKET",   tone:"ember" },
  { eyebrow:"FW26",     title:"TERRAIN SHELL", tone:"dark"  },
  { eyebrow:"DETAIL",   title:"HARDWARE",      tone:"ember" },
];
const FIELD_SPEC_CARDS_ROW_2 = [
  { eyebrow:"CAMPAIGN", title:"ROCKSTAR",   tone:"ember" },
  { eyebrow:"FW26",     title:"FIELD TEST", tone:"dark"  },
  { eyebrow:"LIMITED",  title:"EMBER RUN",  tone:"ember" },
];

const WORKS = [
  { title:"Shell Construction", sub:"Material Study",     span:"md:col-span-7", aspect:"aspect-[16/9]", bg:"from-[#1a0a05] to-[#0a0a0a]" },
  { title:"Hardware Detail",    sub:"Component Close-up", span:"md:col-span-5", aspect:"aspect-[4/3]",  bg:"from-[#060a10] to-[#0a0a0a]" },
  { title:"Back Panel Yoke",    sub:"Structural Layout",  span:"md:col-span-5", aspect:"aspect-[4/3]",  bg:"from-[#080510] to-[#0a0a0a]" },
  { title:"Cuff & Seal System", sub:"Closure Tech",       span:"md:col-span-7", aspect:"aspect-[16/9]", bg:"from-[#0a0805] to-[#0a0a0a]" },
];

const JOURNAL = [
  { title:"Why seam tape matters more than waterproofing rating",           tag:"Construction",     read:"4 min", date:"Jan 2026" },
  { title:"Cold-weather layering: the myth of the single shell",            tag:"Field Guide",      read:"6 min", date:"Dec 2025" },
  { title:"Zip pull metallurgy — what separates field gear from fashion",   tag:"Hardware",         read:"3 min", date:"Nov 2025" },
  { title:"The cuff system: why most jackets fail at the wrist",            tag:"Detail Study",     read:"5 min", date:"Oct 2025" },
  { title:"Breathability vs waterproofing: the trade-off nobody tells you", tag:"Material Science", read:"5 min", date:"Aug 2025" },
];

const STATS = [
  { n:"3",    label:"Seasons",      sub:"Refined over 3 FW collections." },
  { n:"40+",  label:"Fabric Tests", sub:"Material iterations before production." },
  { n:"100%", label:"Field-tested", sub:"Every detail proven in the terrain." },
];

const RIBBON_WIDTHS = [60, 70, 80, 90, 100];
const STAGE_BGS_MAP = ["Intro","Shell","Hardware","BackPanel","Cuff","HeroRest"];

/* ============================================================
   HERO — BACKGROUND STAGES
   ============================================================ */
function MarqueeRow({ text, size, rowOpacity, duration, dir, accent }) {
  const content = `${text}  •  `.repeat(14);
  return (
    <div className="w-full overflow-hidden whitespace-nowrap leading-none">
      <div className="marquee-row-anim inline-block font-black uppercase select-none"
        style={{ fontSize:size, letterSpacing:"-0.02em", opacity:rowOpacity,
          color:accent?"rgba(255,76,29,0.88)":"transparent",
          WebkitTextStroke:accent?"0px transparent":"1px rgba(245,245,240,0.45)",
          animation:`${dir>0?"marqueeLeft":"marqueeRight"} ${duration}s linear infinite`,
          willChange:"transform",
          textShadow:accent?"0 0 40px rgba(255,61,26,0.6),0 0 80px rgba(255,61,26,0.3)":"none",
        }}>{content}</div>
    </div>
  );
}

function BgIntro() {
  return (
    <div className="absolute inset-0 bg-[#0a0a0a] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute aura-pulse-1" style={{ width:"80vw",height:"80vw",borderRadius:"50%",background:"radial-gradient(circle,rgba(255,61,26,0.18) 0%,rgba(255,61,26,0.07) 40%,transparent 70%)",bottom:"-20vw",left:"50%",transform:"translateX(-50%)",filter:"blur(30px)" }}/>
        <div className="absolute aura-pulse-2" style={{ width:"50vw",height:"50vw",borderRadius:"50%",background:"radial-gradient(circle,rgba(255,100,30,0.12) 0%,transparent 65%)",top:"-10vw",left:"-10vw",filter:"blur(24px)" }}/>
        <div className="absolute aura-pulse-3" style={{ width:"40vw",height:"60vw",borderRadius:"50%",background:"radial-gradient(circle,rgba(255,61,26,0.10) 0%,transparent 60%)",top:"20%",right:"-8vw",filter:"blur(20px)" }}/>
        <div className="absolute aura-core"    style={{ width:"30vw",height:"30vw",borderRadius:"50%",background:"radial-gradient(circle,rgba(255,80,20,0.22) 0%,rgba(255,61,26,0.08) 50%,transparent 70%)",top:"50%",left:"50%",transform:"translate(-50%,-50%)",filter:"blur(15px)" }}/>
      </div>
      <div className="absolute inset-0 flex flex-col justify-evenly">
        {MARQUEE_ROWS.map((row,i) => <MarqueeRow key={i} {...row}/>)}
      </div>
      <div className="absolute inset-0 mix-blend-screen pointer-events-none">
        <div className="absolute inset-0 lightning-flash-a" style={{ background:"radial-gradient(circle at 28% 12%,rgba(225,240,255,0.95) 0%,rgba(160,195,255,0.32) 30%,transparent 65%)" }}/>
        <div className="absolute inset-0 lightning-flash-b" style={{ background:"radial-gradient(circle at 76% 10%,rgba(200,205,255,0.85) 0%,rgba(150,140,255,0.24) 35%,transparent 65%)" }}/>
      </div>
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        <defs><filter id="boltGlow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter></defs>
        <g className="bolt-a"><g filter="url(#boltGlow)" stroke="#dff1ff" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.85"><path d="M 28 -5 L 34 18 L 26 22 L 36 42 L 28 46 L 34 64"/><path d="M 36 42 L 46 50 L 42 53 L 50 66"/></g><g stroke="#fff" strokeWidth="0.35" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M 28 -5 L 34 18 L 26 22 L 36 42 L 28 46 L 34 64"/><path d="M 36 42 L 46 50 L 42 53 L 50 66"/></g></g>
        <g className="bolt-b"><g filter="url(#boltGlow)" stroke="#e7e9ff" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.8"><path d="M 74 -5 L 68 15 L 76 19 L 66 38 L 74 42 L 64 58"/><path d="M 66 38 L 56 44 L 60 47 L 50 60"/></g><g stroke="#fff" strokeWidth="0.35" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M 74 -5 L 68 15 L 76 19 L 66 38 L 74 42 L 64 58"/><path d="M 66 38 L 56 44 L 60 47 L 50 60"/></g></g>
      </svg>
      <div className="absolute inset-0" style={{ background:"radial-gradient(ellipse at center,transparent 25%,rgba(10,10,10,0.88) 100%)" }}/>
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage:"repeating-linear-gradient(0deg,#fff 0px,#fff 1px,transparent 1px,transparent 3px)" }}/>
      <svg className="absolute inset-0 w-full h-full opacity-[0.05] mix-blend-overlay"><filter id="grain1"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#grain1)"/></svg>
    </div>
  );
}

function BgShell() {
  return (
    <div className="absolute inset-0 bg-[#080c10] overflow-hidden">
      {[15,32,50,68,82].map((x,i) => (
        <div key={i} className="absolute bottom-0 smoke-col" style={{ left:`${x}%`,width:`${8+i*2}vw`,height:"100%",background:`radial-gradient(ellipse at 50% 100%,rgba(${180+i*10},${200+i*5},255,${0.07+i*0.015}) 0%,transparent 70%)`,filter:"blur(18px)",animationDelay:`${i*0.7}s` }}/>
      ))}
      <div className="absolute inset-0" style={{ background:"linear-gradient(180deg,rgba(8,12,16,0.2) 0%,transparent 40%,rgba(8,12,16,0.6) 100%)" }}/>
      <div className="absolute inset-0 pointer-events-none" style={{ background:"radial-gradient(ellipse 120% 80% at 50% 110%,rgba(255,61,26,0.14) 0%,transparent 60%)" }}/>
      {[20,45,70].map((y,i) => (
        <div key={i} className="absolute w-full scan-bar" style={{ top:`${y}%`,height:"1px",background:`linear-gradient(90deg,transparent 0%,rgba(255,61,26,${0.18+i*0.06}) 50%,transparent 100%)`,animationDelay:`${i*1.2}s` }}/>
      ))}
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage:"repeating-linear-gradient(0deg,#fff 0px,#fff 1px,transparent 1px,transparent 3px)" }}/>
      <svg className="absolute inset-0 w-full h-full opacity-[0.06] mix-blend-overlay"><filter id="grain2"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#grain2)"/></svg>
    </div>
  );
}

function BgHardware() {
  return (
    <div className="absolute inset-0 bg-[#050505] overflow-hidden">
      {[12,26,40,54,68,82,95].map((x,i) => (
        <div key={i} className="absolute top-0 bottom-0 red-col" style={{ left:`${x}%`,width:i%2===0?"2px":"1px",background:`linear-gradient(180deg,transparent 0%,rgba(255,${30+i*8},20,${0.7+i*0.04}) 30%,rgba(255,61,26,0.9) 60%,transparent 100%)`,filter:"blur(2px)",boxShadow:`0 0 ${8+i*4}px rgba(255,61,26,${0.4+i*0.04})`,animationDelay:`${i*0.18}s` }}/>
      ))}
      {[20,55,80].map((x,i) => (
        <div key={i} className="absolute top-0 bottom-0" style={{ left:`${x}%`,width:"18vw",background:`radial-gradient(ellipse at 50% 50%,rgba(255,40,10,${0.09+i*0.02}) 0%,transparent 70%)`,filter:"blur(20px)" }}/>
      ))}
      <div className="absolute inset-0" style={{ background:"radial-gradient(ellipse at center,transparent 30%,rgba(5,5,5,0.92) 100%)" }}/>
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage:"repeating-linear-gradient(0deg,#fff 0px,#fff 1px,transparent 1px,transparent 3px)" }}/>
      <svg className="absolute inset-0 w-full h-full opacity-[0.05] mix-blend-overlay"><filter id="grain3"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#grain3)"/></svg>
    </div>
  );
}

function BgBackPanel() {
  const words = ["BACK PANEL","FW26","ROCK JACKET","TERRAIN","SHELL"];
  return (
    <div className="absolute inset-0 bg-[#0a0805] overflow-hidden">
      <div className="absolute inset-0 flex flex-col justify-evenly overflow-hidden">
        {Array.from({length:8},(_,i) => words[i%words.length]).map((w,i) => (
          <div key={i} className="overflow-hidden whitespace-nowrap">
            <div className="inline-block font-black uppercase select-none text-[clamp(2.5rem,6vw,5rem)]"
              style={{ letterSpacing:"-0.01em",color:"rgba(255,61,26,0.55)",animation:`${i%2===0?"marqueeLeft":"marqueeRight"} ${50+i*8}s linear infinite` }}>{`${w}  ·  `.repeat(10)}</div>
          </div>
        ))}
      </div>
      <div className="absolute inset-0 pointer-events-none" style={{ background:"radial-gradient(ellipse at 55% 45%,rgba(255,61,26,0.1) 0%,rgba(5,5,5,0.85) 65%)" }}/>
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage:"repeating-linear-gradient(0deg,#fff 0px,#fff 1px,transparent 1px,transparent 3px)" }}/>
      <svg className="absolute inset-0 w-full h-full opacity-[0.05] mix-blend-overlay"><filter id="grain4"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#grain4)"/></svg>
    </div>
  );
}

function BgCuff() {
  return (
    <div className="absolute inset-0 bg-[#080808] overflow-hidden">
      <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage:"linear-gradient(0deg,rgba(245,245,240,0.6) 1px,transparent 1px),linear-gradient(90deg,rgba(245,245,240,0.6) 1px,transparent 1px)",backgroundSize:"28px 28px" }}/>
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage:"linear-gradient(0deg,rgba(245,245,240,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(245,245,240,0.4) 1px,transparent 1px)",backgroundSize:"7px 7px" }}/>
      <div className="absolute" style={{ width:"55vw",height:"55vw",borderRadius:"50%",background:"radial-gradient(circle,rgba(255,80,20,0.2) 0%,rgba(255,61,26,0.06) 50%,transparent 70%)",top:"20%",left:"55%",transform:"translateX(-50%)",filter:"blur(18px)" }}/>
      <div className="absolute inset-0" style={{ background:"radial-gradient(ellipse at center,transparent 20%,rgba(8,8,8,0.92) 100%)" }}/>
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage:"repeating-linear-gradient(0deg,#fff 0px,#fff 1px,transparent 1px,transparent 3px)" }}/>
      <svg className="absolute inset-0 w-full h-full opacity-[0.06] mix-blend-overlay"><filter id="grain5"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#grain5)"/></svg>
    </div>
  );
}

function BgHeroRest() {
  return (
    <div className="absolute inset-0 bg-[#060404] overflow-hidden">
      {[-30,-10,10,30,50].map((x,i) => (
        <div key={i} className="absolute top-0 bottom-0 beam-slash" style={{ left:`${x}%`,width:"12vw",background:`linear-gradient(105deg,transparent 0%,rgba(255,61,26,${0.04+i*0.015}) 50%,transparent 100%)`,filter:"blur(6px)",animationDelay:`${i*0.3}s` }}/>
      ))}
      <div className="absolute aura-core" style={{ width:"70vw",height:"70vw",borderRadius:"50%",background:"radial-gradient(circle,rgba(255,61,26,0.22) 0%,rgba(255,80,20,0.08) 45%,transparent 70%)",top:"50%",left:"50%",transform:"translate(-50%,-50%)",filter:"blur(20px)" }}/>
      <div className="absolute aura-pulse-1" style={{ width:"40vw",height:"40vw",borderRadius:"50%",background:"radial-gradient(circle,rgba(255,100,30,0.14) 0%,transparent 65%)",bottom:"-15vw",right:"10vw",filter:"blur(18px)" }}/>
      <div className="absolute inset-0 mix-blend-screen pointer-events-none">
        <div className="absolute inset-0 lightning-flash-a" style={{ background:"radial-gradient(circle at 50% 10%,rgba(255,200,160,0.6) 0%,rgba(255,120,60,0.18) 35%,transparent 65%)" }}/>
      </div>
      <div className="absolute inset-0" style={{ background:"radial-gradient(ellipse at center,transparent 20%,rgba(6,4,4,0.88) 100%)" }}/>
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage:"repeating-linear-gradient(0deg,#fff 0px,#fff 1px,transparent 1px,transparent 3px)" }}/>
      <svg className="absolute inset-0 w-full h-full opacity-[0.05] mix-blend-overlay"><filter id="grain6"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#grain6)"/></svg>
    </div>
  );
}

const STAGE_BGS = [BgIntro, BgShell, BgHardware, BgBackPanel, BgCuff, BgHeroRest];

const STAGE_CSS = `
  @keyframes stageFadeIn{from{opacity:0}to{opacity:1}}
  @keyframes marqueeLeft{from{transform:translateX(0)}to{transform:translateX(-50%)}}
  @keyframes marqueeRight{from{transform:translateX(-50%)}to{transform:translateX(0)}}
  @keyframes auraPulse1{0%,100%{opacity:1;transform:translateX(-50%) scale(1)}50%{opacity:0.6;transform:translateX(-50%) scale(1.12)}}
  @keyframes auraPulse2{0%,100%{opacity:1;transform:scale(1)}60%{opacity:0.5;transform:scale(1.18)}}
  @keyframes auraPulse3{0%,100%{opacity:1;transform:scale(1)}40%{opacity:0.55;transform:scale(1.15) translateY(-4%)}}
  @keyframes auraCore{0%,100%{opacity:1;transform:translate(-50%,-50%) scale(1)}50%{opacity:0.65;transform:translate(-50%,-50%) scale(1.28)}}
  .aura-pulse-1{animation:auraPulse1 6s ease-in-out infinite}
  .aura-pulse-2{animation:auraPulse2 8s ease-in-out infinite 1s}
  .aura-pulse-3{animation:auraPulse3 7s ease-in-out infinite 2s}
  .aura-core{animation:auraCore 5s ease-in-out infinite 0.5s}
  @keyframes smokeRise{0%,100%{transform:scaleY(1) translateY(0);opacity:0.7}50%{transform:scaleY(1.08) translateY(-3%);opacity:1}}
  .smoke-col{animation:smokeRise 6s ease-in-out infinite}
  @keyframes scanPulse{0%,100%{opacity:0.5;transform:scaleX(0.7)}50%{opacity:1;transform:scaleX(1)}}
  .scan-bar{animation:scanPulse 4s ease-in-out infinite}
  @keyframes redColFlicker{0%,100%{opacity:0.85}50%{opacity:1}75%{opacity:0.9}}
  .red-col{animation:redColFlicker 3s ease-in-out infinite}
  @keyframes beamDrift{0%,100%{transform:translateX(0) skewX(-8deg)}50%{transform:translateX(2vw) skewX(-8deg)}}
  .beam-slash{transform:skewX(-8deg);animation:beamDrift 7s ease-in-out infinite}
  @keyframes lightningFlashA{0%,100%{opacity:0}41%{opacity:0}41.5%{opacity:1}42.5%{opacity:0.15}43.5%{opacity:0.85}44.5%{opacity:0}70%{opacity:0}70.6%{opacity:0.9}71.2%{opacity:0}}
  @keyframes lightningFlashB{0%,100%{opacity:0}18%{opacity:0}18.6%{opacity:0.85}19.4%{opacity:0.1}20%{opacity:0.7}20.8%{opacity:0}82%{opacity:0}82.5%{opacity:0.8}83%{opacity:0}}
  @keyframes boltFlickerA{0%,100%{opacity:0}41%{opacity:0}41.5%{opacity:1}42.5%{opacity:0.15}43.5%{opacity:0.85}44.5%{opacity:0}70%{opacity:0}70.6%{opacity:0.9}71.2%{opacity:0}}
  @keyframes boltFlickerB{0%,100%{opacity:0}18%{opacity:0}18.6%{opacity:0.85}19.4%{opacity:0.1}20%{opacity:0.7}20.8%{opacity:0}82%{opacity:0}82.5%{opacity:0.8}83%{opacity:0}}
  .lightning-flash-a{animation:lightningFlashA 10s ease-out infinite}
  .lightning-flash-b{animation:lightningFlashB 13s ease-out infinite 2.4s}
  .bolt-a{animation:boltFlickerA 10s ease-out infinite}
  .bolt-b{animation:boltFlickerB 13s ease-out infinite 2.4s}
  @media(prefers-reduced-motion:reduce){
    .marquee-row-anim,.aura-pulse-1,.aura-pulse-2,.aura-pulse-3,.aura-core,
    .smoke-col,.scan-bar,.red-col,.beam-slash,
    .lightning-flash-a,.lightning-flash-b,.bolt-a,.bolt-b{animation:none!important;opacity:0!important}
  }
`;

function StageBackground({ stopIndex }) {
  const Bg = STAGE_BGS[stopIndex] || BgIntro;
  return (
    <div className="absolute inset-0 z-0" key={stopIndex} style={{ animation:"stageFadeIn 0.9s ease forwards" }}>
      <Bg/>
      <style>{STAGE_CSS}</style>
    </div>
  );
}

/* ============================================================
   HERO — 3D SCENE COMPONENTS
   ============================================================ */
function EmberParticles({ count=220 }) {
  const points = useRef();
  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count*3), spd = new Float32Array(count);
    for (let i=0; i<count; i++) { pos[i*3]=(Math.random()-0.5)*14; pos[i*3+1]=Math.random()*8-1; pos[i*3+2]=(Math.random()-0.5)*14; spd[i]=0.15+Math.random()*0.35; }
    return [pos, spd];
  }, [count]);
  useFrame((_, delta) => {
    const arr = points.current.geometry.attributes.position.array;
    for (let i=0; i<count; i++) { arr[i*3+1]+=speeds[i]*delta; if (arr[i*3+1]>7) arr[i*3+1]=-1; }
    points.current.geometry.attributes.position.needsUpdate = true;
  });
  return (
    <points ref={points}>
      <bufferGeometry><bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3}/></bufferGeometry>
      <pointsMaterial size={0.035} color="#ff3d1a" transparent opacity={0.55} sizeAttenuation depthWrite={false}/>
    </points>
  );
}

function LabelTracker({ stopIndex, labelRef }) {
  const { camera } = useThree();
  const vec = useMemo(() => new THREE.Vector3(), []);
  useFrame(() => {
    const stop = CAMERA_STOPS[stopIndex], el = labelRef.current;
    if (!stop || !el) return;
    vec.set(stop.textAnchor[0], stop.textAnchor[1], stop.textAnchor[2]);
    vec.project(camera);
    const behind = vec.z>1, nx = behind?-vec.x:vec.x, ny = behind?-vec.y:vec.y;
    const w=window.innerWidth, h=window.innerHeight, lW=280, lH=140, m=20;
    let x=Math.min(Math.max((nx*.5+.5)*w,m),w-m-lW), y=Math.min(Math.max((-ny*.5+.5)*h,m),h-m-lH);
    el.style.transform = `translate3d(${x}px,${y}px,0)`;
  });
  return null;
}

function SpecLabel({ stop, labelRef }) {
  return (
    <div ref={labelRef} className="absolute top-0 left-0 z-20 pointer-events-none will-change-transform">
      <div key={stop.id} className="w-[280px] select-none animate-[specIn_0.7s_cubic-bezier(0.16,1,0.3,1)]">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="h-px w-6 bg-[#ff3d1a]"/><span className="text-[10px] tracking-[0.35em] uppercase text-[#ff3d1a] font-semibold">Detail</span>
        </div>
        <h3 className="text-2xl md:text-3xl font-black uppercase leading-[0.95] text-[#f5f5f0] drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]" style={{ letterSpacing:"-0.01em" }}>{stop.label}</h3>
        <p className="mt-2 text-[13px] leading-snug text-[#f5f5f0]/75 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">{stop.spec}</p>
      </div>
      <style>{`@keyframes specIn{from{opacity:0;filter:blur(4px);transform:translateY(10px)}to{opacity:1;filter:blur(0);transform:translateY(0)}}`}</style>
    </div>
  );
}

function JacketModel({ isFloating }) {
  const group = useRef(), clock = useRef(0);
  const { scene } = useGLTF("/rock_jacket_mid-poly.glb");
  useFrame((_, delta) => {
    if (!group.current) return;
    clock.current += delta;
    const amp = isFloating?1:0.4;
    group.current.position.y = Math.sin(clock.current*2.1)*0.08*amp;
    group.current.rotation.z = Math.sin(clock.current*1.3)*0.012*amp;
  });
  return <group ref={group} position={[0,0,0]} scale={MODEL_SCALE}><primitive object={scene}/></group>;
}

function PlaceholderJacket({ isFloating }) {
  const group = useRef(), clock = useRef(0), baseY = 0.9;
  useFrame((_, delta) => {
    if (!group.current) return;
    clock.current += delta;
    const amp = isFloating?1:0.4;
    group.current.position.y = baseY+Math.sin(clock.current*2.1)*0.08*amp;
    group.current.rotation.z = Math.sin(clock.current*1.3)*0.012*amp;
  });
  return (
    <group ref={group} position={[0,baseY,0]}>
      <mesh castShadow><capsuleGeometry args={[0.55,1.1,8,16]}/><meshStandardMaterial color="#1c1c1c" roughness={0.6} metalness={0.2}/></mesh>
      <mesh position={[-0.78,0.25,0]} rotation={[0,0,0.25]} castShadow><capsuleGeometry args={[0.16,0.7,8,16]}/><meshStandardMaterial color="#1c1c1c" roughness={0.6} metalness={0.2}/></mesh>
      <mesh position={[0.78,0.25,0]} rotation={[0,0,-0.25]} castShadow><capsuleGeometry args={[0.16,0.7,8,16]}/><meshStandardMaterial color="#1c1c1c" roughness={0.6} metalness={0.2}/></mesh>
      <mesh position={[0,-0.05,0.42]}><boxGeometry args={[0.04,1.3,0.02]}/><meshStandardMaterial color="#ff3d1a" roughness={0.3} metalness={0.6}/></mesh>
    </group>
  );
}

function JacketHoverZone({ onEnter, onLeave }) {
  return (
    <mesh position={[0,1.0,0]} scale={[MODEL_SCALE*2.2,MODEL_SCALE*2.8,MODEL_SCALE*1.6]} onPointerEnter={onEnter} onPointerLeave={onLeave}>
      <boxGeometry args={[1,1,1]}/><meshBasicMaterial transparent opacity={0} depthWrite={false}/>
    </mesh>
  );
}

class ModelErrorBoundary extends Component {
  constructor(p) { super(p); this.state = { hasError:false }; }
  static getDerivedStateFromError() { return { hasError:true }; }
  componentDidCatch() { this.props.onError?.(); }
  render() { return this.state.hasError ? null : this.props.children; }
}

function JacketWithFallback({ isFloating, onHoverEnter, onHoverLeave }) {
  const [failed, setFailed] = useState(false);
  return (
    <>
      {failed ? <PlaceholderJacket isFloating={isFloating}/> : (
        <ModelErrorBoundary onError={() => setFailed(true)}>
          <Suspense fallback={null}><JacketModel isFloating={isFloating}/></Suspense>
        </ModelErrorBoundary>
      )}
      <JacketHoverZone onEnter={onHoverEnter} onLeave={onHoverLeave}/>
    </>
  );
}

function CameraRig({ stopIndex }) {
  const { camera } = useThree();
  const lookAtVec = useRef(new THREE.Vector3(0,0.9,0));
  const targetPos = useRef(new THREE.Vector3(...CAMERA_STOPS[0].position));
  const targetFov = useRef({ current:CAMERA_STOPS[0].fov });
  const clock = useRef(0);
  const reduceMotion = useMemo(() => typeof window!=="undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches, []);
  useFrame((_, delta) => {
    clock.current += delta;
    const bob = reduceMotion?0:1;
    camera.position.set(targetPos.current.x+Math.sin(clock.current*.45)*.025*bob, targetPos.current.y+Math.sin(clock.current*.6+1.3)*.02*bob, targetPos.current.z);
    camera.fov = targetFov.current.current; camera.updateProjectionMatrix(); camera.lookAt(lookAtVec.current);
  });
  useEffect(() => {
    const t = CAMERA_STOPS[stopIndex]; if (!t) return;
    gsap.to(targetPos.current, { x:t.position[0],y:t.position[1],z:t.position[2],duration:1.6,ease:"power3.inOut" });
    gsap.to(targetFov.current, { current:t.fov,duration:1.6,ease:"power3.inOut" });
    gsap.to(lookAtVec.current, { x:t.lookAt[0],y:t.lookAt[1],z:t.lookAt[2],duration:1.6,ease:"power3.inOut" });
  }, [stopIndex]);
  return null;
}

function JacketScene() {
  const [playing, setPlaying] = useState(false);
  const [stopIndex, setStopIndex] = useState(0);
  const [isFloating, setIsFloating] = useState(false);
  const labelRef = useRef(null);
  const current = CAMERA_STOPS[stopIndex];

  const handleExplore = () => {
    if (playing) return;
    setPlaying(true); setStopIndex(0);
    let i = 0;
    const tl = gsap.timeline({ onComplete:() => setPlaying(false) });
    CAMERA_STOPS.forEach((_, idx) => { if (idx===0) return; tl.call(() => setStopIndex(idx), null, i*2.2+1.6); i++; });
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0a0a0a]">
      <StageBackground stopIndex={stopIndex}/>
      <Canvas shadows gl={{ alpha:true,antialias:true }} camera={{ position:CAMERA_STOPS[0].position,fov:CAMERA_STOPS[0].fov }} className="absolute inset-0 z-10" style={{ background:"transparent" }}>
        <fog attach="fog" args={["#0a0a0a",6,16]}/>
        <ambientLight intensity={0.25}/>
        <directionalLight position={[3,5,2]} intensity={1.4} color="#ffffff" castShadow/>
        <pointLight position={[-3,1.5,-2]} intensity={6} color="#ff3d1a"/>
        <pointLight position={[2,0.5,2]} intensity={2} color="#ffffff"/>
        <pointLight position={[0,3,1]} intensity={isFloating?4:0} color="#ff5522"/>
        <JacketWithFallback isFloating={isFloating} onHoverEnter={() => setIsFloating(true)} onHoverLeave={() => setIsFloating(false)}/>
        <EmberParticles/>
        <ContactShadows position={[0,-0.6,0]} opacity={0.55} scale={8} blur={2.4} far={3}/>
        <Environment preset="city"/>
        <CameraRig stopIndex={stopIndex}/>
        <LabelTracker stopIndex={stopIndex} labelRef={labelRef}/>
      </Canvas>
      <SpecLabel stop={current} labelRef={labelRef}/>
      <div className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-between p-6 md:p-12">
        <div className="flex justify-between items-start">
          <span className="text-xs md:text-sm tracking-[0.3em] text-[#f5f5f0]/60 font-medium uppercase">Rock Jacket // FW26</span>
          <span className="text-xs md:text-sm tracking-[0.3em] text-[#ff3d1a] font-semibold uppercase">{String(stopIndex+1).padStart(2,"0")} / {String(CAMERA_STOPS.length).padStart(2,"0")}</span>
        </div>
        <div className="flex justify-end">
          {!playing && <button onClick={handleExplore} className="pointer-events-auto px-8 py-4 bg-[#ff3d1a] text-[#0a0a0a] font-bold uppercase tracking-[0.15em] text-sm transition-all hover:scale-[1.03] active:scale-[0.98] hover:shadow-[0_0_30px_rgba(255,61,26,0.5)]"><span className="relative z-10">Explore the Jacket</span></button>}
          {playing && <div className="pointer-events-none text-xs uppercase tracking-[0.3em] text-[#f5f5f0]/50">Exploring…</div>}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SHARED SCROLL ANIMATION UTILITIES
   ============================================================ */
function ParallaxLayer({ children, speed=0.3, className="" }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target:ref, offset:["start end","end start"] });
  const y = useTransform(scrollYProgress, [0,1], [`${-speed*100}px`,`${speed*100}px`]);
  const smoothY = useSpring(y, { stiffness:60, damping:20 });
  return <motion.div ref={ref} style={{ y:smoothY }} className={className}>{children}</motion.div>;
}

function ParallaxX({ children, speed=0.15, className="" }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target:ref, offset:["start end","end start"] });
  const x = useTransform(scrollYProgress, [0,1], [`${-speed*200}px`,`${speed*200}px`]);
  return <motion.div ref={ref} style={{ x }} className={className}>{children}</motion.div>;
}

function SplitReveal({ text, className="", delay=0, tag="h2" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once:true, margin:"-80px" });
  const words = text.split(" ");
  const Tag = tag;
  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em]">
          <motion.span className="inline-block" initial={{ y:"110%",opacity:0 }} animate={isInView?{ y:"0%",opacity:1 }:{}} transition={{ duration:0.75,delay:delay+i*0.07,ease:[0.16,1,0.3,1] }}>{word}</motion.span>
        </span>
      ))}
    </Tag>
  );
}

function ScanReveal({ children, delay=0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once:true, margin:"-60px" });
  return (
    <div ref={ref} className="relative overflow-hidden">
      {children}
      <motion.div className="absolute inset-0 z-10 pointer-events-none" style={{ background:"linear-gradient(180deg, #0a0a0a 0%, #0a0a0a 100%)",transformOrigin:"top" }} initial={{ scaleY:1 }} animate={isInView?{ scaleY:0 }:{}} transition={{ duration:0.9,delay,ease:[0.76,0,0.24,1] }}/>
      <motion.div className="absolute left-0 right-0 h-[2px] pointer-events-none z-20" style={{ background:"linear-gradient(90deg, transparent, #ff3d1a, transparent)",boxShadow:"0 0 12px rgba(255,61,26,0.9)" }} initial={{ top:"0%",opacity:1 }} animate={isInView?{ top:"100%",opacity:0 }:{}} transition={{ duration:0.9,delay,ease:[0.76,0,0.24,1] }}/>
    </div>
  );
}

function ScrollAura({ top, left, right, bottom, size="60vw", color="rgba(255,61,26,0.12)", blur="40px", speed=0.2 }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target:ref, offset:["start end","end start"] });
  const y = useTransform(scrollYProgress, [0,1], [`${-speed*80}px`,`${speed*80}px`]);
  const scale = useTransform(scrollYProgress, [0,0.5,1], [0.9,1.1,0.95]);
  return (
    <motion.div ref={ref} className="absolute pointer-events-none" style={{ top,left,right,bottom,width:size,height:size,y,scale,borderRadius:"50%",background:`radial-gradient(circle, ${color} 0%, transparent 70%)`,filter:`blur(${blur})` }}/>
  );
}

function DarkBackdrop({ children, className="", auraPos="50% 80%", auraColor="rgba(255,61,26,0.09)" }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target:ref, offset:["start end","end start"] });
  const auraScale = useTransform(scrollYProgress, [0,0.5,1], [0.85,1.15,0.9]);
  const auraOpacity = useTransform(scrollYProgress, [0,0.3,0.7,1], [0,1,1,0]);
  return (
    <div ref={ref} className={`relative overflow-hidden bg-[#0a0a0a] ${className}`}>
      <motion.div className="absolute pointer-events-none" style={{ width:"80vw",height:"80vw",borderRadius:"50%",background:`radial-gradient(circle, ${auraColor} 0%, transparent 70%)`,filter:"blur(50px)",top:"50%",left:"50%",x:"-50%",y:"-50%",scale:auraScale,opacity:auraOpacity }}/>
      <div className="absolute inset-0 pointer-events-none" style={{ background:"radial-gradient(ellipse at center,transparent 30%,rgba(10,10,10,0.92) 100%)" }}/>
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage:"repeating-linear-gradient(0deg,#fff 0px,#fff 1px,transparent 1px,transparent 3px)" }}/>
      <svg className="absolute inset-0 w-full h-full opacity-[0.04] mix-blend-overlay pointer-events-none"><filter id="pgrain"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#pgrain)"/></svg>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

function Eyebrow({ children, delay=0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once:true, margin:"-60px" });
  return (
    <motion.div ref={ref} className="flex items-center gap-2 mb-5" initial={{ opacity:0,x:-16 }} animate={isInView?{ opacity:1,x:0 }:{}} transition={{ duration:0.6,delay,ease:[0.25,0.1,0.25,1] }}>
      <motion.span className="h-px bg-[#ff3d1a]" initial={{ width:0 }} animate={isInView?{ width:24 }:{}} transition={{ duration:0.5,delay:delay+0.1,ease:"easeOut" }}/>
      <span className="text-[10px] tracking-[0.35em] uppercase text-[#ff3d1a] font-semibold">{children}</span>
    </motion.div>
  );
}

function AnimatedStat({ value, isInView, delay=0 }) {
  const [display, setDisplay] = useState("0");
  useEffect(() => {
    if (!isInView) return;
    const match = value.match(/^([0-9]+)(.*)$/);
    if (!match) { setDisplay(value); return; }
    const end = parseInt(match[1]), suffix = match[2];
    const duration = 1200, startTime = performance.now();
    const animate = (now) => {
      const progress = Math.min((now-startTime)/duration, 1);
      const eased = 1-Math.pow(1-progress, 3);
      setDisplay(`${Math.round(eased*end)}${suffix}`);
      if (progress<1) requestAnimationFrame(animate);
    };
    const timer = setTimeout(() => requestAnimationFrame(animate), delay*1000);
    return () => clearTimeout(timer);
  }, [isInView, value, delay]);
  return <>{display}</>;
}

/* ============================================================
   SECTION A: FIELD SPECS
   ============================================================ */
function CardHalftone() {
  return <div className="absolute inset-0 opacity-[0.16] mix-blend-overlay pointer-events-none" style={{ backgroundImage:"radial-gradient(circle,#000 1px,transparent 1px)",backgroundSize:"6px 6px" }}/>;
}

function FieldSpecCard({ eyebrow, title, tone }) {
  const isEmber = tone==="ember";
  return (
    <div className="relative flex-shrink-0 w-[200px] sm:w-[230px] md:w-[260px] h-[96px] md:h-[108px] rounded-[20px] overflow-hidden flex flex-col justify-center px-5 md:px-6 select-none"
      style={{ background:isEmber?"linear-gradient(135deg,#3a1206 0%,#c83a18 45%,#ff5a26 100%)":"linear-gradient(135deg,#0c0c0c 0%,#1a1410 55%,#2a1c12 100%)",boxShadow:isEmber?"0 8px 28px rgba(255,61,26,0.22)":"0 8px 28px rgba(0,0,0,0.38)" }}>
      <CardHalftone/>
      <span className="relative z-10 text-[9px] tracking-[0.28em] uppercase font-semibold mb-1" style={{ color:isEmber?"rgba(10,5,2,0.55)":"rgba(255,90,40,0.7)" }}>{eyebrow}</span>
      <h3 className="relative z-10 text-xl md:text-2xl font-black uppercase leading-none" style={{ letterSpacing:"-0.01em",color:isEmber?"#170a04":"rgba(255,120,70,0.85)" }}>{title}</h3>
    </div>
  );
}

function FieldSpecRow({ cards, direction=1, duration=32 }) {
  const loop = [...cards, ...cards];
  return (
    <div className="overflow-hidden w-full">
      <div className="field-spec-track flex gap-3 md:gap-4 will-change-transform" style={{ animation:`${direction===1?"fieldSpecDriftLeft":"fieldSpecDriftRight"} ${duration}s linear infinite` }}>
        {loop.map((c, i) => <FieldSpecCard key={`${c.title}-${i}`} {...c}/>)}
      </div>
    </div>
  );
}

function FieldSpecsSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#0a0a0a] py-16 md:py-20 border-t border-[#f5f5f0]/[0.06]">
      <div className="absolute inset-0 pointer-events-none" style={{ background:"radial-gradient(ellipse at center,transparent 30%,rgba(10,10,10,0.9) 100%)" }}/>
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage:"repeating-linear-gradient(0deg,#fff 0px,#fff 1px,transparent 1px,transparent 3px)" }}/>
      <div className="relative z-10 flex flex-col gap-3 md:gap-4">
        <FieldSpecRow cards={FIELD_SPEC_CARDS_ROW_1} direction={1} duration={30}/>
        <FieldSpecRow cards={FIELD_SPEC_CARDS_ROW_2} direction={-1} duration={30}/>
      </div>
      <style>{`
        @keyframes fieldSpecDriftLeft{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes fieldSpecDriftRight{from{transform:translateX(-50%)}to{transform:translateX(0)}}
        @media(prefers-reduced-motion:reduce){.field-spec-track{animation:none!important}}
      `}</style>
    </section>
  );
}

/* ============================================================
   SECTION B: SELECTED WORKS
   ============================================================ */
function WorkCard({ title, sub, span, aspect, bg, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once:true, margin:"-60px" });
  const { scrollYProgress } = useScroll({ target:ref, offset:["start end","end start"] });
  const imageY = useTransform(scrollYProgress, [0,1], ["-8%","8%"]);
  const variants = {
    hidden: { opacity:0,y:50,clipPath:"inset(0 0 100% 0)" },
    visible: { opacity:1,y:0,clipPath:"inset(0 0 0% 0)",transition:{ duration:0.9,delay:index*0.1,ease:[0.16,1,0.3,1] } },
  };
  return (
    <motion.div ref={ref} variants={variants} initial="hidden" animate={isInView?"visible":"hidden"} className={`group relative ${span} rounded-3xl overflow-hidden border border-[#f5f5f0]/[0.07] bg-[#111] cursor-pointer`}>
      <div className={`${aspect} overflow-hidden relative`}>
        <motion.div className={`absolute inset-[-10%] bg-gradient-to-br ${bg} flex items-end`} style={{ y:imageY }}>
          <div className="absolute inset-0 opacity-20 mix-blend-multiply" style={{ backgroundImage:"radial-gradient(circle,#000 1px,transparent 1px)",backgroundSize:"4px 4px" }}/>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background:"radial-gradient(ellipse at 30% 70%,rgba(255,61,26,0.15) 0%,transparent 60%)" }}/>
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#ff3d1a] to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-300" style={{ boxShadow:"0 0 12px rgba(255,61,26,0.8)" }}/>
        </motion.div>
        <div className="absolute inset-0 bg-[#0a0a0a]/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-400 z-10"/>
        <div className="absolute bottom-6 left-6 right-6 z-20 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <span className="h-px w-4 bg-[#ff3d1a]"/>
          <span className="text-xs tracking-[0.25em] uppercase text-[#ff3d1a] font-semibold">{sub}</span>
          <span className="text-sm font-black uppercase text-[#f5f5f0] ml-2">{title}</span>
        </div>
        <div className="absolute bottom-6 left-6 right-6 z-20 group-hover:opacity-0 transition-opacity duration-300">
          <p className="text-[11px] tracking-[0.3em] uppercase text-[#f5f5f0]/40 mb-1">{sub}</p>
          <h3 className="text-lg md:text-xl font-black uppercase text-[#f5f5f0]" style={{ letterSpacing:"-0.01em" }}>{title}</h3>
        </div>
      </div>
    </motion.div>
  );
}

function SelectedWorksSection() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target:sectionRef, offset:["start end","end start"] });
  const decorY = useTransform(scrollYProgress, [0,1], ["-15%","15%"]);
  return (
    <DarkBackdrop className="py-20 md:py-28 border-t border-[#f5f5f0]/[0.06]" auraColor="rgba(255,80,20,0.08)">
      <motion.div className="absolute inset-x-0 top-1/2 -translate-y-1/2 pointer-events-none select-none overflow-hidden" style={{ y:decorY }}>
        <div className="font-black uppercase text-[#ff3d1a]/[0.04] whitespace-nowrap text-[clamp(5rem,14vw,12rem)] leading-none" style={{ letterSpacing:"-0.04em" }}>SELECTED WORK</div>
      </motion.div>
      <div ref={sectionRef} className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <Eyebrow>Selected Work</Eyebrow>
            <SplitReveal text="Featured details" className="text-4xl md:text-6xl font-black uppercase leading-[0.95]" style={{ letterSpacing:"-0.01em" }}/>
            <motion.p className="mt-4 text-sm text-[#f5f5f0]/50 max-w-md leading-relaxed" initial={{ opacity:0,y:12 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true,margin:"-60px" }} transition={{ duration:0.7,delay:0.5 }}>
              A close look at the construction that makes every Rock Jacket worth its name.
            </motion.p>
          </div>
          <motion.button className="hidden md:inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#f5f5f0]/10 text-xs uppercase tracking-[0.2em] text-[#f5f5f0]/60 hover:border-[#ff3d1a] hover:text-[#ff3d1a] transition-all duration-300" initial={{ opacity:0,x:20 }} whileInView={{ opacity:1,x:0 }} viewport={{ once:true }} transition={{ duration:0.6,delay:0.4 }} whileHover={{ scale:1.04 }}>
            View all <span>↗</span>
          </motion.button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6">
          {WORKS.map((w,i) => <WorkCard key={w.title} {...w} index={i}/>)}
        </div>
      </div>
    </DarkBackdrop>
  );
}

/* ============================================================
   SECTION C: JOURNAL / FIELD NOTES
   ============================================================ */

const JOURNAL_COUNT = JOURNAL.length; // 5

/*
 * useIsDesktop — returns true when window width >= 768px (Tailwind's md breakpoint).
 * Starts as false on SSR / before mount so hydration is safe.
 * Updates on resize so breakpoint transitions work correctly.
 */
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const handler = (e) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isDesktop;
}

/*
 * RibbonRow
 *
 * Desktop (md+):
 *   The background pill and the row content are BOTH driven exclusively by the
 *   `revealed` prop, which comes from JournalScrollDriver.  No useInView at all
 *   on desktop — so items are fully invisible until scroll reaches them.
 *
 * Mobile (<md):
 *   useInView fires once when the row scrolls into view normally.
 *   The `revealed` prop is ignored on mobile.
 *
 * The key fix: we never mix the two triggers. On desktop `revealed` is the
 * only source of truth; on mobile `mobileInView` is the only source of truth.
 */
function RibbonRow({ j, i, revealed, widthPercent }) {
  const isDesktop = useIsDesktop();

  // Mobile-only scroll-into-view trigger (ignored on desktop)
  const mobileRef = useRef(null);
  const mobileInView = useInView(mobileRef, { once: true, margin: "-40px" });

  // The single boolean that drives ALL animation for this row
  const isVisible = isDesktop ? revealed : mobileInView;

  const isEmber  = i % 2 === 0;
  const numCol   = isEmber ? "text-[#170a04]" : "text-[#ff3d1a]";
  const txtCol   = isEmber ? "text-[#170a04]" : "text-[#f5f5f0]/90";
  const metaCol  = isEmber ? "text-[#170a04]/60" : "text-[#f5f5f0]/30";
  const tagCol   = isEmber ? "border-[#170a04]/25 text-[#170a04]/70" : "border-[#ff3d1a]/20 text-[#ff3d1a]/70";
  const arrowCol = isEmber ? "text-[#170a04]/70" : "text-[#f5f5f0]/30";
  const bg       = isEmber
    ? "linear-gradient(90deg,#ff5a26 0%,#c83a18 55%,#3a1206 100%)"
    : "linear-gradient(90deg,#2a1c12 0%,#1a1410 55%,#0c0c0c 100%)";
  const shadow   = isEmber ? "0 10px 34px rgba(255,61,26,0.22)" : "0 10px 34px rgba(0,0,0,0.4)";

  return (
    <div ref={mobileRef} className="relative w-full">

      {/* ── Background pill — mobile uses rounded-2xl, desktop uses rounded-full ── */}
      <div
        className="absolute inset-0 md:left-0 md:top-0 md:h-full"
        style={{ width: isDesktop ? `${widthPercent}%` : "100%" }}
      >
        <motion.div
          className="absolute inset-0 overflow-hidden"
          style={{
            transformOrigin: "left center",
            background: bg,
            boxShadow: shadow,
            borderRadius: isDesktop ? "9999px" : "1rem",
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isVisible ? 1 : 0 }}
          transition={{ duration: isDesktop ? 0.55 : 0.85, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Halftone texture */}
          <div
            className="absolute inset-0 opacity-[0.14] mix-blend-overlay"
            style={{ backgroundImage: "radial-gradient(circle,#000 1px,transparent 1px)", backgroundSize: "6px 6px" }}
          />
          {/* Shimmer — only plays when bar opens */}
          <motion.div
            className="absolute inset-y-0 w-1/3 pointer-events-none"
            style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.45),transparent)" }}
            initial={{ x: "-120%" }}
            animate={isVisible ? { x: "220%" } : { x: "-120%" }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          />
        </motion.div>
      </div>

      {/* ── Row content ── */}
      <motion.div
        className="relative z-10 flex items-center gap-3 sm:gap-4 md:gap-6 px-4 sm:px-6 md:px-9 py-3 sm:py-0 sm:h-[68px] md:h-[76px]"
        initial={{ opacity: 0, x: -20 }}
        animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Index badge */}
        <div className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0 border ${isEmber ? "bg-[#170a04]/15 border-[#170a04]/25" : "bg-[#ff3d1a]/10 border-[#ff3d1a]/20"}`}>
          <span className={`text-[10px] sm:text-xs font-black ${numCol}`}>{String(i + 1).padStart(2, "0")}</span>
        </div>
        {/* Title + tag */}
        <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 md:gap-4">
          <p className={`min-w-0 text-xs sm:text-sm md:text-base font-semibold leading-snug line-clamp-2 sm:line-clamp-1 sm:truncate ${txtCol}`}>{j.title}</p>
          <span className={`self-start sm:self-auto flex-shrink-0 text-[9px] sm:text-[10px] tracking-[0.25em] sm:tracking-[0.3em] uppercase font-semibold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border ${tagCol}`}>{j.tag}</span>
        </div>
        {/* Read + date */}
        <div className={`hidden md:block text-xs flex-shrink-0 text-right ${metaCol}`}>
          <div>{j.read} read</div>
          <div>{j.date}</div>
        </div>
        <span className={`flex-shrink-0 text-sm ${arrowCol}`}>↗</span>
      </motion.div>
    </div>
  );
}

/*
 * JournalScrollDriver
 *
 * Maps scroll progress → how many ribbons should be revealed.
 *
 * The scroll range is split into:
 *   [0 → 0.18]   "Header pause" — section is pinned, title is readable, zero ribbons shown.
 *   [0.18 → 1]   Ribbons reveal one by one as the user scrolls.
 *
 * This is fully reversible: scroll back up and ribbons disappear.
 * Math.round() gives a crisp snap — each ribbon flips at the halfway point
 * of its own budget slice.
 */
const HEADER_RESERVE = 0.18;

function JournalScrollDriver({ scrollYProgress, children }) {
  const count = JOURNAL_COUNT;

  const visibleCount = useTransform(
    scrollYProgress,
    [HEADER_RESERVE, 1],
    [0, count],
    { clamp: true }
  );

  const [revealed, setRevealed] = useState(() => Array(count).fill(false));

  useEffect(() => {
    // Fire once immediately with the current value (handles back-navigation)
    const current = visibleCount.get();
    setRevealed(Array(count).fill(false).map((_, idx) => idx < Math.round(current)));

    const unsub = visibleCount.on("change", (v) => {
      setRevealed(Array(count).fill(false).map((_, idx) => idx < Math.round(v)));
    });
    return unsub;
  }, [visibleCount, count]);

  return children(revealed);
}

/*
 * JournalSection
 *
 * Outer div is the scroll container (600 vh total):
 *   100 vh  = the pinned panel itself (1 viewport)
 *   100 vh  = header-pause budget (HEADER_RESERVE × 600vh ≈ 108vh)
 *   5×80 vh = 400 vh scroll budget for 5 ribbons (80vh each)
 *   Total   = 600 vh
 *
 * The sticky panel pins immediately when its top edge hits the viewport top,
 * and unpins when the outer div's bottom exits the viewport bottom.
 *
 * Layout: justify-start + pt so the title clears any top navbar and is
 * never clipped on initial pin.
 */
function JournalSection() {
  const scrollRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });

  const bgTextX = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);

  return (
    <div
      ref={scrollRef}
      className="relative bg-[#0a0a0a] border-t border-[#f5f5f0]/[0.06]"
      style={{ height: "calc(100vh + 100vh + 5 * 80vh)" }}
    >
      {/* Sticky panel — pins at top, stays for full 600vh scroll */}
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* Background layer */}
        <div className="absolute inset-0 bg-[#0a0a0a]">
          <div
            className="absolute pointer-events-none"
            style={{
              width: "80vw", height: "80vw", borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,61,26,0.07) 0%, transparent 70%)",
              filter: "blur(50px)", top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at center,transparent 30%,rgba(10,10,10,0.92) 100%)" }}
          />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: "repeating-linear-gradient(0deg,#fff 0px,#fff 1px,transparent 1px,transparent 3px)" }}
          />
          <svg className="absolute inset-0 w-full h-full opacity-[0.04] mix-blend-overlay pointer-events-none">
            <filter id="jgrain">
              <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"/>
            </filter>
            <rect width="100%" height="100%" filter="url(#jgrain)"/>
          </svg>
        </div>

        {/* Drifting watermark text */}
        <motion.div
          className="absolute right-0 top-1/4 pointer-events-none select-none overflow-hidden"
          style={{ x: bgTextX }}
        >
          <div
            className="font-black uppercase text-[#f5f5f0]/[0.025] whitespace-nowrap text-[clamp(4rem,10vw,9rem)]"
            style={{ letterSpacing: "-0.03em" }}
          >
            FIELD NOTES
          </div>
        </motion.div>

        {/* Main content — top-aligned so title never clips behind navbar */}
        <div className="relative z-10 h-full flex flex-col pt-[max(4.5rem,9vh)] pb-10">
          <div className="max-w-6xl mx-auto px-6 md:px-12 w-full flex flex-col h-full">

            {/* Header — visible the moment section pins, before any ribbon animates */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-14 flex-shrink-0">
              <div>
                <Eyebrow>Field Notes</Eyebrow>
                <SplitReveal
                  text="Recent thoughts"
                  className="text-4xl md:text-6xl font-black uppercase leading-[0.95] text-[#f5f5f0]"
                  style={{ letterSpacing: "-0.01em" }}
                />
                <motion.p
                  className="mt-4 text-sm text-[#f5f5f0]/50 max-w-md leading-relaxed"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.7, delay: 0.45 }}
                >
                  Technical writing on materials, construction, and why the details matter out there.
                </motion.p>
              </div>
              <motion.button
                className="hidden md:inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#f5f5f0]/10 text-xs uppercase tracking-[0.2em] text-[#f5f5f0]/60 hover:border-[#ff3d1a] hover:text-[#ff3d1a] transition-all duration-300"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                whileHover={{ scale: 1.04 }}
              >
                View all <span>↗</span>
              </motion.button>
            </div>

            {/* Ribbon list — all invisible until scroll drives them in */}
            <div className="flex-1 flex flex-col justify-center">
              <JournalScrollDriver scrollYProgress={scrollYProgress}>
                {(revealed) => (
                  <div className="flex flex-col gap-4 md:gap-5">
                    {JOURNAL.map((j, i) => (
                      <RibbonRow
                        key={j.title}
                        j={j}
                        i={i}
                        revealed={revealed[i]}
                        widthPercent={RIBBON_WIDTHS[i] ?? 100}
                      />
                    ))}
                  </div>
                )}
              </JournalScrollDriver>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SECTION D: STATS
   ============================================================ */
function StatCard({ s, i }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once:true, margin:"-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity:0,scale:0.92,y:30 }} animate={isInView?{ opacity:1,scale:1,y:0 }:{}} transition={{ duration:0.8,delay:i*0.15,ease:[0.16,1,0.3,1] }} className="py-10 md:px-12 first:pt-0 md:first:pt-10 last:pb-0 md:last:pb-10 group relative">
      <motion.div className="absolute top-6 left-0 w-24 h-24 pointer-events-none" style={{ background:"radial-gradient(circle, rgba(255,61,26,0.18) 0%, transparent 70%)",filter:"blur(16px)" }} animate={isInView?{ scale:[1,1.3,1],opacity:[0.5,1,0.5] }:{}} transition={{ duration:3,repeat:Infinity,delay:i*0.5 }}/>
      <div className="text-5xl md:text-7xl font-black text-[#ff3d1a] leading-none mb-3 relative" style={{ textShadow:"0 0 30px rgba(255,61,26,0.3)" }}>
        <AnimatedStat value={s.n} isInView={isInView} delay={i*0.15+0.3}/>
      </div>
      <h4 className="text-sm font-bold uppercase tracking-[0.1em] text-[#f5f5f0]/80 mb-1">{s.label}</h4>
      <motion.div className="w-0 h-px bg-[#ff3d1a]/50 mb-2" animate={isInView?{ width:"2rem" }:{}} transition={{ duration:0.5,delay:i*0.15+0.6 }}/>
      <p className="text-xs text-[#f5f5f0]/40 leading-relaxed">{s.sub}</p>
    </motion.div>
  );
}

function StatsSection() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target:sectionRef, offset:["start end","end start"] });
  const bgScale = useTransform(scrollYProgress, [0,0.5,1], [1.1,1.0,1.1]);
  return (
    <DarkBackdrop className="py-20 md:py-28 border-t border-[#f5f5f0]/[0.06]" auraColor="rgba(255,61,26,0.14)">
      <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden" style={{ scale:bgScale }}>
        <div className="font-black text-[#ff3d1a]/[0.03] whitespace-nowrap" style={{ fontSize:"clamp(8rem,22vw,20rem)",letterSpacing:"-0.06em" }}>FW26</div>
      </motion.div>
      <div ref={sectionRef} className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
        <Eyebrow>By the numbers</Eyebrow>
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#f5f5f0]/[0.07]">
          {STATS.map((s,i) => <StatCard key={s.label} s={s} i={i}/>)}
        </div>
      </div>
    </DarkBackdrop>
  );
}

/* ============================================================
   SECTION E: CONTACT / FOOTER
   ============================================================ */
function ContactSection() {
  const marqueeRef = useRef();
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target:sectionRef, offset:["start end","end start"] });
  const ctaY = useTransform(scrollYProgress, [0,1], ["6%","-6%"]);
  const auraScale = useTransform(scrollYProgress, [0,0.5,1], [0.7,1.2,0.9]);

  useEffect(() => {
    if (!marqueeRef.current) return;
    const ctx = gsap.context(() => { gsap.to(marqueeRef.current, { xPercent:-50,duration:40,ease:"none",repeat:-1 }); });
    return () => ctx.revert();
  }, []);

  return (
    <DarkBackdrop className="pt-20 md:pt-28 pb-10 border-t border-[#f5f5f0]/[0.06] overflow-hidden" auraColor="rgba(255,61,26,0.12)">
      <motion.div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ width:"60vw",height:"60vw",borderRadius:"50%",background:"radial-gradient(circle, rgba(255,61,26,0.15) 0%, transparent 70%)",filter:"blur(40px)",scale:auraScale }}/>
      <div className="w-full overflow-hidden mb-16 md:mb-24 opacity-[0.07]">
        <div ref={marqueeRef} className="inline-block whitespace-nowrap font-black uppercase text-[#f5f5f0]" style={{ fontSize:"clamp(3rem,8vw,7rem)",letterSpacing:"-0.02em" }}>
          {"ROCK JACKET • FW26 • TERRAIN • ".repeat(10)}
        </div>
      </div>
      <div ref={sectionRef} className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div style={{ y:ctaY }} className="mb-16">
          <Eyebrow>Get Yours</Eyebrow>
          <SplitReveal text="Built to move. Ready when you are." className="text-4xl md:text-6xl font-black uppercase leading-[0.95] text-[#f5f5f0]" style={{ letterSpacing:"-0.01em" }}/>
          <motion.p className="mt-5 text-sm md:text-base text-[#f5f5f0]/50 max-w-lg leading-relaxed" initial={{ opacity:0,y:16 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true,margin:"-60px" }} transition={{ duration:0.7,delay:0.5 }}>
            The Rock Jacket FW26 is available now. Limited run — engineered for the terrain that breaks everything else.
          </motion.p>
          <div className="mt-10 flex flex-wrap gap-4">
            <motion.a href="#" className="group relative inline-flex items-center gap-2 px-8 py-4 bg-[#ff3d1a] text-[#0a0a0a] font-bold uppercase tracking-[0.15em] text-sm" initial={{ opacity:0,y:20 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} transition={{ duration:0.6,delay:0.6 }} whileHover={{ scale:1.04,boxShadow:"0 0 40px rgba(255,61,26,0.6)" }} whileTap={{ scale:0.97 }}>
              Shop Rock Jacket <span>↗</span>
            </motion.a>
            <motion.a href="#" className="inline-flex items-center gap-2 px-8 py-4 border border-[#f5f5f0]/15 text-[#f5f5f0] font-bold uppercase tracking-[0.15em] text-sm hover:border-[#ff3d1a]/50 hover:text-[#ff3d1a] transition-all duration-300" initial={{ opacity:0,y:20 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} transition={{ duration:0.6,delay:0.7 }} whileHover={{ scale:1.03 }}>
              Size Guide
            </motion.a>
          </div>
        </motion.div>
        <motion.div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-8 border-t border-[#f5f5f0]/[0.07]" initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }} transition={{ duration:0.8,delay:0.3 }}>
          <span className="text-xs tracking-[0.3em] uppercase text-[#f5f5f0]/30">© 2026 Rock Jacket. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ff3d1a] animate-pulse"/>
              <span className="text-xs tracking-[0.2em] uppercase text-[#f5f5f0]/50">In Stock</span>
            </div>
            {["Instagram","Stockists","Care"].map((l,i) => (
              <motion.a key={l} href="#" className="text-xs uppercase tracking-[0.2em] text-[#f5f5f0]/30 hover:text-[#ff3d1a] transition-colors duration-200" initial={{ opacity:0,y:8 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} transition={{ duration:0.4,delay:0.4+i*0.08 }}>{l}</motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </DarkBackdrop>
  );
}

/* ============================================================
   PAGE ROOT
   ============================================================ */
export default function Home() {
  return (
    <main className="bg-[#0a0a0a]">
      <JacketScene/>
      <FieldSpecsSection/>
      <JournalSection/>
      <SelectedWorksSection/>
      <StatsSection/>
      <ContactSection/>
    </main>
  );
}
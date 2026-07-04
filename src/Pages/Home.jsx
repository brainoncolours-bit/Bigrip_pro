import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ==========================================
   ULTRA-HIGH DENSITY EDITORIAL MEDIA ARCHIVE
   ========================================== */
const ASSETS = {
  heroVideo: "6HBxWrmI8OU",
  cinematicClip2: "9Wd_A8e8TqM",
  cinematicClip3: "s1x4u5QBbXM"
};

/* ==========================================
   PRODUCTION REUSABLE WRAPPERS
   ========================================== */
function SaturatedVideo({ videoId, opacity = "opacity-100" }) {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-black pointer-events-none">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&playsinline=1`}
        title="Vivid Continuum Loop"
        className={`absolute top-1/2 left-1/2 w-[140%] h-[140%] sm:w-[120%] sm:h-[120%] -translate-x-1/2 -translate-y-1/2 object-cover select-none transition-opacity duration-1000 ${opacity}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
    </div>
  );
}

/* ==========================================
   THE 15 EXPERIMENTAL CINEMATIC SECTIONS
   ========================================= */

// SECTION 1: Pre-flight Brand Identity Landing
function Section1Hero() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const textScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={containerRef} className="relative w-full h-screen bg-black overflow-hidden flex flex-col p-6 md:p-12">
      <SaturatedVideo videoId={ASSETS.heroVideo} opacity="opacity-100" />
      <motion.div style={{ scale: textScale, opacity }} className="z-10 flex flex-col items-start max-w-7xl mt-auto">
        <h1 className="text-[clamp(2.2rem,7.5vw,9rem)] font-extralight tracking-tighter leading-[0.9] text-white uppercase font-sans break-words w-full">
          Seckrick Productions
        </h1>
        <div className="w-full flex flex-col md:flex-row md:items-center justify-between mt-6 md:mt-8 gap-4">
          <p className="text-[9px] md:text-[10px] tracking-[0.4em] md:tracking-[0.6em] text-neutral-400 font-light uppercase leading-relaxed">
            VISUAL PRODUCTION &amp; FASHION ARCHITECTURE
          </p>
          <span className="text-[9px] font-mono tracking-widest text-neutral-500 animate-pulse">[ RUNTIME INIT: 2026 ]</span>
        </div>
      </motion.div>
      <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-end z-10 font-mono text-[9px] tracking-widest text-neutral-400 gap-2">
        <span className="animate-pulse duration-[4000ms] ease-in-out text-neutral-400 hover:text-white transition-colors cursor-default">SCROLL TO TRIGGER EXPOSURE</span>
        <span>01 // IDENTITY</span>
      </div>
    </section>
  );
}

// SECTION 2: Dynamic Typographic Threshold
function Section2Threshold() {
  const containerRef = useRef(null);
  const words = "We construct optical weight. Every sequence is structured through clean geometry, micro-tonal color shifts, and unforgiving silhouettes tailored for alternative digital landscapes.".split(" ");

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        }
      });

      tl.to(".manifesto-word", {
        color: "#ffffff",
        duration: 0.5,
        stagger: 0.5,
        ease: "power2.out",
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="w-full min-h-[40vh] bg-black flex items-center px-6 sm:px-12 md:px-24 py-16 md:py-24 border-y border-neutral-900">
      <div className="max-w-5xl">
        <span className="text-[10px] md:text-xs font-mono tracking-[0.5em] text-neutral-500 block mb-6 md:mb-8">[02 / MANIFESTO MATRIX]</span>
        <h2 className="text-xl sm:text-2xl md:text-5xl font-extralight tracking-tight leading-snug font-sans">
          {words.map((word, i) => (
            <span key={i} className="manifesto-word text-neutral-700">{word}{i < words.length - 1 ? "\u00A0" : ""}</span>
          ))}
        </h2>
      </div>
    </section>
  );
}

// SECTION 3: The Expanding Aperture Frame
function Section3Aperture() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const frameWidth = useTransform(scrollYProgress, [0, 0.6], ["85%", "100%"]);
  const frameRadius = useTransform(scrollYProgress, [0, 0.6], ["16px", "0px"]);

  return (
    <div ref={containerRef} className="relative w-full h-[80vh] md:h-[120vh] bg-black flex items-center justify-center overflow-hidden">
      <motion.div style={{ width: frameWidth, height: "100%", borderRadius: frameRadius }} className="relative overflow-hidden will-change-transform bg-neutral-900">
        <SaturatedVideo videoId={ASSETS.heroVideo} opacity="opacity-100" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-6 left-6 md:bottom-12 md:left-12 z-10 font-mono text-[9px] md:text-[10px] tracking-[0.4em] text-white">[ 03 // APERTURE EXPOSURE CAPTURE ]</div>
      </motion.div>
    </div>
  );
}

// SECTION 4: THE DOUBLE-LAYER CHROMATIC MATTE REVEAL
function Section4ChromaticMatte() {
  const triggerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: triggerRef, offset: ["start end", "end start"] });
  const yParallaxFast = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const yParallaxSlow = useTransform(scrollYProgress, [0, 1], ["5%", "-5%"]);

  return (
    <section ref={triggerRef} className="w-full min-h-screen bg-black flex flex-col justify-center py-16 md:py-24 px-6 md:px-12 lg:px-24 border-b border-neutral-900 relative overflow-hidden">
      <div className="w-full flex justify-between font-mono text-[9px] md:text-[10px] tracking-[0.3em] md:tracking-[0.5em] text-neutral-400 mb-6 gap-4">
        <span>[04 // DEPTH LAYERING PROFILE]</span>
        <span className="text-white text-right">MATTE REEL: ACTIVE</span>
      </div>
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative">
        <div className="lg:col-span-7 aspect-[4/5] lg:aspect-[16/10] overflow-hidden bg-neutral-950 border border-neutral-800 relative w-full">
          <motion.div style={{ y: yParallaxSlow }} className="absolute top-0 left-0 w-full h-[115%]">
            <SaturatedVideo videoId={ASSETS.cinematicClip3} />
          </motion.div>
        </div>
        <div className="lg:col-span-5 aspect-[3/4] w-full max-w-[280px] lg:max-w-[340px] overflow-hidden bg-neutral-950 border border-neutral-800 relative lg:-translate-x-24 lg:translate-y-16 shadow-[0_0_60px_rgba(255,255,255,0.05)] z-10 mx-auto lg:mx-0">
          <motion.div style={{ y: yParallaxFast }} className="absolute top-0 left-0 w-full h-[120%]">
            <SaturatedVideo videoId={ASSETS.heroVideo} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// SECTION 5: BRUTALIST NEON PULSE RUNTIME BANNER
function Section5VividMarquee() {
  return (
    <section className="w-full py-20 md:py-32 bg-black overflow-hidden border-b border-neutral-900 flex justify-center items-center select-none">
      <style>{`
        @keyframes revealLetter {
          from {
            opacity: 0;
            transform: translateY(10px);
            filter: blur(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }
        .animate-letter {
          opacity: 0;
          animation: revealLetter 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <div className="max-w-6xl px-4 md:px-8 text-center text-[5.5vw] md:text-[4.5vw] lg:text-[3vw] font-sans font-thin tracking-[0.12em] md:tracking-[0.18em] uppercase text-neutral-500 leading-relaxed break-words">
        {"Art is not what you see, but what you make others see.".split("").map((char, index) => (
          <span
            key={index}
            className="inline-block animate-letter transition-colors duration-500 hover:text-white"
            style={{ 
              animationDelay: `${index * 15}ms` 
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </div>
    </section>
  );
}

// SECTION 6: THE EXPANDING HORIZONTAL LINE INTERCEPT
function Section6LineVideoReveal() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const lineWidth = useTransform(scrollYProgress, [0.1, 0.45], ["0%", "100%"]);
  const lineHeight = useTransform(scrollYProgress, [0.45, 0.75], ["0%", "100%"]);
  const opacity = useTransform(scrollYProgress, [0.5, 0.7], [0, 1]);

  return (
    <section ref={containerRef} className="w-full min-h-[100vh] md:min-h-[140vh] bg-black flex flex-col justify-center items-center px-6 relative py-12">
      <div className="w-full max-w-5xl flex justify-between font-mono text-[9px] md:text-[10px] text-neutral-400 mb-4 tracking-[0.2em] md:tracking-[0.3em] gap-4">
        <span>[06 // HORIZONTAL EXPANSION]</span>
        <span>STREAM IDENTITY ACTIVE</span>
      </div>
      <div className="w-full max-w-5xl aspect-video relative overflow-hidden">
        <motion.div style={{ width: lineWidth, height: lineHeight }} className="absolute inset-x-0 bottom-0 bg-neutral-800 overflow-hidden will-change-[width,height] shadow-2xl">
          <motion.div style={{ opacity }} className="absolute inset-0 w-full h-full">
            <SaturatedVideo videoId={ASSETS.cinematicClip3} />
          </motion.div>
        </motion.div>
      </div>
      <div className="mt-6 max-w-md text-center">
        <p className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">[ Linear pixel translation complete ]</p>
      </div>
    </section>
  );
}

// SECTION 7: VIVID TRIPLE-STILL GRID INTERLOCK
function Section7VividMatrix() {
  return (
    <section className="w-full bg-black py-20 md:py-32 px-6 md:px-12 lg:px-16 border-b border-neutral-900">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 lg:gap-6">
        <div className="flex flex-col justify-between p-4 md:p-6 border border-neutral-800 aspect-[3/4] bg-neutral-950 relative overflow-hidden group shadow-[0_0_30px_rgba(255,255,255,0.02)]">
          <SaturatedVideo videoId={ASSETS.heroVideo} />
          <span className="font-mono text-[9px] md:text-[10px] text-white z-10 bg-black/40 p-1 rounded backdrop-blur-sm self-start">[ VAL_01 / RADIANCE ]</span>
          <span className="font-mono text-[8px] md:text-[9px] text-neutral-400 text-right z-10 bg-black/40 p-1 rounded backdrop-blur-sm self-end">CORE SPECTRUM METRIC</span>
        </div>
        <div className="flex flex-col justify-between p-4 md:p-6 border border-neutral-800 aspect-[3/4] bg-neutral-950 relative overflow-hidden group md:translate-y-8 lg:translate-y-12 shadow-[0_0_30px_rgba(255,255,255,0.02)]">
          <SaturatedVideo videoId={ASSETS.cinematicClip2} />
          <span className="font-mono text-[9px] md:text-[10px] text-white z-10 bg-black/40 p-1 rounded backdrop-blur-sm self-start">[ VAL_02 / VIBRANCY ]</span>
          <span className="font-mono text-[8px] md:text-[9px] text-neutral-400 text-right z-10 bg-black/40 p-1 rounded backdrop-blur-sm self-end">CHROMATIC CORRECTION</span>
        </div>
        <div className="flex flex-col justify-between p-4 md:p-6 border border-neutral-800 aspect-[3/4] bg-neutral-950 relative overflow-hidden group shadow-[0_0_30px_rgba(255,255,255,0.02)]">
          <SaturatedVideo videoId={ASSETS.cinematicClip3} />
          <span className="font-mono text-[9px] md:text-[10px] text-white z-10 bg-black/40 p-1 rounded backdrop-blur-sm self-start">[ VAL_03 / SATURATE ]</span>
          <span className="font-mono text-[8px] md:text-[9px] text-neutral-400 text-right z-10 bg-black/40 p-1 rounded backdrop-blur-sm self-end">COLOR CONVERSION INIT</span>
        </div>
      </div>
    </section>
  );
}

// SECTION 8: FULL-BLEED SATURATED PARALLAX REEL REVEAL
function Section8VideoIntercept() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const scaleHero = useTransform(scrollYProgress, [0, 1], [1.1, 1]);

  return (
    <section ref={containerRef} className="w-full h-[60vh] md:h-screen bg-black overflow-hidden relative border-b border-neutral-900 flex items-center justify-center">
      <motion.div style={{ scale: scaleHero }} className="absolute inset-0 w-full h-full">
        <SaturatedVideo videoId={ASSETS.cinematicClip2} opacity="opacity-100" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black pointer-events-none opacity-40 mix-blend-multiply" />
      <div className="z-10 text-center font-mono text-[8px] md:text-[10px] tracking-[0.4em] md:tracking-[0.6em] text-white bg-black/50 px-3 py-2 backdrop-blur-sm rounded max-w-[90%] break-words">
        [ SATURATED RUNTIME FEED INTERCEPT // REEL_ACTIVE ]
      </div>
    </section>
  );
}

// SECTION 9: HIGH-GLOW CINEMATIC SPECTRUM FOCAL WALL
function Section9VividFocus() {
  return (
    <section className="w-full min-h-[60vh] md:min-h-screen bg-black flex items-center justify-center py-16 md:py-24 px-6 border-b border-neutral-900">
      <div className="w-full max-w-5xl aspect-video relative border border-neutral-800 bg-neutral-950 overflow-hidden shadow-[0_0_60px_rgba(255,255,255,0.05)]">
        <SaturatedVideo videoId={ASSETS.cinematicClip3} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />
        <div className="absolute top-4 left-4 md:top-8 md:left-8 font-mono text-[8px] md:text-[10px] tracking-[0.3em] md:tracking-[0.4em] text-white bg-black/40 px-2 py-1 backdrop-blur-sm rounded">[ 09 // SPECTRUM INTENSITY FIELD ]</div>
      </div>
    </section>
  );
}

// SECTION 10: ALTERNATIVE GEOMETRIC BLOCK OVERLAY
function Section10AsymmetricBlock() {
  const blockRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: blockRef, offset: ["start end", "end start"] });
  const xOffset = useTransform(scrollYProgress, [0, 1], ["-10%", "5%"]);

  return (
    <section ref={blockRef} className="w-full min-h-screen bg-black py-16 md:py-24 px-6 md:px-12 lg:px-24 border-b border-neutral-900 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center overflow-hidden">
      <div className="lg:col-span-4 flex flex-col space-y-4 md:space-y-6">
        <span className="font-mono text-[10px] md:text-xs text-neutral-400 tracking-[0.4em]">[10 // DYNAMIC GRID OVERLAY]</span>
        <h3 className="text-2xl md:text-3xl lg:text-5xl font-extralight tracking-tighter text-white uppercase font-sans leading-none break-words">
          ASYMMETRIC<br className="hidden lg:block"/> DISPLACEMENT
        </h3>
      </div>
      <div className="lg:col-span-8 relative flex items-center justify-center w-full">
        <div className="w-full aspect-[16/10] overflow-hidden bg-neutral-950 border border-neutral-800 relative z-10">
          <SaturatedVideo videoId={ASSETS.heroVideo} />
        </div>
        <motion.div style={{ x: xOffset }} className="absolute right-0 bottom-[-40px] w-1/2 aspect-square max-w-[280px] bg-white opacity-5 filter blur-3xl rounded-full z-0 pointer-events-none" />
      </div>
    </section>
  );
}

// SECTION 11: CHROMATIC TEXT INTERSECTION
function Section11TypeIntersect() {
  const textContainer = useRef(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".intersect-item-1", { xPercent: -20, ease: "none", scrollTrigger: { trigger: textContainer.current, scrub: true, start: "top bottom", end: "bottom top" } });
      gsap.to(".intersect-item-2", { xPercent: 20, ease: "none", scrollTrigger: { trigger: textContainer.current, scrub: true, start: "top bottom", end: "bottom top" } });
    }, textContainer);
    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={textContainer} 
      className="w-full py-20 md:py-32 bg-black border-b border-neutral-900 overflow-hidden flex items-center justify-center select-none relative min-h-[350px] md:min-h-[500px]"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#141414_1px,transparent_1px),linear-gradient(to_bottom,#141414_1px,transparent_1px)] bg-[size:3rem_3rem] md:bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-60" />

      <motion.div 
        className="absolute w-16 h-16 md:w-24 md:h-24 rounded-full border border-violet-500/40 bg-violet-500/5 blur-sm z-0 pointer-events-none"
        animate={{
          scale: [0, 0, 3.5, 5, 0],
          opacity: [0, 0, 0.8, 0, 0]
        }}
        transition={{
          duration: 6,
          times: [0, 0.22, 0.26, 0.37, 1],
          repeat: Infinity,
          ease: "easeOut"
        }}
      />

      <div className="relative w-full max-w-6xl h-48 md:h-64 flex items-center justify-center z-10 overflow-hidden">
        
        {/* ================= LEFT TRAIN ================= */}
        {[
          "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=300&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=300&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1563089145-599997674d42?w=300&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&auto=format&fit=crop&q=80"
        ].map((src, i) => {
          const baseOffset = -120 - (i * 60); 
          const orbitAngle = i * (360 / 8);

          return (
            <motion.div
              key={`left-${i}`}
              className="absolute w-14 h-9 md:w-20 md:h-12 origin-center"
              animate={{
                x: [baseOffset, 0, 0, Math.cos(orbitAngle * Math.PI / 180) * 90, Math.cos((orbitAngle + 360) * Math.PI / 180) * 180],
                y: [0, 0, 0, Math.sin(orbitAngle * Math.PI / 180) * 90, Math.sin((orbitAngle + 360) * Math.PI / 180) * 180],
                rotate: [0, 0, 0, orbitAngle + 90, orbitAngle + 90 + 360],
                scale: [1, 1, 1.1, 0.9, 0],
                opacity: [0, 1, 1, 0.9, 0],
                filter: ["blur(2px)", "blur(0px)", "blur(0px)", "blur(1px)", "blur(6px)"]
              }}
              transition={{
                duration: 6,
                times: [0, 0.18, 0.32, 0.75, 1],
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <img src={src} alt="" className="w-full h-full object-cover rounded-none shadow-[0_0_20px_rgba(0,0,0,0.8)]" />
            </motion.div>
          );
        })}

        {/* ================= RIGHT TRAIN ================= */}
        {[
          "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=300&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&auto=format&fit=crop&q=80"
        ].map((src, i) => {
          const baseOffset = 120 + (i * 60);
          const orbitAngle = (i + 4) * (360 / 8);

          return (
            <motion.div
              key={`right-${i}`}
              className="absolute w-14 h-9 md:w-20 md:h-12 origin-center"
              animate={{
                x: [baseOffset, 0, 0, Math.cos(orbitAngle * Math.PI / 180) * 90, Math.cos((orbitAngle + 360) * Math.PI / 180) * 180],
                y: [0, 0, 0, Math.sin(orbitAngle * Math.PI / 180) * 90, Math.sin((orbitAngle + 360) * Math.PI / 180) * 180],
                rotate: [0, 0, 0, orbitAngle + 90, orbitAngle + 90 + 360],
                scale: [1, 1, 1.1, 0.9, 0],
                opacity: [0, 1, 1, 0.9, 0],
                filter: ["blur(2px)", "blur(0px)", "blur(0px)", "blur(1px)", "blur(6px)"]
              }}
              transition={{
                duration: 6,
                times: [0, 0.18, 0.32, 0.75, 1],
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <img src={src} alt="" className="w-full h-full object-cover rounded-none shadow-[0_0_20px_rgba(0,0,0,0.8)]" />
            </motion.div>
          );
        })}

      </div>
    </section>
  );
}

// SECTION 12: CINEMATIC MULTI-ANGLE STRIP
function Section12AngleStrip() {
  const videoFeeds = [ASSETS.heroVideo, ASSETS.cinematicClip2, ASSETS.cinematicClip3, ASSETS.heroVideo];
  
  return (
    <section className="w-full bg-black py-16 md:py-28 px-6 md:px-12 lg:px-16 border-b border-neutral-900">
      <div className="max-w-7xl mx-auto flex flex-col space-y-8 md:space-y-12">
        <div className="w-full flex justify-between items-center font-mono text-[9px] md:text-[10px] text-neutral-400 tracking-widest border-b border-neutral-900 pb-4 gap-4">
          <span>[12 // CAPTURE AXIS MAP]</span>
          <span className="text-white text-right">MULTI_ANGLE_PROFILES</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {videoFeeds.map((videoId, idx) => (
            <div key={idx} className="group relative aspect-[3/4] overflow-hidden bg-neutral-950 border border-neutral-800">
              <SaturatedVideo videoId={videoId} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
              <span className="absolute bottom-3 left-3 font-mono text-[8px] md:text-[9px] text-white opacity-80 bg-black/50 px-1.5 py-0.5 rounded backdrop-blur-sm">[CAM_0{idx + 1}]</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// SECTION 13: THE INVERTED APERTURE MASQUE
function Section13InvertedAperture() {
  const scaleRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: scaleRef, offset: ["start end", "end start"] });
  const innerScale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);

  return (
    <section ref={scaleRef} className="w-full h-[60vh] md:h-screen bg-black overflow-hidden relative border-b border-neutral-900 flex items-center justify-center">
      <motion.div style={{ scale: innerScale }} className="absolute inset-0 w-full h-full">
        <SaturatedVideo videoId={ASSETS.cinematicClip2} />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-40 pointer-events-none" />
      <div className="absolute top-6 left-6 md:top-12 md:left-12 font-mono text-[9px] md:text-[10px] tracking-[0.4em] md:tracking-[0.5em] text-white bg-black/40 px-2.5 py-1 backdrop-blur-sm rounded">[13 // INVERTED TARGET]</div>
    </section>
  );
}

// SECTION 14: KINETIC SHUTTER PROFILE
function Section14ShutterProfile() {
  return (
    <section className="w-full min-h-[35vh] bg-black flex items-center px-6 md:px-12 lg:px-24 py-16 md:py-20 border-b border-neutral-900">
      <div className="max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-baseline">
        <span className="font-mono text-[10px] md:text-xs text-white lg:col-span-3 uppercase tracking-widest">[14 // SHUTTER SYNC]</span>
        <h2 className="text-lg md:text-xl lg:text-3xl font-extralight text-neutral-400 tracking-tight leading-relaxed lg:col-span-9 font-sans">
          We break absolute linearity to calibrate alternative visual frames. Tracking velocity is matched seamlessly with the organic drape of structural fabrics.
        </h2>
      </div>
    </section>
  );
}

// SECTION 15: CHROMATIC ARCHITECTURAL COMMAND TERMINAL
function Section15TerminalFooter() {
  return (
    <section className="w-full bg-black text-white pt-24 md:pt-40 pb-12 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto flex flex-col justify-between h-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-20 md:mb-32">
          <div className="lg:col-span-8 flex flex-col items-start space-y-6 md:space-y-10">
            <span className="font-mono text-[8px] md:text-[9px] tracking-[0.3em] md:tracking-[0.4em] text-neutral-400">[15 // MASTER OUTFLOW TERMINAL]</span>
            <h2 className="text-2xl sm:text-4xl lg:text-6xl font-extralight tracking-tighter text-white uppercase leading-[1.05] md:leading-[0.98] max-w-2xl font-sans break-words">
              EXECUTE PROJECT CORES &amp; SYNC CHROMATIC CHANNELS.
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto pt-2">
              <a href="#" className="px-8 md:px-12 py-3.5 md:py-4 bg-white text-black font-mono text-[9px] md:text-[10px] tracking-[0.2em] md:tracking-[0.3em] uppercase hover:bg-neutral-200 transition-colors rounded-[1px] text-center shadow-[0_0_25px_rgba(255,255,255,0.1)]">
                LAUNCH ARCHIVE SOURCE
              </a>
              <a href="#" className="px-8 md:px-12 py-3.5 md:py-4 border border-neutral-800 text-neutral-400 font-mono text-[9px] md:text-[10px] tracking-[0.2em] md:tracking-[0.3em] uppercase hover:text-white hover:border-neutral-500 transition-colors rounded-[1px] text-center">
                READ SPECTRAL CONFIGS
              </a>
            </div>
          </div>
          <div className="lg:col-span-3 lg:col-start-10 flex flex-col gap-3 font-mono text-[9px] md:text-[10px] tracking-widest text-neutral-500 pt-6 lg:pt-0 border-t border-neutral-900 lg:border-none self-end w-full">
            <span className="text-neutral-400 font-bold mb-1 uppercase">[SYSTEM INDICES]</span>
            <a href="#" className="hover:text-white transition-colors">01 / PLATFORM CORE LANDING</a>
            <a href="#" className="hover:text-white transition-colors">02 / COLOR GAIN TRACK RUN</a>
            <a href="#" className="hover:text-white transition-colors">03 / CONTINUOUS HORIZON CELL</a>
            <a href="#" className="hover:text-white transition-colors">04 / ARCHIVE LOG DISPATCH</a>
          </div>
        </div>
        <div className="w-full pt-8 border-t border-neutral-900 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-[8px] md:text-[9px] tracking-wider text-neutral-600 text-center md:text-left">
          <span>© 2026 ROCKET JACKET LABS. DIGITAL COGNIZANCE SECURED.</span>
          <div className="flex gap-6 md:gap-8">
            <a href="#" className="hover:text-white transition-colors">INSTAGRAM</a>
            <a href="#" className="hover:text-white transition-colors">VIMEO CONTROL</a>
            <a href="#" className="hover:text-white transition-colors">X ARCHIVE</a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==========================================
   MAIN ROOT EXPORT ENTRY COMPONENT
   ========================================== */
export default function Home() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const systemPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (systemPreference.matches) {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      }
    }
  }, []);

  return (
    <main className="bg-black text-white overflow-x-hidden selection:bg-white selection:text-black antialiased">
      <Section1Hero />
      <Section2Threshold />
      <Section3Aperture />
      <Section4ChromaticMatte />
      <Section5VividMarquee />
      <Section6LineVideoReveal />
      <Section7VividMatrix />
      <Section8VideoIntercept />
      <Section9VividFocus />
      <Section10AsymmetricBlock />
      <Section11TypeIntersect />
      <Section12AngleStrip />
      <Section13InvertedAperture />
      <Section14ShutterProfile />
      <Section15TerminalFooter />
    </main>
  );
}
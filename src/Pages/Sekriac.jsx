import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ==========================================
   ULTRA-HIGH DENSITY EDITORIAL SERVICES MEDIA
   ========================================== */
const ASSETS = {
  serviceVideo1: "6HBxWrmI8OU", // Narrative Architecture
  serviceVideo2: "9Wd_A8e8TqM", // Chromatic Grading & Finish
  serviceVideo3: "s1x4u5QBbXM", // Fashion & Silhouette Capture
  serviceVideo4: "6HBxWrmI8OU", // Sound Design & Sonic Textures
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
   SERVICES EXPERIMENTAL SECTIONS
   ========================================= */

// SECTION 1: Header Manifesto
function ServicesHero() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const yOffset = useTransform(scrollYProgress, [0, 0.5], ["0px", "-50px"]);

  return (
    <section ref={containerRef} className="relative w-full min-h-[62vh] md:min-h-[80vh] bg-black overflow-hidden flex flex-col justify-between p-6 md:p-12 border-b border-neutral-900">
      
      
      <motion.div style={{ opacity, y: yOffset }} className="z-10 flex flex-col items-start max-w-7xl my-auto">
        <h1 className="text-[clamp(2.5rem,8vw,8rem)] font-thin tracking-tighter leading-[0.95] text-white uppercase font-sans break-words w-full">
          OPERATIONAL<br />CAPABILITIES.
        </h1>
        <p className="text-[11px] md:text-xs tracking-[0.3em] text-neutral-400 font-light uppercase max-w-2xl mt-5 md:mt-8 leading-relaxed">
          We engineer raw visual weight. Below is our baseline framework for tailoring high-density digital assets, architectural fashion campaigns, and severe optical grades.
        </p>
      </motion.div>

      <div className="w-full flex justify-between items-end z-10 font-mono text-[9px] tracking-widest text-neutral-500">
        <span className="animate-pulse">[ DEPLOYING CORE MODULES ]</span>
        <span>INDEXED BY VOLTAGE</span>
      </div>
    </section>
  );
}

// SECTION 2: Interactive Service List Matrix (GSAP Scrubbing)
function ServicesMatrixList() {
  const componentRef = useRef(null);

  const capabilities = [
    {
      num: "01",
      title: "CINEMATIC DIRECTION & ARCHITECTURE",
      desc: "Full-scale visual architecture from spatial concepts to continuous tracking. Engineered using precise camera grids, high-speed shutter manipulation, and geometric alignment.",
      metrics: ["ANAMORPHIC PIPELINES", "SPATIAL BLOCKING", "16MM / 35MM EMBEDDED ENGINE"],
      video: ASSETS.serviceVideo1
    },
    {
      num: "02",
      title: "CHROMATIC GRADE & SPECTRAL DEPTH",
      desc: "Micro-tonal color shifts and unforgiving color treatments engineered for low-light digital landscapes. We calibrate custom look-up profiles tailored per deployment canvas.",
      metrics: ["LUT SPECULATION", "HIGH-GLOW CONTRAST ISOLATION", "REDUCED NOISE COMPRESSION"],
      video: ASSETS.serviceVideo2
    },
    {
      num: "03",
      title: "EDITORIAL FASHION & SILHOUETTE CAPTURE",
      desc: "Calibrating the relationship between moving fabrics, human form, and static brutalist architecture. Tailored strictly for high-end fashion campaigns and digital runway archives.",
      metrics: ["DRAPE/VELOCITY SYNC", "TEXTURE RETENTION ENGINE", "ASYMMETRIC FRAMING"],
      video: ASSETS.serviceVideo3
    },
    {
      num: "04",
      title: "SONIC LANDSCAPES & AUDIO TEXTURING",
      desc: "Constructing raw, industrial audio spaces that backstop visual weight. Sub-bass design, rhythmic pacing edits, and customized microtonal synthesis.",
      metrics: ["SUB-FREQUENCY CALIBRATION", "RHYTHMIC INTERVAL SYNCHRONIZATION", "ATMOSPHERIC GAIN DESIGN"],
      video: ASSETS.serviceVideo4
    }
  ];

  return (
    <section ref={componentRef} className="w-full bg-black py-8 md:py-12 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto flex flex-col">
        {capabilities.map((item, idx) => (
          <div 
            key={idx} 
            className="group grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-12 py-10 md:py-16 border-b border-neutral-900 items-start transition-colors duration-500 hover:bg-neutral-950/40 px-2"
          >
            {/* Number Code */}
            <div className="lg:col-span-1 font-mono text-[10px] md:text-xs text-neutral-600 group-hover:text-white transition-colors">
              [{item.num} // GEN_CAP]
            </div>

            {/* Core Details */}
            <div className="lg:col-span-6 flex flex-col space-y-4">
              <h3 className="text-xl md:text-2xl lg:text-3xl font-extralight tracking-tight text-neutral-300 group-hover:text-white transition-colors font-sans">
                {item.title}
              </h3>
              <p className="text-xs md:text-[13px] font-light text-neutral-500 leading-relaxed max-w-xl group-hover:text-neutral-400 transition-colors">
                {item.desc}
              </p>
              
              {/* Technical Tags */}
              <div className="flex flex-wrap gap-2 pt-2">
                {item.metrics.map((metric, mIdx) => (
                  <span key={mIdx} className="font-mono text-[8px] md:text-[9px] tracking-wider text-neutral-600 border border-neutral-900 group-hover:border-neutral-800 group-hover:text-neutral-400 px-2 py-0.5 rounded-[1px] transition-all">
                    {metric}
                  </span>
                ))}
              </div>
            </div>

            {/* Micro Video Terminal Preview */}
            <div className="lg:col-span-5 w-full aspect-video lg:aspect-[16/10] bg-neutral-950 border border-neutral-900 overflow-hidden relative shadow-2xl transition-all duration-700 group-hover:border-neutral-700 filter grayscale group-hover:grayscale-0">
              <SaturatedVideo videoId={item.video} />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500 pointer-events-none" />
              <div className="absolute bottom-2 right-2 font-mono text-[7px] text-neutral-600 group-hover:text-neutral-400 px-1 bg-black/60 backdrop-blur-sm uppercase">
                PREVIEW_{item.num}_LIVE
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// SECTION 3: The Deployment Spec Sheet (Grid Specs)
function TechnicalSpecsTable() {
  return (
    <section className="w-full bg-black py-12 md:py-32 px-6 md:px-12 lg:px-24 border-t border-neutral-900">
      <div className="max-w-5xl mx-auto">
        <span className="text-[10px] md:text-xs font-mono tracking-[0.5em] text-neutral-500 block mb-5 md:mb-8">[03 // ACQUISITION PARAMETERS]</span>
        <h2 className="text-2xl font-extralight tracking-tighter text-white uppercase mb-8 md:mb-12 font-sans">DELIVERY SPECIFICATIONS</h2>
        
        <div className="w-full overflow-x-auto border border-neutral-950">
          <table className="w-full text-left border-collapse font-mono text-[10px] md:text-xs text-neutral-400">
            <thead>
              <tr className="border-b border-neutral-900 text-neutral-500">
                <th className="py-4 px-2 uppercase tracking-widest font-normal">MODULE SYSTEM</th>
                <th className="py-4 px-2 uppercase tracking-widest font-normal">NATIVE ENGINE</th>
                <th className="py-4 px-2 uppercase tracking-widest font-normal">OUTPUT STATE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900">
              <tr className="hover:text-white transition-colors">
                <td className="py-4 px-2 text-neutral-300">RAW Capture Platform</td>
                <td className="py-4 px-2">ARRI Alexa Mini LF / RED V-Raptor XL</td>
                <td className="py-4 px-2">ProRes 4444 XQ / 8K REDCODE RAW</td>
              </tr>
              <tr className="hover:text-white transition-colors">
                <td className="py-4 px-2 text-neutral-300">Optics Mapping</td>
                <td className="py-4 px-2">Cooke Anamorphic / Tribe7 Blackwing7</td>
                <td className="py-4 px-2">Custom Spatial Distortion Profiles</td>
              </tr>
              <tr className="hover:text-white transition-colors">
                <td className="py-4 px-2 text-neutral-300">Color Framework</td>
                <td className="py-4 px-2">ACES workflow / DaVinci Resolve Studio</td>
                <td className="py-4 px-2">Rec.2026 / P3 D65 Master Matrices</td>
              </tr>
              <tr className="hover:text-white transition-colors">
                <td className="py-4 px-2 text-neutral-300">Spatial Mastering</td>
                <td className="py-4 px-2">Dolby Atmos Spatial Mixing Engines</td>
                <td className="py-4 px-2">24-bit Linear PCM Broadcast Stream</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

// SECTION 4: Pipeline Operational Call To Action
function ServicesCTA() {
  return (
    <section className="w-full bg-black text-white pt-12 md:pt-24 pb-14 md:pb-28 px-6 md:px-12 lg:px-24 border-t border-neutral-900 selection:bg-white selection:text-black">
  <div className="max-w-6xl mx-auto space-y-8 md:space-y-12">
    
    {/* SYSTEM MONITOR TOP TRIM */}
    <div className="flex flex-col sm:flex-row sm:items-center justify-between font-mono text-[9px] tracking-[0.2em] text-neutral-600 border-b border-neutral-900 pb-3 gap-2">
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-neutral-700 animate-pulse"></span>
        <span>SYS_ROUTING // CRT_WALL_01</span>
      </div>
      <div className="flex gap-4">
        <span>MATRIX: ACTIVE</span>
        <span>LOCATION // STUDIO_P3</span>
      </div>
    </div>

    {/* ULTRA-WIDE BLACKBOX VIEWPORT */}
    <div className="relative w-full aspect-[21/9] bg-black border border-neutral-900 overflow-hidden shadow-[0_0_80px_rgba(0,0,0,1)]">
      {/* Heavy shadow vignette masking to sink the video into the black background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.85)_100%)] pointer-events-none z-10"></div>
      
      <iframe
        className="w-full h-full opacity-90 filter brightness-90 contrast-[1.05] grayscale-[15%]"
        src="https://www.youtube.com/embed/Sgxbx65IDeM?si=SHSHCVGWP7dutQV-&autoplay=1&mute=1&loop=1&playlist=Sgxbx65IDeM&controls=0&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1" 
        title="YouTube video player" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        referrerPolicy="strict-origin-when-cross-origin" 
        allowFullScreen>
      </iframe>
    </div>

    {/* SPLIT DATA FRAME & TELEMETRY TERMINAL */}
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 pt-2 md:pt-4">
      
      {/* Left Data Column */}
      <div className="lg:col-span-8 space-y-5 md:space-y-6">
        <div className="space-y-2">
          <span className="font-mono text-[9px] tracking-[0.4em] text-neutral-500 block">
            [ INITIATING SEQUENTIAL INTERACTION ]
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extralight tracking-tighter text-white uppercase font-sans leading-none">
            READY TO CALIBRATE YOUR SEQUENCES?
          </h2>
        </div>
        
        <p className="text-xs font-mono tracking-wide text-neutral-400 max-w-2xl leading-relaxed">
          Connect your project core parameters with our architectural system pipeline. We accept direct inquiries for corporate assets, fashion campaigns, and feature grading frameworks.
        </p>

        {/* Technical Specification Ribbon */}
        <div className="grid grid-cols-3 gap-2 border-t border-neutral-900 pt-6 font-mono text-[9px] text-neutral-500 tracking-wider">
          <div>
            <span className="text-neutral-700 block text-[8px] mb-1">01 / RESOLUTION</span>
            <span>8K ANAMORPHIC</span>
          </div>
          <div>
            <span className="text-neutral-700 block text-[8px] mb-1">02 / COLOR PROFILE</span>
            <span>ACES MASTERING // LOG-C</span>
          </div>
          <div>
            <span className="text-neutral-700 block text-[8px] mb-1">03 / TIMING</span>
            <span>23.976 FPS // 180°</span>
          </div>
        </div>
      </div>

      {/* Right Action Column */}
      <div className="lg:col-span-4 flex lg:justify-end lg:items-end">
        <a 
          href="mailto:pipeline@seckrick.com" 
          className="w-full lg:w-auto text-center px-12 py-5 bg-white text-black font-mono text-[10px] tracking-[0.3em] uppercase hover:bg-neutral-200 transition-all duration-300 rounded-[1px] hover:shadow-[0_0_50px_rgba(255,255,255,0.1)]">
          ENGAGE PRODUCTION ROUTER
        </a>
      </div>

    </div>

  </div>
</section>
  );
}

/* ==========================================
   MAIN SERVICES PAGE COMPONENT EXPORT
   ========================================== */
export default function Services() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const systemPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (systemPreference.matches) {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      }
    }
  }, []);

  return (
    <div className="bg-black text-white overflow-x-hidden selection:bg-white selection:text-black antialiased">
      <ServicesHero />
      <ServicesMatrixList />
      <TechnicalSpecsTable />
      <ServicesCTA />
    </div>
  );
}

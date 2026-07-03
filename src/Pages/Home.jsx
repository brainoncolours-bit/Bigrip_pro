import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ==========================================
   HIGH-EDITORIAL PRODUCTION DATA STRINGS
   ========================================== */
const ASSETS = {
  heroVideo: "6HBxWrmI8OU",
  bridgeImage: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1600",
  detailImage: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=800",
  lookbookVideos: ["bA7-8tZ_aQ0", "9Wd_A8e8TqM", "6HBxWrmI8OU"],
  products: [
    { img: "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&q=80&w=800", name: "Oversized Field Shell", price: "$459" },
    { img: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=800", name: "Articulated Technical Trouser", price: "$289" },
    { img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800", name: "Modular Storm Hood", price: "$145" }
  ]
};

/* ==========================================
   UNIVERSAL REUSABLE COMPONENT WRAPPERS
   ========================================== */
function StreamVideoEmbed({ videoId, className = "" }) {
  return (
    <div className={`relative w-full h-full overflow-hidden bg-[#f4f4f4] filter grayscale contrast-[1.04] ${className}`}>
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&playsinline=1`}
        title="Editorial Background Loop"
        className="absolute top-1/2 left-1/2 w-[180%] h-[180%] -translate-x-1/2 -translate-y-1/2 object-cover border-0 pointer-events-none select-none"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
      <div className="absolute inset-0 bg-white/5 pointer-events-none mix-blend-overlay" />
    </div>
  );
}

/* ==========================================
   THE EXPERIMENTAL MOTION SECTIONS
   ========================================== */

// 1. Cinematic Scale-Down Intro Hero
function PremiumHeroSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const videoScale = useTransform(scrollYProgress, [0, 1], ["100%", "88%"]);
  const videoRadius = useTransform(scrollYProgress, [0, 1], ["0px", "8px"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);

  return (
    <section ref={containerRef} className="relative w-full h-screen bg-white select-none overflow-hidden">
      <motion.div 
        style={{ width: videoScale, height: videoScale, borderRadius: videoRadius }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden bg-black"
      >
        <StreamVideoEmbed videoId={ASSETS.heroVideo} className="opacity-85 contrast-[1.08]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
      </motion.div>

      <div className="absolute inset-0 z-10 flex flex-col justify-between p-8 md:p-16 pointer-events-none">
        

        <motion.div style={{ y: textY }} className="flex flex-col items-start max-w-5xl text-white mix-blend-difference">
          <h1 className="text-[clamp(3.5rem,10vw,11rem)] font-serif font-extralight tracking-tighter leading-[0.8] uppercase">
            ROCKET JACKET
          </h1>
          <p className="mt-6 font-sans text-xs tracking-[0.5em] font-light uppercase opacity-90 pl-1">
            COLLECTION 01 / ARCHIVE 26
          </p>
        </motion.div>

        <div className="w-full flex justify-between items-end text-white mix-blend-difference font-sans text-[9px] tracking-[0.3em] opacity-70">
          <span>[SCROLL TO UNLOCK SYSTEM]</span>
          <span>INITIATED NO. 01</span>
        </div>
      </div>
    </section>
  );
}

// 2. THE MULTI-SECTION IMAGE BRIDGE (The Split-Reveal Canvas Effect)
function MultiSectionImageBridge() {
  const triggerRef = useRef(null);
  const leftCanvasRef = useRef(null);
  const rightCanvasRef = useRef(null);
  const centralTextRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: "+=180%",
          scrub: 1,
          pin: true,
          anticipatePin: 1
        }
      });

      // Split the single photo into two halves expanding outward smoothly
      tl.to(leftCanvasRef.current, { xPercent: -50, ease: "power2.inOut" }, 0)
        .to(rightCanvasRef.current, { xPercent: 50, ease: "power2.inOut" }, 0)
        .to(centralTextRef.current, { opacity: 1, y: 0, scale: 1, ease: "power2.out" }, 0.3);
    }, triggerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={triggerRef} className="relative w-full h-screen bg-black overflow-hidden select-none">
      
      {/* Central Content Area Revealed On-Scroll */}
      <div ref={centralTextRef} className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6 opacity-0 transform translate-y-10 scale-95 pointer-events-none transition-all duration-300">
        <span className="font-sans text-[10px] tracking-[0.5em] text-white/40 mb-6 uppercase">[THE TRANSITION]</span>
        <h2 className="text-white text-3xl md:text-6xl font-serif font-extralight tracking-tight max-w-3xl leading-tight">
          A single structural profile broken into clean architectural layers.
        </h2>
        <p className="text-white/50 text-xs md:text-sm font-sans tracking-wide max-w-md mt-8 font-light leading-relaxed">
          The outer textile grid reacts to localized climate fluctuations, creating a dynamic barrier that morphs as you transition between raw landscapes.
        </p>
      </div>

      {/* LEFT CANVAS HALF */}
      <div ref={leftCanvasRef} className="absolute top-0 left-0 w-1/2 h-full overflow-hidden z-20 will-change-transform">
        <div className="absolute top-0 left-0 w-[200vw] h-full">
          <img 
            src={ASSETS.bridgeImage} 
            alt="Structural Profile Left" 
            className="w-full h-full object-cover filter grayscale contrast-[1.05]"
          />
        </div>
      </div>

      {/* RIGHT CANVAS HALF */}
      <div ref={rightCanvasRef} className="absolute top-0 right-0 w-1/2 h-full overflow-hidden z-20 will-change-transform">
        <div className="absolute top-0 right-[-100vw] w-[200vw] h-full">
          <img 
            src={ASSETS.bridgeImage} 
            alt="Structural Profile Right" 
            className="w-full h-full object-cover filter grayscale contrast-[1.05]"
          />
        </div>
      </div>
    </div>
  );
}

// 3. Immersive Horizontal Scrub Video Lookbook
function HorizontalScrubLookbook() {
  const scrollSectionRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const scrollWidth = scrollSectionRef.current.offsetWidth - window.innerWidth;
      
      gsap.to(scrollSectionRef.current, {
        x: -scrollWidth,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: () => `+=${scrollWidth}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="bg-white overflow-hidden w-full h-screen relative">
      <div className="absolute top-12 left-8 md:left-16 z-30 font-sans text-[10px] tracking-[0.4em] text-black/40">
        [INDEX 03 // HORIZONTAL SYSTEM INTERFACE]
      </div>
      
      <div ref={scrollSectionRef} className="h-full flex items-center gap-16 px-8 md:px-20 py-20 will-change-transform whitespace-nowrap flex-nowrap">
        <div className="w-[30vw] min-w-[300px] h-[60vh] flex flex-col justify-center shrink-0">
          <h3 className="text-5xl md:text-7xl font-serif font-extralight text-black tracking-tighter leading-none uppercase whitespace-normal">
            KINETIC<br/>ANCHOR<br/>DESIGN
          </h3>
          <p className="text-black/40 text-xs font-sans tracking-widest uppercase mt-6 whitespace-normal">
            Swipe-scrub sequence capturing functional textiles across spatial axes.
          </p>
        </div>

        {ASSETS.lookbookVideos.map((videoId, idx) => (
          <div key={idx} className="w-[70vw] md:w-[45vw] h-[65vh] shrink-0 bg-[#f9f9f9] relative overflow-hidden rounded-[2px]">
            <StreamVideoEmbed videoId={videoId} />
            <div className="absolute bottom-4 left-4 z-10 font-sans text-[9px] tracking-[0.2em] text-white mix-blend-difference font-light">
              PANEL NO. 0{idx + 1} // GRID MOTION LOCK
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 4. Asymmetric Clean Product Grid Catalog
function PremiumProductCatalog() {
  return (
    <section className="w-full bg-white py-36 px-6 md:px-16 border-t border-black/[0.04]">
      <div className="max-w-7xl mx-auto">
        <div className="w-full flex flex-col items-start mb-24">
          <span className="font-sans text-[10px] tracking-[0.4em] text-black/30 uppercase mb-3">SYSTEM DIRECTORY</span>
          <h2 className="text-4xl font-serif font-extralight tracking-tight text-black uppercase">AVAILABLE MATRIX ARTIFACTS</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {ASSETS.products.map((prod, idx) => (
            <div key={idx} className={`group flex flex-col cursor-pointer ${idx === 1 ? 'md:translate-y-12' : ''}`}>
              <div className="w-full h-[60vh] md:h-[75vh] overflow-hidden bg-[#fafafa] mb-6 relative rounded-[1px]">
                <img 
                  src={prod.img} 
                  alt={prod.name} 
                  className="w-full h-full object-cover transform transition-transform duration-[1.6s] cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-[1.04] filter grayscale group-hover:grayscale-0 contrast-[1.02]"
                />
              </div>
              <div className="flex justify-between items-baseline font-sans text-xs px-1">
                <span className="text-black/80 font-light tracking-tight group-hover:text-black transition-colors">{prod.name}</span>
                <span className="text-black/40 font-mono text-[11px] font-light tracking-wider">{prod.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 5. Reactive Typography Parallax Strip
function ParallaxMarqueeSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  const xLeft = useTransform(scrollYProgress, [0, 1], ["5%", "-25%"]);
  const xRight = useTransform(scrollYProgress, [0, 1], ["-25%", "5%"]);

  return (
    <section ref={containerRef} className="w-full py-24 bg-black text-white overflow-hidden flex flex-col gap-6 select-none">
      <motion.div style={{ x: xLeft }} className="whitespace-nowrap will-change-transform">
        <h3 className="text-[7vw] md:text-[5vw] font-serif font-extralight tracking-tight uppercase leading-none opacity-90">
          STRUCTURAL PROTECTION MATRICES FW26 • PROTOTYPE ARCHIVE 01 • 
        </h3>
      </motion.div>
      <motion.div style={{ x: xRight }} className="whitespace-nowrap will-change-transform">
        <h3 className="text-[7vw] md:text-[5vw] font-serif italic font-extralight tracking-tight uppercase leading-none text-transparent unique-text-stroke">
          ENVIRONMENTAL IMMUNIZATION PROTOCOLS // ATOMIC DYNAMICS • 
        </h3>
      </motion.div>
      <style>{`.unique-text-stroke { -webkit-text-stroke: 1px rgba(255,255,255,0.3); }`}</style>
    </section>
  );
}

// 6. Minimal High-End E-Commerce Footer Navigation
function PremiumFooterSection() {
  return (
    <section className="w-full bg-black text-white pt-40 pb-16 px-8 md:px-20 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col justify-between">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-32">
          <div className="lg:col-span-6 flex flex-col items-start">
            <span className="font-sans text-[10px] tracking-[0.4em] text-white/30 mb-6">[DIRECT TERMINAL ACCESS]</span>
            <h2 className="text-3xl md:text-5xl font-serif font-extralight tracking-tight uppercase mb-12 leading-[1.1] max-w-lg">
              EXPERIENCE THE ATOMIC PROTECTION ARCHITECTURE.
            </h2>
            <div className="flex flex-wrap gap-4">
              <a href="#" className="px-12 py-4 bg-white text-black font-sans text-[11px] tracking-[0.3em] uppercase transition-opacity hover:opacity-90 rounded-[1px]">
                ACQUIRE SHELL SYSTEM
              </a>
              <a href="#" className="px-12 py-4 border border-white/10 text-white font-sans text-[11px] tracking-[0.3em] uppercase transition-colors hover:bg-white/5 rounded-[1px]">
                LOCATE RETAIL DISTRIBUTIONS
              </a>
            </div>
          </div>
          <div className="lg:col-span-3 lg:col-start-9 flex flex-col gap-4 font-sans text-[11px] tracking-[0.2em] font-light text-white/50">
            <span className="text-white/20 tracking-[0.3em] mb-2 uppercase font-normal">[DIRECTORY MAP]</span>
            <a href="#" className="hover:text-white transition-colors">01 / BRAND PLATFORM MATRIX</a>
            <a href="#" className="hover:text-white transition-colors">02 / EXPERIMENTAL FIELD LAB</a>
            <a href="#" className="hover:text-white transition-colors">03 / KINETIC SCROLL LOOKBOOK</a>
            <a href="#" className="hover:text-white transition-colors">04 / CURATED CATALOG CORES</a>
          </div>
        </div>

        <div className="w-full pt-12 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 font-sans text-[10px] tracking-[0.2em] text-white/30 font-light">
          <span>© 2026 ROCKET JACKET SYSTEMS INC. DIGITAL COGNIZANCE SECURED.</span>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">INSTAGRAM</a>
            <a href="#" className="hover:text-white transition-colors">X ARCHIVE</a>
            <a href="#" className="hover:text-white transition-colors">DISPATCH LAB</a>
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
    <main className="bg-white text-black overflow-x-hidden selection:bg-black selection:text-white antialiased">
      <PremiumHeroSection />
      <MultiSectionImageBridge />
      <HorizontalScrubLookbook />
      <PremiumProductCatalog />
      <ParallaxMarqueeSection />
      <PremiumFooterSection />
    </main>
  );
}
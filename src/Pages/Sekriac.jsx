import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useVelocity, useSpring } from 'framer-motion';

// --- STAGGERED BOTTOM-TO-TOP MASK REVEAL ---
const ImageClipReveal = ({ src, alt, aspect = "aspect-[3/4]", delay = 0 }) => (
  <div className={`relative overflow-hidden w-full ${aspect} bg-[#F4F4F4]`}>
    <motion.div
      className="w-full h-full origin-bottom"
      initial={{ clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)", scale: 1.05 }}
      whileInView={{ clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)", scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ 
        clipPath: { duration: 1.3, ease: [0.16, 1, 0.3, 1], delay },
        scale: { duration: 1.6, ease: [0.16, 1, 0.3, 1], delay }
      }}
    >
      <img src={src} alt={alt} className="w-full h-full object-cover grayscale contrast-[102%]" />
    </motion.div>
  </div>
);

export default function ZaraImmersiveScale() {
  const { scrollYProgress } = useScroll();
  
  // Kinetic layout offsets for Section 3
  const leftColY = useTransform(scrollYProgress, [0.1, 0.6], ["0px", "-100px"]);
  const rightColY = useTransform(scrollYProgress, [0.1, 0.6], ["0px", "100px"]);

  // --- STRICT SECTIONAL ANCHOR REFS ---
  const interstice1Ref = useRef(null);
  const section2Ref = useRef(null);
  const section3Ref = useRef(null);
  const section4Ref = useRef(null);
  const section5Ref = useRef(null);
  const interstice2Ref = useRef(null);
  const section6Ref = useRef(null);
  const section7Ref = useRef(null);

  // ─── INTERACTIVE HOVER BANNER DATA ───
  const bannerMovies = [
    {
      id: "backrooms",
      title: "Backrooms",
      year: "2026",
      image: "https://www.gstatic.com/webp/gallery/1.jpg"
    },
    {
      id: "death-robin-hood",
      title: "The Death of Robin Hood",
      year: "2026",
      image: "https://www.gstatic.com/webp/gallery/2.jpg"
    },
    {
      id: "the-invite",
      title: "The Invite",
      year: "2026",
      image: "https://www.gstatic.com/webp/gallery/3.jpg"
    },
    {
      id: "tony",
      title: "Tony",
      year: "2026",
      image: "https://www.gstatic.com/webp/gallery/4.jpg"
    },
    {
      id: "onslaught",
      title: "Onslaught",
      year: "2026",
      image: "https://www.gstatic.com/webp/gallery/5.jpg"
    },
    {
      id: "primetime",
      title: "Primetime",
      year: "2026",
      image: "https://www.gstatic.com/webp/gallery/6.jpg"
    }
  ];

  const [activeMovie, setActiveMovie] = useState(bannerMovies[2]); // Defaulting to 'The Invite' context matching the screenshot

  // ─── REVEAL 01 SCROLL LOGIC (First Interstice Frame) ───
  const { scrollYProgress: s1Progress } = useScroll({
    target: interstice1Ref,
    offset: ["start end", "end start"]
  });
  const reveal01Opacity = useTransform(s1Progress, [0, 0.2, 0.6, 0.8], [0, 1, 1, 0]);
  const reveal01Y = useTransform(s1Progress, [0, 0.2, 0.6, 0.8], [40, 0, 0, -40]);
  const reveal01Clip = useTransform(
    s1Progress, 
    [0, 0.25, 0.55, 0.8], 
    [
      "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)", 
      "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)", 
      "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)", 
      "polygon(0 0%, 100% 0%, 100% 0%, 0 0%)"
    ]
  );

  // ─── REVEAL 02 SCROLL LOGIC (Section 3 Kinetic Sidebar) ───
  const { scrollYProgress: s3Progress } = useScroll({
    target: section3Ref,
    offset: ["start end", "end start"]
  });
  const reveal02Y = useTransform(s3Progress, [0, 0.25, 0.75, 1], [100, 0, 0, -100]);
  const reveal02Opacity = useTransform(s3Progress, [0, 0.2, 0.8, 1], [0, 0.15, 0.15, 0]);

  // ─── REVEAL 03 MARQUEE RUNWAY LOGIC (Section 4 Runway Matrix) ───
  const { scrollYProgress: s4Progress } = useScroll({
    target: section4Ref,
    offset: ["start end", "end start"]
  });
  const textXMarquee = useTransform(s4Progress, [0, 1], ["5%", "-35%"]);
  const reveal03Opacity = useTransform(s4Progress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);
  
  // Velocity-based structural skew
  const scrollVelocity = useVelocity(scrollYProgress);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 300 });
  const textSkew = useTransform(smoothVelocity, [-3, 3], [-8, 8]);

  // Section 05 Image & Structural Parallax Defaults
  const { scrollYProgress: s5Progress } = useScroll({
    target: section5Ref,
    offset: ["start end", "end start"]
  });
  const imageScaleDown = useTransform(s5Progress, [0, 0.5], [1.25, 1]);
  const textFadeUp = useTransform(s5Progress, [0, 0.4], [80, 0]);
  const textOpacity = useTransform(s5Progress, [0, 0.35], [0, 1]);

  // ─── REVEAL 04 SCROLL LOGIC (Second Interstice Frame) ───
  const { scrollYProgress: sInterstice2 } = useScroll({
    target: interstice2Ref,
    offset: ["start end", "end start"]
  });
  const reveal04Opacity = useTransform(sInterstice2, [0, 0.2, 0.7, 0.9], [0, 1, 1, 0]);
  const reveal04Tracking = useTransform(sInterstice2, [0, 0.4, 0.7], ["0.1em", "0.5em", "0.7em"]);
  const reveal04Scale = useTransform(sInterstice2, [0, 0.3, 0.7, 0.9], [0.95, 1, 1, 1.05]);

  // ─── REVEAL 05 SCROLL LOGIC (Section 7 Monumental Watermark) ───
  const { scrollYProgress: s7Progress } = useScroll({
    target: section7Ref,
    offset: ["start end", "end start"]
  });
  const bgWatermarkScale = useTransform(s7Progress, [0, 1], [0.85, 1.15]);
  const bgWatermarkOpacity = useTransform(s7Progress, [0, 0.25, 0.75, 1], [0, 0.03, 0.03, 0]);

  return (
    <div className="overflow-x-hidden bg-white text-black font-sans antialiased selection:bg-black selection:text-white min-h-screen relative tracking-normal font-normal">
      
      {/* ==================== STRUCTURAL ZARA / A24 HUD ==================== */}
      <header className="fixed top-0 left-0 w-full h-16 sm:h-20 md:h-24 grid grid-cols-12 px-4 sm:px-6 md:px-10 items-center z-50 pointer-events-none mix-blend-difference text-white">
        <div className="col-span-2 md:col-span-1 pointer-events-auto">
          <button className="relative w-6 h-6 flex flex-col justify-center space-y-[6px] group">
            <span className="w-6 h-[1px] bg-white transition-transform group-hover:rotate-45 group-hover:translate-y-[3.5px]" />
            <span className="w-6 h-[1px] bg-white transition-transform group-hover:-rotate-45 group-hover:-translate-y-[3.5px]" />
          </button>
        </div>

        <div className="col-span-8 md:col-span-10 text-center pointer-events-auto">
          <a href="#" className="select-none inline-block">
            <h1 className="text-[22px] sm:text-[28px] md:text-[36px] font-serif font-black tracking-[0.1em] uppercase leading-none scale-y-[1.02]">
              A24
            </h1>
          </a>
        </div>

        <div className="col-span-2 md:col-span-1 text-right flex justify-end items-center pointer-events-auto">
          <button className="text-white hover:opacity-70 transition-opacity">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </header>

      {/* ==================== NEW SECTION 01: IMMERSIVE HOVER INTERACTIVE BANNER ==================== */}
      <section className="relative w-full min-h-screen bg-neutral-900 overflow-hidden select-none">
        
        {/* Dynamic Multi-layered Background Canvas */}
        {bannerMovies.map((movie) => (
          <motion.div
            key={movie.id}
            className="absolute inset-0 w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: activeMovie.id === movie.id ? 1 : 0 }}
            transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
          >
            <img 
              src={movie.image} 
              alt={movie.title} 
              className="w-full h-full object-cover brightness-[0.65] contrast-[105%]"
            />
          </motion.div>
        ))}

        {/* Foreground Content Interface Overlay */}
        <div className="absolute inset-0 z-20 w-full h-full flex flex-col justify-end p-4 sm:p-6 md:p-12 pb-16 md:pb-20">
          <div className="max-w-4xl tracking-tight">
            {bannerMovies.map((movie) => {
              const isActive = activeMovie.id === movie.id;
              return (
                <div 
                  key={movie.id}
                  className="relative group py-1 cursor-pointer w-fit"
                  onMouseEnter={() => setActiveMovie(movie)}
                >
                  <div className="flex items-start flex-wrap gap-2">
                    <h2 className={`text-3xl sm:text-4xl md:text-[74px] font-sans font-bold tracking-tight leading-[1.05] transition-all duration-300 ${
                      isActive ? 'text-white font-medium' : 'text-neutral-400/60 hover:text-neutral-200'
                    }`}>
                      {movie.title}
                    </h2>
                    <span className={`text-[9px] font-mono ml-2 mt-2 font-normal ${
                      isActive ? 'text-white' : 'text-neutral-500'
                    }`}>
                      {movie.year}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Floating Downward Navigation Signifier */}
        <div className="absolute bottom-6 right-8 z-30 pointer-events-none opacity-80 mix-blend-difference text-white">
          <span className="text-xl font-light">↓</span>
        </div>
      </section>

      {/* ─── BRAND REVEAL 01: SEAMLESS BOUNDED CLIP-MASK RUNWAY ─── */}
      <div ref={interstice1Ref} className="w-full bg-white px-4 sm:px-6 md:px-10 overflow-hidden py-16 sm:py-20 md:py-24 border-t border-neutral-100 mix-blend-difference">
        <motion.div 
          style={{ opacity: reveal01Opacity, y: reveal01Y, clipPath: reveal01Clip }}
          className="text-[11px] font-mono tracking-[1.8em] text-black uppercase text-center will-change-transform font-bold pl-[1.8em]"
        >
          SIKRICK STUDIO DESIGN SYSTEM V.4
        </motion.div>
      </div>

      {/* ==================== SECTION 02: STRUCTURAL DROPDOWN NAV MATRIX ==================== */}
      <section ref={section2Ref} className="w-full bg-white px-4 sm:px-6 md:px-10 py-20 sm:py-24 md:py-32 border-t border-neutral-100 grid grid-cols-1 gap-8 md:grid-cols-12 items-start">
        <div className="md:col-span-2">
          <span className="text-[10px] font-medium tracking-wider uppercase block text-black">NEW COLLECTION</span>
          <span className="text-[8px] font-mono text-neutral-400 block mt-1">SYSTEM_EDITION_V4</span>
        </div>

        <div className="md:col-span-3 space-y-6">
          <div>
            <span className="text-neutral-400 block mb-2 font-mono text-[9px]">|01 // ACTUALIZACIÓN</span>
            <div className="space-y-1 uppercase font-semibold text-xs tracking-wide">
              <a href="#" className="block text-black hover:opacity-60">THE NEW COAT</a>
              <a href="#" className="block text-neutral-400 hover:text-black">THE SUMMER CAPSULE</a>
              <a href="#" className="block text-neutral-400 hover:text-black">BENITO ANTONIO</a>
            </div>
          </div>
        </div>

        <div className="md:col-span-4 space-y-1 uppercase text-[11px] font-normal tracking-wide text-neutral-400">
          <span className="text-neutral-400 block mb-3 font-mono text-[9px]">|02 // CATEGORÍAS</span>
          <a href="#" className="block text-black">LINO</a>
          <a href="#" className="block hover:text-black transition-colors">VESTIDOS</a>
          <a href="#" className="block hover:text-black transition-colors">TOPS | BODIES</a>
          <a href="#" className="block hover:text-black transition-colors">CAMISETAS</a>
          <a href="#" className="block hover:text-black transition-colors">CAMISAS</a>
          <a href="#" className="block hover:text-black transition-colors">PUNTO</a>
          <a href="#" className="block hover:text-black transition-colors">SHORTS | BERMUDAS</a>
          <a href="#" className="block hover:text-black transition-colors">PANTALONES</a>
          <a href="#" className="block hover:text-black transition-colors">JEANS</a>
          <a href="#" className="block hover:text-black transition-colors">FALDAS</a>
          <a href="#" className="block hover:text-black transition-colors">BLAZERS</a>
          <a href="#" className="block hover:text-black transition-colors">LENCERÍA</a>
        </div>
      </section>

      {/* ==================== SECTION 03: INTERLOCKING PARALLAX MATRIX ==================== */}
      <section ref={section3Ref} className="w-full bg-[#FAF9F5] py-24 sm:py-28 md:py-40 px-4 sm:px-6 md:px-10 relative overflow-hidden">
        
        {/* ─── BRAND REVEAL 02: ISOLATED ZONE BOUNDED SIDEBAR ─── */}
        <motion.div 
          style={{ y: reveal02Y, opacity: reveal02Opacity }}
          className="absolute right-12 top-1/4 hidden md:block select-none z-0 pointer-events-none will-change-transform"
        >
          <span className="font-serif font-black tracking-tighter text-[8vw] leading-none block uppercase text-black rotate-90 origin-center select-none">
            Sikrick
          </span>
        </motion.div>

        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-12 items-center relative z-10">
          <motion.div style={{ y: leftColY }} className="md:col-span-4 md:col-start-2 space-y-4">
            <ImageClipReveal 
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80" 
              alt="Editorial Dynamic Landscape"
              aspect="aspect-[3/4]"
              delay={0.1}
            />
            <div className="text-[9px] uppercase tracking-normal text-black font-medium">
              [FRAME_04 / MONOLITHIC]
            </div>
          </motion.div>

          <motion.div style={{ y: rightColY }} className="md:col-span-4 md:col-start-8 space-y-4 pt-0 md:pt-16">
            <ImageClipReveal 
              src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=80" 
              alt="Editorial High Saturation Frame"
              aspect="aspect-[2/3]"
              delay={0.25}
            />
            <div className="text-[9px] uppercase tracking-normal text-neutral-400 text-right">
              [FRAME_05 / EXT_CONCRETE]
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================== SECTION 04: KINETIC VELOCITY MARQUEE ==================== */}
      <section ref={section4Ref} className="w-full bg-white py-20 sm:py-24 md:py-32 overflow-hidden border-b border-neutral-100 whitespace-nowrap">
        <motion.div 
          style={{ x: textXMarquee, skewX: textSkew, opacity: reveal03Opacity }} 
          className="inline-block text-[11vw] sm:text-[9vw] font-serif font-black uppercase tracking-[-0.06em] leading-none text-black select-none will-change-transform"
        >
          SIKRICK • COLLECCIÓN DE CONTRALUZ • CRUDE STUDIO ARCHIVE REMIX • SIKRICK • COLLECCIÓN DE CONTRALUZ • CRUDE STUDIO ARCHIVE REMIX •
        </motion.div>
        <div className="px-4 sm:px-6 md:px-10 grid grid-cols-1 md:grid-cols-12 gap-4 mt-6">
          <div className="md:col-span-3 md:col-start-9 text-[9px] font-mono tracking-tighter text-neutral-400 uppercase">
            <span>// ADAPTIVE BEHAVIOR REGISTERED UNDER VELOCITY MATRIX</span>
          </div>
        </div>
      </section>

      {/* ==================== SECTION 05: ASYMMETRIC MONO REVEAL & INVERSE PIN ==================== */}
      <section ref={section5Ref} className="w-full bg-white py-20 sm:py-24 md:py-32 px-4 sm:px-6 md:px-10 grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-12 items-start relative">
        <div className="md:col-span-4 md:sticky md:top-24 space-y-8 z-10">
          <div>
            <span className="text-[10px] font-mono text-black block mb-4">03 / MANIFESTO ELEVACIÓN</span>
            <motion.h3 
              style={{ y: textFadeUp, opacity: textOpacity }}
              className="text-4xl md:text-5xl font-serif tracking-tight leading-[1.05]"
            >
              The structural weights are completely omitted, allowing raw fabric edges to interact with spatial air current.
            </motion.h3>
          </div>
          <div className="text-[11px] text-neutral-500 max-w-xs leading-relaxed font-light">
            Each iteration acts as an isolated monolithic volume. Subversive proportions meet delicate, deliberate linear stitch lines.
          </div>
        </div>

        <div className="md:col-span-7 md:col-start-6 overflow-hidden relative">
          <motion.div style={{ scale: imageScaleDown }} className="w-full h-full origin-center">
            <ImageClipReveal 
              src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1600&q=90" 
              alt="Tailored Minimal Canvas Monolith"
              aspect="aspect-[4/5]"
            />
          </motion.div>
          <div className="mt-4 flex justify-between font-mono text-[9px] text-neutral-400">
            <span>[PIECE // 9283-A]</span>
            <span>MODEL COMPOSITION OUTSIDE RAW MATRIX</span>
          </div>
        </div>
      </section>

      {/* ─── BRAND REVEAL 04: STRUCTURAL BOUNDED KERN EXPANSION INTERSTICE ─── */}
      <div ref={interstice2Ref} className="w-full bg-white py-20 sm:py-24 md:py-32 overflow-hidden border-t border-neutral-100 flex justify-center items-center">
        <motion.span 
          style={{ opacity: reveal04Opacity, letterSpacing: reveal04Tracking, scale: reveal04Scale }}
          className="text-3xl md:text-5xl font-serif uppercase font-light text-black origin-center will-change-transform"
        >
          SIKRICK
        </motion.span>
      </div>

      {/* ==================== SECTION 06: MULTI-COLUMN TRIPLE STAGGER INDEX ==================== */}
      <section ref={section6Ref} className="w-full bg-[#FAF9F5] py-20 sm:py-24 md:py-32 px-4 sm:px-6 md:px-10 border-t border-b border-neutral-200/60">
        <div className="mb-16">
          <span className="text-[9px] font-mono text-neutral-400 uppercase block">SYSTEMATIC GRID SEQUENCE // EDITIONS</span>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12">
          
          <div className="space-y-6">
            <ImageClipReveal 
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80" 
              alt="Sequence Plate 01" 
              aspect="aspect-[3/4]"
              delay={0.0}
            />
            <div className="flex justify-between items-start">
              <span className="text-xs uppercase font-bold tracking-wide">01 / ESTRUCTURA DE LINO</span>
              <span className="text-[9px] font-mono text-neutral-400 mt-0.5">EDIT.01</span>
            </div>
          </div>

          <div className="space-y-6 md:translate-y-12">
            <ImageClipReveal 
              src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80" 
              alt="Sequence Plate 02" 
              aspect="aspect-[3/4]"
              delay={0.15}
            />
            <div className="flex justify-between items-start">
              <span className="text-xs uppercase font-bold tracking-wide">02 / SILUETA FLUIDA</span>
              <span className="text-[9px] font-mono text-neutral-400 mt-0.5">EDIT.02</span>
            </div>
          </div>

          <div className="space-y-6 md:translate-y-24">
            <ImageClipReveal 
              src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=80" 
              alt="Sequence Plate 03" 
              aspect="aspect-[3/4]"
              delay={0.3}
            />
            <div className="flex justify-between items-start">
              <span className="text-xs uppercase font-bold tracking-wide">03 / SASTRERÍA ASIMÉTRICA</span>
              <span className="text-[9px] font-mono text-neutral-400 mt-0.5">EDIT.03</span>
            </div>
          </div>

        </div>
        <div className="h-24 hidden md:block" />
      </section>

      {/* ==================== SECTION 07: OPAQUE RADIAL TYPOGRAPHIC OVERLAY ==================== */}
      <section ref={section7Ref} className="w-full bg-white py-24 sm:py-32 md:py-40 px-4 sm:px-6 md:px-10 flex flex-col justify-center items-center text-center relative overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl space-y-8 z-10"
        >
          <span className="text-[9px] font-mono tracking-widest text-neutral-400 uppercase block">// EPÍLOGO DE MARCA</span>
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-serif tracking-tighter leading-none text-black font-black">
            AUTONOMOUS <br />
            <span className="italic font-normal font-serif text-neutral-400">DESIGN SYMMETRY</span>
          </h2>
          <div className="w-16 h-[1px] bg-black mx-auto my-6" />
          <p className="text-xs md:text-sm text-neutral-500 font-light max-w-md mx-auto leading-relaxed normal-case">
            An exploration of spatial balance and absolute material honesty. Built explicitly for the uncompromised modern landscape.
          </p>
        </motion.div>
        
        <motion.div 
          style={{ scale: bgWatermarkScale, opacity: bgWatermarkOpacity }}
          className="absolute inset-0 flex justify-center items-center pointer-events-none select-none will-change-transform z-0"
        >
          <div className="text-[38vw] font-serif font-bold text-black tracking-tighter uppercase">Sikrick</div>
        </motion.div>
      </section>

      {/* ==================== STRUCTURAL EDITORIAL FOOTER ==================== */}
      <footer className="bg-white border-t border-black/10 pt-16 sm:pt-20 md:pt-24 pb-12 px-4 sm:px-6 md:px-10 text-[11px] font-normal text-neutral-500">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end pb-16">
          <div className="md:col-span-9">
            <h2 className="text-[14vw] font-serif font-black text-black tracking-[-0.12em] leading-[0.75] uppercase select-none scale-y-[1.05] origin-bottom">
              Sikrick
            </h2>
          </div>
          <div className="md:col-span-3 md:text-right font-mono text-[9px] text-neutral-400 uppercase tracking-widest">
            OPERATIONAL_NODE // 2026
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-12 border-t border-neutral-100">
          <div className="space-y-3">
            <span className="text-black font-semibold text-[10px] tracking-wider uppercase block">NEWSLETTER DE SUBSCRIPCIÓN</span>
            <div className="relative w-full max-w-xs border-b border-black pb-1">
              <input 
                type="text" 
                placeholder="EMAIL ADDRESS" 
                className="w-full bg-transparent focus:outline-none text-[10px] uppercase text-black placeholder-neutral-300 tracking-widest"
              />
            </div>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-black font-semibold text-[10px] tracking-wider uppercase block mb-1">AYUDA</span>
            <a href="#" className="hover:text-black transition-colors">PRODUCTOS Y TALLAS</a>
            <a href="#" className="hover:text-black transition-colors">ENVÍOS Y ENTREGAS</a>
            <a href="#" className="hover:text-black transition-colors">CAMBIOS Y DEVOLUCIONES</a>
          </div>
          <div className="flex flex-col space-y-1 md:items-end">
            <span className="text-black font-semibold text-[10px] tracking-wider uppercase block mb-1">POLÍTICAS</span>
            <a href="#" className="hover:text-black transition-colors">COOKIES CONFIGURATION</a>
            <a href="#" className="hover:text-black transition-colors">TERMS OF SALE</a>
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-neutral-100 flex flex-col md:flex-row justify-between text-[9px] text-neutral-400 font-mono tracking-normal uppercase gap-4">
          <span>© 2026 Sikrick NETWORK ACTIONS. ALL SYSTEMS STABLE.</span>
          <span>[INDEX_V.4.26_COMPLIANT]</span>
        </div>
      </footer>

    </div>
  );
}
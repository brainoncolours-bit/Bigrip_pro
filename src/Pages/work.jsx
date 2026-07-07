import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabaseClient";

/* ============================================================
   DESIGN TOKENS & SYSTEM DATA CONFIGURATIONS
   ============================================================ */
const FALLBACK_ASSETS = [
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=80"
];

function mapWorkRow(row, index) {
  return {
    id: row.display_id || String(index + 1).padStart(2, "0"),
    title: row.title || (index === 0 ? "PHOTOGRAPHERS" : index === 1 ? "STYLISTS" : index === 2 ? "DIRECTORS" : "GUEST DIRECTORS"),
    category: row.category || "Creative Direction",
    year: row.year || "2026",
    tag: row.tag || "Campaign Asset",
    mediaType: row.media_type || "image",
    mediaUrl: row.media_url || FALLBACK_ASSETS[index % FALLBACK_ASSETS.length],
    desc: row.desc || "Commercial production overview and spatial execution details aligned with high-fashion client rosters.",
  };
}

/* ============================================================
   INTERFACE SECTIONS
   ============================================================ */

// UNCHANGED: CINEMATIC FULLSCREEN VIDEO HERO
function MassiveHeroSection() {
  return (
    <section className="relative w-full h-screen flex flex-col items-center justify-center border-b border-neutral-900 bg-black overflow-hidden">
      {/* Background Video Wrapper */}
      <div className="absolute inset-0 z-0 pointer-events-none w-full h-full">
        <iframe 
          className="w-full h-full scale-[1.35] object-cover" 
          src="https://www.youtube.com/embed/FWIJr42Ezfw?si=Ij-D2UqTmXMLU02s&autoplay=1&mute=1&loop=1&playlist=FWIJr42Ezfw&controls=0&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1" 
          title="YouTube video player" 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          referrerPolicy="strict-origin-when-cross-origin" 
          allowFullScreen
        />
        {/* Subtle dark overlay to preserve high-contrast UI scannability */}
        <div className="absolute inset-0 bg-black/30 mix-blend-multiply" />
      </div>

      <div className="absolute top-24 left-6 md:left-12 z-10 font-mono text-[9px] tracking-[0.4em] text-neutral-300 uppercase drop-shadow">
        [ SYSTEM ARCHIVE COLLECTION ]
      </div>
      
      <h1 className="text-[clamp(3rem,12vw,13rem)] font-sans font-thin uppercase tracking-tighter text-white z-10 select-none text-center leading-none drop-shadow-2xl px-4 break-words w-full">
        Done deals.
      </h1>

      <div className="absolute bottom-10 left-6 md:left-12 right-6 md:right-12 z-10 flex justify-between font-mono text-[9px] tracking-widest text-neutral-300 drop-shadow">
        <span className="animate-pulse">[ DISPATCH RUNNING ]</span>
        <span>SCROLL FOR REELS</span>
      </div>
    </section>
  );
}

// REDESIGNED: ASYMMETRIC LARGE TEXT INTRO SECTION WITH A BIG STATEMENT ASSET
function EditorialIntroSection() {
  return (
    <section className="w-full bg-black text-white pt-16 md:pt-32 pb-12 md:pb-20 px-6 md:px-12 border-b border-neutral-900">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-8 items-start mb-10 md:mb-24">
        <div className="lg:col-span-4 font-mono text-[9px] tracking-[0.3em] text-neutral-500 uppercase">
          // INTRODUCTORY STATEMENT_
        </div>
        <div className="lg:col-span-8">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-sans font-extralight tracking-tight uppercase leading-[1.1] mb-0 md:mb-8">
            We operate at the volatile intersection of high-end commercial viability and uncompromising conceptual art direction.
          </h2>
        </div>
      </div>

      {/* NEW: MASSIVE FULL-BLEED MID-SECTION IMAGE */}
      <div className="w-full h-[42vh] md:h-[80vh] bg-neutral-950 overflow-hidden relative border border-neutral-900">
        <img 
          src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=2000&q=90" 
          alt="High fashion editorial setup" 
          className="w-full h-full object-cover filter grayscale contrast-125 hover:scale-[1.01] transition-transform duration-1000 ease-out"
        />
        <div className="absolute bottom-6 left-6 font-mono text-[9px] tracking-widest text-white/50 bg-black/60 backdrop-blur-md px-3 py-1.5 uppercase">
          FRAME_01 // SCENIC SYSTEM SPATIAL OVERVIEW
        </div>
      </div>
    </section>
  );
}

// REDESIGNED: WORKS GRID (NOW FEATURING A HIGH-IMPACT STAGGERED COLUMN LAYOUT)
function WorkCard({ work, onOpen }) {
  return (
    <div className="group w-full mb-10 md:mb-32 flex flex-col">
      <button
        type="button"
        onClick={() => work.mediaUrl && onOpen(work)}
        className={`relative w-full aspect-[4/5] overflow-hidden bg-neutral-950 transition-all border border-neutral-900/60 ${
          work.mediaUrl ? "cursor-pointer" : "cursor-default"
        }`}
      >
        {work.mediaUrl && (
          work.mediaType === "video" ? (
            <video className="absolute inset-0 h-full w-full object-cover opacity-100 md:grayscale md:opacity-60 md:group-hover:scale-105 md:group-hover:opacity-100 md:group-hover:grayscale-0 transition-all duration-1000 ease-out" src={work.mediaUrl} autoPlay muted loop playsInline />
          ) : (
            <img className="absolute inset-0 h-full w-full object-cover opacity-100 md:grayscale md:opacity-60 md:group-hover:scale-105 md:group-hover:opacity-100 md:group-hover:grayscale-0 transition-all duration-1000 ease-out" src={work.mediaUrl} alt={work.title} loading="lazy" />
          )
        )}
        <div className="absolute top-4 left-4 font-mono text-[10px] bg-black/80 text-neutral-400 px-2 py-1 border border-neutral-800">
          INDEX_{work.id}
        </div>
      </button>

      <div className="mt-4 md:mt-6 flex flex-col md:flex-row md:justify-between md:items-baseline font-sans border-b border-neutral-900 pb-4">
        <div>
          <h3 className="text-2xl font-light tracking-tight text-white uppercase group-hover:text-neutral-300 transition-colors">
            {work.title}
          </h3>
          <p className="text-neutral-500 text-[11px] font-mono tracking-widest uppercase mt-1">
            {work.category} // {work.year}
          </p>
        </div>
        <button 
          onClick={() => work.mediaUrl && onOpen(work)}
          className="mt-4 md:mt-0 font-mono text-[9px] tracking-widest uppercase border border-neutral-800 hover:border-white px-4 py-2 text-neutral-400 hover:text-white transition-all self-start md:self-auto"
        >
          VIEW_REEL_DATA &rarr;
        </button>
      </div>
    </div>
  );
}

function WorksGridSection({ works, loading, error }) {
  const [activeWork, setActiveWork] = useState(null);

  return (
    <section id="production-catalogue" className="relative w-full bg-black py-8 md:py-12 px-6 md:px-12">
      <div className="w-full flex justify-between items-end border-b border-neutral-900 pb-4 mb-8 md:mb-24 text-[9px] tracking-[0.3em] text-neutral-500 uppercase font-mono">
        <div>[ CORE CATALOGUE ROSTER ]</div>
        <div>TOTAL_UNITS // {works.length || "04"}</div>
      </div>

      {loading && (
        <div className="text-[10px] tracking-[0.4em] text-neutral-500 text-center py-48 font-mono uppercase animate-pulse">
          SYNCHRONIZING ROSTER ARCHIVES FROM SECURE DISPATCH...
        </div>
      )}

      {!loading && !error && works.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-24 items-start">
          {/* Left Column Staggered */}
          <div className="flex flex-col md:pt-0">
            {works.filter((_, i) => i % 2 === 0).map((work, i) => (
              <WorkCard key={`left-${work.id}-${i}`} work={work} onOpen={setActiveWork} />
            ))}
          </div>
          {/* Right Column Staggered (Shifted down slightly on desktop for premium pacing) */}
          <div className="flex flex-col md:pt-32">
            {works.filter((_, i) => i % 2 !== 0).map((work, i) => (
              <WorkCard key={`right-${work.id}-${i}`} work={work} onOpen={setActiveWork} />
            ))}
          </div>
        </div>
      )}

      <MediaViewer work={activeWork} onClose={() => setActiveWork(null)} />
    </section>
  );
}

// NEW INTERMEDIARY SECTION: MASSIVE INTERSTITIAL FULL SCREEN EXPERIENTIAL GRAPHIC
function InterstitialImageSection() {
  return (
    <section className="w-full h-[46vh] md:h-screen bg-black relative overflow-hidden border-t border-b border-neutral-900">
      <img 
        src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=2000&q=90" 
        alt="Raw runway layout asset" 
        className="w-full h-full object-cover grayscale contrast-150 brightness-75 scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
      <div className="absolute bottom-12 right-6 md:right-12 text-right max-w-md mix-blend-difference">
        <span className="font-mono text-[9px] tracking-[0.4em] text-neutral-400 block mb-2">[ ARCHIVAL PROOF_04 ]</span>
        <h4 className="text-xl md:text-2xl font-sans font-thin tracking-widest text-white uppercase leading-tight">
          CHRONICLING TRANSIENT STRATEGIES ACROSS HIGH-DENSITY POPULATION METRIC HUBS.
        </h4>
      </div>
    </section>
  );
}

// REDESIGNED: STUDIO MANIFESTO & SYSTEM METRICS LAYOUT
function StudioManifesto() {
  return (
    <section id="manifesto" className="w-full bg-black py-14 md:py-32 px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
      <div className="lg:col-span-5 flex flex-col justify-center">
        <span className="text-[9px] tracking-[0.4em] uppercase text-neutral-500 mb-4 md:mb-6 block font-mono">
          [ PIPELINE VISUAL ETHOS // SPEC_08 ]
        </span>
        <h2 className="font-sans font-thin text-4xl md:text-6xl tracking-tight leading-none mb-5 md:mb-8 text-white uppercase">
          DEFINITIVE OPTICAL MANAGEMENT.
        </h2>
        <p className="text-[13px] text-neutral-400 font-sans font-light leading-relaxed mb-5 md:mb-8 max-w-md">
          Operating dynamic architectural layouts in critical cultural centers, we coordinate cross-platform digital and moving media formats with creator portfolios who prioritize high-contrast depth configurations and uncompromising alignment logic.
        </p>
        <div>
          <a href="#" className="inline-block font-mono text-[10px] tracking-[0.3em] text-white uppercase border border-neutral-800 hover:border-white px-6 py-4 bg-neutral-950/40 transition-all">
            READ CONFIGURATION STATEMENTS &rarr;
          </a>
        </div>
      </div>

      <div className="lg:col-span-7 w-full flex flex-col gap-4">
        {/* HUGE RIGHT-ALIGNED EDITORIAL PHOTO */}
        <div className="w-full aspect-[16/10] bg-neutral-950 border border-neutral-900 overflow-hidden relative">
          <img 
            src="https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=1500&q=80" 
            alt="Studio Atelier Production Floor" 
            className="w-full h-full object-cover grayscale contrast-115 opacity-70 hover:opacity-90 transition-opacity duration-700"
          />
        </div>
        {/* DYNAMIC SYSTEM METRIC READOUT */}
        <div className="grid grid-cols-3 gap-4 pt-4 font-mono text-left border-t border-neutral-900">
          <div>
            <div className="text-xl md:text-2xl font-light text-white">48.9K</div>
            <div className="text-[8px] tracking-widest text-neutral-600 uppercase mt-1">FRAME EXCHANGES</div>
          </div>
          <div>
            <div className="text-xl md:text-2xl font-light text-white">02//A</div>
            <div className="text-[8px] tracking-widest text-neutral-600 uppercase mt-1">REEL RATIO</div>
          </div>
          <div>
            <div className="text-xl md:text-2xl font-light text-white">UTC+1</div>
            <div className="text-[8px] tracking-widest text-neutral-600 uppercase mt-1">CORE DISPATCH</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// OVERLAY VIEWER SYSTEM (KEEPING LOGIC & CLEANING TRANSITION)
function MediaViewer({ work, onClose }) {
  useEffect(() => {
    if (!work) return;
    const handleKeyDown = (e) => e.key === "Escape" && onClose();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [work, onClose]);

  return (
    <AnimatePresence>
      {work && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black p-6 md:p-12 overflow-y-auto"
        >
          <button type="button" className="absolute inset-0 cursor-zoom-out bg-black/80 backdrop-blur-md" onClick={onClose} aria-label="Close" />
          
          <div className="relative z-10 w-full max-w-7xl h-full flex flex-col lg:grid lg:grid-cols-12 justify-between gap-8 pointer-events-none pt-12 md:pt-0">
            <div className="lg:col-span-8 h-full flex items-center justify-center pointer-events-auto">
              <div className="w-full max-h-[80vh] flex items-center justify-center border border-neutral-900 bg-neutral-950">
                {work.mediaType === "video" ? (
                  <video className="max-h-[80vh] w-full object-contain" src={work.mediaUrl} controls autoPlay playsInline />
                ) : (
                  <img className="max-h-[80vh] w-full object-contain" src={work.mediaUrl} alt={work.title} />
                )}
              </div>
            </div>

            <div className="lg:col-span-4 h-full flex flex-col justify-between pointer-events-auto border-t lg:border-t-0 lg:border-l border-neutral-900 pt-6 lg:pt-0 lg:pl-10 text-white">
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[9px] tracking-[0.3em] text-neutral-500 font-mono">[ ROSTER MATRIX {work.id} ]</span>
                  <button type="button" className="text-[9px] tracking-[0.2em] font-mono text-neutral-400 hover:text-white border-b border-neutral-800 pb-0.5" onClick={onClose}>
                    TERMINATE_OVERLAY
                  </button>
                </div>

                <h3 className="text-2xl md:text-3xl font-sans font-extralight tracking-tight text-white uppercase mb-2">{work.title}</h3>
                <span className="text-[10px] tracking-[0.3em] text-neutral-400 uppercase font-mono">{work.category}</span>
                <div className="border-b border-neutral-900 my-6" />
                <p className="text-[12px] leading-relaxed text-neutral-400 font-sans font-light">{work.desc}</p>
              </div>

              <div className="pt-8 lg:pt-0">
                <button onClick={onClose} className="w-full bg-white text-black font-mono text-[10px] font-bold tracking-[0.3em] py-4 uppercase transition-colors hover:bg-neutral-200 rounded-[1px]">
                  RETURN TO INDEX
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ============================================================
   PAGE ROOT EXPORT (COMPLETELY PRESERVED CONTROLLER LOGIC)
   ============================================================ */
export default function Work() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadWorks() {
      const { data, fetchError } = await supabase
        .from("works")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true });

      if (!mounted) return;

      if (fetchError || !data || data.length === 0) {
        const syntheticData = Array.from({ length: 4 }).map((_, idx) => mapWorkRow({}, idx));
        setWorks(syntheticData);
        setError(null);
      } else {
        setError(null);
        setWorks(data.map(mapWorkRow));
      }
      setLoading(false);
    }

    loadWorks();
    return () => { mounted = false; };
  }, []);

  return (
    <main className="bg-black min-h-screen text-white antialiased selection:bg-white selection:text-black overflow-x-hidden">
      <MassiveHeroSection />
      <EditorialIntroSection />
      <WorksGridSection works={works} loading={loading} error={error} />
      <InterstitialImageSection />
      <StudioManifesto />
    </main>
  );
}

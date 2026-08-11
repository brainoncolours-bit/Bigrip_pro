import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { supabase } from "../lib/supabaseClient";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const ASSETS = {
  heroVideo: "6HBxWrmI8OU",
  cinematicClip2: "9Wd_A8e8TqM",
  cinematicClip3: "s1x4u5QBbXM",
};

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

function SaturatedVideo({ mediaUrl, fallbackVideoId, opacity = "opacity-100" }) {
  const [videoError, setVideoError] = useState(false);
  const videoId = mediaUrl && !videoError ? null : fallbackVideoId;
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-black pointer-events-none">
      {mediaUrl && !videoError ? (
        <video
          src={mediaUrl}
          autoPlay
          muted
          loop
          playsInline
          onError={() => setVideoError(true)}
          className={`absolute top-1/2 left-1/2 w-[140%] h-[140%] sm:w-[120%] sm:h-[120%] -translate-x-1/2 -translate-y-1/2 object-cover select-none transition-opacity duration-1000 ${opacity}`}
        />
      ) : videoId ? (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&playsinline=1`}
          title="Vivid Continuum Loop"
          className={`absolute top-1/2 left-1/2 w-[140%] h-[140%] sm:w-[120%] sm:h-[120%] -translate-x-1/2 -translate-y-1/2 object-cover select-none transition-opacity duration-1000 ${opacity}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      ) : (
        <div className="absolute inset-0 bg-black" />
      )}
    </div>
  );
}

// WORKS COMPONENTS (MOVED FROM WORK.JSX)
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
    <section id="works" className="relative w-full bg-black py-8 md:py-12 px-6 md:px-12 border-b border-neutral-900">
     

      {/* New Section Heading & Sub-content Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start mb-12 md:mb-24">
        <div className="lg:col-span-8">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-sans font-extralight tracking-tight text-white uppercase leading-[1.1] mb-4">
            FROM IDEA TO IMAGE.
          </h2>
          <p className="text-xs md:text-sm font-mono text-neutral-400 uppercase tracking-widest max-w-2xl leading-relaxed">
            A selection of films, campaigns and visual stories created with our collaborators.
          </p>
        </div>
      </div>

      {loading && (
        <div className="text-[10px] tracking-[0.4em] text-neutral-500 text-center py-48 font-mono uppercase animate-pulse">
          SYNCHRONIZING ROSTER ARCHIVES FROM SECURE DISPATCH...
        </div>
      )}

      {!loading && !error && works.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-24 items-start">
          <div className="flex flex-col md:pt-0">
            {works.filter((_, i) => i % 2 === 0).map((work, i) => (
              <WorkCard key={`left-${work.id}-${i}`} work={work} onOpen={setActiveWork} />
            ))}
          </div>
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

// SECTION 1
function Section1Hero({ mediaUrl, fallbackVideoId }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const textScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={containerRef} className="relative w-full h-screen bg-black overflow-hidden flex flex-col p-6 md:p-12">
      <SaturatedVideo mediaUrl={mediaUrl} fallbackVideoId={fallbackVideoId} opacity="opacity-100" />
      <motion.div style={{ scale: textScale, opacity }} className="z-10 flex flex-col items-start max-w-7xl mt-auto">
        <h1 className="text-[clamp(2.2rem,7.5vw,9rem)] font-extralight tracking-tighter leading-[0.9] text-white uppercase font-sans break-words w-full">
          SEKRICK
        </h1>
        <div className="w-full flex flex-col md:flex-row md:items-center justify-between mt-6 md:mt-8 gap-4">
          <p className="text-[9px] md:text-[10px] tracking-[0.4em] md:tracking-[0.6em] text-neutral-400 font-light uppercase leading-relaxed">
            SECRETS OF CREATIVE CULTURE.
          </p>
          
        </div>
        <div>
          <p className="text-[9px] md:text-[10px] tracking-[0.4em] md:tracking-[0.6em] text-neutral-400 font-light uppercase leading-relaxed">
            A creative production house and agency working across fashion, film, brands and culture.
          </p>
        </div>
      </motion.div>
    </section>
  );
}

// SECTION 2
function Section2Threshold() {
  const containerRef = useRef(null);
  const lines = [
    "MORE THAN A PRODUCTION HOUSE.",
    "SEKRICK is an independent creative company built around production, ideas, people and culture.",
    "We work across commercial production, creative direction, fashion, film and visual culture — collaborating with brands, artists and creative talent to develop ideas from concept to screen.",
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const allWords = gsap.utils.toArray(".manifesto-word");
      gsap.set(allWords, { color: "#404040" });
      gsap.to(allWords, {
        color: "#ffffff",
        stagger: 0.08,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
          end: "bottom 25%",
          scrub: 1,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="w-full min-h-[40vh] md:min-h-[60vh] bg-black flex items-center px-6 sm:px-12 md:px-24 py-16 md:py-32 border-y border-neutral-900">
      <div className="max-w-5xl">
        {lines.map((line, lineIdx) => (
          <div key={lineIdx} className="mb-4 md:mb-6">
            <span className="block text-xl sm:text-2xl md:text-4xl font-extralight tracking-tight leading-snug font-sans">
              {line.trim().split(/\s+/).filter(Boolean).map((word, wordIdx) => (
                <span key={wordIdx} className="manifesto-word inline-block mr-[0.25em]">
                  {word}
                </span>
              ))}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

/*
// SECTION 3
function Section3Aperture({ mediaUrl, fallbackVideoId }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const frameWidth = useTransform(scrollYProgress, [0, 0.6], ["85%", "100%"]);
  const frameRadius = useTransform(scrollYProgress, [0, 0.6], ["16px", "0px"]);

  return (
    <div ref={containerRef} className="relative w-full h-[48vh] md:h-[120vh] bg-black flex items-center justify-center overflow-hidden">
      <motion.div style={{ width: frameWidth, height: "100%", borderRadius: frameRadius }} className="relative overflow-hidden will-change-transform bg-neutral-900">
        <SaturatedVideo mediaUrl={mediaUrl} fallbackVideoId={fallbackVideoId} opacity="opacity-100" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
      </motion.div>
    </div>
  );
}
  */

// SECTION 4
function Section4ChromaticMatte({ slowMediaUrl, slowFallback, fastMediaUrl, fastFallback }) {
  const triggerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: triggerRef,
    offset: ["start end", "end start"],
  });
  const yParallaxFast = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const yParallaxSlow = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);

  return (
    <section ref={triggerRef} className="w-full min-h-[auto] md:min-h-screen bg-black flex flex-col justify-center py-12 md:py-24 px-6 md:px-12 lg:px-24 border-b border-neutral-900 relative overflow-hidden">
      <div className="w-full flex justify-between font-mono text-[9px] md:text-[10px] tracking-[0.3em] md:tracking-[0.5em] text-neutral-400 mb-6 gap-4">
        <span className="text-white text-right">MATTE REEL: ACTIVE</span>
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center relative">
        <div className="w-full aspect-[16/10] overflow-hidden bg-neutral-950 border border-neutral-800 relative">
          <motion.div style={{ y: yParallaxSlow }} className="absolute top-0 left-0 w-full h-[115%]">
            <SaturatedVideo mediaUrl={slowMediaUrl} fallbackVideoId={slowFallback} />
          </motion.div>
        </div>
        <div className="w-full aspect-[16/10] overflow-hidden bg-neutral-950 border border-neutral-800 relative">
          <motion.div style={{ y: yParallaxFast }} className="absolute top-0 left-0 w-full h-[115%]">
            <SaturatedVideo mediaUrl={fastMediaUrl} fallbackVideoId={fastFallback} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// SECTION 8
function Section8VideoIntercept({ mediaUrl, fallbackVideoId }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const scaleHero = useTransform(scrollYProgress, [0, 1], [1.1, 1]);

  return (
    <section ref={containerRef} className="w-full h-[42vh] md:h-screen bg-black overflow-hidden relative border-b border-neutral-900 flex items-center justify-center">
      <motion.div style={{ scale: scaleHero }} className="absolute inset-0 w-full h-full">
        <SaturatedVideo mediaUrl={mediaUrl} fallbackVideoId={fallbackVideoId} opacity="opacity-100" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black pointer-events-none opacity-40 mix-blend-multiply" />
      <div className="z-10 text-center font-mono text-[8px] md:text-[10px] tracking-[0.4em] md:tracking-[0.6em] text-white bg-black/50 px-3 py-2 backdrop-blur-sm rounded max-w-[90%] break-words">
        [ SATURATED RUNTIME FEED INTERCEPT // REEL_ACTIVE ]
      </div>
    </section>
  );
}

// SECTION 10
function Section10AsymmetricBlock({ mediaUrl, fallbackVideoId }) {
  const blockRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: blockRef,
    offset: ["start end", "end start"],
  });
  const xOffset = useTransform(scrollYProgress, [0, 1], ["-10%", "5%"]);

  return (
    <section ref={blockRef} className="w-full min-h-[auto] md:min-h-screen bg-black py-12 md:py-24 px-6 md:px-12 lg:px-24 border-b border-neutral-900 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center overflow-hidden">
      <div className="lg:col-span-4 flex flex-col space-y-4 md:space-y-6">
        <h3 className="text-2xl md:text-3xl lg:text-5xl font-extralight tracking-tighter text-white uppercase font-sans leading-none break-words">
          WHERE IDEAS FIND <br className="hidden lg:block" /> THEIR VISUAL VOICE.
        </h3>
      </div>
      <div className="lg:col-span-8 relative flex items-center justify-center w-full">
        <div className="w-full aspect-[16/10] overflow-hidden bg-neutral-950 border border-neutral-800 relative z-10">
          <SaturatedVideo mediaUrl={mediaUrl} fallbackVideoId={fallbackVideoId} />
        </div>
        <motion.div style={{ x: xOffset }} className="absolute right-0 bottom-[-40px] w-1/2 aspect-square max-w-[280px] bg-white opacity-5 filter blur-3xl rounded-full z-0 pointer-events-none" />
      </div>
    </section>
  );
}




/* ==========================================
   MAIN ROOT EXPORT ENTRY COMPONENT
   ========================================== */
export default function Home() {
  const [videos, setVideos] = useState({});
  const [works, setWorks] = useState([]);
  const [loadingWorks, setLoadingWorks] = useState(true);
  const [worksError, setWorksError] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const systemPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (systemPreference.matches) {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      }
    }
  }, []);


  
  // Fetch Home Videos from Supabase
  useEffect(() => {
    async function loadVideos() {
      const { data } = await supabase
        .from("home_videos")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true });

      if (data) {
        const map = {};
        data.forEach((v) => {
          map[v.section_key] = v.media_url;
        });
        setVideos(map);
      }
    }
    loadVideos();
  }, []);

  // Fetch Works from Supabase
  useEffect(() => {
    let mounted = true;

    async function loadWorks() {
      const { data, error: fetchError } = await supabase
        .from("works")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true });

      if (!mounted) return;

      if (fetchError || !data || data.length === 0) {
        const syntheticData = Array.from({ length: 4 }).map((_, idx) => mapWorkRow({}, idx));
        setWorks(syntheticData);
        setWorksError(null);
      } else {
        setWorksError(null);
        setWorks(data.map(mapWorkRow));
      }
      setLoadingWorks(false);
    }

    loadWorks();
    return () => { mounted = false; };
  }, []);

  return (
    <main className="bg-black text-white overflow-x-hidden selection:bg-white selection:text-black antialiased">
      <Section1Hero mediaUrl={videos.hero} fallbackVideoId={ASSETS.heroVideo} />
      <Section2Threshold />
      
      

      
      <Section4ChromaticMatte
        slowMediaUrl={videos.chromatic_matte_1}
        slowFallback={ASSETS.cinematicClip3}
        fastMediaUrl={videos.fastMediaUrl || videos.chromatic_matte_2}
        fastFallback={ASSETS.heroVideo}
      />
      <Section8VideoIntercept mediaUrl={videos.video_intercept} fallbackVideoId={ASSETS.cinematicClip2} />
      <Section10AsymmetricBlock mediaUrl={videos.asymmetric_block} fallbackVideoId={ASSETS.heroVideo} />
      {/* Dynamic Works Section under Home */}
      <WorksGridSection works={works} loading={loadingWorks} error={worksError} />
      
    </main>
  );
}
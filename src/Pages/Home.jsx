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
  "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=80",
];

function mapWorkRow(row, index) {
  return {
    id: row.display_id || String(index + 1).padStart(2, "0"),
    title:
      row.title ||
      (index === 0
        ? "PHOTOGRAPHERS"
        : index === 1
        ? "STYLISTS"
        : index === 2
        ? "DIRECTORS"
        : "GUEST DIRECTORS"),
    category: row.category || "Creative Direction",
    year: row.year || "2026",
    tag: row.tag || "Campaign Asset",
    mediaType: row.media_type || "image",
    mediaUrl: row.media_url || FALLBACK_ASSETS[index % FALLBACK_ASSETS.length],
    desc:
      row.desc ||
      "Commercial production overview and spatial execution details aligned with high-fashion client rosters.",
  };
}

function SaturatedVideo({ mediaUrl, fallbackVideoId, opacity = "opacity-100" }) {
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef(null);

  // Reset error state whenever mediaUrl updates
  useEffect(() => {
    setVideoError(false);
  }, [mediaUrl]);

  const handleVideoError = () => {
    // Attempt a quick reload if it was a temporary network timeout
    if (videoRef.current && mediaUrl) {
      videoRef.current.load();
    } else {
      setVideoError(true);
    }
  };

  const showFallback = !mediaUrl || videoError;

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-black pointer-events-none">
      {mediaUrl && !videoError ? (
        <video
          ref={videoRef}
          src={mediaUrl}
          autoPlay
          muted
          loop
          playsInline
          onError={handleVideoError}
          className={`absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover select-none transition-opacity duration-1000 ${opacity}`}
        />
      ) : fallbackVideoId ? (
        <iframe
          src={`https://www.youtube.com/embed/${fallbackVideoId}?autoplay=1&mute=1&loop=1&playlist=${fallbackVideoId}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&playsinline=1`}
          title="Vivid Continuum Loop"
          className={`absolute top-1/2 left-1/2 w-[300vw] h-[300vh] sm:w-[150vw] sm:h-[150vh] -translate-x-1/2 -translate-y-1/2 object-cover select-none transition-opacity duration-1000 ${opacity}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      ) : (
        <div className="absolute inset-0 bg-black" />
      )}
    </div>
  );
}
// WORKS COMPONENTS (NATURAL ASPECT RATIO + HOVER EFFECT)
function WorkCard({ work, onOpen }) {
  return (
    <div className="group w-full mb-8 sm:mb-12 md:mb-24 lg:mb-32 flex flex-col">
      <button
        type="button"
        onClick={() => work.mediaUrl && onOpen(work)}
        className={`relative w-full overflow-hidden bg-neutral-950 transition-all border border-neutral-900/60 block text-left ${
          work.mediaUrl ? "cursor-pointer" : "cursor-default"
        }`}
      >
        {work.mediaUrl &&
          (work.mediaType === "video" ? (
            <video
              className="w-full h-auto block grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out will-change-transform"
              src={work.mediaUrl}
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <img
              className="w-full h-auto block grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out will-change-transform"
              src={work.mediaUrl}
              alt={work.title}
              loading="lazy"
            />
          ))}

        {/* Index Badge */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 font-mono text-[9px] sm:text-[10px] bg-black/80 text-neutral-400 px-2 py-1 border border-neutral-800 backdrop-blur-sm pointer-events-none z-10">
          INDEX_{work.id}
        </div>

        {/* Subtle Dark Overlay on idle, fades out on hover */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 pointer-events-none" />
      </button>

      <div className="mt-3 sm:mt-4 md:mt-6 flex flex-col md:flex-row md:justify-between md:items-baseline font-sans border-b border-neutral-900 pb-4 gap-2 md:gap-0">
        <div>
          <h3 className="text-xl sm:text-2xl font-light tracking-tight text-white uppercase group-hover:text-neutral-300 transition-colors">
            {work.title}
          </h3>
          <p className="text-neutral-500 text-[10px] sm:text-[11px] font-mono tracking-widest uppercase mt-1">
            {work.category} // {work.year}
          </p>
        </div>
        <button
          onClick={() => work.mediaUrl && onOpen(work)}
          className="mt-2 md:mt-0 font-mono text-[8px] sm:text-[9px] tracking-widest uppercase border border-neutral-800 hover:border-white px-3 sm:px-4 py-1.5 sm:py-2 text-neutral-400 hover:text-white transition-all self-start md:self-auto"
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
    <section
      id="works"
      className="relative w-full bg-black py-10 sm:py-16 md:py-24 px-4 sm:px-8 md:px-12 lg:px-24 border-b border-neutral-900"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start mb-8 sm:mb-12 md:mb-20">
        <div className="lg:col-span-8">
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-sans font-extralight tracking-tight text-white uppercase leading-[1.1] mb-3 sm:mb-4">
            FROM IDEA TO IMAGE.
          </h2>
          <p className="text-[11px] sm:text-xs md:text-sm font-mono text-neutral-400 uppercase tracking-widest max-w-2xl leading-relaxed">
            A selection of films, campaigns and visual stories created with our collaborators.
          </p>
        </div>
      </div>

      {loading && (
        <div className="text-[9px] sm:text-[10px] tracking-[0.3em] sm:tracking-[0.4em] text-neutral-500 text-center py-28 sm:py-36 md:py-48 font-mono uppercase animate-pulse">
          SYNCHRONIZING ROSTER ARCHIVES FROM SECURE DISPATCH...
        </div>
      )}

      {!loading && !error && works.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 sm:gap-x-10 lg:gap-x-24 items-start">
          <div className="flex flex-col md:pt-0">
            {works
              .filter((_, i) => i % 2 === 0)
              .map((work, i) => (
                <WorkCard
                  key={`left-${work.id}-${i}`}
                  work={work}
                  onOpen={setActiveWork}
                />
              ))}
          </div>
          <div className="flex flex-col md:pt-20 lg:pt-32">
            {works
              .filter((_, i) => i % 2 !== 0)
              .map((work, i) => (
                <WorkCard
                  key={`right-${work.id}-${i}`}
                  work={work}
                  onOpen={setActiveWork}
                />
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
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black p-4 sm:p-8 md:p-12 overflow-y-auto"
        >
          <button
            type="button"
            className="absolute inset-0 cursor-zoom-out bg-black/80 backdrop-blur-md"
            onClick={onClose}
            aria-label="Close"
          />

          <div className="relative z-10 w-full max-w-7xl h-full flex flex-col lg:grid lg:grid-cols-12 justify-between gap-6 md:gap-8 pointer-events-none pt-8 sm:pt-12 md:pt-0 overflow-y-auto lg:overflow-visible">
            <div className="lg:col-span-8 h-full flex items-center justify-center pointer-events-auto">
              <div className="w-full max-h-[55vh] sm:max-h-[70vh] lg:max-h-[80vh] flex items-center justify-center border border-neutral-900 bg-neutral-950">
                {work.mediaType === "video" ? (
                  <video
                    className="max-h-[55vh] sm:max-h-[70vh] lg:max-h-[80vh] w-full object-contain"
                    src={work.mediaUrl}
                    controls
                    autoPlay
                    playsInline
                  />
                ) : (
                  <img
                    className="max-h-[55vh] sm:max-h-[70vh] lg:max-h-[80vh] w-full object-contain"
                    src={work.mediaUrl}
                    alt={work.title}
                  />
                )}
              </div>
            </div>

            <div className="lg:col-span-4 h-full flex flex-col justify-between pointer-events-auto border-t lg:border-t-0 lg:border-l border-neutral-900 pt-6 lg:pt-0 lg:pl-10 text-white">
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <span className="text-[8px] sm:text-[9px] tracking-[0.3em] text-neutral-500 font-mono">
                    [ ROSTER MATRIX {work.id} ]
                  </span>
                  <button
                    type="button"
                    className="text-[8px] sm:text-[9px] tracking-[0.2em] font-mono text-neutral-400 hover:text-white border-b border-neutral-800 pb-0.5"
                    onClick={onClose}
                  >
                    TERMINATE_OVERLAY
                  </button>
                </div>

                <h3 className="text-xl sm:text-2xl md:text-3xl font-sans font-extralight tracking-tight text-white uppercase mb-2">
                  {work.title}
                </h3>
                <span className="text-[9px] sm:text-[10px] tracking-[0.3em] text-neutral-400 uppercase font-mono">
                  {work.category}
                </span>
                <div className="border-b border-neutral-900 my-4 sm:my-6" />
                <p className="text-[11px] sm:text-[12px] leading-relaxed text-neutral-400 font-sans font-light">
                  {work.desc}
                </p>
              </div>

              <div className="pt-6 sm:pt-8 lg:pt-0">
                <button
                  onClick={onClose}
                  className="w-full bg-white text-black font-mono text-[9px] sm:text-[10px] font-bold tracking-[0.3em] py-3.5 sm:py-4 uppercase transition-colors hover:bg-neutral-200 rounded-[1px]"
                >
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

// SECTION 1: RESPONSIVE HERO
function Section1Hero({ mediaUrl, fallbackVideoId }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const textScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[100svh] min-h-[520px] bg-black overflow-hidden flex flex-col justify-between p-4 sm:p-8 md:p-12 lg:p-16 border-b border-neutral-900"
    >
      <SaturatedVideo
        mediaUrl={mediaUrl}
        fallbackVideoId={fallbackVideoId}
        opacity="opacity-100"
      />

      <motion.div
        style={{ scale: textScale, opacity }}
        className="z-10 flex flex-col items-start w-full max-w-7xl mt-auto pb-4 sm:pb-8"
      >
        <h1 className="text-[clamp(2.75rem,11vw,9.5rem)] font-extralight tracking-tighter leading-[0.88] text-white uppercase font-sans break-words w-full select-none drop-shadow-2xl">
          SEKRICK
        </h1>

        <div className="w-full flex flex-col md:flex-row md:items-center justify-between mt-3 sm:mt-6 md:mt-8 gap-2 sm:gap-4">
          <p className="text-[9px] sm:text-[10px] md:text-xs tracking-[0.25em] sm:tracking-[0.4em] text-neutral-300 font-light uppercase leading-relaxed">
            SECRETS OF CREATIVE CULTURE.
          </p>
        </div>

        <div className="mt-2 sm:mt-3 max-w-2xl">
          <p className="text-[8px] sm:text-[10px] md:text-[11px] tracking-[0.18em] sm:tracking-[0.25em] text-neutral-400 font-light uppercase leading-relaxed">
            A creative production house and agency working across fashion, film, brands and culture.
          </p>
        </div>
      </motion.div>
    </section>
  );
}

// SECTION 2: MANIFESTO THRESHOLD
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
    <section
      ref={containerRef}
      className="w-full min-h-[35vh] sm:min-h-[45vh] md:min-h-[60vh] bg-black flex items-center px-4 sm:px-8 md:px-16 lg:px-24 py-12 sm:py-20 md:py-32 border-b border-neutral-900"
    >
      <div className="max-w-5xl">
        {lines.map((line, lineIdx) => (
          <div key={lineIdx} className="mb-3 sm:mb-4 md:mb-6">
            <span className="block text-lg sm:text-2xl md:text-3xl lg:text-4xl font-extralight tracking-tight leading-snug font-sans uppercase">
              {line
                .trim()
                .split(/\s+/)
                .filter(Boolean)
                .map((word, wordIdx) => (
                  <span
                    key={wordIdx}
                    className="manifesto-word inline-block mr-[0.22em]"
                  >
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

// SECTION 4: CHROMATIC MATTE
function Section4ChromaticMatte({
  slowMediaUrl,
  slowFallback,
  fastMediaUrl,
  fastFallback,
}) {
  const triggerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: triggerRef,
    offset: ["start end", "end start"],
  });
  const yParallaxFast = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const yParallaxSlow = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);

  return (
    <section
      ref={triggerRef}
      className="w-full min-h-[auto] md:min-h-screen bg-black flex flex-col justify-center py-10 sm:py-16 md:py-24 px-4 sm:px-8 md:px-12 lg:px-24 border-b border-neutral-900 relative overflow-hidden"
    >
      <div className="w-full flex justify-between items-center font-mono text-[8px] sm:text-[9px] md:text-[10px] tracking-[0.3em] md:tracking-[0.5em] text-neutral-400 mb-4 sm:mb-6">
        <span className="text-white text-right">DUAL PERSPECTIVE | REEL STREAM</span>
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 items-center relative">
        <div className="w-full aspect-[16/10] overflow-hidden bg-neutral-950 border border-neutral-800 relative">
          <motion.div
            style={{ y: yParallaxSlow }}
            className="absolute top-0 left-0 w-full h-[115%]"
          >
            <SaturatedVideo
              mediaUrl={slowMediaUrl}
              fallbackVideoId={slowFallback}
            />
          </motion.div>
        </div>
        <div className="w-full aspect-[16/10] overflow-hidden bg-neutral-950 border border-neutral-800 relative">
          <motion.div
            style={{ y: yParallaxFast }}
            className="absolute top-0 left-0 w-full h-[115%]"
          >
            <SaturatedVideo
              mediaUrl={fastMediaUrl}
              fallbackVideoId={fastFallback}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// SECTION 8: VIDEO INTERCEPT
function Section8VideoIntercept({ mediaUrl, fallbackVideoId }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const scaleHero = useTransform(scrollYProgress, [0, 1], [1.08, 1]);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[45svh] sm:h-[60svh] md:h-[100svh] min-h-[300px] bg-black overflow-hidden border-b border-neutral-900 flex items-center justify-center p-4 sm:p-6"
    >
      <motion.div
        style={{ scale: scaleHero }}
        className="absolute inset-0 w-full h-full will-change-transform"
      >
        <SaturatedVideo
          mediaUrl={mediaUrl}
          fallbackVideoId={fallbackVideoId}
          opacity="opacity-100"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black pointer-events-none opacity-40 mix-blend-multiply" />
      <div className="z-10 text-center font-mono text-[8px] sm:text-[9px] md:text-[10px] tracking-[0.25em] sm:tracking-[0.4em] md:tracking-[0.6em] text-white bg-black/50 px-3 sm:px-4 py-2 backdrop-blur-sm rounded max-w-[90%] break-words">
        [ SATURATED RUNTIME FEED INTERCEPT // REEL_ACTIVE ]
      </div>
    </section>
  );
}

// SECTION 10: ASYMMETRIC BLOCK
function Section10AsymmetricBlock({ mediaUrl, fallbackVideoId }) {
  const blockRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: blockRef,
    offset: ["start end", "end start"],
  });
  const xOffset = useTransform(scrollYProgress, [0, 1], ["-10%", "5%"]);

  return (
    <section
      ref={blockRef}
      className="w-full min-h-[auto] md:min-h-screen bg-black py-10 sm:py-16 md:py-24 px-4 sm:px-8 md:px-12 lg:px-24 border-b border-neutral-900 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center overflow-hidden"
    >
      <div className="lg:col-span-4 flex flex-col space-y-3 sm:space-y-4 md:space-y-6">
        <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extralight tracking-tighter text-white uppercase font-sans leading-none break-words">
          WHERE IDEAS FIND <br className="hidden lg:block" /> THEIR VISUAL VOICE.
        </h3>
      </div>
      <div className="lg:col-span-8 relative flex items-center justify-center w-full">
        <div className="w-full aspect-[16/10] overflow-hidden bg-neutral-950 border border-neutral-800 relative z-10">
          <SaturatedVideo
            mediaUrl={mediaUrl}
            fallbackVideoId={fallbackVideoId}
          />
        </div>
        <motion.div
          style={{ x: xOffset }}
          className="absolute right-0 bottom-[-40px] w-1/2 aspect-square max-w-[280px] bg-white opacity-5 filter blur-3xl rounded-full z-0 pointer-events-none"
        />
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
      const systemPreference = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      );
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
        const syntheticData = Array.from({ length: 4 }).map((_, idx) =>
          mapWorkRow({}, idx)
        );
        setWorks(syntheticData);
        setWorksError(null);
      } else {
        setWorksError(null);
        setWorks(data.map(mapWorkRow));
      }
      setLoadingWorks(false);
    }

    loadWorks();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="bg-black text-white overflow-x-hidden selection:bg-white selection:text-black antialiased w-full">
      <Section1Hero
        mediaUrl={videos.hero}
        fallbackVideoId={ASSETS.heroVideo}
      />
      <Section2Threshold />
      <Section4ChromaticMatte
        slowMediaUrl={videos.chromatic_matte_1}
        slowFallback={ASSETS.cinematicClip3}
        fastMediaUrl={videos.fastMediaUrl || videos.chromatic_matte_2}
        fastFallback={ASSETS.heroVideo}
      />
      <Section8VideoIntercept
        mediaUrl={videos.video_intercept}
        fallbackVideoId={ASSETS.cinematicClip2}
      />
      <Section10AsymmetricBlock
        mediaUrl={videos.asymmetric_block}
        fallbackVideoId={ASSETS.heroVideo}
      />
      <WorksGridSection
        works={works}
        loading={loadingWorks}
        error={worksError}
      />
    </main>
  );
}
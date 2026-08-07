import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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

function SaturatedVideo({
  mediaUrl,
  fallbackVideoId,
  opacity = "opacity-100",
}) {
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

/* ==========================================
   THE EXPERIMENTAL CINEMATIC SECTIONS
   ========================================= */

// SECTION 1: Pre-flight Brand Identity Landing
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
      className="relative w-full h-screen bg-black overflow-hidden flex flex-col p-6 md:p-12"
    >
      <SaturatedVideo
        mediaUrl={mediaUrl}
        fallbackVideoId={fallbackVideoId}
        opacity="opacity-100"
      />
      <motion.div
        style={{ scale: textScale, opacity }}
        className="z-10 flex flex-col items-start max-w-7xl mt-auto"
      >
        <h1 className="text-[clamp(2.2rem,7.5vw,9rem)] font-extralight tracking-tighter leading-[0.9] text-white uppercase font-sans break-words w-full">
          SEKRICK
        </h1>
        <div className="w-full flex flex-col md:flex-row md:items-center justify-between mt-6 md:mt-8 gap-4">
          <p className="text-[9px] md:text-[10px] tracking-[0.4em] md:tracking-[0.6em] text-neutral-400 font-light uppercase leading-relaxed">
            Visual Storytelling & Brand Architecture
          </p>
         
        </div>
      </motion.div>
      
    </section>
  );
}

// SECTION 2: Dynamic Typographic Threshold (Line-by-Line Reveal)
// SECTION 2: Dynamic Typographic Threshold (Sequential Line-by-Line Word Fill)
function Section2Threshold() {
  const containerRef = useRef(null);

  const lines = [
    "We don’t just create visuals.",
    "We shape stories people can feel.",
    "Every frame is crafted with intention,",
    "emotion, and timeless design.",
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const allWords = gsap.utils.toArray(".manifesto-word");

      gsap.set(allWords, { color: "#404040" });

      gsap.to(allWords, {
        color: "#ffffff",
        stagger: 0.1,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
          end: "bottom 20%",
          scrub: 1,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="w-full min-h-[40vh] md:min-h-[60vh] bg-black flex items-center px-6 sm:px-12 md:px-24 py-16 md:py-32 border-y border-neutral-900"
    >
      <div className="max-w-5xl">
        
        <h2 className="text-xl sm:text-2xl md:text-5xl font-extralight tracking-tight leading-snug font-sans space-y-2">
          {lines.map((line, lineIdx) => (
            <span key={lineIdx} className="block">
              {line
                .trim()
                .split(/\s+/)
                .filter(Boolean)
                .map((word, wordIdx) => (
                  <span
                    key={wordIdx}
                    className="manifesto-word inline-block mr-[0.25em]"
                  >
                    {word}
                  </span>
                ))}
            </span>
          ))}
        </h2>
      </div>
    </section>
  );
}

// SECTION 3: The Expanding Aperture Frame
function Section3Aperture({ mediaUrl, fallbackVideoId }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const frameWidth = useTransform(scrollYProgress, [0, 0.6], ["85%", "100%"]);
  const frameRadius = useTransform(scrollYProgress, [0, 0.6], ["16px", "0px"]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[48vh] md:h-[120vh] bg-black flex items-center justify-center overflow-hidden"
    >
      <motion.div
        style={{ width: frameWidth, height: "100%", borderRadius: frameRadius }}
        className="relative overflow-hidden will-change-transform bg-neutral-900"
      >
        <SaturatedVideo
          mediaUrl={mediaUrl}
          fallbackVideoId={fallbackVideoId}
          opacity="opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
        
      </motion.div>
    </div>
  );
}

// SECTION 4: THE DOUBLE-LAYER CHROMATIC MATTE REVEAL
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
      className="w-full min-h-[auto] md:min-h-screen bg-black flex flex-col justify-center py-12 md:py-24 px-6 md:px-12 lg:px-24 border-b border-neutral-900 relative overflow-hidden"
    >
      <div className="w-full flex justify-between font-mono text-[9px] md:text-[10px] tracking-[0.3em] md:tracking-[0.5em] text-neutral-400 mb-6 gap-4">
        
        <span className="text-white text-right">MATTE REEL: ACTIVE</span>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center relative">
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



// SECTION 8: FULL-BLEED SATURATED PARALLAX REEL REVEAL
function Section8VideoIntercept({ mediaUrl, fallbackVideoId }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const scaleHero = useTransform(scrollYProgress, [0, 1], [1.1, 1]);

  return (
    <section
      ref={containerRef}
      className="w-full h-[42vh] md:h-screen bg-black overflow-hidden relative border-b border-neutral-900 flex items-center justify-center"
    >
      <motion.div
        style={{ scale: scaleHero }}
        className="absolute inset-0 w-full h-full"
      >
        <SaturatedVideo
          mediaUrl={mediaUrl}
          fallbackVideoId={fallbackVideoId}
          opacity="opacity-100"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black pointer-events-none opacity-40 mix-blend-multiply" />
      <div className="z-10 text-center font-mono text-[8px] md:text-[10px] tracking-[0.4em] md:tracking-[0.6em] text-white bg-black/50 px-3 py-2 backdrop-blur-sm rounded max-w-[90%] break-words">
        [ SATURATED RUNTIME FEED INTERCEPT // REEL_ACTIVE ]
      </div>
    </section>
  );
}

// SECTION 10: ALTERNATIVE GEOMETRIC BLOCK OVERLAY
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
      className="w-full min-h-[auto] md:min-h-screen bg-black py-12 md:py-24 px-6 md:px-12 lg:px-24 border-b border-neutral-900 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center overflow-hidden"
    >
      <div className="lg:col-span-4 flex flex-col space-y-4 md:space-y-6">
        
        <h3 className="text-2xl md:text-3xl lg:text-5xl font-extralight tracking-tighter text-white uppercase font-sans leading-none break-words">
          WHERE IDEAS FIND
          <br className="hidden lg:block" /> THEIR VISUAL VOICE.
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

  useEffect(() => {
    if (typeof window !== "undefined") {
      const systemPreference = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      );
      if (systemPreference.matches) {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      }
    }
  }, []);

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

  return (
    <main className="bg-black text-white overflow-x-hidden selection:bg-white selection:text-black antialiased">
      <Section1Hero mediaUrl={videos.hero} fallbackVideoId={ASSETS.heroVideo} />
      <Section2Threshold />
      <Section3Aperture
        mediaUrl={videos.aperture}
        fallbackVideoId={ASSETS.heroVideo}
      />
      <Section4ChromaticMatte
        slowMediaUrl={videos.chromatic_matte_1}
        slowFallback={ASSETS.cinematicClip3}
        fastMediaUrl={videos.chromatic_matte_2}
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
     
    </main>
  );
}
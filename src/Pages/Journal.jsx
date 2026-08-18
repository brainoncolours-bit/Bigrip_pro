import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ==========================================
   HELPER COMPONENT: FULL COLOR VIDEO PLAYER
   ========================================== */
function JournalVideoPlayer({ mediaUrl, fallbackYoutubeId }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [mediaUrl]);

  return (
    <div className="relative w-full aspect-video overflow-hidden bg-neutral-950 border border-neutral-900 group">
      {mediaUrl && !hasError ? (
        <video
          src={mediaUrl}
          autoPlay
          muted
          loop
          playsInline
          onError={() => setHasError(true)}
          className="w-full h-full object-cover opacity-100 group-hover:scale-105 transition-all duration-700 ease-out will-change-transform"
        />
      ) : fallbackYoutubeId ? (
        <iframe
          src={`https://www.youtube.com/embed/${fallbackYoutubeId}?autoplay=1&mute=1&loop=1&playlist=${fallbackYoutubeId}&controls=0&showinfo=0&rel=0&modestbranding=1`}
          title="Journal Reel Dispatch"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      ) : (
        <div className="w-full h-full bg-neutral-900" />
      )}
    </div>
  );
}

/* ==========================================
   SECTION 1: JOURNAL HERO
   ========================================== */
function JournalHero() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const yOffset = useTransform(scrollYProgress, [0, 0.5], ["0px", "-40px"]);

  const tags = ["FILMS", "STORIES", "INTERVIEWS", "ARTISTS", "FASHION", "CULTURE"];

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[100svh] min-h-[520px] bg-black overflow-hidden flex flex-col justify-between p-6 md:p-12 border-b border-neutral-900"
    >
      <div className="absolute inset-0 z-0 pointer-events-none w-full h-full overflow-hidden">
        <img
          src="/web banner 5.png"
          alt="Community Hero Background"
          className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover select-none filter grayscale contrast-100 brightness-110"
        />
        <div className="absolute inset-0 bg-black/15 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
      </div>

      <motion.div
        style={{ opacity, y: yOffset }}
        className="z-10 flex flex-col items-start max-w-7xl my-auto text-left"
      >
        <h1 className="text-[clamp(2.5rem,8vw,8rem)] font-thin tracking-tighter leading-[0.95] text-white uppercase font-sans break-words w-full drop-shadow-2xl">
          THE SEKRICK JOURNAL.
        </h1>
        <p className="text-[11px] md:text-xs tracking-[0.3em] text-neutral-300 font-light uppercase max-w-2xl mt-8 leading-relaxed drop-shadow">
          Stories, conversations, films and ideas from the people shaping creative culture.
        </p>

        <div className="flex flex-wrap gap-2 md:gap-3 mt-8">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="font-mono text-[9px] md:text-[10px] tracking-widest text-neutral-300 border border-neutral-700/80 bg-black/40 backdrop-blur-md px-3 py-1 uppercase"
            >
              {tag}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

/* ==========================================
   SECTION 2: DYNAMIC JOURNAL VIDEOS (FROM ADMIN)
   ========================================== */
const FALLBACK_VIDEOS = [
  {
    title: "ATMOSPHERIC COMPOSITION & RHYTHM",
    media_url: "",
    fallback_yt: "9Wd_A8e8TqM",
    desc_text:
      "An exploration into how tactile lighting cues and tempo control define cinematic narrative within high-fashion campaigns.",
  },
  {
    title: "BEYOND THE COMMERCIAL FRAME",
    media_url: "",
    fallback_yt: "6HBxWrmI8OU",
    desc_text:
      "Interviews on creative autonomy, balancing auteur direction with high-profile global brand requirements.",
  },
];

function JournalVideoSection() {
  const [videoEntries, setVideoEntries] = useState(FALLBACK_VIDEOS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchJournalVideos() {
      try {
        const { data, error } = await supabase
          .from("journal_videos")
          .select("*")
          .eq("published", true)
          .order("sort_order", { ascending: true });

        if (!isMounted) return;

        if (error || !data || data.length === 0) {
          setVideoEntries(FALLBACK_VIDEOS);
        } else {
          setVideoEntries(
            data.map((item) => ({
              title: item.title,
              media_url: item.media_url,
              fallback_yt: "9Wd_A8e8TqM",
              desc_text: item.desc_text || "",
            }))
          );
        }
      } catch {
        if (isMounted) setVideoEntries(FALLBACK_VIDEOS);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchJournalVideos();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="w-full bg-black pt-8 pb-16 sm:pt-12 sm:pb-24 md:pt-16 md:pb-32 px-6 md:px-12 lg:px-24 border-b border-neutral-900">
      <div className="w-full flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 pb-4 border-b border-neutral-900 gap-4">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-thin tracking-tight text-white uppercase font-sans">
          CURATED MOTION ESSAYS.
        </h2>
      </div>

      {loading && (
        <div className="text-[10px] tracking-[0.4em] text-neutral-500 text-center py-12 font-mono uppercase animate-pulse">
          FETCHING ADMIN REEL DISPATCHES...
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {videoEntries.map((entry, index) => (
            <div key={index} className="flex flex-col space-y-3">
              <JournalVideoPlayer
                mediaUrl={entry.media_url}
                fallbackYoutubeId={entry.fallback_yt}
              />

              <h3 className="text-xl sm:text-2xl font-light tracking-tight text-white uppercase font-sans pt-2">
                {entry.title}
              </h3>

              <p className="text-xs sm:text-sm font-light text-neutral-400 leading-relaxed font-sans">
                {entry.desc_text}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/* ==========================================
   SECTION 3: JOURNAL ARTICLES GRID
   ========================================== */
function JournalCategoriesGrid() {
  const articles = [
    {
      num: "01",
      category: "FILMS / CULTURE",
      title: "THE FUTURE OF BRAND FILMS",
      desc: "How contemporary fashion and luxury brands are shifting from commercial advertising to cinematic storytelling.",
    },
    {
      num: "02",
      category: "ARTISTS / INTERVIEWS",
      title: "IN CONVERSATION WITH INDEPENDENT DIRECTORS",
      desc: "Discussions on creative autonomy, navigating commercial budgets, and preserving personal style.",
    },
    {
      num: "03",
      category: "FASHION / STORIES",
      title: "TACTILE TEXTURES & SPATIAL LIGHTING",
      desc: "A technical visual inquiry into setting mood, high-contrast shadows, and cinematic framing on set.",
    },
    {
      num: "04",
      category: "IDEAS / CULTURE",
      title: "IDEAS BEFORE EXECUTION",
      desc: "Why strategic creative direction and visual conceptualization determine the resonance of contemporary media.",
    },
  ];

  return (
    <section className="w-full bg-black py-12 md:py-24 px-6 md:px-12 lg:px-24 border-b border-neutral-900">
      <div className="max-w-7xl mx-auto flex flex-col divide-y divide-neutral-900 border-t border-b border-neutral-900">
        {articles.map((item, idx) => (
          <div
            key={idx}
            className="group grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 py-8 md:py-12 items-baseline transition-colors duration-500 hover:bg-neutral-950/60 px-4 md:px-8 cursor-pointer"
          >
            <div className="md:col-span-2 font-mono text-[10px] md:text-xs tracking-[0.3em] text-neutral-600 group-hover:text-white transition-colors uppercase">
              // {item.num}
            </div>

            <div className="md:col-span-5 flex flex-col space-y-1">
              <span className="font-mono text-[9px] tracking-widest text-neutral-500 uppercase">
                {item.category}
              </span>
              <h3 className="text-2xl md:text-3xl font-extralight tracking-tight text-white uppercase font-sans group-hover:text-neutral-200 transition-colors">
                {item.title}
              </h3>
            </div>

            <div className="md:col-span-5">
              <p className="text-xs md:text-sm font-light text-neutral-400 leading-relaxed font-sans">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ==========================================
   SECTION 4: WORK TOGETHER / CTA SECTION
   ========================================== */
function JournalContactSection() {
  return (
    <section className="w-full bg-black py-20 md:py-36 px-6 md:px-12 lg:px-24 border-b border-neutral-900">
      <div className="max-w-7xl mx-auto flex flex-col items-start space-y-8">
        <h2 className="text-4xl md:text-7xl lg:text-8xl font-thin tracking-tighter uppercase font-sans text-white leading-none">
          LET’S MAKE SOMETHING.
        </h2>

        <p className="text-sm md:text-lg font-light text-neutral-400 max-w-2xl leading-relaxed font-sans">
          Have an idea, campaign or project in mind? Tell us what you’re building.
        </p>

        <div className="pt-6">
          <Link
            to="/contact"
            className="inline-flex items-center space-x-4 border border-white bg-white text-black font-mono text-xs md:text-sm tracking-[0.25em] font-bold px-8 py-5 uppercase transition-all duration-300 hover:bg-black hover:text-white hover:border-neutral-700"
          >
            <span>START A PROJECT</span>
            <span>&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ==========================================
   MAIN ROOT EXPORT
   ========================================== */
export default function Journal() {
  return (
    <main className="bg-black text-white overflow-x-hidden selection:bg-white selection:text-black antialiased">
      <JournalHero />
      <JournalContactSection />
      <JournalVideoSection />
      <JournalCategoriesGrid />
    </main>
  );
}
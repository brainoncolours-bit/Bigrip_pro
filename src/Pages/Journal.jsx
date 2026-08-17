import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ==========================================
   SECTION 1: JOURNAL HERO
   ========================================== */
function JournalHero() {
  const containerRef = useRef(null);
  const defaultYoutubeId = "FWIJr42Ezfw";

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
      className="relative w-full h-screen bg-black overflow-hidden flex flex-col justify-between p-6 md:p-12 border-b border-neutral-900"
    >
      {/* Background Video Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none w-full h-full overflow-hidden">
          <img
            src="/web banner 5.png"
            alt="Community Hero Background"
            className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover select-none filter grayscale contrast-100 brightness-110"
          />
          {/* Lighter multiplier overlay */}
          <div className="absolute inset-0 bg-black/15 mix-blend-multiply" />
          {/* Softened top/bottom vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
        </div>

      

      {/* Main Title & Tags Content */}
      <motion.div
        style={{ opacity, y: yOffset }}
        className="z-10 flex flex-col items-start max-w-7xl my-auto"
      >
        <h1 className="text-[clamp(2.5rem,8vw,8rem)] font-thin tracking-tighter leading-[0.95] text-white uppercase font-sans break-words w-full drop-shadow-2xl">
          THE SEKRICK JOURNAL.
        </h1>
        <p className="text-[11px] md:text-xs tracking-[0.3em] text-neutral-300 font-light uppercase max-w-2xl mt-8 leading-relaxed drop-shadow">
          Stories, conversations, films and ideas from the people shaping creative culture.
        </p>

        {/* Filter Tags */}
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
   

      {/* Clean Text Grid */}
      <div className="max-w-7xl mx-auto flex flex-col divide-y divide-neutral-900 border-t border-b border-neutral-900">
        {articles.map((item, idx) => (
          <div
            key={idx}
            className="group grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 py-8 md:py-12 items-baseline transition-colors duration-500 hover:bg-neutral-950/60 px-4 md:px-8 cursor-pointer"
          >
            {/* Number Index */}
            <div className="md:col-span-2 font-mono text-[10px] md:text-xs tracking-[0.3em] text-neutral-600 group-hover:text-white transition-colors uppercase">
              // {item.num}
            </div>

            {/* Title & Tag */}
            <div className="md:col-span-5 flex flex-col space-y-1">
              <span className="font-mono text-[9px] tracking-widest text-neutral-500 uppercase">
                {item.category}
              </span>
              <h3 className="text-2xl md:text-3xl font-extralight tracking-tight text-white uppercase font-sans group-hover:text-neutral-200 transition-colors">
                {item.title}
              </h3>
            </div>

            {/* Description */}
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
      <JournalCategoriesGrid />
     
    </main>
  );
}
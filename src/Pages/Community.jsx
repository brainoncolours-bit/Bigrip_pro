import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ==========================================
   SECTION 1: COMMUNITY HERO
   ========================================== */
function CommunityHero() {
  const containerRef = useRef(null);
  const defaultYoutubeId = "FWIJr42Ezfw";

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const yOffset = useTransform(scrollYProgress, [0, 0.5], ["0px", "-40px"]);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen bg-black overflow-hidden flex flex-col justify-between p-6 md:p-12 border-b border-neutral-900"
    >
      {/* Background Video Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none w-full h-full overflow-hidden">
        <img
          src="/web banner 4.jpeg"
          alt="Community Hero Background"
          className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover select-none filter grayscale-[40%] contrast-110 brightness-90"
        />
        <div className="absolute inset-0 bg-black/5 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />
      </div>

      

      {/* Main Title Content */}
      <motion.div
        style={{ opacity, y: yOffset }}
        className="z-10 flex flex-col items-start max-w-7xl my-auto"
      >
        <h1 className="text-[clamp(2.5rem,8vw,8rem)] font-thin tracking-tighter leading-[0.95] text-white uppercase font-sans break-words w-full drop-shadow-2xl">
          CREATIVE PEOPLE, TOGETHER.
        </h1>
        <p className="text-[11px] md:text-xs tracking-[0.3em] text-neutral-300 font-light uppercase max-w-2xl mt-8 leading-relaxed drop-shadow">
          SIKRICK Community brings together emerging and established creatives through collaboration, experimentation and shared creative culture.
        </p>
      </motion.div>

      
    </section>
  );
}



/* ==========================================
   SECTION 3: COMMUNITY CATEGORIES (TEXT ONLY)
   ========================================== */
function CommunityCategoriesGrid() {
  const categories = [
    {
      num: "01",
      title: "EVENTS",
      desc: "Bringing creative people together through conversations, gatherings and experiences.",
    },
    {
      num: "02",
      title: "COLLABORATIONS",
      desc: "Connecting artists and brands to create new ideas and possibilities.",
    },
    {
      num: "03",
      title: "PROJECTS",
      desc: "Independent creative projects developed beyond commercial work.",
    },
    {
      num: "04",
      title: "PEOPLE",
      desc: "Discovering and supporting the next generation of creative talent.",
    },
  ];

  return (
    <section className="w-full bg-black py-12 md:py-24 px-6 md:px-12 lg:px-24 border-b border-neutral-900">
     

      {/* Clean Text Grid */}
      <div className="max-w-7xl mx-auto flex flex-col divide-y divide-neutral-900 border-t border-b border-neutral-900">
        {categories.map((item, idx) => (
          <div
            key={idx}
            className="group grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 py-8 md:py-12 items-baseline transition-colors duration-500 hover:bg-neutral-950/60 px-4 md:px-8"
          >
            {/* Number Index */}
            <div className="md:col-span-2 font-mono text-[10px] md:text-xs tracking-[0.3em] text-neutral-600 group-hover:text-white transition-colors uppercase">
              // {item.num}
            </div>

            {/* Title */}
            <div className="md:col-span-5">
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
   MAIN ROOT EXPORT
   ========================================== */
export default function Community() {
  return (
    <main className="bg-black text-white overflow-x-hidden selection:bg-white selection:text-black antialiased">
      <CommunityHero />
      
      <CommunityCategoriesGrid />
    </main>
  );
}
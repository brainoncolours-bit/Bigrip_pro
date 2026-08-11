import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ==========================================
   SECTION 1: AGENCY HERO
   ========================================== */
function AgencyHero() {
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
        <iframe
          src={`https://www.youtube.com/embed/${defaultYoutubeId}?autoplay=1&mute=1&loop=1&playlist=${defaultYoutubeId}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&playsinline=1`}
          title="Agency Hero Background"
          className="absolute top-1/2 left-1/2 w-[150%] h-[150%] sm:w-[130%] sm:h-[130%] -translate-x-1/2 -translate-y-1/2 object-cover select-none filter grayscale contrast-125 brightness-75"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
        <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />
      </div>

      
      {/* Main Title Content */}
      <motion.div
        style={{ opacity, y: yOffset }}
        className="z-10 flex flex-col items-start max-w-7xl my-auto"
      >
        <h1 className="text-[clamp(2.5rem,8vw,8rem)] font-thin tracking-tighter leading-[0.95] text-white uppercase font-sans break-words w-full drop-shadow-2xl">
          IDEAS BEFORE EXECUTION.
        </h1>
        <p className="text-[11px] md:text-xs tracking-[0.3em] text-neutral-300 font-light uppercase max-w-2xl mt-8 leading-relaxed drop-shadow">
          We develop creative concepts and visual worlds that give brands a distinct point of view.
        </p>
      </motion.div>

    </section>
  );
}


/* ==========================================
   SECTION 3: AGENCY CATEGORIES (TEXT ONLY)
   ========================================== */
function AgencyCategoriesGrid() {
  const categories = [
    {
      num: "01",
      title: "CREATIVE DIRECTION",
      desc: "Defining the visual language, tone and creative direction of a project.",
    },
    {
      num: "02",
      title: "CAMPAIGN CONCEPTS",
      desc: "Building ideas and concepts that become campaigns people remember.",
    },
    {
      num: "03",
      title: "BRAND FILMS",
      desc: "Visual stories designed to communicate what a brand stands for.",
    },
    {
      num: "04",
      title: "VISUAL IDENTITY",
      desc: "Creating a consistent visual world across campaigns and content.",
    },
    {
      num: "05",
      title: "DIGITAL & SOCIAL",
      desc: "Creative formats and visual content designed for contemporary platforms.",
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
export default function Agency() {
  return (
    <main className="bg-black text-white overflow-x-hidden selection:bg-white selection:text-black antialiased">
      <AgencyHero />
     
      <AgencyCategoriesGrid />
    </main>
  );
}
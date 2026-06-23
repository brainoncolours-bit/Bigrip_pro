import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

/* ============================================================
   DESIGN TOKENS (mirrors home page brand)
   ============================================================ */
// bg:      #0a0a0a
// accent:  #ff3d1a
// ink:     #f5f5f0
// muted:   #f5f5f0 @ 40–60%
// grain, vignette, marquee, aura = same system as home

/* ============================================================
   WORKS DATA
   ============================================================ */
const WORKS = [
  {
    id: "01",
    title: "Shell Construction",
    category: "Material Study",
    year: "FW26",
    tag: "Featured",
    size: "large",          // large | medium | small
    accent: true,
    desc: "A deep investigation into mid-poly panel bonding — where synthetic meets structure.",
    details: ["Bonded seams", "Laminate shell", "Weatherproof finish"],
    color: "from-[#1a0a05] via-[#0f0a08] to-[#0a0a0a]",
  },
  {
    id: "02",
    title: "Hardware Detail",
    category: "Component Study",
    year: "FW26",
    tag: "Close-up",
    size: "medium",
    accent: false,
    desc: "Heavy-gauge zinc alloy pull tabs — mechanical poetry under tension.",
    details: ["Zinc alloy", "Field-rated", "Zero slop"],
    color: "from-[#06090f] via-[#080a10] to-[#0a0a0a]",
  },
  {
    id: "03",
    title: "Back Panel Yoke",
    category: "Structural Layout",
    year: "FW26",
    tag: "Engineering",
    size: "medium",
    accent: false,
    desc: "Articulated rear geometry — full range of motion across every axis.",
    details: ["Articulated yoke", "4-way stretch", "Heat transfer print"],
    color: "from-[#08050f] via-[#090810] to-[#0a0a0a]",
  },
  {
    id: "04",
    title: "Cuff & Seal System",
    category: "Closure Tech",
    year: "FW26",
    tag: "Detail",
    size: "large",
    accent: false,
    desc: "Dual-lock cuff strap — wind and debris stopped at the wrist.",
    details: ["Dual-lock tab", "Taped interior", "Self-gripping strap"],
    color: "from-[#0a0805] via-[#0a0a08] to-[#0a0a0a]",
  },
  {
    id: "05",
    title: "Insulation Core",
    category: "Thermal Study",
    year: "FW25",
    tag: "Archive",
    size: "small",
    accent: false,
    desc: "PrimaLoft Gold lofting at depth — warmth without mass.",
    details: ["PrimaLoft Gold", "650g fill", "Baffled channels"],
    color: "from-[#0a0a0a] via-[#0d0808] to-[#0a0a0a]",
  },
  {
    id: "06",
    title: "Hood Architecture",
    category: "Form Study",
    year: "FW25",
    tag: "Archive",
    size: "small",
    accent: false,
    desc: "Helmet-compatible volume — three-axis adjustment without compromise.",
    details: ["Three-point adjust", "Helmet compat.", "Wired peak"],
    color: "from-[#050a0a] via-[#080c0f] to-[#0a0a0a]",
  },
  {
    id: "07",
    title: "Pocket System",
    category: "Utility Study",
    year: "FW25",
    tag: "Archive",
    size: "small",
    accent: false,
    desc: "Six discrete zones — harness-accessible, helmet-pocket aligned.",
    details: ["6 pockets", "Harness compat.", "YKK AquaGuard"],
    color: "from-[#0a0a05] via-[#0a0a08] to-[#0a0a0a]",
  },
];

/* ============================================================
   SHARED UTILS
   ============================================================ */
function Eyebrow({ children, delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      className="flex items-center gap-2.5 mb-5"
      initial={{ opacity: 0, x: -14 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <motion.span
        className="h-px bg-[#ff3d1a]"
        initial={{ width: 0 }}
        animate={isInView ? { width: 20 } : {}}
        transition={{ duration: 0.4, delay: delay + 0.1 }}
        style={{ display: "block" }}
      />
      <span className="text-[10px] tracking-[0.38em] uppercase text-[#ff3d1a] font-semibold">{children}</span>
    </motion.div>
  );
}

/* ============================================================
   HERO SECTION
   ============================================================ */
function HeroMarquee() {
  const words = "WORKS  ·  FW26  ·  ROCK JACKET  ·  TERRAIN  ·  CONSTRUCTION  ·  MATERIAL  ·  ";
  const content = words.repeat(6);
  return (
    <div className="w-full overflow-hidden whitespace-nowrap leading-none select-none pointer-events-none">
      <div
        className="inline-block font-black uppercase"
        style={{
          fontSize: "clamp(1rem,2.2vw,1.8rem)",
          letterSpacing: "0.22em",
          color: "transparent",
          WebkitTextStroke: "1px rgba(245,245,240,0.18)",
          animation: "marqueeLeft 60s linear infinite",
        }}
      >
        {content}
      </div>
    </div>
  );
}

/* Big background WORKS text that parallaxes */
function HeroBgText() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.4], ["0%", "12%"]);
  const op = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
      style={{ y, opacity: op }}
    >
      <span
        className="font-black uppercase leading-none"
        style={{
          fontSize: "clamp(10rem,28vw,26rem)",
          letterSpacing: "-0.06em",
          color: "transparent",
          WebkitTextStroke: "1px rgba(255,61,26,0.12)",
        }}
      >
        WORKS
      </span>
    </motion.div>
  );
}

function HeroSection() {
  const { scrollYProgress } = useScroll();
  const heroOp = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.96]);

  /* Stagger mount */
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 80); return () => clearTimeout(t); }, []);

  return (
    <section className="relative w-full h-screen min-h-[640px] bg-[#0a0a0a] overflow-hidden flex flex-col">
      {/* ── Background layer ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* ember auras */}
        <div className="absolute" style={{ width:"90vw",height:"90vw",borderRadius:"50%",background:"radial-gradient(circle,rgba(255,61,26,0.13) 0%,rgba(255,61,26,0.04) 45%,transparent 70%)",bottom:"-35vw",left:"50%",transform:"translateX(-50%)",filter:"blur(40px)",animation:"auraPulse1 7s ease-in-out infinite" }}/>
        <div className="absolute" style={{ width:"45vw",height:"45vw",borderRadius:"50%",background:"radial-gradient(circle,rgba(255,80,20,0.10) 0%,transparent 65%)",top:"-8vw",right:"-6vw",filter:"blur(28px)",animation:"auraPulse2 9s ease-in-out infinite 1.5s" }}/>
        <div className="absolute" style={{ width:"35vw",height:"35vw",borderRadius:"50%",background:"radial-gradient(circle,rgba(255,61,26,0.09) 0%,transparent 65%)",top:"30%",left:"-5vw",filter:"blur(22px)",animation:"auraPulse3 8s ease-in-out infinite 0.8s" }}/>
        {/* scan lines */}
        {[18,45,72].map((y,i)=>(
          <div key={i} className="absolute w-full" style={{ top:`${y}%`,height:"1px",background:`linear-gradient(90deg,transparent 0%,rgba(255,61,26,${0.14+i*0.05}) 50%,transparent 100%)`,animation:`scanPulse ${4+i}s ease-in-out infinite`,animationDelay:`${i*1.1}s` }}/>
        ))}
        {/* grain */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage:"repeating-linear-gradient(0deg,#fff 0px,#fff 1px,transparent 1px,transparent 3px)" }}/>
        <svg className="absolute inset-0 w-full h-full opacity-[0.05] mix-blend-overlay"><filter id="gh"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#gh)"/></svg>
        {/* vignette */}
        <div className="absolute inset-0" style={{ background:"radial-gradient(ellipse at center,transparent 28%,rgba(10,10,10,0.88) 100%)" }}/>
      </div>

      {/* ── Big bg WORKS word ── */}
      <HeroBgText />

      {/* ── Top bar ── */}
      <motion.div
        className="relative z-20 flex justify-between items-center px-6 md:px-12 pt-6 md:pt-8"
        initial={{ opacity: 0, y: -12 }}
        animate={mounted ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <a href="/" className="text-xs tracking-[0.32em] uppercase text-[#f5f5f0]/50 hover:text-[#ff3d1a] transition-colors duration-200 font-medium">← Rock Jacket</a>
        <span className="text-xs tracking-[0.32em] uppercase text-[#ff3d1a] font-semibold">{WORKS.length.toString().padStart(2,"0")} Projects</span>
      </motion.div>

      {/* ── Main headline ── */}
      <motion.div
        className="relative z-20 flex-1 flex flex-col justify-center px-6 md:px-12 pb-8"
        style={{ opacity: heroOp, scale: heroScale }}
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={mounted ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Eyebrow delay={0.2}>Selected Works</Eyebrow>
        </motion.div>

        <h1 className="font-black uppercase leading-[0.88] text-[#f5f5f0]" style={{ fontSize:"clamp(3.8rem,11vw,10rem)",letterSpacing:"-0.03em" }}>
          <div className="overflow-hidden">
            <motion.span
              className="block"
              initial={{ y: "110%" }}
              animate={mounted ? { y: "0%" } : {}}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              Every
            </motion.span>
          </div>
          <div className="overflow-hidden">
            <motion.span
              className="block text-[#ff3d1a]"
              style={{ textShadow:"0 0 60px rgba(255,61,26,0.4),0 0 120px rgba(255,61,26,0.15)" }}
              initial={{ y: "110%" }}
              animate={mounted ? { y: "0%" } : {}}
              transition={{ duration: 0.9, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
            >
              Detail.
            </motion.span>
          </div>
          <div className="overflow-hidden">
            <motion.span
              className="block"
              initial={{ y: "110%" }}
              animate={mounted ? { y: "0%" } : {}}
              transition={{ duration: 0.9, delay: 0.54, ease: [0.16, 1, 0.3, 1] }}
            >
              Documented.
            </motion.span>
          </div>
        </h1>

        {/* sub + CTA row */}
        <div className="mt-8 md:mt-10 flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-12">
          <motion.p
            className="text-sm md:text-base text-[#f5f5f0]/50 max-w-sm leading-relaxed"
            initial={{ opacity: 0, y: 16 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.75 }}
          >
            Construction studies, material close-ups, and hardware anatomy from FW25–26.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.88 }}
          >
            <a
              href="#works-grid"
              className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-[#f5f5f0] font-bold group"
            >
              <span className="w-10 h-px bg-[#ff3d1a] group-hover:w-16 transition-all duration-400" />
              View all work
            </a>
          </motion.div>
        </div>
      </motion.div>

      {/* ── Bottom marquee strip ── */}
      <motion.div
        className="relative z-20 border-t border-[#f5f5f0]/[0.07] py-3 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={mounted ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 1.1 }}
      >
        <HeroMarquee />
      </motion.div>

      {/* ── CSS animations ── */}
      <style>{`
        @keyframes marqueeLeft{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes auraPulse1{0%,100%{opacity:1;transform:translateX(-50%) scale(1)}50%{opacity:0.55;transform:translateX(-50%) scale(1.1)}}
        @keyframes auraPulse2{0%,100%{opacity:1;transform:scale(1)}55%{opacity:0.5;transform:scale(1.15)}}
        @keyframes auraPulse3{0%,100%{opacity:1}45%{opacity:0.5;transform:scale(1.12)}}
        @keyframes scanPulse{0%,100%{opacity:0.4;transform:scaleX(0.65)}50%{opacity:1;transform:scaleX(1)}}
        @media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
      `}</style>
    </section>
  );
}

/* ============================================================
   PAGE ROOT
   ============================================================ */
export default function Work() {
  return (
    <main className="bg-[#0a0a0a]">
      <HeroSection />
    </main>
  );
}
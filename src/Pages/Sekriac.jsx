import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { supabase } from "../lib/supabaseClient";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ==========================================
   ULTRA-HIGH DENSITY EDITORIAL SERVICES MEDIA
   ========================================== */
const ASSETS = {
  serviceVideo1: "6HBxWrmI8OU", // Narrative Architecture
  serviceVideo2: "9Wd_A8e8TqM", // Chromatic Grading & Finish
  serviceVideo3: "s1x4u5QBbXM", // Fashion & Silhouette Capture
};

const DEFAULT_SERVICES_CONTENT = [
  {
    num: "01",
    title: "VISION DEFINES EVERYTHING",
    desc: "Creative excellence begins with a clear vision. Every decision we make is guided by purpose, originality, and craftsmanship.",
    metrics: [
      "ANAMORPHIC PIPELINES",
      "SPATIAL BLOCKING",
      "16MM / 35MM EMBEDDED ENGINE",
    ],
  },
  {
    num: "02",
    title: "PRECISION IN EVERY DETAIL",
    desc: "Lighting, movement, composition, and sound work together to create immersive cinematic experiences that elevate every story.",
    metrics: [
      "LUT SPECULATION",
      "HIGH-GLOW CONTRAST ISOLATION",
      "REDUCED NOISE COMPRESSION",
    ],
  },
  {
    num: "03",
    title: "BUILT FOR TIMELESS IMPACT",
    desc: "We don't create content for the moment. We create visual experiences designed to inspire, engage, and endure.",
    metrics: [
      "DRAPE/VELOCITY SYNC",
      "TEXTURE RETENTION ENGINE",
      "ASYMMETRIC FRAMING",
    ],
  },
];

const DEFAULT_CTA_CONTENT = {
  title: "READY TO CALIBRATE YOUR SEQUENCES?",
  desc: "Every remarkable film begins with a conversation. Whether you're launching a brand, producing a campaign, or telling a story that matters, we're here to craft visuals with purpose, precision, and lasting impact.",
  buttonLabel: "ENGAGE PRODUCTION ROUTER",
};

/* ==========================================
   PRODUCTION REUSABLE WRAPPERS
   ========================================== */
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
   SERVICES EXPERIMENTAL SECTIONS
   ========================================= */

// SECTION 1: Header Manifesto
function ServicesHero() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const yOffset = useTransform(scrollYProgress, [0, 0.5], ["0px", "-50px"]);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[80vh] bg-black overflow-hidden flex flex-col justify-between p-6 md:p-12 border-b border-neutral-900"
    >
      <motion.div
        style={{ opacity, y: yOffset }}
        className="z-10 flex flex-col items-start max-w-7xl my-auto"
      >
        <h1 className="text-[clamp(2.5rem,8vw,8rem)] font-thin tracking-tighter leading-[0.95] text-white uppercase font-sans break-words w-full">
          WHERE STORIES
          <br />
          TAKE FORM.
        </h1>
        <p className="text-[11px] md:text-xs tracking-[0.3em] text-neutral-400 font-light uppercase max-w-2xl mt-8 leading-relaxed">
          Every brand has something worth sharing. We take the time to understand what makes it unique, then bring it to life through thoughtful ideas, beautiful visuals, and stories people genuinely connect with.

        </p>
      </motion.div>

      
    </section>
  );
}

// SECTION 2: Interactive Service List Matrix (GSAP Scrubbing)
function ServicesMatrixList({ items = [] }) {
  const componentRef = useRef(null);

  return (
    <section
      ref={componentRef}
      className="w-full bg-black py-12 px-6 md:px-12 lg:px-24"
    >
      <div className="max-w-7xl mx-auto flex flex-col">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="group grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 py-16 border-b border-neutral-900 items-start transition-colors duration-500 hover:bg-neutral-950/40 px-2"
          >
            {/* Number Code */}
            <div className="lg:col-span-1 font-mono text-[10px] md:text-xs text-neutral-600 group-hover:text-white transition-colors">
              [{item.num} // GEN_CAP]
            </div>

            {/* Core Details */}
            <div className="lg:col-span-6 flex flex-col space-y-4">
              <h3 className="text-xl md:text-2xl lg:text-3xl font-extralight tracking-tight text-neutral-300 group-hover:text-white transition-colors font-sans">
                {item.title}
              </h3>
              <p className="text-xs md:text-[13px] font-light text-neutral-500 leading-relaxed max-w-xl group-hover:text-neutral-400 transition-colors">
                {item.desc}
              </p>

              {/* Technical Tags */}
              <div className="flex flex-wrap gap-2 pt-2">
                {item.metrics.map((metric, mIdx) => (
                  <span
                    key={mIdx}
                    className="font-mono text-[8px] md:text-[9px] tracking-wider text-neutral-600 border border-neutral-900 group-hover:border-neutral-800 group-hover:text-neutral-400 px-2 py-0.5 rounded-[1px] transition-all"
                  >
                    {metric}
                  </span>
                ))}
              </div>
            </div>

            {/* Micro Video Terminal Preview */}
            <div className="lg:col-span-5 w-full aspect-video lg:aspect-[16/10] bg-neutral-950 border border-neutral-900 overflow-hidden relative shadow-2xl transition-all duration-700 group-hover:border-neutral-700 filter grayscale group-hover:grayscale-0">
              <SaturatedVideo
                mediaUrl={item.videoUrl}
                fallbackVideoId={item.fallbackVideoId}
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500 pointer-events-none" />
              <div className="absolute bottom-2 right-2 font-mono text-[7px] text-neutral-600 group-hover:text-neutral-400 px-1 bg-black/60 backdrop-blur-sm uppercase">
                PREVIEW_{item.num}_LIVE
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// SECTION 3: The Deployment Spec Sheet (Grid Specs)
function TechnicalSpecsTable() {
  return (
    <section className="w-full bg-black py-20 md:py-32 px-6 md:px-12 lg:px-24 border-t border-neutral-900">
      <div className="max-w-5xl mx-auto">
        <span className="text-[10px] md:text-xs font-mono tracking-[0.5em] text-neutral-500 block mb-8">
          [03 // ACQUISITION PARAMETERS]
        </span>
        <h2 className="text-2xl font-extralight tracking-tighter text-white uppercase mb-12 font-sans">
          READY TO BRING YOUR VISION TO LIFE?
        </h2>

        <div className="w-full overflow-x-auto border border-neutral-950">
          <table className="w-full text-left border-collapse font-mono text-[10px] md:text-xs text-neutral-400">
            <thead>
              <tr className="border-b border-neutral-900 text-neutral-500">
                <th className="py-4 px-2 uppercase tracking-widest font-normal">
                  MODULE SYSTEM
                </th>
                <th className="py-4 px-2 uppercase tracking-widest font-normal">
                  NATIVE ENGINE
                </th>
                <th className="py-4 px-2 uppercase tracking-widest font-normal">
                  OUTPUT STATE
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900">
              <tr className="hover:text-white transition-colors">
                <td className="py-4 px-2 text-neutral-300">
                  RAW Capture Platform
                </td>
                <td className="py-4 px-2">
                  ARRI Alexa Mini LF / RED V-Raptor XL
                </td>
                <td className="py-4 px-2">ProRes 4444 XQ / 8K REDCODE RAW</td>
              </tr>
              <tr className="hover:text-white transition-colors">
                <td className="py-4 px-2 text-neutral-300">Optics Mapping</td>
                <td className="py-4 px-2">
                  Cooke Anamorphic / Tribe7 Blackwing7
                </td>
                <td className="py-4 px-2">
                  Custom Spatial Distortion Profiles
                </td>
              </tr>
              <tr className="hover:text-white transition-colors">
                <td className="py-4 px-2 text-neutral-300">Color Framework</td>
                <td className="py-4 px-2">
                  ACES workflow / DaVinci Resolve Studio
                </td>
                <td className="py-4 px-2">Rec.2026 / P3 D65 Master Matrices</td>
              </tr>
              <tr className="hover:text-white transition-colors">
                <td className="py-4 px-2 text-neutral-300">
                  Spatial Mastering
                </td>
                <td className="py-4 px-2">
                  Dolby Atmos Spatial Mixing Engines
                </td>
                <td className="py-4 px-2">
                  24-bit Linear PCM Broadcast Stream
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}


/* ==========================================
   MAIN SERVICES PAGE COMPONENT EXPORT
   ========================================== */
export default function Services() {
  const [videos, setVideos] = useState({});
  const [serviceItems, setServiceItems] = useState(DEFAULT_SERVICES_CONTENT);
  const [ctaContent, setCtaContent] = useState(DEFAULT_CTA_CONTENT);

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
        .from("services_videos")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true });

      if (data) {
        const map = {};
        const itemMap = {};
        let cta = DEFAULT_CTA_CONTENT;
        data.forEach((v) => {
          map[v.section_key] = v.media_url;
          if (v.section_key === "services_cta") {
            cta = {
              title: v.title || DEFAULT_CTA_CONTENT.title,
              desc: v.description || DEFAULT_CTA_CONTENT.desc,
              buttonLabel:
                v.button_label || DEFAULT_CTA_CONTENT.buttonLabel,
            };
          } else if (v.title) {
            itemMap[v.section_key] = v;
          }
        });
        setVideos(map);
        setCtaContent(cta);
        if (Object.keys(itemMap).length > 0) {
          setServiceItems(
            DEFAULT_SERVICES_CONTENT.map((defaultItem, idx) => {
              const row = itemMap[`service_${idx + 1}`];
              return {
                num: defaultItem.num,
                title: row?.title || defaultItem.title,
                desc: row?.description || defaultItem.desc,
                metrics:
                  Array.isArray(row?.metrics) && row.metrics.length > 0
                    ? row.metrics
                    : defaultItem.metrics,
              };
            }),
          );
        }
      }
    }
    loadVideos();
  }, []);

  return (
    <div className="bg-black text-white overflow-x-hidden selection:bg-white selection:text-black antialiased">
      <ServicesHero />
      <ServicesMatrixList
        items={serviceItems.map((item, idx) => ({
          ...item,
          videoUrl: videos[`service_${idx + 1}`],
          fallbackVideoId: ASSETS[`serviceVideo${idx + 1}`],
        }))}
      />
      <TechnicalSpecsTable />
     
    </div>
  );
}

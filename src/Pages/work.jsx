import { useRef, useState, useEffect, Suspense, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { supabase } from "../lib/supabaseClient";

/* ============================================================
   DESIGN TOKENS (Art Partner Inspired High-Luxury Palette)
   ============================================================ */
// Primary BG:     #FFFFFF (Crisp Studio White)
// Text Primary:   #000000 (Pure Black)
// Muted Accent:   #767676 / #8E8E8E (Editorial Gray)
// Grid Fills:     #EAEAEA / #B5B5B5 (Structural Solids)

// Curated open editorial imagery matching the black-and-white fashion style from Screenshot 2026-07-03 at 11.34.37.jpg
const FALLBACK_ASSETS = [
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80", // High Fashion Studio
  "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80", // Editorial Product Spatial
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80", // Minimalist Garment
  "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=80"  // Couture Portrait
];

function mapWorkRow(row, index) {
  return {
    id: row.display_id || String(index + 1).padStart(2, "0"),
    title: row.title || (index === 0 ? "PHOTOGRAPHERS" : index === 1 ? "STYLISTS" : index === 2 ? "DIRECTORS" : "GUEST DIRECTORS"),
    category: row.category || "Creative Direction",
    year: row.year || "2026",
    tag: row.tag || "Campaign",
    mediaType: row.media_type || "image",
    mediaUrl: row.media_url || FALLBACK_ASSETS[index % FALLBACK_ASSETS.length],
    desc: row.desc || "Commercial production overview and spatial execution details aligned with high-fashion client rosters.",
  };
}

/* ============================================================
   3D COMPONENT (Interactive Specimen Layer)
   ============================================================ */
function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}
function easeOutBack(t, overshoot = 1.4) {
  const c1 = overshoot;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

const FINAL_SIZE = 1.6;

function RockModel({ onSettled }) {
  const group = useRef(null);
  const { scene } = useGLTF("/rock.glb");
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  const normalizedScale = useMemo(() => {
    const box = new THREE.Box3().setFromObject(clonedScene);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);
    clonedScene.position.sub(center);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    return FINAL_SIZE / maxDim;
  }, [clonedScene]);

  const startTime = useRef(null);
  const settled = useRef(false);
  const RISE_DURATION = 2.0;
  const START_Y = -6.5;
  const END_Y = 0.2; 
  const SPIN_TURNS = 1.8;
  const START_SCALE = normalizedScale * 0.72;
  const END_SCALE = normalizedScale * 1.0;

  const mouse = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const handleMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, []);

  useFrame((state, delta) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    if (startTime.current === null) startTime.current = t;
    const elapsed = t - startTime.current;
    const progress = Math.min(elapsed / RISE_DURATION, 1);

    if (progress < 1) {
      const posT = easeOutExpo(progress);
      const scaleT = easeOutBack(Math.min(progress * 1.15, 1));
      group.current.position.y = START_Y + (END_Y - START_Y) * posT;
      group.current.scale.setScalar(START_SCALE + (END_SCALE - START_SCALE) * scaleT);
      const spinT = easeOutExpo(progress);
      group.current.rotation.y = spinT * Math.PI * 2 * SPIN_TURNS;
      group.current.rotation.x = (1 - progress) * 0.6;
      group.current.rotation.z = Math.sin(progress * Math.PI) * 0.18;
    } else {
      if (!settled.current) {
        settled.current = true;
        onSettled && onSettled();
      }
      const idle = Math.sin(t * 0.4) * 0.04;
      group.current.position.y = END_Y + idle;
      group.current.rotation.y += delta * 0.08;
      const targetX = mouse.current.y * 0.1;
      const targetZ = -mouse.current.x * 0.1;
      group.current.rotation.x += (targetX - group.current.rotation.x) * 0.04;
      group.current.rotation.z += (targetZ - group.current.rotation.z) * 0.04;
      group.current.scale.setScalar(END_SCALE);
    }
  });

  return (
    <group ref={group} position={[0, START_Y, 0]} scale={START_SCALE}>
      <primitive object={clonedScene} />
    </group>
  );
}

function RockScene({ onSettled }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 7.5], fov: 32 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <ambientLight intensity={0.9} color="#ffffff" />
      <directionalLight position={[2, 8, 4]} intensity={1.4} color="#ffffff" />
      <Suspense fallback={null}>
        <RockModel onSettled={onSettled} />
      </Suspense>
    </Canvas>
  );
}

/* ============================================================
   NAVIGATION HEADER
   ============================================================ */
function Header() {
  return (
    <header className="w-full bg-white px-6 py-6 md:px-12 flex justify-between items-center border-b border-[#F4F4F2] sticky top-0 z-50">
      <a href="/" className="font-serif font-normal text-3xl md:text-4xl tracking-tight text-black lowercase select-none">
        SECKRICK 
      </a>
      
    
    </header>
  );
}

/* ============================================================
   HERO INTRO SECTION
   ============================================================ */
function HeroSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <section className="relative w-full h-[55vh] bg-white text-black px-6 md:px-12 flex flex-col justify-center overflow-hidden border-b border-[#EAEAEA]">
      <div className="w-full max-w-4xl z-10">
        <span className="text-[11px] tracking-[0.3em] uppercase text-[#8E8E8E] mb-4 block font-sans font-semibold">
          Global Representation Archive
        </span>
        <h1 className="font-serif font-normal tracking-tight text-[8vw] md:text-[5vw] leading-[1.1] text-black">
          Representing the world’s leading <br />photographers & image makers.
        </h1>
      </div>

      <div className="absolute right-0 top-0 bottom-0 left-0 md:left-[45%] z-0 pointer-events-none mix-blend-darken opacity-90">
        {mounted && <RockScene onSettled={() => {}} />}
      </div>
    </section>
  );
}

/* ============================================================
   NEW SECTION: EDITORIAL FEATURES CAROUSEL (Google / Unsplash Assets)
   ============================================================ */
function FeaturesCarousel() {
  const customFeatures = [
    { title: "PARIS ARCHIVE", label: "Couture Autumn/Winter", img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80" },
    { title: "NEW FORM", label: "Spatial Minimalism", img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80" },
    { title: "MONOCHROME", label: "Studio Castings", img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80" },
    { title: "RAW EDITS", label: "Pre-Fall Campaigns", img: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=800&q=80" }
  ];

  return (
    <section id="features-carousel" className="w-full bg-white py-16 px-6 md:px-12 border-b border-[#EAEAEA]">
      <div className="w-full flex justify-between items-end border-b border-[#EAEAEA] pb-4 mb-10 text-[11px] tracking-[0.2em] text-[#767676] uppercase font-sans">
        <div className="font-medium text-black">IN FOCUS / LATEST RELEASES</div>
        <div>VOLUME II</div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {customFeatures.map((item, idx) => (
          <div key={idx} className="group cursor-pointer flex flex-col">
            <div className="w-full aspect-[4/5] overflow-hidden bg-[#F4F4F2] mb-3">
              <img 
                src={item.img} 
                alt={item.title} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.02] transition-all duration-500 ease-out"
              />
            </div>
            <div className="flex flex-col font-sans">
              <span className="text-[12px] font-bold tracking-[0.15em] text-black uppercase">{item.title}</span>
              <span className="text-[11px] text-[#8E8E8E] tracking-normal mt-0.5">{item.label}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   WORKS CATALOGUE (Bold 2-Column Text Overlay Grid)
   ============================================================ */
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
          className="fixed inset-0 z-[100] flex items-center justify-center bg-white p-6 md:p-12 overflow-y-auto"
        >
          <button type="button" className="absolute inset-0 cursor-zoom-out" onClick={onClose} aria-label="Close" />
          
          <div className="relative z-10 w-full max-w-7xl h-full flex flex-col md:flex-row justify-between gap-12 pointer-events-none pt-12 md:pt-0">
            <div className="flex-1 h-full flex items-center justify-center pointer-events-auto">
              <div className="w-full max-h-[85vh] flex items-center justify-center">
                {work.mediaType === "video" ? (
                  <video className="max-h-[85vh] w-full object-contain bg-[#F4F4F2]" src={work.mediaUrl} controls autoPlay playsInline />
                ) : (
                  <img className="max-h-[85vh] w-full object-contain bg-[#F4F4F2]" src={work.mediaUrl} alt={work.title} />
                )}
              </div>
            </div>

            <div className="w-full md:w-[380px] h-full flex flex-col justify-between pointer-events-auto border-t md:border-t-0 md:border-l border-[#EAEAEA] pt-6 md:pt-0 md:pl-10 text-black">
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-8">
                  <span className="text-[11px] tracking-[0.2em] text-[#767676] uppercase font-sans font-medium">ROSTER {work.id}</span>
                  <button type="button" className="text-[11px] tracking-[0.2em] font-semibold uppercase border-b border-black pb-0.5" onClick={onClose}>
                    CLOSE OVERLAY
                  </button>
                </div>

                <h3 className="text-3xl font-serif font-normal tracking-wide text-black mb-3">{work.title}</h3>
                <p className="text-[11px] tracking-[0.2em] text-[#8E8E8E] uppercase font-sans mb-6">{work.category}</p>
                <hr className="border-[#EAEAEA] my-4" />
                <p className="text-[13px] leading-relaxed text-[#767676] mb-8 font-sans">{work.desc}</p>
              </div>

              <div className="pt-8 md:pt-0">
                <button onClick={onClose} className="w-full bg-black text-white text-[11px] font-semibold tracking-[0.25em] py-5 uppercase transition-colors hover:bg-[#1c1c1c]">
                  RETURN TO ROSTER
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function WorkCard({ work, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => work.mediaUrl && onOpen(work)}
      className={`relative w-full aspect-[4/3] md:aspect-[16/10] overflow-hidden bg-[#B5B5B5] group flex items-center justify-center transition-all duration-300 ${
        work.mediaUrl ? "cursor-pointer" : "cursor-default"
      }`}
    >
      {work.mediaUrl && (
        work.mediaType === "video" ? (
          <video className="absolute inset-0 h-full w-full object-cover grayscale opacity-90 transition-all duration-750 group-hover:scale-[1.02] group-hover:grayscale-0" src={work.mediaUrl} autoPlay muted loop playsInline />
        ) : (
          <img className="absolute inset-0 h-full w-full object-cover grayscale opacity-90 transition-all duration-750 group-hover:scale-[1.02] group-hover:grayscale-0" src={work.mediaUrl} alt={work.title} loading="lazy" />
        )
      )}

      <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-colors duration-500" />

      {/* Heavy Centered Typography Overlay mirroring Screenshot 2026-07-03 at 11.34.37.jpg */}
      <div className="relative z-10 text-center p-4">
        <h2 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-sans font-bold tracking-[0.25em] uppercase transition-transform duration-500 group-hover:scale-[1.03]">
          {work.title}
        </h2>
      </div>
    </button>
  );
}

function WorksGridSection({ works, loading, error }) {
  const [activeWork, setActiveWork] = useState(null);

  return (
    <section id="production-catalogue" className="relative w-full bg-white">
      {loading && (
        <div className="text-[12px] tracking-widest text-[#767676] text-center py-40 font-sans uppercase">
          Synchronizing Roster Collection...
        </div>
      )}

      {!loading && !error && works.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px] bg-[#EAEAEA] border-b border-[#EAEAEA]">
          {works.map((work, i) => (
            <WorkCard key={`${work.id}-${i}`} work={work} onOpen={setActiveWork} />
          ))}
        </div>
      )}

      <MediaViewer work={activeWork} onClose={() => setActiveWork(null)} />
    </section>
  );
}

/* ============================================================
   NEW SECTION: SPLIT-SCREEN MANIFESTO EDITORIAL
   ============================================================ */
function StudioManifesto() {
  return (
    <section id="manifesto" className="w-full bg-white py-20 px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center border-b border-[#EAEAEA]">
      <div className="h-[50vh] bg-[#F4F4F2] overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=1200&q=80" 
          alt="Studio Atelier" 
          className="w-full h-full object-cover grayscale"
        />
      </div>
      <div className="flex flex-col justify-center max-w-lg">
        <span className="text-[11px] tracking-[0.3em] uppercase text-[#8E8E8E] mb-4 block font-sans font-semibold">
          OUR MISSION
        </span>
        <h2 className="font-serif font-normal text-3xl md:text-4xl leading-tight mb-6 text-black">
          Definitive visual communication and global strategy.
        </h2>
        <p className="text-[13px] text-[#767676] font-sans leading-relaxed mb-6">
          Operating dynamic studios in critical cultural centers, we coordinate cross-platform digital and print campaigns with artists who prioritize architectural thought, luxury clarity, and progressive composition rules.
        </p>
        <div>
          <a href="#" className="text-[11px] font-bold tracking-[0.2em] uppercase border-b border-black pb-1 hover:text-[#767676] hover:border-[#767676] transition-colors font-sans">
            READ STATEMENT &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   PAGE ROOT
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
        // Fallback directly to populate Screenshot 2026-07-03 at 11.34.37.jpg categories seamlessly
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
    <main className="bg-white min-h-screen text-black antialiased selection:bg-black selection:text-white">
      <Header />
      <HeroSection />
      <FeaturesCarousel />
      <WorksGridSection works={works} loading={loading} error={error} />
      <StudioManifesto />
    </main>
  );
}
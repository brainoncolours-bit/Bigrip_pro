import { useRef, useState, useEffect, Suspense, useMemo } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { supabase } from "../lib/supabaseClient";

/* ============================================================
   DESIGN TOKENS (mirrors home page brand)
   ============================================================ */
// bg:      #0a0a0a
// accent:  #ff3d1a
// ink:     #f5f5f0
// muted:   #f5f5f0 @ 40–60%
// grain, vignette, marquee, aura = same system as home

function mapWorkRow(row, index) {
  return {
    id: row.display_id || String(index + 1).padStart(2, "0"),
    title: row.title,
    category: row.category,
    year: row.year,
    tag: row.tag,
    size: row.size,
    accent: row.accent,
    mediaType: row.media_type,
    mediaUrl: row.media_url,
    desc: row.desc,
    details: row.details || [],
    color: row.color,
  };
}

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
   3D ROCK — model, rise+spin animation, settle
   ============================================================ */

/**
 * Easing: strong ease-out so the rock decelerates hard near center,
 * like it's "locking" into place (matches reference screenshots).
 */
function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}
function easeOutBack(t, overshoot = 1.4) {
  const c1 = overshoot;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

// Target size (in world units) the rock's largest dimension should be
// once centered at origin, with camera at z=8.5, fov=32. Tweak FINAL_SIZE
// to make the rock bigger/smaller on screen — independent of the GLB's
// original export units (meters, cm, arbitrary, etc).
const FINAL_SIZE = 1.5;

function RockModel({ onSettled }) {
  const group = useRef(null);
  const { scene } = useGLTF("/rock.glb");

  // Clone so we don't mutate the cached/shared GLTF scene
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  // Auto-fit: measure the model's real bounding box, recenter it on its
  // own pivot, and compute a normalizing scale so FINAL_SIZE is always
  // respected on screen regardless of the GLB's native unit scale.
  const normalizedScale = useMemo(() => {
    const box = new THREE.Box3().setFromObject(clonedScene);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);

    // Recenter geometry so rotation happens around the rock's own middle,
    // not wherever its pivot happened to be authored in the original file.
    clonedScene.position.sub(center);

    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    return FINAL_SIZE / maxDim;
  }, [clonedScene]);

  const startTime = useRef(null);
  const settled = useRef(false);
  // Tunables — adjust to taste
  const RISE_DURATION = 2.0; // seconds for the rise+spin
  const START_Y = -6.5; // below the screen
  const END_Y = 1.1; // resting position — raised above headline text
  const SPIN_TURNS = 2.4; // full rotations during rise
  const START_SCALE = normalizedScale * 0.72;
  const END_SCALE = normalizedScale * 1.0;

  // gentle idle bobbing + mouse parallax after settle
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
      // RISE PHASE
      const posT = easeOutExpo(progress);
      const scaleT = easeOutBack(Math.min(progress * 1.15, 1));

      group.current.position.y = START_Y + (END_Y - START_Y) * posT;
      group.current.scale.setScalar(
        START_SCALE + (END_SCALE - START_SCALE) * scaleT
      );

      // Spin fast early, slow to a stop near the end (ease-out on rotation too)
      const spinT = easeOutExpo(progress);
      group.current.rotation.y = spinT * Math.PI * 2 * SPIN_TURNS;
      group.current.rotation.x = (1 - progress) * 0.6;
      group.current.rotation.z = Math.sin(progress * Math.PI) * 0.18;
    } else {
      // SETTLED PHASE
      if (!settled.current) {
        settled.current = true;
        onSettled && onSettled();
      }
      // idle float
      const idle = Math.sin(t * 0.6) * 0.08;
      group.current.position.y = END_Y + idle;

      // continuous self-rotation that never stops, like a tumbling asteroid
      group.current.rotation.y += delta * 0.16;

      // subtle parallax tilt toward mouse
      const targetX = mouse.current.y * 0.15;
      const targetZ = -mouse.current.x * 0.15;
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

useGLTF.preload("/rock.glb");

/* ============================================================
   STAR FIELD — layered particle systems for depth, plus a warm
   drifting dust layer. Each layer is a single simple <points>
   system positioned directly in front of the camera, so nothing
   ever produces a hard edge or gets clipped behind the camera.
   ============================================================ */
function StarLayer({ count, spread, zNear, zFar, size, color, opacity, driftSpeed = 1 }) {
  const ref = useRef(null);

  // Base positions plus a per-particle phase/speed/amplitude so each one
  // floats independently instead of the whole field spinning as one rigid disc.
  const { positions, basePositions, phases } = useMemo(() => {
    const base = new Float32Array(count * 3);
    const ph = new Float32Array(count * 3); // [phaseX, phaseY, ampScale] per particle
    for (let i = 0; i < count; i++) {
      base[i * 3] = (Math.random() - 0.5) * spread;
      base[i * 3 + 1] = (Math.random() - 0.5) * spread;
      base[i * 3 + 2] = zNear - Math.random() * (zFar - zNear);
      ph[i * 3] = Math.random() * Math.PI * 2; // phase offset X
      ph[i * 3 + 1] = Math.random() * Math.PI * 2; // phase offset Y
      ph[i * 3 + 2] = 0.4 + Math.random() * 0.8; // per-particle speed/amplitude multiplier
    }
    return { positions: base.slice(), basePositions: base, phases: ph };
  }, [count, spread, zNear, zFar]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime() * driftSpeed;
    const posAttr = ref.current.geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const mult = phases[i3 + 2];
      // gentle continuous floating drift, independent per particle —
      // small sine/cosine wander around each particle's base position
      posAttr.array[i3] = basePositions[i3] + Math.sin(t * mult + phases[i3]) * 0.6;
      posAttr.array[i3 + 1] = basePositions[i3 + 1] + Math.cos(t * mult * 0.8 + phases[i3 + 1]) * 0.6;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={opacity}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function StarField() {
  return (
    <>
      {/* far, dense, tiny — the bulk of the star field */}
      <StarLayer count={3200} spread={42} zNear={-3} zFar={28} size={0.032} color="#ffffff" opacity={0.7} driftSpeed={0.12} />
      {/* near, sparse, bigger — closer stars for parallax depth */}
      <StarLayer count={500} spread={26} zNear={-1} zFar={12} size={0.07} color="#ffffff" opacity={0.9} driftSpeed={0.22} />
      {/* warm reddish dust drifting through, ties into the nebula glow */}
      <StarLayer count={900} spread={30} zNear={-2} zFar={18} size={0.05} color="#ff8a5c" opacity={0.45} driftSpeed={0.18} />
    </>
  );
}

/* ============================================================
   BACKGROUND ASTEROIDS — small procedural rocks (low-poly,
   displaced icosahedrons) tumbling slowly at varying depths,
   so the scene reads as a real asteroid field, not one rock
   floating alone. Purely generated geometry — no extra assets.
   ============================================================ */
function MiniAsteroid({ position, scale, speed, tilt, seed }) {
  const ref = useRef(null);

  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1, 1);
    const posAttr = geo.attributes.position;
    // simple deterministic pseudo-random displacement per vertex,
    // seeded so each asteroid has a stable, unique craggy shape
    let s = seed;
    const rand = () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
    for (let i = 0; i < posAttr.count; i++) {
      const v = new THREE.Vector3(
        posAttr.getX(i),
        posAttr.getY(i),
        posAttr.getZ(i)
      );
      const n = v.clone().normalize();
      const bump = 0.78 + rand() * 0.36;
      v.copy(n.multiplyScalar(bump));
      posAttr.setXYZ(i, v.x, v.y, v.z);
    }
    geo.computeVertexNormals();
    return geo;
  }, [seed]);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * speed * 0.6;
    ref.current.rotation.y += delta * speed;
  });

  return (
    <mesh ref={ref} position={position} scale={scale} rotation={[tilt, tilt * 0.6, 0]} geometry={geometry}>
      <meshStandardMaterial color="#3a332e" roughness={0.95} metalness={0.05} />
    </mesh>
  );
}

function BackgroundAsteroids() {
  // hand-placed so they sit clearly away from the hero rock and headline,
  // scattered at different depths/sizes for parallax + scale variety
  const rocks = useMemo(
    () => [
      { position: [-6.2, 2.4, -9], scale: 0.55, speed: 0.12, tilt: 0.4, seed: 17 },
      { position: [6.8, 1.2, -7], scale: 0.4, speed: 0.18, tilt: 1.1, seed: 42 },
      { position: [-5.5, -2.6, -6], scale: 0.32, speed: 0.22, tilt: 2.0, seed: 8 },
      { position: [7.5, -1.8, -11], scale: 0.65, speed: 0.09, tilt: 0.8, seed: 73 },
      { position: [-8.5, 0.2, -13], scale: 0.45, speed: 0.14, tilt: 1.6, seed: 29 },
      { position: [4.2, 3.4, -14], scale: 0.3, speed: 0.2, tilt: 0.3, seed: 55 },
    ],
    []
  );

  return (
    <>
      {rocks.map((r, i) => (
        <MiniAsteroid key={i} {...r} />
      ))}
    </>
  );
}

/* Thin circular orbit ring around the asteroid, like the reference.
   Sized relative to FINAL_SIZE and tilted slightly so it reads as an
   orbital ellipse centered on the asteroid's resting position. */
function OrbitRing() {
  const ref = useRef(null);
  const radius = FINAL_SIZE * 1.7;
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = state.clock.getElapsedTime() * 0.025;
    }
  });
  return (
    <mesh ref={ref} position={[0, 1.1, 0]} rotation={[1.45, 0, 0]}>
      <ringGeometry args={[radius, radius + 0.015, 128]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.14} side={THREE.DoubleSide} />
    </mesh>
  );
}

/* Adjusts camera FOV based on viewport aspect ratio so the rock keeps a
   consistent visual size — narrow/tall mobile screens get a wider FOV
   to compensate for the cropped horizontal frustum. */
function ResponsiveCamera() {
  const { camera, size } = useThree();
  useEffect(() => {
    const aspect = size.width / size.height;
    let fov = 32;
    if (aspect < 0.6) fov = 46; // tall narrow phones
    else if (aspect < 0.85) fov = 40; // phones
    else if (aspect < 1.2) fov = 36; // tablets / square-ish
    camera.fov = fov;
    camera.updateProjectionMatrix();
  }, [size, camera]);
  return null;
}

function RockScene({ onSettled }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 8.5], fov: 32 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <ResponsiveCamera />
      <ambientLight intensity={0.5} color="#ffb89e" />
      <directionalLight position={[3, 4, 5]} intensity={1.0} color="#ffe0d0" />
      <directionalLight position={[-4, -1, -3]} intensity={0.4} color="#ff3d1a" />

      <StarField />
      <BackgroundAsteroids />

      <Suspense fallback={null}>
        <RockModel onSettled={onSettled} />
        <OrbitRing />
      </Suspense>
    </Canvas>
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

function HeroSection({ projectCount = 0 }) {
  const { scrollYProgress } = useScroll();
  const heroOp = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.96]);

  /* Stagger mount */
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  /* Text only appears once the rock has settled into place */
  const [rockSettled, setRockSettled] = useState(false);

  return (
    <section className="relative w-full h-screen min-h-[640px] bg-[#0a0a0a] overflow-hidden flex flex-col" style={{ height: "100dvh", minHeight: "640px" }}>
      {/* ── Background layer ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* central nebula glow — sits right behind the asteroid, pure CSS
            so it can never produce a hard geometric edge like a WebGL plane would */}
        <div className="absolute" style={{ width:"70vw",height:"70vw",maxWidth:"900px",maxHeight:"900px",borderRadius:"50%",background:"radial-gradient(circle,rgba(180,40,18,0.35) 0%,rgba(120,25,12,0.18) 35%,rgba(80,15,8,0.08) 60%,transparent 80%)",top:"38%",left:"50%",transform:"translate(-50%,-50%)",filter:"blur(20px)" }}/>
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

      {/* ── 3D Rock layer — shifted up so it sits clear of the headline below ── */}
      <motion.div
        className="absolute inset-0 z-10"
        style={{ opacity: heroOp, scale: heroScale, transform: "translateY(-8%)" }}
      >
        {mounted && <RockScene onSettled={() => setRockSettled(true)} />}
      </motion.div>

      {/* ── Top bar ── */}
      <motion.div
        className="relative z-20 flex justify-between items-center px-6 md:px-12 pt-6 md:pt-8"
        initial={{ opacity: 0, y: -12 }}
        animate={mounted ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <a href="/" className="text-xs tracking-[0.32em] uppercase text-[#f5f5f0]/50 hover:text-[#ff3d1a] transition-colors duration-200 font-medium">← Rock Jacket</a>
        <span className="text-xs tracking-[0.32em] uppercase text-[#ff3d1a] font-semibold">{projectCount.toString().padStart(2,"0")} Projects</span>
      </motion.div>

      {/* ── Main headline (gated behind rock settling) ── */}
      <motion.div
        className="relative z-20 flex-1 flex flex-col justify-end items-center px-6 md:px-12 pb-16 md:pb-20 text-center"
        style={{ opacity: heroOp, scale: heroScale }}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={rockSettled ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Eyebrow delay={0.1}>Selected Works</Eyebrow>
        </motion.div>

        <h1
          className="font-black uppercase leading-[0.88] text-[#f5f5f0]"
          style={{ fontSize: "clamp(3.2rem,9vw,8rem)", letterSpacing: "-0.03em" }}
        >
          <div className="overflow-hidden">
            <motion.span
              className="block"
              initial={{ y: "110%" }}
              animate={rockSettled ? { y: "0%" } : {}}
              transition={{ duration: 0.9, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            >
              Every
            </motion.span>
          </div>
          <div className="overflow-hidden">
            <motion.span
              className="block text-[#ff3d1a]"
              style={{ textShadow: "0 0 60px rgba(255,61,26,0.4),0 0 120px rgba(255,61,26,0.15)" }}
              initial={{ y: "110%" }}
              animate={rockSettled ? { y: "0%" } : {}}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              Detail.
            </motion.span>
          </div>
          <div className="overflow-hidden">
            <motion.span
              className="block"
              initial={{ y: "110%" }}
              animate={rockSettled ? { y: "0%" } : {}}
              transition={{ duration: 0.9, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
            >
              Documented.
            </motion.span>
          </div>
        </h1>

        {/* sub + CTA row */}
        <div className="mt-8 md:mt-10 flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-12 justify-center">
          <motion.p
            className="text-sm md:text-base text-[#f5f5f0]/50 max-w-sm leading-relaxed"
            initial={{ opacity: 0, y: 16 }}
            animate={rockSettled ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            Construction studies, material close-ups, and hardware anatomy from FW25–26.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={rockSettled ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.72 }}
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
   WORKS GRID — masonry-style gallery of project cards. Media
   areas are placeholders until the admin dashboard is wired up
   to upload real images/video per item.
   ============================================================ */

/* Visual placeholder for a card's media slot. Distinguishes image vs
   video intent so it's obvious what kind of file the admin should
   eventually upload here. Pure CSS/SVG — no external assets needed. */
function MediaPlaceholder({ mediaType, color }) {
  return (
    <div
      className={`absolute inset-0 bg-gradient-to-br ${color} flex items-center justify-center`}
    >
      {/* faint diagonal hatch so the placeholder doesn't read as a real photo */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #f5f5f0 0px, #f5f5f0 1px, transparent 1px, transparent 14px)",
        }}
      />
      <div className="relative z-10 flex flex-col items-center gap-3 text-[#f5f5f0]/35">
        {mediaType === "video" ? (
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
            <rect x="2.5" y="5" width="14" height="14" rx="2" />
            <path d="M21.5 8.2v7.6l-5-2.8v-2l5-2.8z" fill="currentColor" stroke="none" />
          </svg>
        ) : (
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
            <rect x="2.5" y="3.5" width="19" height="17" rx="2" />
            <circle cx="8.5" cy="9.5" r="1.6" />
            <path d="M21.5 16l-5.5-5.5-3.5 3.5-2.5-2.5L2.5 18" />
          </svg>
        )}
        <span className="text-[9px] tracking-[0.28em] uppercase font-semibold">
          {mediaType === "video" ? "Video pending" : "Image pending"}
        </span>
      </div>
    </div>
  );
}

function WorkCard({ work, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const spanClasses =
    work.size === "large"
      ? "md:col-span-2 md:row-span-2 aspect-[4/3] md:aspect-auto"
      : work.size === "medium"
      ? "md:col-span-1 md:row-span-2 aspect-[4/3] md:aspect-auto"
      : "md:col-span-1 md:row-span-1 aspect-[4/3]";

  return (
    <motion.a
      ref={ref}
      href={`#work-${work.id}`}
      className={`group relative block overflow-hidden rounded-sm border border-[#f5f5f0]/[0.08] ${spanClasses}`}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: (index % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      {work.mediaUrl ? (
        work.mediaType === "video" ? (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={work.mediaUrl}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src={work.mediaUrl}
            alt={work.title}
            loading="lazy"
          />
        )
      ) : (
        <MediaPlaceholder mediaType={work.mediaType} color={work.color} />
      )}

      {/* top row: id + tag */}
      <div className="absolute top-0 inset-x-0 z-10 flex items-center justify-between p-4 md:p-5">
        <span className="text-[10px] tracking-[0.28em] uppercase text-[#f5f5f0]/45 font-semibold">
          {work.id}
        </span>
        <span
          className={`text-[10px] tracking-[0.24em] uppercase font-bold px-2 py-1 rounded-sm ${
            work.accent
              ? "bg-[#ff3d1a] text-[#0a0a0a]"
              : "bg-[#f5f5f0]/[0.08] text-[#f5f5f0]/70"
          }`}
        >
          {work.tag}
        </span>
      </div>

      {/* gradient for text legibility */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/70 to-transparent z-10" />

      {/* bottom content */}
      <div className="absolute bottom-0 inset-x-0 z-20 p-4 md:p-5">
        <div className="flex items-center gap-2 mb-2 text-[10px] tracking-[0.24em] uppercase text-[#ff3d1a]/90 font-semibold">
          <span>{work.category}</span>
          <span className="text-[#f5f5f0]/30">·</span>
          <span className="text-[#f5f5f0]/50">{work.year}</span>
        </div>
        <h3 className="text-xl md:text-2xl font-black uppercase leading-tight text-[#f5f5f0] tracking-tight">
          {work.title}
        </h3>

        {/* reveal on hover: description + spec chips */}
        <div className="overflow-hidden">
          <div className="max-h-0 group-hover:max-h-32 transition-all duration-400 ease-out">
            <p className="text-sm text-[#f5f5f0]/55 mt-2 leading-relaxed pr-2">
              {work.desc}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {work.details.map((d) => (
                <span
                  key={d}
                  className="text-[10px] tracking-[0.1em] uppercase text-[#f5f5f0]/60 border border-[#f5f5f0]/15 rounded-sm px-2 py-1"
                >
                  {d}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* corner accent on hover */}
      <div className="absolute top-4 right-4 md:top-5 md:right-5 z-20 w-7 h-7 rounded-full border border-[#f5f5f0]/20 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f5f5f0" strokeWidth="2">
          <path d="M7 17L17 7M7 7h10v10" />
        </svg>
      </div>
    </motion.a>
  );
}

function WorksGridSection({ works, loading, error }) {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  return (
    <section id="works-grid" className="relative w-full bg-[#0a0a0a] py-24 md:py-32 px-6 md:px-12 overflow-hidden">
      {/* faint ambient glow, consistent with hero's red atmosphere but quieter */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: "60vw",
          height: "60vw",
          maxWidth: "700px",
          maxHeight: "700px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(255,61,26,0.06) 0%,transparent 70%)",
          top: "-10%",
          right: "-15%",
          filter: "blur(40px)",
        }}
      />

      <div ref={headerRef} className="relative z-10 max-w-3xl mb-12 md:mb-16">
        <motion.div
          initial={{ opacity: 0, x: -14 }}
          animate={headerInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Eyebrow>The Archive</Eyebrow>
        </motion.div>
        <motion.h2
          className="font-black uppercase leading-[0.95] text-[#f5f5f0]"
          style={{ fontSize: "clamp(2.2rem,5vw,4rem)", letterSpacing: "-0.02em" }}
          initial={{ opacity: 0, y: 16 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          Construction, close up.
        </motion.h2>
        <motion.p
          className="text-sm md:text-base text-[#f5f5f0]/50 mt-4 max-w-xl leading-relaxed"
          initial={{ opacity: 0, y: 12 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.18 }}
        >
          Every panel, seam, and hardware detail — documented as it's built.
          Media for each entry is uploaded and managed from the studio dashboard.
        </motion.p>
      </div>

      {loading && (
        <div className="relative z-10 text-sm uppercase tracking-[0.24em] text-[#f5f5f0]/45">
          Loading works...
        </div>
      )}

      {!loading && error && (
        <div className="relative z-10 border border-[#ff3d1a]/30 bg-[#ff3d1a]/10 px-5 py-4 text-sm text-[#f5f5f0]/70">
          Could not load works right now. Please try again later.
        </div>
      )}

      {!loading && !error && works.length === 0 && (
        <div className="relative z-10 border border-[#f5f5f0]/10 px-5 py-4 text-sm text-[#f5f5f0]/55">
          No published work items yet.
        </div>
      )}

      {!loading && !error && works.length > 0 && (
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 auto-rows-[260px] gap-3 md:gap-4">
          {works.map((work, i) => (
            <WorkCard key={`${work.id}-${i}`} work={work} index={i} />
          ))}
        </div>
      )}
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
      const { data, error: fetchError } = await supabase
        .from("works")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });

      if (!mounted) return;

      if (fetchError) {
        setError(fetchError);
        setWorks([]);
      } else {
        setError(null);
        setWorks((data || []).map(mapWorkRow));
      }

      setLoading(false);
    }

    loadWorks();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="bg-[#0a0a0a]">
      <HeroSection projectCount={works.length} />
      <WorksGridSection works={works} loading={loading} error={error} />
    </main>
  );
}

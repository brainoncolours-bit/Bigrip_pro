import { useRef, useState, useMemo, useEffect, Suspense, Component } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment, ContactShadows } from "@react-three/drei";
import gsap from "gsap";
import * as THREE from "three";

/* -------------------------------------------------------------------------- */
/*  MODEL SCALE                                                               */
/*  Your exported .glb's real-world size is unknown until tested live.        */
/*  Tune THIS ONE number first if the jacket looks too big/small/close.       */
/*  Try 0.6 → 0.4 → 0.25 etc. Camera stops above assume a roughly             */
/*  human-torso-sized result after scaling.                                  */
/* -------------------------------------------------------------------------- */
const MODEL_SCALE = 0.6;

/* -------------------------------------------------------------------------- */
/*  CAMERA KEYFRAMES                                                          */
/*  Each stop = a position + lookAt + fov the camera animates through on      */
/*  click. textAnchor is where the floating spec label sits in 3D space,     */
/*  near (not on top of) the part being shown. Edit freely.                  */
/* -------------------------------------------------------------------------- */
const CAMERA_STOPS = [
  {
    id: "intro",
    position: [0, 1.5, 6.5],
    lookAt: [0, 1.0, 0],
    textAnchor: [1.6, 1.5, 1.2],
    fov: 38,
    label: "ROCK JACKET",
    spec: "Mid-poly tactical shell — built for the long haul.",
  },
  {
    id: "orbit-left",
    position: [-4.2, 1.4, 4.4],
    lookAt: [0, 1.0, 0],
    textAnchor: [-1.8, 1.6, 1.0],
    fov: 36,
    label: "SHELL",
    spec: "Reinforced panel construction across the torso and shoulders.",
  },
  {
    id: "zipper-detail",
    position: [-1.0, 1.3, 2.0],
    lookAt: [-0.2, 1.1, 0.3],
    textAnchor: [0.9, 1.2, 0.6],
    fov: 28,
    label: "HARDWARE",
    spec: "Heavy-gauge zip pulls, rated for repeated field use.",
  },
  {
    id: "back",
    position: [0.5, 1.6, -5.5],
    lookAt: [0, 1.0, 0],
    textAnchor: [1.5, 1.7, -1.0],
    fov: 36,
    label: "BACK PANEL",
    spec: "Articulated rear yoke for full range of motion.",
  },
  {
    id: "cuff-detail",
    position: [2.4, 0.7, 1.4],
    lookAt: [1.6, 0.6, 0.6],
    textAnchor: [0.5, 1.0, 0.6],
    fov: 26,
    label: "CUFF",
    spec: "Adjustable cuff straps lock out wind and debris.",
  },
  {
    id: "hero-rest",
    position: [0, 1.3, 6.0],
    lookAt: [0, 1.0, 0],
    textAnchor: [1.7, 1.4, 1.0],
    fov: 34,
    label: "New Style // ROCK JACKET",
    spec: "Engineered for the terrain that breaks everything else.",
  },
];

/* -------------------------------------------------------------------------- */
/*  MARQUEE BACKGROUND                                                       */
/*  Tiled rows of brand type scrolling behind a transparent canvas, like a   */
/*  product-drop microsite. Center row is the accent (solid, bold, biggest); */
/*  outer rows fade smaller/dimmer for depth. Pure CSS — no extra deps.      */
/* -------------------------------------------------------------------------- */
const MARQUEE_ROWS = [
  { text: "FW26", size: "4.5rem", rowOpacity: 0.07, duration: 85, dir: 1, accent: false },
  { text: "TERRAIN", size: "6.5rem", rowOpacity: 0.13, duration: 62, dir: -1, accent: false },
  { text: "Rockstar", size: "10rem", rowOpacity: 1, duration: 42, dir: 1, accent: true },
  { text: "ROCK JACKET", size: "6.5rem", rowOpacity: 0.13, duration: 62, dir: -1, accent: false },
  { text: "FW26", size: "4.5rem", rowOpacity: 0.07, duration: 85, dir: 1, accent: false },
];

function MarqueeRow({ text, size, rowOpacity, duration, dir, accent }) {
  // Repeated an even number of times so a -50% translate loops seamlessly.
  const content = `${text}  •  `.repeat(14);

  return (
    <div className="w-full overflow-hidden whitespace-nowrap leading-none">
      <div
        className="marquee-row-anim inline-block font-black uppercase select-none"
        style={{
          fontSize: size,
          letterSpacing: "-0.02em",
          opacity: rowOpacity,
          color: accent ? "rgba(255,76,29,0.88)" : "transparent",
          WebkitTextStroke: accent ? "0px transparent" : "1px rgba(245,245,240,0.45)",
          animation: `${dir > 0 ? "marqueeLeft" : "marqueeRight"} ${duration}s linear infinite`,
          willChange: "transform",
        }}
      >
        {content}
      </div>
    </div>
  );
}

function MarqueeBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[#0a0a0a]">
      <div className="absolute inset-0 flex flex-col justify-evenly">
        {MARQUEE_ROWS.map((row, i) => (
          <MarqueeRow key={i} {...row} />
        ))}
      </div>

      {/* Vignette — keeps focus on the product, fades the type at the edges */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(10,10,10,0.9) 100%)",
        }}
      />

      {/* Faint HUD scanlines — tactical/industrial texture */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 3px)",
        }}
      />

      {/* Film grain — cheap SVG noise, no image asset needed */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.05] mix-blend-overlay">
        <filter id="bigripGrain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#bigripGrain)" />
      </svg>

      <style>{`
        @keyframes marqueeLeft  { from { transform: translateX(0); }    to { transform: translateX(-50%); } }
        @keyframes marqueeRight { from { transform: translateX(-50%); } to { transform: translateX(0); } }

        @media (prefers-reduced-motion: reduce) {
          .marquee-row-anim { animation: none !important; }
        }
      `}</style>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  PARTICLES — drifting ember/dust field for a bold industrial atmosphere    */
/* -------------------------------------------------------------------------- */
function EmberParticles({ count = 220 }) {
  const points = useRef();

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = Math.random() * 8 - 1;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 14;
      spd[i] = 0.15 + Math.random() * 0.35;
    }
    return [pos, spd];
  }, [count]);

  useFrame((_, delta) => {
    const arr = points.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += speeds[i] * delta;
      if (arr[i * 3 + 1] > 7) arr[i * 3 + 1] = -1;
    }
    points.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#ff3d1a"
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/* -------------------------------------------------------------------------- */
/*  LABEL TRACKER (the bug fix)                                              */
/*  Lives inside the Canvas so it can read the live camera. Every frame it   */
/*  projects the current stop's textAnchor into screen space and writes the */
/*  result straight onto a DOM node via a ref (no React re-render, no jank). */
/*  Two things specifically fix the "text disappears off-screen" bug:        */
/*   1) Behind-camera correction — projecting a point that's briefly behind  */
/*      the camera mid-transition flips its sign, which used to send the     */
/*      label flying to a nonsense position. We detect that (vec.z > 1) and  */
/*      mirror it back.                                                      */
/*   2) Hard clamping — the final x/y is always clamped inside the viewport  */
/*      with a margin, so the label can slide near an edge but never leave   */
/*      it, no matter how the camera moves.                                  */
/* -------------------------------------------------------------------------- */
function LabelTracker({ stopIndex, labelRef }) {
  const { camera } = useThree();
  const vec = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const stop = CAMERA_STOPS[stopIndex];
    const el = labelRef.current;
    if (!stop || !el) return;

    vec.set(stop.textAnchor[0], stop.textAnchor[1], stop.textAnchor[2]);
    vec.project(camera);

    const behindCamera = vec.z > 1;
    const nx = behindCamera ? -vec.x : vec.x;
    const ny = behindCamera ? -vec.y : vec.y;

    const w = window.innerWidth;
    const h = window.innerHeight;
    const labelW = 280;
    const labelH = 140;
    const margin = 20;

    let x = (nx * 0.5 + 0.5) * w;
    let y = (-ny * 0.5 + 0.5) * h;

    x = Math.min(Math.max(x, margin), w - margin - labelW);
    y = Math.min(Math.max(y, margin), h - margin - labelH);

    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  });

  return null;
}

/* -------------------------------------------------------------------------- */
/*  SPEC LABEL — plain DOM element, positioned imperatively by LabelTracker. */
/*  key={stop.id} on the inner div replays the blur/fade-in whenever the     */
/*  active stop changes.                                                    */
/* -------------------------------------------------------------------------- */
function SpecLabel({ stop, labelRef }) {
  return (
    <div
      ref={labelRef}
      className="absolute top-0 left-0 z-20 pointer-events-none will-change-transform"
    >
      <div
        key={stop.id}
        className="w-[280px] select-none animate-[specIn_0.7s_cubic-bezier(0.16,1,0.3,1)]"
      >
        <div className="flex items-center gap-2 mb-1.5">
          <span className="h-px w-6 bg-[#ff3d1a]" />
          <span className="text-[10px] tracking-[0.35em] uppercase text-[#ff3d1a] font-semibold">
            Detail
          </span>
        </div>
        <h3
          className="text-2xl md:text-3xl font-black uppercase leading-[0.95] text-[#f5f5f0] drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]"
          style={{ letterSpacing: "-0.01em" }}
        >
          {stop.label}
        </h3>
        <p className="mt-2 text-[13px] leading-snug text-[#f5f5f0]/75 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
          {stop.spec}
        </p>
      </div>

      <style>{`
        @keyframes specIn {
          from { opacity: 0; filter: blur(4px); transform: translateY(10px); }
          to { opacity: 1; filter: blur(0); transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  JACKET MODEL                                                              */
/*  Swap in real model via /rock_jacket_mid-poly.glb (already in /public).    */
/*  Falls back to a placeholder torso-like shape if the file isn't found,     */
/*  so the scene never breaks during development.                            */
/* -------------------------------------------------------------------------- */
function JacketModel() {
  const group = useRef();

  const { scene } = useGLTF("/rock_jacket_mid-poly.glb");

  return (
    <group ref={group} position={[0, 0, 0]} scale={MODEL_SCALE}>
      <primitive object={scene} />
    </group>
  );
}

function PlaceholderJacket() {
  return (
    <group position={[0, 0.9, 0]}>
      <mesh castShadow>
        <capsuleGeometry args={[0.55, 1.1, 8, 16]} />
        <meshStandardMaterial color="#1c1c1c" roughness={0.6} metalness={0.2} />
      </mesh>
      <mesh position={[-0.78, 0.25, 0]} rotation={[0, 0, 0.25]} castShadow>
        <capsuleGeometry args={[0.16, 0.7, 8, 16]} />
        <meshStandardMaterial color="#1c1c1c" roughness={0.6} metalness={0.2} />
      </mesh>
      <mesh position={[0.78, 0.25, 0]} rotation={[0, 0, -0.25]} castShadow>
        <capsuleGeometry args={[0.16, 0.7, 8, 16]} />
        <meshStandardMaterial color="#1c1c1c" roughness={0.6} metalness={0.2} />
      </mesh>
      <mesh position={[0, -0.05, 0.42]}>
        <boxGeometry args={[0.04, 1.3, 0.02]} />
        <meshStandardMaterial color="#ff3d1a" roughness={0.3} metalness={0.6} />
      </mesh>
    </group>
  );
}

/**
 * Tries to render the real GLB. If it errors (file not present yet in this
 * dev environment), shows the placeholder instead — swap is automatic once
 * the real file resolves at /rock_jacket_mid-poly.glb.
 */
function JacketWithFallback() {
  const [failed, setFailed] = useState(false);

  if (failed) return <PlaceholderJacket />;

  return (
    <ModelErrorBoundary onError={() => setFailed(true)}>
      <Suspense fallback={null}>
        <JacketModel />
      </Suspense>
    </ModelErrorBoundary>
  );
}

class ModelErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch() {
    this.props.onError?.();
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

/* -------------------------------------------------------------------------- */
/*  CAMERA RIG — animates through CAMERA_STOPS via GSAP, plus a subtle idle   */
/*  bob layered on top so the scene never feels frozen between clicks.       */
/*  GSAP tweens lightweight target refs (not camera.position directly) so    */
/*  the idle motion and the tween never fight each other.                    */
/* -------------------------------------------------------------------------- */
function CameraRig({ stopIndex }) {
  const { camera } = useThree();
  const lookAtVec = useRef(new THREE.Vector3(0, 0.9, 0));
  const targetPos = useRef(new THREE.Vector3(...CAMERA_STOPS[0].position));
  const targetFov = useRef({ current: CAMERA_STOPS[0].fov });
  const clock = useRef(0);

  const reduceMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
    []
  );

  useFrame((_, delta) => {
    clock.current += delta;
    const bob = reduceMotion ? 0 : 1;

    camera.position.set(
      targetPos.current.x + Math.sin(clock.current * 0.45) * 0.025 * bob,
      targetPos.current.y + Math.sin(clock.current * 0.6 + 1.3) * 0.02 * bob,
      targetPos.current.z
    );
    camera.fov = targetFov.current.current;
    camera.updateProjectionMatrix();
    camera.lookAt(lookAtVec.current);
  });

  useEffect(() => {
    const target = CAMERA_STOPS[stopIndex];
    if (!target) return;

    gsap.to(targetPos.current, {
      x: target.position[0],
      y: target.position[1],
      z: target.position[2],
      duration: 1.6,
      ease: "power3.inOut",
    });
    gsap.to(targetFov.current, {
      current: target.fov,
      duration: 1.6,
      ease: "power3.inOut",
    });
    gsap.to(lookAtVec.current, {
      x: target.lookAt[0],
      y: target.lookAt[1],
      z: target.lookAt[2],
      duration: 1.6,
      ease: "power3.inOut",
    });
  }, [stopIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}

/* -------------------------------------------------------------------------- */
/*  MAIN EXPORTED SCENE                                                       */
/* -------------------------------------------------------------------------- */
export default function JacketScene() {
  const [playing, setPlaying] = useState(false);
  const [stopIndex, setStopIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const labelRef = useRef(null);

  const current = CAMERA_STOPS[stopIndex];

  const handleExplore = () => {
    if (playing) return;
    setPlaying(true);

    // Build a master timeline that steps stopIndex forward through every
    // camera stop, holding briefly at each so the spec text is readable.
    let i = 0;
    const tl = gsap.timeline({
      onComplete: () => {
        setPlaying(false);
        setFinished(true);
      },
    });

    CAMERA_STOPS.forEach((_, idx) => {
      if (idx === 0) return; // already at stop 0
      tl.call(() => setStopIndex(idx), null, i * 2.2 + 1.6);
      i++;
    });
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0a0a0a]">
      {/* Animated brand-text background, visible through the transparent canvas */}
      <MarqueeBackground />

      <Canvas
        shadows
        gl={{ alpha: true, antialias: true }}
        camera={{ position: CAMERA_STOPS[0].position, fov: CAMERA_STOPS[0].fov }}
        className="absolute inset-0 z-10"
        style={{ background: "transparent" }}
      >
        <fog attach="fog" args={["#0a0a0a", 6, 16]} />

        <ambientLight intensity={0.25} />
        <directionalLight
          position={[3, 5, 2]}
          intensity={1.4}
          color="#ffffff"
          castShadow
        />
        <pointLight position={[-3, 1.5, -2]} intensity={6} color="#ff3d1a" />
        <pointLight position={[2, 0.5, 2]} intensity={2} color="#ffffff" />

        <JacketWithFallback />
        <EmberParticles />

        <ContactShadows
          position={[0, -0.6, 0]}
          opacity={0.55}
          scale={8}
          blur={2.4}
          far={3}
        />

        <Environment preset="city" />

        <CameraRig stopIndex={stopIndex} />
        <LabelTracker stopIndex={stopIndex} labelRef={labelRef} />
      </Canvas>

      <SpecLabel stop={current} labelRef={labelRef} />

      {/* ---------------------------------------------------------------- */}
      {/*  UI OVERLAY                                                       */}
      {/* ---------------------------------------------------------------- */}
      <div className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-between p-6 md:p-12">
        {/* Top label */}
        <div className="flex justify-between items-start">
          <span className="text-xs md:text-sm tracking-[0.3em] text-[#f5f5f0]/60 font-medium uppercase">
            Rock Jacket // FW26
          </span>
          <span className="text-xs md:text-sm tracking-[0.3em] text-[#ff3d1a] font-semibold uppercase">
            {String(stopIndex + 1).padStart(2, "0")} / {String(CAMERA_STOPS.length).padStart(2, "0")}
          </span>
        </div>

        {/* Bottom CTA */}
        <div className="flex justify-end">
          {!playing && !finished && stopIndex === 0 && (
            <button
              onClick={handleExplore}
              className="pointer-events-auto group relative px-8 py-4 bg-[#ff3d1a] text-[#0a0a0a] font-bold uppercase tracking-[0.15em] text-sm overflow-hidden transition-all hover:scale-[1.03] active:scale-[0.98] hover:shadow-[0_0_30px_rgba(255,61,26,0.5)]"
            >
              <span className="relative z-10">Explore the Jacket</span>
            </button>
          )}

          {playing && (
            <div className="pointer-events-none text-xs uppercase tracking-[0.3em] text-[#f5f5f0]/50">
              Exploring…
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
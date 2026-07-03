import { useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

export default function MultiSectionContactPage() {
  const [form, setForm] = useState({ name: "", email: "", agency: "", timeline: "", criteria: "" });
  const [isTransmitted, setIsTransmitted] = useState(false);

  // Scroll Tracking for Smooth Parallax Transitions
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacityDim = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const handleDispatch = (e) => {
    e.preventDefault();
    setIsTransmitted(true);
  };

  return (
    <main className="bg-black text-white min-h-screen selection:bg-white selection:text-black antialiased font-sans overflow-x-hidden">
      
      {/* GLOBAL SYSTEM OVERLAY NAVIGATION */}
     

      {/* ==========================================
         SECTION 01: FULL-BLEED KINETIC BANNER 
         ========================================== */}
      <section ref={heroRef} className="relative w-full h-screen flex items-end justify-start p-6 md:p-12 overflow-hidden border-b border-neutral-900">
        
        {/* Absolute Background Video Scaling Layer */}
        <motion.div style={{ scale: videoScale }} className="absolute inset-0 w-full h-full pointer-events-none select-none">
          <div className="absolute inset-0 bg-neutral-950/40 z-10 mix-blend-multiply" />
          <iframe
            src="https://www.youtube.com/embed/szdbKz5CyhA?autoplay=1&mute=1&loop=1&playlist=szdbKz5CyhA&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1"
            title="Structural Context Loop"
            className="absolute top-1/2 left-1/2 w-[180%] h-[180%] md:w-[130%] md:h-[130%] -translate-x-1/2 -translate-y-1/2 object-cover grayscale contrast-[1.12]"
            allow="autoplay; encrypted-media"
          />
        </motion.div>

        {/* Scanline Mesh Texture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_96%,rgba(255,255,255,0.02)_96%)] bg-[size:100%_18px] pointer-events-none z-10 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent pointer-events-none z-10" />

        {/* Typography Content Layer */}
        <motion.div style={{ y: textY, opacity: opacityDim }} className="z-20 max-w-5xl relative pb-8">
          <span className="font-mono text-[9px] tracking-[0.5em] text-neutral-400 block mb-4">[ SEC-01 // ENTRY EXPANSION ]</span>
          <h1 className="text-[clamp(2.5rem,8vw,8.5rem)] font-extralight uppercase tracking-tighter leading-[0.9] text-white">
            Initiate <br /> Correspondence
          </h1>
          <div className="mt-8 font-mono text-[9px] tracking-widest text-neutral-500 uppercase animate-pulse">
            [ SCROLL DOWN TO EXPOSE DATA MESH ]
          </div>
        </motion.div>
      </section>


      {/* ==========================================
         SECTION 02: THE CENTRAL INPUT METRICS 
         ========================================== */}
      <section className="w-full bg-black border-b border-neutral-900 px-6 md:px-12 py-24 md:py-36 relative">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-7xl mx-auto items-start">
          
          {/* Section Indicator Sidebar */}
          <div className="col-span-12 lg:col-span-4 lg:sticky lg:top-28 flex flex-col space-y-4">
            <span className="font-mono text-[10px] tracking-[0.4em] text-neutral-500 uppercase">[ SEC-02 // INTAKE PORT ]</span>
            <h2 className="text-2xl md:text-3xl font-light uppercase tracking-tight text-white leading-tight">
              Operational <br />Parameters
            </h2>
            <p className="font-sans font-extralight text-neutral-500 text-sm max-w-xs leading-relaxed">
              Complete the serialization arrays below to sync your project footprint with our asset architecture.
            </p>
          </div>

          {/* Core Interactive Grid Form Block */}
          <div className="col-span-12 lg:col-span-8">
            <AnimatePresence mode="wait">
              {!isTransmitted ? (
                <motion.form 
                  key="form-matrix"
                  onSubmit={handleDispatch} 
                  className="w-full flex flex-col space-y-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  
                  {/* Field 1 */}
                  <div className="flex flex-col border-b border-neutral-900 pb-3 group relative">
                    <span className="font-mono text-[9px] tracking-[0.3em] text-neutral-500 uppercase mb-1 group-focus-within:text-white transition-colors">01 // Agent Call Sign</span>
                    <input 
                      type="text" required placeholder="Individual Name or Venture Node"
                      value={form.name} onChange={(e) => setForm({...form, name: e.target.value})}
                      className="bg-transparent border-0 p-0 text-lg font-light text-white placeholder-neutral-800 focus:ring-0 focus:outline-none w-full"
                    />
                  </div>

                  {/* Field 2 */}
                  <div className="flex flex-col border-b border-neutral-900 pb-3 group relative">
                    <span className="font-mono text-[9px] tracking-[0.3em] text-neutral-500 uppercase mb-1 group-focus-within:text-white transition-colors">02 // Secure Digital Address</span>
                    <input 
                      type="email" required placeholder="endpoint@network.location"
                      value={form.email} onChange={(e) => setForm({...form, email: e.target.value})}
                      className="bg-transparent border-0 p-0 text-lg font-light text-white placeholder-neutral-800 focus:ring-0 focus:outline-none w-full"
                    />
                  </div>

                  {/* Field 3 */}
                  <div className="flex flex-col border-b border-neutral-900 pb-3 group relative">
                    <span className="font-mono text-[9px] tracking-[0.3em] text-neutral-500 uppercase mb-1 group-focus-within:text-white transition-colors">03 // Intent Alignment</span>
                    <input 
                      type="text" required placeholder="Visual Production / Fine Art Architecture"
                      value={form.agency} onChange={(e) => setForm({...form, agency: e.target.value})}
                      className="bg-transparent border-0 p-0 text-lg font-light text-white placeholder-neutral-800 focus:ring-0 focus:outline-none w-full"
                    />
                  </div>

                  {/* Field 4 */}
                  <div className="flex flex-col border-b border-neutral-900 pb-3 group relative">
                    <span className="font-mono text-[9px] tracking-[0.3em] text-neutral-500 uppercase mb-1 group-focus-within:text-white transition-colors">04 // Timeline Benchmark</span>
                    <input 
                      type="text" required placeholder="Target Launch Window // Q3 2026"
                      value={form.timeline} onChange={(e) => setForm({...form, timeline: e.target.value})}
                      className="bg-transparent border-0 p-0 text-lg font-light text-white placeholder-neutral-800 focus:ring-0 focus:outline-none w-full"
                    />
                  </div>

                  {/* Field 5 (Textarea) */}
                  <div className="flex flex-col border-b border-neutral-900 pb-3 group relative">
                    <span className="font-mono text-[9px] tracking-[0.3em] text-neutral-500 uppercase mb-1 group-focus-within:text-white transition-colors">05 // Structural Criteria</span>
                    <textarea 
                      rows={3} required placeholder="Outline specifications, sizing metrics, or asset counts..."
                      value={form.criteria} onChange={(e) => setForm({...form, criteria: e.target.value})}
                      className="bg-transparent border-0 p-0 text-lg font-light text-white placeholder-neutral-800 focus:ring-0 focus:outline-none w-full resize-none leading-relaxed"
                    />
                  </div>

                  {/* Action Link Control */}
                  <div className="pt-4">
                    <button 
                      type="submit" 
                      className="px-12 py-4 bg-white text-black font-mono text-[10px] tracking-[0.4em] uppercase font-bold hover:bg-neutral-200 transition-colors rounded-[1px] shadow-2xl"
                    >
                      TRANSMIT PAYLOAD DATA
                    </button>
                  </div>

                </motion.form>
              ) : (
                /* Clear Success State */
                <motion.div 
                  key="success-prompt"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col space-y-6 items-start py-6"
                >
                  <div className="font-mono text-[9px] tracking-[0.4em] text-emerald-400 uppercase">[ SYSTEM CONFIRMATION // ACK 200 ]</div>
                  <h3 className="text-3xl font-light uppercase tracking-tighter text-white">Log Complete.</h3>
                  <p className="font-light text-neutral-400 text-base leading-relaxed max-w-md">
                    The serialization block has been appended directly into our network pipeline. Operatives will review parameters and ping your digital node address shortly.
                  </p>
                  <button 
                    onClick={() => setIsTransmitted(false)}
                    className="font-mono text-[9px] tracking-[0.3em] uppercase text-neutral-500 hover:text-white transition-colors border-b border-neutral-800 pb-1"
                  >
                    [ INTRODUCE ALTERNATIVE LOG ]
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </section>


      {/* ==========================================
         SECTION 03: ASYMMETRICAL NETWORKS MATRIX
         ========================================== */}
      <section className="w-full bg-neutral-950/40 px-6 md:px-12 py-24 md:py-32">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 font-mono">
          
          <div className="col-span-12 md:col-span-4 flex flex-col space-y-2">
            <span className="text-[10px] tracking-[0.4em] text-neutral-500 uppercase">[ SEC-03 // INDEX MATRIX ]</span>
            <h3 className="text-sm uppercase tracking-widest font-medium text-white">// CORE INDEX TERMINALS</h3>
          </div>

          {/* Grid column clusters containing structural address arrays */}
          <div className="col-span-12 sm:col-span-6 md:col-span-4 grid grid-cols-1 gap-8 text-[11px] tracking-widest text-neutral-400">
            <div>
              <span className="text-neutral-700 block text-[9px] tracking-[0.3em] uppercase mb-2">[ INTENSIFIED NODES ]</span>
              <p className="hover:text-white transition-colors cursor-pointer">studio@seckrick.archive</p>
              <p className="hover:text-white transition-colors cursor-pointer">pipelines@seckrick.archive</p>
            </div>
            <div>
              <span className="text-neutral-700 block text-[9px] tracking-[0.3em] uppercase mb-2">[ HARD ARCHIVES ]</span>
              <p>42.3601° N, 71.0589° W</p>
              <p>Global Shipments Transit // 2026</p>
            </div>
          </div>

          <div className="col-span-12 sm:col-span-6 md:col-span-4 grid grid-cols-1 gap-4 text-[10px] tracking-widest text-neutral-500">
            <span className="text-neutral-700 block text-[9px] tracking-[0.3em] uppercase mb-1">[ SYSTEM NAVIGATION ]</span>
            <a href="#" className="hover:text-white transition-colors">01 / PLATFORM CORE INTEGRATION</a>
            <a href="#" className="hover:text-white transition-colors">02 / COLOR GAIN CONFIG MATRIX</a>
            <a href="#" className="hover:text-white transition-colors">03 / CONTINUOUS HORIZON STREAM</a>
          </div>

        </div>
      </section>


      {/* ==========================================
         INVARIANT SYSTEM FOOTER BLOCK
         ========================================== */}
      <footer className="w-full border-t border-neutral-900 bg-black py-8 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-[8px] md:text-[9px] tracking-wider text-neutral-600 text-center md:text-left">
        <span>© 2026 ROCKET JACKET LABS. DIGITAL COGNIZANCE SECURED.</span>
        <div className="flex gap-6 md:gap-8">
          <a href="#" className="hover:text-white transition-colors">INSTAGRAM</a>
          <a href="#" className="hover:text-white transition-colors">VIMEO CONTROL</a>
          <a href="#" className="hover:text-white transition-colors">X ARCHIVE</a>
        </div>
      </footer>

    </main>
  );
}
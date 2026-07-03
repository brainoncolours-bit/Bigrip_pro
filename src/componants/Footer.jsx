import React from "react";

export default function MinimalCinemaFooter() {
  return (
    <footer className="w-full bg-black text-white border-t border-zinc-900 pt-24 pb-12 font-sans selection:bg-white selection:text-black">
      <div className="max-w-7xl mx-auto px-8">
        
        {/* Main Interface Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start pb-16 mb-12 border-b border-zinc-900">
          
          {/* Column 1: Studio Profile */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-[10px] font-mono tracking-[0.4em] text-zinc-500">
              <span>// SYSTEM_READY</span>
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
            </div>
            
            <h3 className="text-xl font-extralight tracking-[0.2em] uppercase text-zinc-100">
              KINETIC <span className="font-light text-white font-mono text-sm opacity-40">/ FRAME</span>
            </h3>
            
            <p className="text-xs text-zinc-400 font-light max-w-xs leading-relaxed">
              Boutique production asset management. Crafting high-contrast structural cinematography, commercial optics, and offline editing arrays.
            </p>
          </div>

          {/* Column 2: Static Camera Metadata */}
          <div className="space-y-2 font-mono md:justify-self-center">
            <div className="text-[9px] uppercase tracking-widest text-zinc-600">// CONFIGURATION</div>
            <div className="text-xs font-light tracking-widest text-zinc-400 space-y-1.5">
              <div>CAPTURE // 8K RED RAW</div>
              <div>ASPECT // 2.39:1 ANAMORPHIC</div>
              <div>TIMECODE // 00:00:20:26</div>
            </div>
          </div>

          {/* Column 3: Navigation Directory */}
          <div className="flex flex-col space-y-3 font-mono text-xs tracking-widest text-zinc-400 md:items-end">
            <div className="text-[9px] tracking-widest text-zinc-600 uppercase mb-1">// INDEX</div>
            <a href="#showreel" className="hover:text-white transition-colors duration-200">[ CINEMATIC_REEL ]</a>
            <a href="#narratives" className="hover:text-white transition-colors duration-200">[ ARCHIVED_WORKS ]</a>
            <a href="#contact" className="hover:text-white transition-colors duration-200">[ HELLO_STUDIO ]</a>
          </div>

        </div>

        {/* Lower Meta Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-[10px] text-zinc-500 font-mono tracking-[0.25em] gap-4">
          <div className="flex items-center gap-4">
            <span>ISO 400</span>
            <span className="text-zinc-800">•</span>
            <span>SHUTTER 180°</span>
            <span className="text-zinc-800">•</span>
            <span>5600K</span>
          </div>
          <div className="text-zinc-600">© 2026 KINETIC FRAME STUDIO. ALL RIGHTS RESERVED.</div>
        </div>

      </div>
    </footer>
  );
}
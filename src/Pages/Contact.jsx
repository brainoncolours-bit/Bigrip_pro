import { useState } from "react";

function ContactFieldGrid({ label, type = "text", placeholder }) {
  return (
    <div className="w-full grid grid-cols-12 border-b border-black/[0.08] py-5 items-baseline group">
      {/* Label tracks perfectly in the first 4 columns */}
      <label className="col-span-12 md:col-span-4 font-sans text-[10px] tracking-[0.4em] text-black/30 uppercase transition-colors group-focus-within:text-black mb-2 md:mb-0">
        {label}
      </label>
      {/* Input tracks perfectly in the remaining 8 columns */}
      <input 
        type={type} 
        placeholder={placeholder}
        className="col-span-12 md:col-span-8 bg-transparent border-0 p-0 font-serif font-extralight text-lg text-black placeholder-black/20 focus:ring-0 focus:outline-none"
      />
    </div>
  );
}

export default function ContactPage() {
  return (
    <main className="bg-white text-black min-h-screen selection:bg-black selection:text-white antialiased flex flex-col justify-between">
      
      {/* 01. FIXED SYSTEM HEADER OVERLAY */}
      <header className="w-full grid grid-cols-12 px-6 md:px-12 py-8 border-b border-black/[0.04] font-sans text-[10px] tracking-[0.4em] font-light">
        <span className="col-span-6 md:col-span-4 text-black">ZARA // PROJEKT</span>
        <span className="hidden md:block col-span-4 text-center text-black/40">SYSTEM CORRESPONDENCE</span>
        <div className="col-span-6 md:col-span-4 text-right">
          <a href="/" className="text-black/50 hover:text-black transition-colors">[ CLOSE ]</a>
        </div>
      </header>

      {/* 02. STRICT EDITORIAL ARCHITECTURAL GRID */}
      <section className="w-full flex-grow px-6 md:px-12 py-16 md:py-28">
        <div className="w-full grid grid-cols-12 gap-y-16 md:gap-x-12 lg:gap-x-20 items-start">
          
          {/* Left Column Complex: Locks cleanly across 5 grid columns */}
          <div className="col-span-12 lg:col-span-5 flex flex-col justify-between h-full min-h-[50vh] lg:min-h-[60vh]">
            
            {/* Top Typography Header */}
            <div className="flex flex-col items-start">
              <span className="font-sans text-[10px] tracking-[0.4em] text-black/30 mb-4">[ COMMUNICATIONS DIRECTORY ]</span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-extralight tracking-tight text-black uppercase leading-[0.95]">
                Initiate <br />
                Correspondence
              </h1>
            </div>

            {/* Embedded Micro Cinematic Streaming Loop */}
            <div className="w-full h-[22vh] overflow-hidden bg-[#fafafa] border border-black/[0.03] rounded-[1px] relative filter grayscale contrast-[1.05] my-10 lg:my-0">
              <iframe
                src="https://www.youtube.com/embed/9Wd_A8e8TqM?autoplay=1&mute=1&loop=1&playlist=9Wd_A8e8TqM&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1"
                title="Contact Atmosphere Loop"
                className="absolute top-1/2 left-1/2 w-[160%] h-[160%] -translate-x-1/2 -translate-y-1/2 object-cover border-0 pointer-events-none opacity-85"
              />
            </div>

            {/* Meta Information Footer Coordinates */}
            <div className="grid grid-cols-2 gap-4 font-sans text-[11px] tracking-[0.2em] font-light text-black/50 border-t border-black/[0.06] pt-6">
              <div>
                <span className="text-black/20 block mb-2 uppercase text-[9px] tracking-[0.3em]">[ DIGITAL NODE ]</span>
                <p className="hover:text-black transition-colors cursor-pointer truncate">studio@rockjacket.archive</p>
                <p className="hover:text-black transition-colors cursor-pointer truncate">press@rockjacket.archive</p>
              </div>
              <div>
                <span className="text-black/20 block mb-2 uppercase text-[9px] tracking-[0.3em]">[ GEOGRAPHY ]</span>
                <p>42.3601° N, 71.0589° W</p>
                <p>Global Shipments // 2026</p>
              </div>
            </div>
          </div>

          {/* Right Column Complex: Perfectly aligned 7 grid columns layout */}
          <div className="col-span-12 lg:col-span-7 flex flex-col justify-between h-full pt-2 lg:pt-14">
            <form onSubmit={(e) => e.preventDefault()} className="w-full flex flex-col gap-3">
              
              <ContactFieldGrid label="Identity // Name" placeholder="Your name or organization" />
              <ContactFieldGrid label="Digital Address" type="email" placeholder="Your email node" />
              <ContactFieldGrid label="Subject Priority" placeholder="Procurement / Press / Collaboration" />
              
              {/* Asymmetric Textarea field mapped precisely to grid columns */}
              <div className="w-full grid grid-cols-12 border-b border-black/[0.08] py-5 items-start group mb-14">
                <label className="col-span-12 md:col-span-4 font-sans text-[10px] tracking-[0.4em] text-black/30 uppercase transition-colors group-focus-within:text-black mb-3 md:mb-0 pt-1">
                  Inquiry // Manifest
                </label>
                <textarea 
                  rows={4}
                  placeholder="Outline details regarding structural placement or stockist procurement parameters..."
                  className="col-span-12 md:col-span-8 bg-transparent border-0 p-0 font-serif font-extralight text-lg text-black placeholder-black/20 focus:ring-0 focus:outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Action Button: Matches exact layout tracks */}
              <div className="w-full grid grid-cols-12">
                <div className="col-span-12 md:col-start-5 md:col-span-8">
                  <button 
                    type="submit" 
                    className="w-full md:w-auto px-16 py-4 bg-black text-white font-sans text-[10px] tracking-[0.4em] uppercase transition-opacity hover:opacity-85 rounded-[1px] select-none"
                  >
                    TRANSMIT DISPATCH
                  </button>
                </div>
              </div>

            </form>
          </div>

        </div>
      </section>
    </main>
  );
}
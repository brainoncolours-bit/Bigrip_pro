import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-black text-white text-[11px] tracking-[0.18em] font-light antialiased overflow-hidden select-none">
      
      {/* Top Bar: Call to Action + Top Social Links */}
      <div className="mx-auto max-w-7xl px-8 pt-12 pb-16 flex flex-col md:flex-row md:justify-between gap-8 border-b border-white/10">
        <div className="flex flex-col gap-3 max-w-xs">
          <span className="text-white/40 uppercase leading-relaxed">
            DROP US A LINE, AND WE'LL GET IN TOUCH!
          </span>
          <a 
            href="#call" 
            className="text-white uppercase underline underline-offset-4 hover:text-white/70 transition-colors duration-300"
          >
            SCHEDULE A CALL
          </a>
        </div>

        {/* Dynamic Social Navigation Grid */}
        <div className="flex flex-wrap gap-x-8 gap-y-3 pt-1">
          {['DRIBBBLE', 'BEHANCE', 'LINKEDIN', 'X (TWITTER)', 'INSTAGRAM', 'FACEBOOK', 'YOUTUBE'].map((social) => (
            <a 
              key={social} 
              href={`https://${social.toLowerCase().replace(/[\s()]/g, '')}.com`}
              target="_blank"
              rel="noreferrer"
              className="text-white/50 hover:text-white transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-white hover:after:w-full after:transition-all after:duration-300 pb-1"
            >
              {social}
            </a>
          ))}
        </div>
      </div>

      {/* Large Email Anchor Panel */}
      <div className="mx-auto max-w-7xl px-8 py-16">
        <div className="w-full text-right md:text-left">
          <a 
            href="mailto:hello@SECKRICK.com" 
            className="group inline-flex items-center gap-4 text-3xl sm:text-5xl md:text-6xl font-normal tracking-normal text-white border-b border-white/20 pb-4 hover:border-white transition-colors duration-500"
          >
            <span className="break-all uppercase">HELLO@SECKRICK.COM</span>
            <span className="transform group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-300 ease-out text-2xl sm:text-4xl">
              ↗
            </span>
          </a>
        </div>
      </div>

      {/* Directory & Metadata Information Grid */}
      <div className="mx-auto max-w-7xl px-8 pb-20 grid grid-cols-1 md:grid-cols-12 gap-12 items-start text-white/50">
        
        {/* Office Address / Coordinates */}
        <div className="md:col-span-5 flex flex-col gap-4 max-w-sm leading-relaxed uppercase text-[10px] tracking-[0.2em]">
          <span className="text-white">+44 7463615117</span>
          <p className="text-white/40">
            LYTCHETT HOUSE, 13 FREELAND PARK, WAREHAM ROAD, POLE DORSET, BH16 6FA
          </p>
        </div>

        {/* Directory Links 1 */}
        <div className="md:col-span-3 flex flex-col gap-3">
          {['WORKS', 'EXPERTISE', 'ABOUT', 'INSIGHTS'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-white hover:translate-x-1 transition-all duration-300 inline-block w-fit">
              {item}
            </a>
          ))}
        </div>

        {/* Directory Links 2 */}
        <div className="md:col-span-4 flex flex-col gap-3">
          {['CAREERS', 'CONTACT'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-white hover:translate-x-1 transition-all duration-300 inline-block w-fit">
              {item}
            </a>
          ))}
        </div>
      </div>

      {/* Clean Legal / Copyright Bottom Notch */}
      <div className="mx-auto max-w-7xl px-8 py-6 border-t border-white/5 flex flex-col sm:flex-row sm:justify-between gap-4 text-[9px] text-white/30 tracking-[0.25em]">
        <span>© ALL RIGHTS RESERVED. SECKRICK 2026</span>
        <div className="flex items-center gap-1">
          <span>LET'S MAKE YOUR IDEAS TO LIFE</span>
          <span className="text-white/50 animate-pulse">🤍</span>
        </div>
      </div>

      {/* CONTINUOUS MOTION: Massive Infinite Typographic Banner (Replacing the Neon Green Bar) */}
      <div className="w-full bg-white text-black py-6 sm:py-10 whitespace-nowrap overflow-hidden select-none border-t border-white/10">
      
        <div className="inline-block animate-[marquee_25s_linear_infinite] text-[18vw] font-bold tracking-tighter leading-none uppercase select-none">
          SECKRICK • SECKRICK • SECKRICK • SECKRICK •&nbsp;
        </div>
      </div>

      {/* Structural Marquee Keyframe Injection */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
import React from "react";

export default function AnimatedCinemaFooter() {
  return (
    <footer className="w-full bg-black text-white border-t border-white/10 pt-16 pb-12 font-sans selection:bg-white selection:text-black">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-12 border-b border-white/10 gap-6">
          <div className="space-y-2">
            {/* Animated Black & White Status Badge */}
            <div className="flex items-center space-x-2 text-xs font-mono tracking-wider text-zinc-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <span>Sick of creativity</span>
            </div>

            <h2 className="text-2xl font-light tracking-wide text-white uppercase">
             Sekrick<span className="text-zinc-500 font-normal">.</span>
            </h2>
            <p className="text-sm text-zinc-400 font-light">
              Boutique film production and post-production services.
            </p>
          </div>
          
          {/* Animated Button */}
          <a 
            href="#contact" 
            className="px-6 py-3 bg-white text-black text-xs uppercase tracking-widest font-medium transition-all duration-300 hover:bg-zinc-200 hover:scale-[1.02] active:scale-95 rounded-sm"
          >
            Get in Touch
          </a>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 py-12 border-b border-white/10 text-sm">
          
          {/* Column 1: Services */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-widest text-zinc-500 font-medium">
              What We Do
            </h3>
            <ul className="space-y-2 text-zinc-300 font-light">
              <li className="hover:text-white transition-colors duration-200 cursor-default">Cinematography & Direction</li>
              <li className="hover:text-white transition-colors duration-200 cursor-default">Commercial Video Production</li>
              <li className="hover:text-white transition-colors duration-200 cursor-default">Post-Production & Editing</li>
              <li className="hover:text-white transition-colors duration-200 cursor-default">Color Grading & Finishing</li>
            </ul>
          </div>

          {/* Column 2: Process */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-widest text-zinc-500 font-medium">
              Our Process
            </h3>
            <ul className="space-y-2 text-zinc-300 font-light">
              <li className="hover:text-white transition-colors duration-200 cursor-default">Ultra High-Definition Capture</li>
              <li className="hover:text-white transition-colors duration-200 cursor-default">Custom Lighting & Visuals</li>
              <li className="hover:text-white transition-colors duration-200 cursor-default">Remote & On-Location Shoot</li>
              <li className="hover:text-white transition-colors duration-200 cursor-default">Tailored Project Delivery</li>
            </ul>
          </div>

          {/* Column 3: Interactive Navigation Links */}
          <div className="space-y-3 sm:col-span-2 md:col-span-1">
            <h3 className="text-xs uppercase tracking-widest text-zinc-500 font-medium">
              Navigation
            </h3>
            <ul className="space-y-2 text-zinc-400 font-light">
              <li>
                <a 
                  href="#showreel" 
                  className="inline-block hover:text-white hover:translate-x-1.5 transition-all duration-200"
                >
                  Showreel
                </a>
              </li>
              <li>
                <a 
                  href="#portfolio" 
                  className="inline-block hover:text-white hover:translate-x-1.5 transition-all duration-200"
                >
                  Selected Works
                </a>
              </li>
              <li>
                <a 
                  href="#about" 
                  className="inline-block hover:text-white hover:translate-x-1.5 transition-all duration-200"
                >
                  About the Studio
                </a>
              </li>
              <li>
                <a 
                  href="#contact" 
                  className="inline-block hover:text-white hover:translate-x-1.5 transition-all duration-200"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-zinc-500 font-light gap-4">
          <p>© 2026 Sekrick . All rights reserved.</p>
          
          <div className="flex items-center space-x-6 text-zinc-400">
            <a href="#privacy" className="hover:text-white transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-white transition-colors duration-200">
              Terms of Service
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
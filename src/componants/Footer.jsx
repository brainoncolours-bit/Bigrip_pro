import React from "react";

export default function AnimatedCinemaFooter() {
  return (
    <footer className="w-full bg-black text-white border-t border-white/10 py-8 font-sans selection:bg-white selection:text-black">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-zinc-500 font-light gap-4">
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
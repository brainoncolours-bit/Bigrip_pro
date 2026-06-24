import { NavLink } from "react-router-dom";
import { useRef, useState, useEffect } from "react";

const links = [
  { to: "/", label: "Home" },
  { to: "/work", label: "Work" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const logoRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogoMove = (e) => {
    const rect = logoRef.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: relX * 14, y: relY * -10 });
  };

  const resetLogo = () => setTilt({ x: 0, y: 0 });

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-black/70 backdrop-blur-md shadow-[0_1px_0_0_rgba(255,255,255,0.08)]"
          : "bg-transparent"
      }`}
    >
      <nav className="flex items-center justify-between px-8 py-5">
        {/* Wordmark */}
        <div
          ref={logoRef}
          onMouseMove={handleLogoMove}
          onMouseLeave={resetLogo}
          className="relative select-none cursor-default"
          style={{ perspective: "400px" }}
        >
          <span
            className="block text-2xl font-black uppercase tracking-tight text-white transition-transform duration-150 ease-out"
            style={{
              fontFamily: "'Arial Narrow', 'Helvetica Neue', sans-serif",
              transform: `rotate(-3deg) skewX(-3deg) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
              textShadow: "3px 3px 0px rgba(249,115,22,0.9)",
            }}
          >
            Rock
          </span>
        </div>

        {/* Links */}
        <ul className="flex items-center gap-10">
          {links.map(({ to, label }) => (
            <li key={to}>
              <NavLink to={to} className="group relative block py-1">
                {({ isActive }) => (
                  <>
                    <span
                      className={`text-sm font-semibold uppercase tracking-wide transition-colors duration-300 ${
                        isActive
                          ? "text-orange-500"
                          : "text-white group-hover:text-orange-400"
                      }`}
                    >
                      {label}
                    </span>

                    {/* Hand-drawn underline — draws in on hover, stays drawn when active */}
                    <svg
                      className="absolute -bottom-1 left-0 w-full h-2.5 overflow-visible"
                      viewBox="0 0 100 10"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M2,6 C20,2 35,8 50,4 C65,1 80,7 98,4"
                        fill="none"
                        stroke="#f97316"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        pathLength="1"
                        className={`transition-all duration-300 ease-out ${
                          isActive
                            ? "[stroke-dashoffset:0] opacity-100"
                            : "[stroke-dashoffset:1] opacity-0 group-hover:[stroke-dashoffset:0] group-hover:opacity-100"
                        }`}
                        style={{ strokeDasharray: 1 }}
                      />
                    </svg>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
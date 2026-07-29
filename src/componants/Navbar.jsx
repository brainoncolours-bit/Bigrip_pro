import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

const links = [
  { to: "/", label: "Home" },
  { to: "/work", label: "Work" },
  { to: "/artists", label: "Artists" },
  { to: "/sekriac", label: "SEKRICK" },
  { to: "/contact", label: "Contact" },
];

const Navbar = ({ mode = "dark" }) => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;

    const { body, documentElement } = document;
    const previousBodyOverflow = body.style.overflow;
    const previousHtmlOverflow = documentElement.style.overflow;

    body.style.overflow = "hidden";
    documentElement.style.overflow = "hidden";

    return () => {
      body.style.overflow = previousBodyOverflow;
      documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [open]);

  const isDark = mode === "dark";

  // Dynamic colors that stay razor thin and high contrast
  const textColor = isDark ? "text-white" : "text-black";
  const borderColor = isDark ? "border-white/10" : "border-black/10";
  const activeColor = "text-orange-500";

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-[60] transition-all duration-700 ease-out ${
          scrolled
            ? isDark
              ? "bg-black/40 backdrop-blur-md"
              : "bg-white/40 backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        {/* Micro border line at the bottom, ultra thin like luxury fashion sites */}
        <nav
          className={`flex items-baseline justify-between px-6 py-3 border-b ${borderColor} transition-colors duration-500`}
        >
          {/* Zara-Style Overlapping Editorial Wordmark */}
          <div className="select-none tracking-[-0.08em] font-black transform scale-y-110 leading-none">
            <span
              className={`text-xl uppercase ${textColor} transition-colors duration-500`}
            >
              SEKRICK
            </span>
          </div>

          {/* Tiny Minimal Links (desktop) */}
          <ul className="hidden md:flex items-center gap-8 lowercase text-[11px] tracking-[0.15em]">
            {links.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className="relative block py-1"
                  onClick={() => setOpen(false)}
                >
                  {({ isActive }) => (
                    <span
                      className={`font-light transition-colors duration-300 uppercase ${
                        isActive
                          ? activeColor
                          : `${textColor} opacity-60 hover:opacity-100`
                      }`}
                    >
                      {label}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center">
            <button
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
              className={`p-2 rounded inline-flex items-center justify-center ${textColor}`}
            >
              <svg
                aria-hidden="true"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {open ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <path d="M3 12h18M3 6h18M3 18h18" />
                )}
              </svg>
            </button>
          </div>
        </nav>
      </header>
      {open && (
        <div className="fixed inset-0 z-[999] h-dvh w-screen overflow-hidden bg-black/95 backdrop-blur-sm md:hidden">
          <div className="absolute right-0 top-0 p-6">
            <button
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="p-2 text-white"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="flex h-full min-h-dvh items-center justify-center px-6">
            <ul className="flex w-full max-w-sm flex-col items-center gap-6 text-lg lowercase tracking-wider text-white">
              {links.map(({ to, label }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `block py-2 ${isActive ? "text-orange-400" : "text-white/90"}`
                    }
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </>
  );
};

export default Navbar;

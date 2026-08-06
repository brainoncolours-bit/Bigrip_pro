import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/home-videos", label: "Home Videos" },
  { to: "/admin/services-videos", label: "Services Videos" },
  { to: "/admin/categories", label: "Categories" },
  { to: "/admin/artists", label: "Artists" },
  { to: "/admin/artist-works", label: "Artist Works" },
  { to: "/admin/works", label: "Works" },
];

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkSession() {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate("/admin/login", { replace: true });
        return;
      }
      setSession(data.session);
      setLoading(false);
    }
    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!nextSession) {
        navigate("/admin/login", { replace: true });
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [navigate]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate("/admin/login", { replace: true });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <p className="text-[#f5f5f0]/60 text-xs uppercase tracking-[0.3em] font-mono animate-pulse">
          Verifying session...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f0] flex">
      <aside className="hidden md:flex w-64 flex-col border-r border-[#f5f5f0]/10 bg-[#111] p-6 shrink-0">
        <div className="mb-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#ff3d1a] mb-1">
            Admin
          </p>
          <p className="text-xs text-[#f5f5f0]/40 font-mono">{session?.user?.email}</p>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <a
                key={item.to}
                href={item.to}
                onClick={(e) => { e.preventDefault(); navigate(item.to); }}
                className={`px-4 py-2.5 text-xs uppercase tracking-[0.18em] rounded transition-colors ${
                  isActive
                    ? "bg-[#ff3d1a]/10 text-[#ff3d1a] font-bold"
                    : "text-[#f5f5f0]/60 hover:text-[#f5f5f0] hover:bg-[#f5f5f0]/5"
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={handleSignOut}
          className="mt-auto border border-[#f5f5f0]/15 px-4 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-[#f5f5f0]/70 hover:text-[#ff3d1a] hover:border-[#ff3d1a]/30 transition-colors rounded"
        >
          Sign Out
        </button>
      </aside>

      {/* Mobile nav bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#111] border-b border-[#f5f5f0]/10 px-4 py-3 flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#ff3d1a]">
          Admin
        </p>
        <button
          type="button"
          onClick={handleSignOut}
          className="text-[10px] uppercase tracking-[0.18em] text-[#f5f5f0]/60 border border-[#f5f5f0]/15 px-3 py-1.5 rounded"
        >
          Sign Out
        </button>
      </div>

      <main className="flex-1 p-6 md:p-8 pt-20 md:pt-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

// Scatter offset positions across the screen without any rotation
const SCATTER_POSITIONS = [
  { top: "-140px", left: "-230px", width: "170px", height: "220px", zIndex: 30 },
  { top: "-180px", right: "-250px", width: "190px", height: "240px", zIndex: 25 },
  { top: "120px", left: "-260px", width: "150px", height: "190px", zIndex: 35 },
  { top: "140px", right: "-280px", width: "180px", height: "230px", zIndex: 20 },
  { top: "-260px", left: "80px", width: "160px", height: "200px", zIndex: 28 },
  { top: "220px", left: "20px", width: "175px", height: "220px", zIndex: 32 },
];

const Artists = () => {
  const navigate = useNavigate();
  const [activeArtist, setActiveArtist] = useState(null);
  const [artistsData, setArtistsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadArtists() {
      const [categoryRes, artistRes, workRes] = await Promise.all([
        supabase
          .from("categories")
          .select("*")
          .eq("published", true)
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: true }),
        supabase
          .from("artists")
          .select("*")
          .eq("published", true)
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: true }),
        supabase
          .from("artist_works")
          .select("*")
          .eq("published", true)
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: true }),
      ]);

      const categories = categoryRes.data || [];
      const artists = artistRes.data || [];
      const works = workRes.data || [];

      const worksByArtist = {};
      works.forEach((work) => {
        if (!worksByArtist[work.artist_id]) worksByArtist[work.artist_id] = [];
        worksByArtist[work.artist_id].push({
          url: work.media_url,
          type: work.media_type,
        });
      });

      const grouped = categories
        .map((category) => ({
          id: category.id,
          title: category.name,
          artists: artists
            .filter((artist) => artist.category_id === category.id)
            .map((artist) => ({
              id: artist.id,
              name: artist.name,
              bio: artist.bio || artist.role || "Boutique creative directional output.",
              role: artist.role,
              images: (worksByArtist[artist.id] || [])
                .filter((item) => item.url)
                .slice(0, 6),
            })),
        }))
        .filter((category) => category.artists.length > 0);

      setArtistsData(grouped);
      setLoading(false);
    }

    loadArtists();
  }, []);

  const renderMedia = (item, artistName, index) => {
    if (item.type === "video") {
      return (
        <video
          src={item.url}
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        />
      );
    }
    return (
      <img
        src={item.url}
        alt={`${artistName} work preview ${index + 1}`}
        className="w-full h-full object-cover"
      />
    );
  };

  return (
    <main className="min-h-screen bg-black text-white font-sans px-6 md:px-12 pt-28 pb-20 relative selection:bg-white selection:text-black overflow-x-hidden antialiased">
      <div className="grid grid-cols-12 gap-6 items-start relative max-w-7xl mx-auto">
        {/* Title Column */}
        <div className="col-span-12 lg:col-span-2 mb-8 lg:mb-0">
          <h1 className="text-2xl font-thin tracking-tighter uppercase leading-none text-white font-sans">
            sekrick
          </h1>
        </div>

        {/* Categories & Artists Grid */}
        <div
          className="col-span-12 lg:col-span-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 relative"
          onMouseLeave={() => setActiveArtist(null)}
        >
          {loading && (
            <p className="col-span-4 font-mono text-[10px] text-neutral-500 tracking-[0.3em] uppercase animate-pulse">
              [ SYNCHRONIZING ARTISTS ROSTER... ]
            </p>
          )}

          {!loading && artistsData.length === 0 && (
            <p className="col-span-4 font-mono text-[10px] text-neutral-500 tracking-[0.3em] uppercase">
              NO ARTISTS PUBLISHED YET.
            </p>
          )}

          {artistsData.map((category) => (
            <div key={category.id} className="flex flex-col gap-6">
              <h2 className="font-mono text-[10px] text-neutral-500 tracking-[0.3em] uppercase border-b border-neutral-900 pb-2">
                // {category.title}
              </h2>
              <ul className="flex flex-col gap-8 text-sm font-light">
                {category.artists.map((artist) => {
                  const isActive = activeArtist?.name === artist.name;

                  return (
                    <li key={artist.name} className="relative group">
                      <button
                        onMouseEnter={() => setActiveArtist(artist)}
                        onClick={() => navigate(`/artists/${artist.id}`)}
                        className={`text-left transition-colors duration-200 block w-full leading-snug uppercase tracking-tight ${
                          isActive
                            ? "text-red-500 font-normal"
                            : "text-neutral-200 hover:text-white"
                        }`}
                      >
                        {artist.name}
                      </button>

                      {/* Bio Text rendered ONLY when active (hovered) */}
                      {isActive && artist.bio && (
                        <p className="mt-1 text-[11px] font-sans text-neutral-400 line-clamp-2 leading-relaxed animate-fadeIn">
                          {artist.bio}
                        </p>
                      )}

                      {/* UNROTATED SCATTERED OVERLAY IMAGES */}
                      {isActive && artist.images.length > 0 && (
                        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-50">
                          {artist.images.map((item, idx) => {
                            const pos =
                              SCATTER_POSITIONS[idx % SCATTER_POSITIONS.length];
                            return (
                              <div
                                key={`scatter-${artist.name}-${idx}`}
                                className="absolute bg-neutral-950 border border-neutral-800 shadow-2xl overflow-hidden transition-all duration-300 ease-out"
                                style={{
                                  top: pos.top,
                                  left: pos.left,
                                  right: pos.right,
                                  width: pos.width,
                                  height: pos.height,
                                  zIndex: pos.zIndex,
                                }}
                              >
                                {renderMedia(item, artist.name, idx)}
                                <div className="absolute inset-0 bg-black/10 pointer-events-none" />
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Artists;
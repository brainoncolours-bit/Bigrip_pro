import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

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
              images: (worksByArtist[artist.id] || [])
                .filter((item) => item.url)
                .slice(0, 12),
            })),
        }))
        .filter((category) => category.artists.length > 0);

      setArtistsData(grouped);
      setLoading(false);
    }

    loadArtists();
  }, []);

  // Split images into left and right groups if there are many, keeping layout balanced
  const getDistributedImages = (images) => {
    if (!images) return { leftImages: [], rightImages: [] };
    const mid = Math.ceil(images.length / 2);
    return {
      leftImages: images.slice(0, mid),
      rightImages: images.slice(mid),
    };
  };

  const renderMedia = (item, artistName, index) => {
    if (item.type === "ideo") {
      return (
        <ideo
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
    /* Changed py-8 to pt-20 pb-12 below to bring content down */
    <main className="min-h-screen bg-white text-black font-serif px-12 pt-20 pb-12 relative selection:bg-neutral-200 overflow-x-hidden">
      {/* Top Navigation Links */}

      {/* Main Container */}
      <div className="grid grid-cols-12 gap-6 items-start relative">
        {/* Logo / Title Column */}
        <div className="col-span-2">
          <h1 className="text-2xl font-bold font-sans tracking-tight leading-none text-black">
            sekrick
          </h1>
        </div>

        {/* Categories & Artists Grid */}
        <div
          className="col-span-10 grid grid-cols-4 gap-8 font-sans relative"
          onMouseLeave={() => setActiveArtist(null)}
        >
          {loading && (
            <p className="col-span-4 text-[12px] text-neutral-500 tracking-wide animate-pulse">
              Loading artists...
            </p>
          )}

          {!loading && artistsData.length === 0 && (
            <p className="col-span-4 text-[12px] text-neutral-500 tracking-wide">
              No artists published yet.
            </p>
          )}

          {artistsData.map((category) => (
            <div key={category.id} className="flex flex-col gap-4">
              <h2 className="text-[12px] font-normal text-neutral-800 tracking-wide">
                {category.title}
              </h2>
              <ul className="flex flex-col gap-1.5 text-[13px]">
                {category.artists.map((artist) => {
                  const isActive = activeArtist?.name === artist.name;
                  const { leftImages, rightImages } = getDistributedImages(
                    artist.images
                  );

                  return (
                    <li key={artist.name} className="relative">
                      <button
                        onMouseEnter={() => setActiveArtist(artist)}
                        onClick={() => navigate(`/artists/${artist.id}`)}
                        className={`text-left transition-colors duration-150 block w-full leading-snug ${
                          isActive
                            ? "text-red-600 font-medium"
                            : "text-black hover:text-red-600"
                        }`}
                      >
                        {artist.name}
                      </button>

                      {/* Left Side Overflow Images */}
                      {isActive && leftImages.length > 0 && (
                        <div className="absolute top-0 right-full mr-6 z-30 flex items-start gap-3 pointer-events-none transition-all duration-300 ease-out opacity-100">
                          {leftImages.map((item, idx) => (
                            <div
                              key={`left-${artist.name}-${idx}`}
                              className="flex-shrink-0 bg-neutral-100 shadow-sm"
                              style={{ width: "150px", height: "200px" }}
                            >
                              {renderMedia(item, artist.name, idx)}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Right Side Images */}
                      {isActive && rightImages.length > 0 && (
                        <div className="absolute top-0 left-full ml-6 z-30 flex items-start gap-3 pointer-events-none transition-all duration-300 ease-out opacity-100">
                          {rightImages.map((item, idx) => (
                            <div
                              key={`right-${artist.name}-${idx}`}
                              className="flex-shrink-0 bg-neutral-100 shadow-sm"
                              style={{ width: "150px", height: "200px" }}
                            >
                              {renderMedia(item, artist.name, idx)}
                            </div>
                          ))}
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
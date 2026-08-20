import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

const ArtistDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [artist, setArtist] = useState(null);
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function loadArtist() {
      setLoading(true);
      setNotFound(false);

      const [artistRes, workRes] = await Promise.all([
        supabase
          .from("artists")
          .select("*")
          .eq("id", id)
          .eq("published", true)
          .maybeSingle(),
        supabase
          .from("artist_works")
          .select("*")
          .eq("artist_id", id)
          .eq("published", true)
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: true }),
      ]);

      if (artistRes.error || !artistRes.data) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setArtist(artistRes.data);
      setWorks((workRes.data || []).filter((work) => work.media_url));
      setLoading(false);
    }

    if (id) loadArtist();
  }, [id]);

  const renderMedia = (work) => {
    if (work.media_type === "video") {
      return (
        <video
          src={work.media_url}
          className="w-full h-auto block object-cover opacity-100 group-hover:scale-105 transition-transform duration-700 ease-out will-change-transform"
          autoPlay
          muted
          loop
          playsInline
        />
      );
    }
    return (
      <img
        src={work.media_url}
        alt={work.title || `${artist?.name} work`}
        className="w-full h-auto block object-cover opacity-100 group-hover:scale-105 transition-transform duration-700 ease-out will-change-transform"
      />
    );
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white px-6 md:px-12 py-12 relative selection:bg-white selection:text-black">
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-neutral-500 animate-pulse">
          [ LOADING ARTIST ARCHIVE... ]
        </p>
      </main>
    );
  }

  if (notFound) {
    return (
      <main className="min-h-screen bg-black text-white px-6 md:px-12 py-12 relative selection:bg-white selection:text-black">
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-neutral-500 mb-8">
          [ ARTIST NOT FOUND ]
        </p>
        <button
          onClick={() => navigate("/artists")}
          className="font-mono text-xs text-white underline underline-offset-4 hover:text-neutral-400 uppercase tracking-widest transition-colors"
        >
          &larr; BACK TO ALL ARTISTS
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 md:px-12 lg:px-20 py-10 relative selection:bg-white selection:text-black overflow-x-hidden antialiased">
      {/* Artist Profile Header */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start pt-24 sm:pt-28 md:pt-32 mb-16 md:mb-20">
        {/* Artist Name & Role */}
        <div className="md:col-span-4 flex flex-col space-y-2">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extralight uppercase font-sans tracking-tight leading-none text-white">
            {artist.name}
          </h1>
          {artist.role && (
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-500 pt-2">
              // {artist.role}
            </p>
          )}
        </div>

        {/* Artist Bio & External Links */}
        <div className="md:col-span-7 md:col-start-6 space-y-6">
          {artist.bio && (
            <p className="text-sm md:text-base font-light font-sans text-neutral-300 leading-relaxed max-w-2xl">
              {artist.bio}
            </p>
          )}

          {(artist.website_url || artist.instagram_url) && (
            <div className="flex gap-6 font-mono text-[10px] tracking-widest uppercase pt-4 border-t border-neutral-900">
              {artist.website_url && (
                <a
                  href={artist.website_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-neutral-400 hover:text-white transition-colors underline underline-offset-4"
                >
                  WEBSITE &rarr;
                </a>
              )}
              {artist.instagram_url && (
                <a
                  href={artist.instagram_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-neutral-400 hover:text-white transition-colors underline underline-offset-4"
                >
                  INSTAGRAM &rarr;
                </a>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Selected Works Portfolio */}
      <section>
        {works.length === 0 ? (
          <p className="font-mono text-[10px] text-neutral-600 uppercase tracking-widest py-12">
            NO WORKS PUBLISHED YET.
          </p>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
            {works.map((work) => (
              <figure
                key={work.id}
                className="break-inside-avoid group flex flex-col bg-neutral-950/80 border border-neutral-900 hover:border-neutral-700 transition-colors duration-500 overflow-hidden"
              >
                <div className="w-full overflow-hidden bg-black relative">
                  {renderMedia(work)}
                </div>

                {(work.title || work.year) && (
                  <figcaption className="flex items-baseline justify-between gap-3 p-4 border-t border-neutral-900 font-sans">
                    {work.title ? (
                      <span className="text-xs md:text-sm font-light uppercase tracking-tight text-white group-hover:text-neutral-200">
                        {work.title}
                      </span>
                    ) : (
                      <span />
                    )}
                    {work.year && (
                      <span className="font-mono text-[9px] tracking-widest text-neutral-500">
                        {work.year}
                      </span>
                    )}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default ArtistDetail;
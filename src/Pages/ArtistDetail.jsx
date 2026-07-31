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
        supabase.from("artists").select("*").eq("id", id).eq("published", true).maybeSingle(),
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
        src={work.media_url}
        alt={work.title || `${artist?.name} work`}
        className="w-full h-full object-cover"
      />
    );
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white text-black font-serif px-12 py-8 relative selection:bg-neutral-200">
        <p className="text-[12px] text-neutral-500 tracking-wide animate-pulse">
          Loading artist...
        </p>
      </main>
    );
  }

  if (notFound) {
    return (
      <main className="min-h-screen bg-white text-black font-serif px-12 py-8 relative selection:bg-neutral-200">
        <p className="mb-8 text-[12px] text-neutral-500 tracking-wide">
          Artist not found.
        </p>
        <button
          onClick={() => navigate("/artists")}
          className="text-black underline underline-offset-4 hover:text-red-600 transition-colors"
        >
          Back to all artists
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-black font-serif px-12 py-8 relative selection:bg-neutral-200 overflow-x-hidden">
      {/* Top Navigation Links */}
      <nav className="flex justify-between items-center text-sm font-sans mb-16">
        <div className="flex gap-8">
          <button
            onClick={() => navigate("/artists")}
            className="text-black hover:opacity-60 transition-opacity"
          >
            Artists
          </button>
          <span className="text-neutral-400">/</span>
          <span className="text-red-600">{artist.name}</span>
        </div>
        <button
          onClick={() => navigate("/")}
          className="text-black hover:opacity-60 transition-opacity"
        >
          Home
        </button>
      </nav>

      {/* Artist Header */}
      <section className="grid grid-cols-12 gap-6 items-start mb-16">
        <div className="col-span-2">
          <h1 className="text-2xl font-bold font-sans tracking-tight leading-none text-black">
            {artist.name}
          </h1>
          {artist.role && (
            <p className="mt-2 text-[12px] font-sans text-neutral-500 tracking-wide">
              {artist.role}
            </p>
          )}
        </div>

        <div className="col-span-6 col-start-4">
          {artist.bio && (
            <p className="max-w-xl text-[14px] leading-relaxed text-neutral-700">
              {artist.bio}
            </p>
          )}
          {(artist.website_url || artist.instagram_url) && (
            <div className="mt-4 flex gap-6 font-sans text-[13px]">
              {artist.website_url && (
                <a
                  href={artist.website_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-black hover:text-red-600 transition-colors"
                >
                  Website
                </a>
              )}
              {artist.instagram_url && (
                <a
                  href={artist.instagram_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-black hover:text-red-600 transition-colors"
                >
                  Instagram
                </a>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Works */}
      <section>
        {works.length === 0 ? (
          <p className="text-[12px] text-neutral-500 tracking-wide">
            No works published yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {works.map((work) => (
              <figure key={work.id} className="bg-neutral-100">
                <div className="aspect-square w-full overflow-hidden">
                  {renderMedia(work)}
                </div>
                {(work.title || work.year) && (
                  <figcaption className="flex items-baseline justify-between gap-3 px-1 pt-2 font-sans">
                    {work.title ? (
                      <span className="text-[13px] text-black">{work.title}</span>
                    ) : (
                      <span />
                    )}
                    {work.year && (
                      <span className="text-[11px] text-neutral-500">{work.year}</span>
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

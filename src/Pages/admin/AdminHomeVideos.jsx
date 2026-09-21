import { useEffect, useState, useRef } from "react";
import { supabase } from "../../lib/supabaseClient";
import AdminLayout from "./AdminLayout";

const ACTIVE_HOME_SECTIONS = [
  {
    key: "hero",
    label: "Hero Background (Section 1)",
    description: "Main fullscreen hero video at the very top of the homepage.",
    sort_order: 1,
    defaultFallback: "/web 31.mp4",
  },
  {
    key: "hero_secondary",
    label: "Hero Secondary Banner (Section 3)",
    description: "Cinematic full-width parallax video banner below the manifesto.",
    sort_order: 2,
    defaultFallback: "/web 10.mp4",
  },
  {
    key: "chromatic_matte_1",
    label: "Chromatic Matte — Left (Section 4)",
    description: "Left video panel in the Dual Perspective reel stream.",
    sort_order: 3,
    defaultFallback: "/web 26.mp4",
  },
  {
    key: "chromatic_matte_2",
    label: "Chromatic Matte — Right (Section 4)",
    description: "Right video panel in the Dual Perspective reel stream.",
    sort_order: 4,
    defaultFallback: "/REEL 6 WEB.mp4",
  },
  {
    key: "video_intercept",
    label: "Full-bleed Intercept (Section 8)",
    description: "Saturated runtime feed intercept video banner.",
    sort_order: 5,
    defaultFallback: "/web 10.mp4",
  },
  {
    key: "asymmetric_block",
    label: "Asymmetric Block (Section 10)",
    description: "Video display next to 'Where ideas find their visual voice'.",
    sort_order: 6,
    defaultFallback: "/web 31.mp4",
  },
];

export default function AdminHomeVideos() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState(null);
  const [error, setError] = useState("");
  const [urlDrafts, setUrlDrafts] = useState({});
  const fileInputs = useRef({});

  useEffect(() => {
    loadSections();
  }, []);

  async function loadSections() {
    setLoading(true);
    const { data, error: fetchError } = await supabase
      .from("home_videos")
      .select("*");

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setError("");
    }

    const dbMap = {};
    if (data) {
      data.forEach((row) => {
        dbMap[row.section_key] = row;
      });
    }

    const merged = ACTIVE_HOME_SECTIONS.map((sec) => {
      const existing = dbMap[sec.key];
      return {
        id: existing?.id || null,
        section_key: sec.key,
        section_label: existing?.section_label || sec.label,
        description: sec.description,
        defaultFallback: sec.defaultFallback,
        media_url: existing?.media_url || "",
        sort_order: sec.sort_order,
        published: existing ? existing.published : true,
      };
    });

    setSections(merged);
    const initialDrafts = {};
    merged.forEach((s) => {
      initialDrafts[s.section_key] = s.media_url || "";
    });
    setUrlDrafts(initialDrafts);
    setLoading(false);
  }

  async function saveMediaUrl(section, newMediaUrl) {
    setSavingKey(section.section_key);
    setError("");

    try {
      const payload = {
        section_key: section.section_key,
        section_label: section.section_label,
        sort_order: section.sort_order,
        published: section.published,
        media_url: newMediaUrl,
      };

      const { error: saveError } = await supabase
        .from("home_videos")
        .upsert(payload, { onConflict: "section_key" });

      if (saveError) throw saveError;
      try {
        localStorage.removeItem("sekrick_home_videos_cache");
      } catch {}
      await loadSections();
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingKey(null);
    }
  }

  async function handleFileSelect(section, file) {
    if (!file) return;

    setSavingKey(section.section_key);
    setError("");

    try {
      const extension = file.name.split(".").pop();
      const path = `${section.section_key}/${crypto.randomUUID()}.${extension}`;
      const { error: uploadError } = await supabase.storage
        .from("home-videos-media")
        .upload(path, file, { cacheControl: "3600", upsert: false });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("home-videos-media")
        .getPublicUrl(path);

      await saveMediaUrl(section, urlData.publicUrl);
    } catch (err) {
      setError(err.message);
      setSavingKey(null);
    }
  }

  async function handleRemove(section) {
    await saveMediaUrl(section, null);
  }

  async function handleTogglePublished(section) {
    setError("");
    const newStatus = !section.published;

    try {
      const payload = {
        section_key: section.section_key,
        section_label: section.section_label,
        sort_order: section.sort_order,
        published: newStatus,
        media_url: section.media_url || null,
      };

      const { error: updateError } = await supabase
        .from("home_videos")
        .upsert(payload, { onConflict: "section_key" });

      if (updateError) throw updateError;
      try {
        localStorage.removeItem("sekrick_home_videos_cache");
      } catch {}
      await loadSections();
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-[#f5f5f0]/40 text-xs uppercase tracking-[0.3em] font-mono animate-pulse">
            Loading active home video sections...
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#ff3d1a]">
          Admin / Home Videos
        </p>
        <h1 className="text-3xl md:text-4xl font-black uppercase">
          Home Page Videos
        </h1>
        <p className="mt-2 text-xs text-[#f5f5f0]/40 font-mono">
          Manage the 6 active video sections featured on the Home page.
        </p>
      </div>

      {error && (
        <div className="mb-6 text-sm text-[#ff7a55] bg-[#ff3d1a]/5 border border-[#ff3d1a]/20 p-4 rounded">
          <p className="font-bold mb-1">Notice / Error:</p>
          <p className="text-xs font-mono">{error}</p>
          {error.includes("quota") && (
            <p className="mt-2 text-xs text-[#f5f5f0]/70">
              Tip: Because your Supabase bandwidth is capped, you can paste external video links (e.g. Cloudflare R2 / Vimeo) into the URL field below.
            </p>
          )}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {sections.map((section) => {
          const isSaving = savingKey === section.section_key;
          const displayUrl = section.media_url || section.defaultFallback;

          return (
            <div
              key={section.section_key}
              className="border border-[#f5f5f0]/10 bg-[#111] rounded overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-[#f5f5f0]/10">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] truncate">
                    {section.section_label}
                  </p>
                  <p className="text-[9px] font-mono text-[#f5f5f0]/30 uppercase tracking-wider mt-0.5">
                    {section.section_key}
                  </p>
                </div>
                <label className="flex items-center gap-1.5 shrink-0 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={section.published}
                    onChange={() => handleTogglePublished(section)}
                    className="accent-[#ff3d1a] w-3.5 h-3.5"
                  />
                  <span className="text-[9px] uppercase tracking-[0.15em] text-[#f5f5f0]/50">
                    Live
                  </span>
                </label>
              </div>

              {/* Section Description */}
              <div className="px-4 py-2 bg-[#0d0d0d] border-b border-[#f5f5f0]/5">
                <p className="text-[10px] text-[#f5f5f0]/50 font-sans">
                  {section.description}
                </p>
              </div>

              {/* Video Preview */}
              <div className="aspect-video bg-black relative overflow-hidden">
                {displayUrl ? (
                  <>
                    <video
                      src={displayUrl}
                      className="absolute inset-0 w-full h-full object-cover"
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                    {!section.media_url && (
                      <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm px-2 py-1 border border-white/10 rounded">
                        <span className="text-[8px] font-mono uppercase tracking-wider text-orange-400">
                          Playing Local Fallback: {section.defaultFallback}
                        </span>
                      </div>
                    )}
                    {isSaving && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white animate-pulse">
                          Saving / Uploading...
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#f5f5f0]/20">
                      No video
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="p-4 flex flex-col gap-3 border-t border-[#f5f5f0]/10 flex-1 justify-between">
                {/* Direct Video URL Input */}
                <div>
                  <label className="block text-[9px] font-mono uppercase text-[#f5f5f0]/40 mb-1">
                    Direct Video URL (or paste external CDN link)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://... or /video.mp4"
                      value={urlDrafts[section.section_key] ?? ""}
                      onChange={(e) =>
                        setUrlDrafts((prev) => ({
                          ...prev,
                          [section.section_key]: e.target.value,
                        }))
                      }
                      className="flex-1 bg-black/60 border border-[#f5f5f0]/15 px-2.5 py-1.5 text-xs text-white rounded outline-none focus:border-[#ff3d1a]"
                    />
                    <button
                      type="button"
                      onClick={() => saveMediaUrl(section, urlDrafts[section.section_key])}
                      disabled={isSaving}
                      className="bg-white/10 hover:bg-white/20 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-white rounded disabled:opacity-50"
                    >
                      Set
                    </button>
                  </div>
                </div>

                {/* Upload or Remove File */}
                <div className="flex items-center gap-2 pt-1 border-t border-[#f5f5f0]/5">
                  <input
                    ref={(el) => {
                      fileInputs.current[section.section_key] = el;
                    }}
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileSelect(section, file);
                      e.target.value = "";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputs.current[section.section_key]?.click()}
                    disabled={isSaving}
                    className="flex-1 bg-[#ff3d1a] px-3 py-2 text-[9px] font-bold uppercase tracking-[0.18em] text-[#0a0a0a] disabled:opacity-50 rounded"
                  >
                    Upload Video File
                  </button>
                  {section.media_url && (
                    <button
                      type="button"
                      onClick={() => handleRemove(section)}
                      disabled={isSaving}
                      className="border border-[#f5f5f0]/15 px-3 py-2 text-[9px] uppercase tracking-[0.16em] text-[#f5f5f0]/50 hover:text-[#ff7a55] hover:border-[#ff3d1a]/30 disabled:opacity-50 rounded"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
}

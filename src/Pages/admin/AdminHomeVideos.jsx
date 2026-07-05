import { useEffect, useState, useRef } from "react";
import { supabase } from "../../lib/supabaseClient";
import AdminLayout from "./AdminLayout";

export default function AdminHomeVideos() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState(null);
  const [error, setError] = useState("");
  const fileInputs = useRef({});

  useEffect(() => {
    loadSections();
  }, []);

  async function loadSections() {
    setLoading(true);
    const { data, error: fetchError } = await supabase
      .from("home_videos")
      .select("*")
      .order("sort_order", { ascending: true });

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setError("");
      setSections(data || []);
    }
    setLoading(false);
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

      const { error: updateError } = await supabase
        .from("home_videos")
        .update({ media_url: urlData.publicUrl })
        .eq("id", section.id);

      if (updateError) throw updateError;

      await loadSections();
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingKey(null);
    }
  }

  async function handleRemove(section) {
    setSavingKey(section.section_key);
    setError("");

    try {
      const { error: updateError } = await supabase
        .from("home_videos")
        .update({ media_url: null })
        .eq("id", section.id);

      if (updateError) throw updateError;
      await loadSections();
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingKey(null);
    }
  }

  async function handleTogglePublished(section) {
    setError("");

    const { error: updateError } = await supabase
      .from("home_videos")
      .update({ published: !section.published })
      .eq("id", section.id);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    await loadSections();
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-[#f5f5f0]/40 text-xs uppercase tracking-[0.3em] font-mono animate-pulse">
            Loading sections...
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
          Upload and manage videos for each section of the home page.
        </p>
      </div>

      {error && (
        <p className="mb-6 text-sm text-[#ff7a55] bg-[#ff3d1a]/5 border border-[#ff3d1a]/20 px-4 py-3 rounded">
          {error}
        </p>
      )}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {sections.map((section) => {
          const isSaving = savingKey === section.section_key;
          return (
            <div
              key={section.id}
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

              {/* Video Preview */}
              <div className="aspect-video bg-black relative overflow-hidden">
                {section.media_url ? (
                  <>
                    <video
                      src={section.media_url}
                      className="absolute inset-0 w-full h-full object-cover"
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                    {isSaving && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white animate-pulse">
                          Uploading...
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
              <div className="flex items-center gap-2 px-4 py-3 border-t border-[#f5f5f0]/10">
                <input
                  ref={(el) => { fileInputs.current[section.section_key] = el; }}
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
                  {section.media_url ? "Replace" : "Upload"}
                </button>
                {section.media_url && (
                  <button
                    type="button"
                    onClick={() => handleRemove(section)}
                    disabled={isSaving}
                    className="border border-[#f5f5f0]/15 px-3 py-2 text-[9px] uppercase tracking-[0.16em] text-[#f5f5f0]/50 hover:text-[#ff7a55] hover:border-[#ff3d1a]/30 disabled:opacity-50 rounded"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
}

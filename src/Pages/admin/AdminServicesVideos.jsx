import { useEffect, useState, useRef } from "react";
import { supabase } from "../../lib/supabaseClient";
import AdminLayout from "./AdminLayout";

function metricsToText(metrics) {
  return Array.isArray(metrics) ? metrics.join(", ") : "";
}

function textToMetrics(text) {
  return text
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export default function AdminServicesVideos() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState(null);
  const [savingTextKey, setSavingTextKey] = useState(null);
  const [error, setError] = useState("");
  const [textDrafts, setTextDrafts] = useState({});
  const fileInputs = useRef({});

  useEffect(() => {
    loadSections();
  }, []);

  async function loadSections() {
    setLoading(true);
    const { data, error: fetchError } = await supabase
      .from("services_videos")
      .select("*")
      .order("sort_order", { ascending: true });

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setError("");
      setSections(data || []);
      const drafts = {};
      (data || []).forEach((section) => {
        drafts[section.id] = {
          title: section.title || "",
          description: section.description || "",
          metrics: metricsToText(section.metrics),
          buttonLabel: section.button_label || "",
        };
      });
      setTextDrafts(drafts);
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
        .from("services-videos-media")
        .upload(path, file, { cacheControl: "3600", upsert: false });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("services-videos-media")
        .getPublicUrl(path);

      const { error: updateError } = await supabase
        .from("services_videos")
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
        .from("services_videos")
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
      .from("services_videos")
      .update({ published: !section.published })
      .eq("id", section.id);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    await loadSections();
  }

  function updateDraft(sectionId, field, value) {
    setTextDrafts((current) => ({
      ...current,
      [sectionId]: { ...current[sectionId], [field]: value },
    }));
  }

  async function handleSaveText(section) {
    setSavingTextKey(section.section_key);
    setError("");

    const draft = textDrafts[section.id] || {};

    try {
      const payload = {
        title: draft.title || null,
        description: draft.description || null,
        metrics: textToMetrics(draft.metrics),
        button_label: draft.buttonLabel || null,
      };

      const { error: updateError } = await supabase
        .from("services_videos")
        .update(payload)
        .eq("id", section.id);

      if (updateError) throw updateError;
      await loadSections();
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingTextKey(null);
    }
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
          Admin / Services Videos
        </p>
        <h1 className="text-3xl md:text-4xl font-black uppercase">
          Sekriac Page Editor
        </h1>
        <p className="mt-2 text-xs text-[#f5f5f0]/40 font-mono">
          Manage the video and heading/text for each section of the Sekriac
          page.
        </p>
      </div>

      {error && (
        <p className="mb-6 text-sm text-[#ff7a55] bg-[#ff3d1a]/5 border border-[#ff3d1a]/20 px-4 py-3 rounded">
          {error}
        </p>
      )}

      {sections.length === 0 && (
        <p className="mb-6 text-sm text-[#ff7a55] bg-[#ff3d1a]/5 border border-[#ff3d1a]/20 px-4 py-3 rounded">
          No sections found. The services_videos table has not been created yet —
          apply the migration supabase/migrations/202607050003_create_services_videos.sql
          to your Supabase project.
        </p>
      )}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {sections.map((section) => {
          const isSaving = savingKey === section.section_key;
          const isSavingText = savingTextKey === section.section_key;
          const draft = textDrafts[section.id] || {
            title: "",
            description: "",
            metrics: "",
            buttonLabel: "",
          };
          const isCta = section.section_key === "services_cta";
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
                    <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#f5f5f0]/20 text-center px-4">
                      No video — falling back to YouTube reel
                    </p>
                  </div>
                )}
              </div>

              {/* Video Actions */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-[#f5f5f0]/10">
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

              {/* Text Editor */}
              <div className="flex flex-col gap-3 px-4 py-4">
                <label className="block">
                  <span className="mb-1 block text-[9px] font-bold uppercase tracking-[0.18em] text-[#f5f5f0]/40">
                    Heading
                  </span>
                  <input
                    type="text"
                    value={draft.title}
                    onChange={(e) => updateDraft(section.id, "title", e.target.value)}
                    placeholder="Section heading"
                    className="w-full border border-[#f5f5f0]/15 bg-[#0a0a0a] px-3 py-2 text-xs text-[#f5f5f0] outline-none focus:border-[#ff3d1a] rounded"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-[9px] font-bold uppercase tracking-[0.18em] text-[#f5f5f0]/40">
                    Text
                  </span>
                  <textarea
                    value={draft.description}
                    onChange={(e) => updateDraft(section.id, "description", e.target.value)}
                    placeholder="Section paragraph"
                    rows={3}
                    className="w-full border border-[#f5f5f0]/15 bg-[#0a0a0a] px-3 py-2 text-xs text-[#f5f5f0] outline-none focus:border-[#ff3d1a] rounded resize-none"
                  />
                </label>

                {isCta ? (
                  <label className="block">
                    <span className="mb-1 block text-[9px] font-bold uppercase tracking-[0.18em] text-[#f5f5f0]/40">
                      Button Label
                    </span>
                    <input
                      type="text"
                      value={draft.buttonLabel}
                      onChange={(e) => updateDraft(section.id, "buttonLabel", e.target.value)}
                      placeholder="Button text"
                      className="w-full border border-[#f5f5f0]/15 bg-[#0a0a0a] px-3 py-2 text-xs text-[#f5f5f0] outline-none focus:border-[#ff3d1a] rounded"
                    />
                  </label>
                ) : (
                  <label className="block">
                    <span className="mb-1 block text-[9px] font-bold uppercase tracking-[0.18em] text-[#f5f5f0]/40">
                      Tags (comma separated)
                    </span>
                    <input
                      type="text"
                      value={draft.metrics}
                      onChange={(e) => updateDraft(section.id, "metrics", e.target.value)}
                      placeholder="TAG ONE, TAG TWO, TAG THREE"
                      className="w-full border border-[#f5f5f0]/15 bg-[#0a0a0a] px-3 py-2 text-xs text-[#f5f5f0] outline-none focus:border-[#ff3d1a] rounded"
                    />
                  </label>
                )}

                <button
                  type="button"
                  onClick={() => handleSaveText(section)}
                  disabled={isSavingText}
                  className="mt-1 border border-[#f5f5f0]/15 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.18em] text-[#f5f5f0]/70 hover:text-white hover:border-[#ff3d1a]/40 disabled:opacity-50 rounded"
                >
                  {isSavingText ? "Saving..." : "Save Text"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
}

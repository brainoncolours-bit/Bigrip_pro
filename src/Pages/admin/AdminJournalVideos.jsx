import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import AdminLayout from "./AdminLayout";

const emptyForm = {
  id: "",
  title: "",
  director: "SEKRICK ARCHIVE",
  runtime: "03:00 MIN",
  desc_text: "",
  media_url: "",
  sort_order: 1,
  published: true,
};

function rowToForm(row) {
  return {
    id: row.id,
    title: row.title || "",
    director: row.director || "SEKRICK ARCHIVE",
    runtime: row.runtime || "03:00 MIN",
    desc_text: row.desc_text || "",
    media_url: row.media_url || "",
    sort_order: row.sort_order || 1,
    published: row.published ?? true,
  };
}

export default function AdminJournalVideos() {
  const [videos, setVideos] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const editing = Boolean(form.id);

  useEffect(() => {
    loadVideos();
  }, []);

  async function loadVideos() {
    setLoading(true);
    const { data, error: loadError } = await supabase
      .from("journal_videos")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (loadError) setError(loadError.message);
    else setVideos(data || []);
    setLoading(false);
  }

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function uploadVideoFile() {
    if (!file) return form.media_url;

    const extension = file.name.split(".").pop();
    const path = `journal/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage
      .from("works-media")
      .upload(path, file, { cacheControl: "3600", upsert: false });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("works-media").getPublicUrl(path);
    return data.publicUrl;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setStatus("");
    setError("");

    try {
      const mediaUrl = await uploadVideoFile();
      if (!mediaUrl && !editing) {
        throw new Error("Please select a video file to upload.");
      }

      const sortOrder = editing
        ? videos.find((v) => v.id === form.id)?.sort_order || 1
        : videos.length + 1;

      const payload = {
        title: form.title,
        director: form.director,
        runtime: form.runtime,
        desc_text: form.desc_text,
        media_url: mediaUrl,
        sort_order: Number(form.sort_order) || sortOrder,
        published: form.published,
      };

      const query = editing
        ? supabase.from("journal_videos").update(payload).eq("id", form.id)
        : supabase.from("journal_videos").insert(payload);

      const { error: saveError } = await query;
      if (saveError) throw saveError;

      setStatus(editing ? "Journal video updated." : "Journal video uploaded.");
      setForm(emptyForm);
      setFile(null);
      await loadVideos();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    const { error: deleteError } = await supabase
      .from("journal_videos")
      .delete()
      .eq("id", id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    if (form.id === id) setForm(emptyForm);
    await loadVideos();
  }

  async function handleTogglePublished(video) {
    const { error: updateError } = await supabase
      .from("journal_videos")
      .update({ published: !video.published })
      .eq("id", video.id);

    if (updateError) {
      setError(updateError.message);
      return;
    }
    await loadVideos();
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-[#f5f5f0]/40 text-xs uppercase tracking-[0.3em] font-mono animate-pulse">
            Loading journal video reels...
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#ff3d1a]">
          Admin / Journal Dispatches
        </p>
        <h1 className="text-3xl md:text-4xl font-black uppercase">Journal Videos</h1>
        <p className="mt-2 text-xs text-[#f5f5f0]/40 font-mono">
          Upload and manage curated motion video essays displayed on the Journal page.
        </p>
      </div>

      {error && (
        <p className="mb-6 text-sm text-[#ff7a55] bg-[#ff3d1a]/5 border border-[#ff3d1a]/20 px-4 py-3 rounded">
          {error}
        </p>
      )}
      {status && (
        <p className="mb-6 text-sm text-[#f5f5f0]/60 bg-[#f5f5f0]/5 border border-[#f5f5f0]/10 px-4 py-3 rounded">
          {status}
        </p>
      )}

      <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
        {/* Upload Form */}
        <form onSubmit={handleSubmit} className="space-y-5 border border-[#f5f5f0]/10 bg-[#111] p-6 rounded">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#ff3d1a] mb-1">
              {editing ? "Edit" : "New"}
            </p>
            <h2 className="text-xl font-black uppercase">
              {editing ? "Edit Journal Video" : "Upload Journal Video"}
            </h2>
          </div>

          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-[#f5f5f0]/50">
              Video File from Device
            </span>
            <input
              className="w-full border border-[#f5f5f0]/15 bg-[#0a0a0a] px-4 py-3 text-sm"
              type="file"
              accept="video/*"
              required={!editing && !form.media_url}
              onChange={(event) => setFile(event.target.files?.[0] || null)}
            />
            {form.media_url && (
              <p className="mt-2 break-all text-xs text-[#f5f5f0]/45">
                Current URL: {form.media_url}
              </p>
            )}
          </label>

          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-[#f5f5f0]/50">
              Title
            </span>
            <input
              className="w-full border border-[#f5f5f0]/15 bg-[#0a0a0a] px-4 py-3 text-sm outline-none focus:border-[#ff3d1a]"
              value={form.title}
              onChange={(event) => updateField("title", event.target.value)}
              placeholder="e.g. ATMOSPHERIC COMPOSITION & RHYTHM"
              required
            />
          </label>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-[#f5f5f0]/50">
                Director / Category
              </span>
              <input
                className="w-full border border-[#f5f5f0]/15 bg-[#0a0a0a] px-4 py-3 text-sm outline-none focus:border-[#ff3d1a]"
                value={form.director}
                onChange={(event) => updateField("director", event.target.value)}
                placeholder="e.g. SEKRICK ARCHIVE"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-[#f5f5f0]/50">
                Runtime Duration
              </span>
              <input
                className="w-full border border-[#f5f5f0]/15 bg-[#0a0a0a] px-4 py-3 text-sm outline-none focus:border-[#ff3d1a]"
                value={form.runtime}
                onChange={(event) => updateField("runtime", event.target.value)}
                placeholder="e.g. 03:42 MIN"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-[#f5f5f0]/50">
              Description
            </span>
            <textarea
              className="min-h-24 w-full border border-[#f5f5f0]/15 bg-[#0a0a0a] px-4 py-3 text-sm outline-none focus:border-[#ff3d1a]"
              value={form.desc_text}
              onChange={(event) => updateField("desc_text", event.target.value)}
              placeholder="Overview of the visual piece..."
            />
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(event) => updateField("published", event.target.checked)}
              className="accent-[#ff3d1a] w-4 h-4"
            />
            <span className="text-xs uppercase tracking-[0.18em] text-[#f5f5f0]/60">
              Published (visible in Journal)
            </span>
          </label>

          <div className="flex gap-3">
            <button
              className="bg-[#ff3d1a] px-5 py-3 text-sm font-black uppercase tracking-[0.18em] text-[#0a0a0a] disabled:opacity-50"
              type="submit"
              disabled={saving}
            >
              {saving ? "Uploading & Saving..." : "Save"}
            </button>
            {editing && (
              <button
                className="border border-[#f5f5f0]/15 px-5 py-3 text-sm font-bold uppercase tracking-[0.18em] text-[#f5f5f0]/70"
                type="button"
                onClick={() => {
                  setForm(emptyForm);
                  setFile(null);
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Video List Sidebar */}
        <aside>
          <h2 className="mb-4 text-sm font-black uppercase tracking-[0.2em]">Live Dispatches</h2>
          <div className="space-y-3">
            {videos.length === 0 && (
              <p className="text-xs text-[#f5f5f0]/40">No journal videos uploaded yet.</p>
            )}
            {videos.map((vid, idx) => (
              <div key={vid.id} className="border border-[#f5f5f0]/10 bg-[#111] p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold truncate">
                    FILM_{String(idx + 1).padStart(2, "0")} · {vid.title}
                  </p>
                  <label className="flex items-center gap-1.5 cursor-pointer flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={vid.published}
                      onChange={() => handleTogglePublished(vid)}
                      className="accent-[#ff3d1a] w-3.5 h-3.5"
                    />
                    <span className="text-[9px] uppercase tracking-[0.15em] text-[#f5f5f0]/50">
                      Live
                    </span>
                  </label>
                </div>
                <p className="mt-1 text-[10px] font-mono text-[#f5f5f0]/35">
                  {vid.director} · {vid.runtime}
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setForm(rowToForm(vid));
                      setFile(null);
                    }}
                    className="border border-[#f5f5f0]/15 px-3 py-2 text-xs uppercase tracking-[0.16em]"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(vid.id)}
                    className="border border-[#ff3d1a]/30 px-3 py-2 text-xs uppercase tracking-[0.16em] text-[#ff7a55]"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </AdminLayout>
  );
}
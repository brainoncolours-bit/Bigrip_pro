import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import AdminLayout from "./AdminLayout";

const emptyForm = {
  id: "",
  artist_id: "",
  category_id: "",
  title: "",
  year: "",
  media_url: "",
  sort_order: 1,
  published: false,
};

function rowToForm(row) {
  return {
    id: row.id,
    artist_id: row.artist_id || "",
    category_id: row.category_id || "",
    title: row.title || "",
    year: row.year || "",
    media_url: row.media_url || "",
    sort_order: row.sort_order || 1,
    published: row.published || false,
  };
}

function getMediaType(file, fallbackUrl) {
  if (file?.type?.startsWith("video/")) return "video";
  if (file?.type?.startsWith("image/")) return "image";
  if (fallbackUrl?.match(/\.(mp4|mov|webm|m4v)(\?|$)/i)) return "video";
  return "image";
}

export default function AdminArtistWorks() {
  const [works, setWorks] = useState([]);
  const [artists, setArtists] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const editing = Boolean(form.id);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [workRes, artistRes, categoryRes] = await Promise.all([
      supabase
        .from("artist_works")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true }),
      supabase
        .from("artists")
        .select("id, name")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true }),
      supabase
        .from("categories")
        .select("id, name, sort_order")
        .order("sort_order", { ascending: true }),
    ]);

    if (workRes.error) setError(workRes.error.message);
    else setWorks(workRes.data || []);

    if (artistRes.error) setError(artistRes.error.message);
    else setArtists(artistRes.data || []);

    if (categoryRes.error) setError(categoryRes.error.message);
    else setCategories(categoryRes.data || []);
    setLoading(false);
  }

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function uploadMedia() {
    if (!file) return form.media_url;

    const extension = file.name.split(".").pop();
    const path = `works/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage
      .from("artists-media")
      .upload(path, file, { cacheControl: "3600", upsert: false });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("artists-media").getPublicUrl(path);
    return data.publicUrl;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setStatus("");
    setError("");

    if (!form.artist_id) {
      setError("Please choose an artist.");
      setSaving(false);
      return;
    }

    try {
      const mediaUrl = await uploadMedia();
      const sortOrder = editing
        ? works.find((work) => work.id === form.id)?.sort_order || 0
        : works.length + 1;

      const payload = {
        artist_id: form.artist_id,
        category_id: form.category_id || null,
        title: form.title,
        year: form.year || null,
        media_type: getMediaType(file, mediaUrl),
        media_url: mediaUrl || null,
        sort_order: Number(form.sort_order) || sortOrder,
        published: form.published,
      };

      const query = editing
        ? supabase.from("artist_works").update(payload).eq("id", form.id)
        : supabase.from("artist_works").insert(payload);

      const { error: saveError } = await query;
      if (saveError) throw saveError;

      setStatus(editing ? "Work updated." : "Work added.");
      setForm(emptyForm);
      setFile(null);
      await loadData();
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    const { error: deleteError } = await supabase.from("artist_works").delete().eq("id", id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    if (form.id === id) setForm(emptyForm);
    await loadData();
  }

  function artistName(id) {
    return artists.find((artist) => artist.id === id)?.name || "—";
  }

  function categoryName(id) {
    return categories.find((category) => category.id === id)?.name || "";
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-[#f5f5f0]/40 text-xs uppercase tracking-[0.3em] font-mono animate-pulse">
            Loading works...
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#ff3d1a]">
          Admin / Artist Works
        </p>
        <h1 className="text-3xl md:text-4xl font-black uppercase">Artist Works</h1>
        <p className="mt-2 text-xs text-[#f5f5f0]/40 font-mono">
          Add portfolio images / videos for each artist.
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
        <form onSubmit={handleSubmit} className="space-y-5 border border-[#f5f5f0]/10 bg-[#111] p-6 rounded">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#ff3d1a] mb-1">
              {editing ? "Edit" : "New"}
            </p>
            <h2 className="text-xl font-black uppercase">{editing ? "Edit Work" : "Add Work"}</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-[#f5f5f0]/50">
                Artist
              </span>
              <select
                className="w-full border border-[#f5f5f0]/15 bg-[#0a0a0a] px-4 py-3 text-sm outline-none focus:border-[#ff3d1a]"
                value={form.artist_id}
                onChange={(event) => updateField("artist_id", event.target.value)}
                required
              >
                <option value="">— Select artist —</option>
                {artists.map((artist) => (
                  <option key={artist.id} value={artist.id}>
                    {artist.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-[#f5f5f0]/50">
                Category (optional)
              </span>
              <select
                className="w-full border border-[#f5f5f0]/15 bg-[#0a0a0a] px-4 py-3 text-sm outline-none focus:border-[#ff3d1a]"
                value={form.category_id}
                onChange={(event) => updateField("category_id", event.target.value)}
              >
                <option value="">— No category —</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-[#f5f5f0]/50">
                Title
              </span>
              <input
                className="w-full border border-[#f5f5f0]/15 bg-[#0a0a0a] px-4 py-3 text-sm outline-none focus:border-[#ff3d1a]"
                value={form.title}
                onChange={(event) => updateField("title", event.target.value)}
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-[#f5f5f0]/50">
                Year
              </span>
              <input
                className="w-full border border-[#f5f5f0]/15 bg-[#0a0a0a] px-4 py-3 text-sm outline-none focus:border-[#ff3d1a]"
                value={form.year}
                onChange={(event) => updateField("year", event.target.value)}
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-[#f5f5f0]/50">
              File (image / video)
            </span>
            <input
              className="w-full border border-[#f5f5f0]/15 bg-[#0a0a0a] px-4 py-3 text-sm"
              type="file"
              accept="image/*,video/*"
              onChange={(event) => setFile(event.target.files?.[0] || null)}
            />
            {form.media_url && (
              <p className="mt-2 break-all text-xs text-[#f5f5f0]/45">
                Current: {form.media_url}
              </p>
            )}
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(event) => updateField("published", event.target.checked)}
              className="accent-[#ff3d1a] w-4 h-4"
            />
            <span className="text-xs uppercase tracking-[0.18em] text-[#f5f5f0]/60">
              Published (visible publicly)
            </span>
          </label>

          <div className="flex gap-3">
            <button
              className="bg-[#ff3d1a] px-5 py-3 text-sm font-black uppercase tracking-[0.18em] text-[#0a0a0a] disabled:opacity-50"
              type="submit"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
            {editing && (
              <button
                className="border border-[#f5f5f0]/15 px-5 py-3 text-sm font-bold uppercase tracking-[0.18em] text-[#f5f5f0]/70"
                type="button"
                onClick={() => { setForm(emptyForm); setFile(null); }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <aside>
          <h2 className="mb-4 text-sm font-black uppercase tracking-[0.2em]">Works</h2>
          <div className="space-y-3">
            {works.length === 0 && (
              <p className="text-xs text-[#f5f5f0]/40">No works yet.</p>
            )}
            {works.map((work) => (
              <div key={work.id} className="border border-[#f5f5f0]/10 bg-[#111] p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate">{work.title || "Untitled"}</p>
                    <p className="mt-1 text-[10px] font-mono text-[#f5f5f0]/35">
                      {artistName(work.artist_id)}
                      {categoryName(work.category_id) ? ` · ${categoryName(work.category_id)}` : ""}
                      {work.year ? ` · ${work.year}` : ""}
                    </p>
                  </div>
                  <span className="shrink-0 text-[9px] uppercase tracking-[0.15em] text-[#f5f5f0]/40 border border-[#f5f5f0]/10 px-2 py-1">
                    {work.published ? "Live" : "Draft"}
                  </span>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setForm(rowToForm(work)); setFile(null); }}
                    className="border border-[#f5f5f0]/15 px-3 py-2 text-xs uppercase tracking-[0.16em]"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(work.id)}
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

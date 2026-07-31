import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import AdminLayout from "./AdminLayout";

const emptyForm = {
  id: "",
  name: "",
  role: "",
  bio: "",
  image_url: "",
  website_url: "",
  instagram_url: "",
  category_id: "",
  sort_order: 1,
  published: false,
};

function rowToForm(row) {
  return {
    id: row.id,
    name: row.name || "",
    role: row.role || "",
    bio: row.bio || "",
    image_url: row.image_url || "",
    website_url: row.website_url || "",
    instagram_url: row.instagram_url || "",
    category_id: row.category_id || "",
    sort_order: row.sort_order || 1,
    published: row.published || false,
  };
}

export default function AdminArtists() {
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
    const [artistRes, categoryRes] = await Promise.all([
      supabase
        .from("artists")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true }),
      supabase
        .from("categories")
        .select("id, name, sort_order, published")
        .order("sort_order", { ascending: true }),
    ]);

    if (artistRes.error) setError(artistRes.error.message);
    else setArtists(artistRes.data || []);

    if (categoryRes.error) setError(categoryRes.error.message);
    else setCategories(categoryRes.data || []);
    setLoading(false);
  }

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function uploadImage() {
    if (!file) return form.image_url;

    const extension = file.name.split(".").pop();
    const path = `artists/${crypto.randomUUID()}.${extension}`;
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

    try {
      const imageUrl = await uploadImage();
      const sortOrder = editing
        ? artists.find((artist) => artist.id === form.id)?.sort_order || 0
        : artists.length + 1;

      const payload = {
        name: form.name,
        role: form.role,
        bio: form.bio,
        image_url: imageUrl || null,
        website_url: form.website_url || null,
        instagram_url: form.instagram_url || null,
        category_id: form.category_id || null,
        sort_order: Number(form.sort_order) || sortOrder,
        published: form.published,
      };

      const query = editing
        ? supabase.from("artists").update(payload).eq("id", form.id)
        : supabase.from("artists").insert(payload);

      const { error: saveError } = await query;
      if (saveError) throw saveError;

      setStatus(editing ? "Artist updated." : "Artist added.");
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
    const { error: deleteError } = await supabase.from("artists").delete().eq("id", id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    if (form.id === id) setForm(emptyForm);
    await loadData();
  }

  async function handleTogglePublished(artist) {
    const { error: updateError } = await supabase
      .from("artists")
      .update({ published: !artist.published })
      .eq("id", artist.id);

    if (updateError) {
      setError(updateError.message);
      return;
    }
    await loadData();
  }

  function categoryName(id) {
    return categories.find((category) => category.id === id)?.name || "—";
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-[#f5f5f0]/40 text-xs uppercase tracking-[0.3em] font-mono animate-pulse">
            Loading artists...
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#ff3d1a]">
          Admin / Artists
        </p>
        <h1 className="text-3xl md:text-4xl font-black uppercase">Artists</h1>
        <p className="mt-2 text-xs text-[#f5f5f0]/40 font-mono">
          Manage artists and assign them to a category.
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
            <h2 className="text-xl font-black uppercase">{editing ? "Edit Artist" : "Add Artist"}</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-[#f5f5f0]/50">
                Name
              </span>
              <input
                className="w-full border border-[#f5f5f0]/15 bg-[#0a0a0a] px-4 py-3 text-sm outline-none focus:border-[#ff3d1a]"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-[#f5f5f0]/50">
                Role
              </span>
              <input
                className="w-full border border-[#f5f5f0]/15 bg-[#0a0a0a] px-4 py-3 text-sm outline-none focus:border-[#ff3d1a]"
                value={form.role}
                onChange={(event) => updateField("role", event.target.value)}
                placeholder="e.g. Director / Photographer"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-[#f5f5f0]/50">
              Category
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

          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-[#f5f5f0]/50">
              Bio
            </span>
            <textarea
              className="min-h-24 w-full border border-[#f5f5f0]/15 bg-[#0a0a0a] px-4 py-3 text-sm outline-none focus:border-[#ff3d1a]"
              value={form.bio}
              onChange={(event) => updateField("bio", event.target.value)}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-[#f5f5f0]/50">
              Profile Image
            </span>
            <input
              className="w-full border border-[#f5f5f0]/15 bg-[#0a0a0a] px-4 py-3 text-sm"
              type="file"
              accept="image/*"
              onChange={(event) => setFile(event.target.files?.[0] || null)}
            />
            {form.image_url && (
              <p className="mt-2 break-all text-xs text-[#f5f5f0]/45">
                Current: {form.image_url}
              </p>
            )}
          </label>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-[#f5f5f0]/50">
                Website URL
              </span>
              <input
                className="w-full border border-[#f5f5f0]/15 bg-[#0a0a0a] px-4 py-3 text-sm outline-none focus:border-[#ff3d1a]"
                value={form.website_url}
                onChange={(event) => updateField("website_url", event.target.value)}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-[#f5f5f0]/50">
                Instagram URL
              </span>
              <input
                className="w-full border border-[#f5f5f0]/15 bg-[#0a0a0a] px-4 py-3 text-sm outline-none focus:border-[#ff3d1a]"
                value={form.instagram_url}
                onChange={(event) => updateField("instagram_url", event.target.value)}
              />
            </label>
          </div>

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
          <h2 className="mb-4 text-sm font-black uppercase tracking-[0.2em]">Artists</h2>
          <div className="space-y-3">
            {artists.length === 0 && (
              <p className="text-xs text-[#f5f5f0]/40">No artists yet.</p>
            )}
            {artists.map((artist) => (
              <div key={artist.id} className="border border-[#f5f5f0]/10 bg-[#111] p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold">{artist.name}</p>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={artist.published}
                      onChange={() => handleTogglePublished(artist)}
                      className="accent-[#ff3d1a] w-3.5 h-3.5"
                    />
                    <span className="text-[9px] uppercase tracking-[0.15em] text-[#f5f5f0]/50">
                      Live
                    </span>
                  </label>
                </div>
                <p className="mt-1 text-[10px] font-mono text-[#f5f5f0]/35">
                  {categoryName(artist.category_id)}
                  {artist.role ? ` · ${artist.role}` : ""}
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setForm(rowToForm(artist)); setFile(null); }}
                    className="border border-[#f5f5f0]/15 px-3 py-2 text-xs uppercase tracking-[0.16em]"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(artist.id)}
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

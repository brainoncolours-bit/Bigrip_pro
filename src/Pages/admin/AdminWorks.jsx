import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

const emptyForm = {
  id: "",
  title: "",
  desc: "",
  media_url: "",
};

function rowToForm(row) {
  return {
    id: row.id,
    title: row.title || "",
    desc: row.desc || "",
    media_url: row.media_url || "",
  };
}

function getMediaType(file, fallbackUrl) {
  if (file?.type?.startsWith("video/")) return "video";
  if (file?.type?.startsWith("image/")) return "image";
  if (fallbackUrl?.match(/\.(mp4|mov|webm|m4v)(\?|$)/i)) return "video";
  return "image";
}

export default function AdminWorks() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [works, setWorks] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const editing = Boolean(form.id);

  useEffect(() => {
    async function loadSession() {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setAuthLoading(false);

      if (!data.session) navigate("/admin/login");
    }

    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (!nextSession) navigate("/admin/login");
    });

    return () => listener.subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (session) loadWorks();
  }, [session]);

  async function loadWorks() {
    const { data, error: loadError } = await supabase
      .from("works")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (loadError) {
      setError(loadError.message);
      return;
    }

    setError("");
    setWorks(data || []);
  }

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function uploadMedia() {
    if (!file) return form.media_url;

    const extension = file.name.split(".").pop();
    const path = `${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage
      .from("works-media")
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });

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
      const mediaUrl = await uploadMedia();
      const sortOrder = editing
        ? works.find((work) => work.id === form.id)?.sort_order || 0
        : works.length + 1;

      const payload = {
        display_id: String(sortOrder).padStart(2, "0"),
        sort_order: sortOrder,
        title: form.title,
        category: "Project",
        year: new Date().getFullYear().toString(),
        tag: "Featured",
        size: "small",
        accent: false,
        media_type: getMediaType(file, mediaUrl),
        media_url: mediaUrl || null,
        desc: form.desc,
        details: [],
        color: "from-[#1a0a05] via-[#0f0a08] to-[#0a0a0a]",
        published: true,
      };

      const query = editing
        ? supabase.from("works").update(payload).eq("id", form.id)
        : supabase.from("works").insert(payload);

      const { error: saveError } = await query;
      if (saveError) throw saveError;

      setStatus(editing ? "Work updated." : "Work uploaded.");
      setForm(emptyForm);
      setFile(null);
      await loadWorks();
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    const { error: deleteError } = await supabase.from("works").delete().eq("id", id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    if (form.id === id) setForm(emptyForm);
    await loadWorks();
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate("/admin/login");
  }

  if (authLoading) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] px-6 py-28 text-[#f5f5f0]">
        Loading...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-6 py-28 text-[#f5f5f0]">
      <section className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#ff3d1a]">
                Admin
              </p>
              <h1 className="text-4xl font-black uppercase">
                {editing ? "Edit Work" : "New Work"}
              </h1>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              className="border border-[#f5f5f0]/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#f5f5f0]/70"
            >
              Sign out
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-[#f5f5f0]/50">
                File
              </span>
              <input
                className="w-full border border-[#f5f5f0]/15 bg-[#111] px-4 py-3 text-sm"
                type="file"
                accept="image/*,video/*"
                required={!editing && !form.media_url}
                onChange={(event) => setFile(event.target.files?.[0] || null)}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-[#f5f5f0]/50">
                Name
              </span>
              <input
                className="w-full border border-[#f5f5f0]/15 bg-[#111] px-4 py-3 text-sm outline-none focus:border-[#ff3d1a]"
                value={form.title}
                onChange={(event) => updateField("title", event.target.value)}
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-[#f5f5f0]/50">
                Description
              </span>
              <textarea
                className="min-h-36 w-full border border-[#f5f5f0]/15 bg-[#111] px-4 py-3 text-sm outline-none focus:border-[#ff3d1a]"
                value={form.desc}
                onChange={(event) => updateField("desc", event.target.value)}
                required
              />
            </label>

            {form.media_url && (
              <p className="break-all text-xs text-[#f5f5f0]/45">
                Current file: {form.media_url}
              </p>
            )}

            {error && <p className="text-sm text-[#ff7a55]">{error}</p>}
            {status && <p className="text-sm text-[#f5f5f0]/60">{status}</p>}

            <div className="flex gap-3">
              <button
                className="bg-[#ff3d1a] px-5 py-3 text-sm font-black uppercase tracking-[0.18em] text-[#0a0a0a] disabled:opacity-50"
                type="submit"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                className="border border-[#f5f5f0]/15 px-5 py-3 text-sm font-bold uppercase tracking-[0.18em] text-[#f5f5f0]/70"
                type="button"
                onClick={() => {
                  setForm(emptyForm);
                  setFile(null);
                }}
              >
                New
              </button>
            </div>
          </form>
        </div>

        <aside>
          <h2 className="mb-4 text-sm font-black uppercase tracking-[0.2em]">Items</h2>
          <div className="space-y-3">
            {works.map((work) => (
              <div key={work.id} className="border border-[#f5f5f0]/10 bg-[#111] p-4">
                <p className="text-sm font-bold">{work.title}</p>
                <p className="mb-3 mt-1 line-clamp-2 text-xs text-[#f5f5f0]/45">
                  {work.desc}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setForm(rowToForm(work))}
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
      </section>
    </main>
  );
}

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import AdminLayout from "./AdminLayout";

const emptyForm = {
  id: "",
  name: "",
  sort_order: 1,
  published: false,
};

function rowToForm(row) {
  return {
    id: row.id,
    name: row.name || "",
    sort_order: row.sort_order || 1,
    published: row.published || false,
  };
}

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const editing = Boolean(form.id);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    setLoading(true);
    const { data, error: loadError } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (loadError) {
      setError(loadError.message);
    } else {
      setError("");
      setCategories(data || []);
    }
    setLoading(false);
  }

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setStatus("");
    setError("");

    const payload = {
      name: form.name,
      sort_order: Number(form.sort_order) || 0,
      published: form.published,
    };

    const query = editing
      ? supabase.from("categories").update(payload).eq("id", form.id)
      : supabase.from("categories").insert(payload);

    const { error: saveError } = await query;
    if (saveError) {
      setError(saveError.message);
      setSaving(false);
      return;
    }

    setStatus(editing ? "Category updated." : "Category added.");
    setForm(emptyForm);
    setSaving(false);
    await loadCategories();
  }

  async function handleDelete(id) {
    const { error: deleteError } = await supabase.from("categories").delete().eq("id", id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    if (form.id === id) setForm(emptyForm);
    await loadCategories();
  }

  async function handleTogglePublished(category) {
    const { error: updateError } = await supabase
      .from("categories")
      .update({ published: !category.published })
      .eq("id", category.id);

    if (updateError) {
      setError(updateError.message);
      return;
    }
    await loadCategories();
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-[#f5f5f0]/40 text-xs uppercase tracking-[0.3em] font-mono animate-pulse">
            Loading categories...
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#ff3d1a]">
          Admin / Categories
        </p>
        <h1 className="text-3xl md:text-4xl font-black uppercase">Categories</h1>
        <p className="mt-2 text-xs text-[#f5f5f0]/40 font-mono">
          Group artists on the artist page (e.g. Direction & Motion, Styling, Casting).
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
            <h2 className="text-xl font-black uppercase">{editing ? "Edit Category" : "Add Category"}</h2>
          </div>

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
              Sort Order
            </span>
            <input
              className="w-full border border-[#f5f5f0]/15 bg-[#0a0a0a] px-4 py-3 text-sm outline-none focus:border-[#ff3d1a]"
              type="number"
              value={form.sort_order}
              onChange={(event) => updateField("sort_order", event.target.value)}
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
                onClick={() => setForm(emptyForm)}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <aside>
          <h2 className="mb-4 text-sm font-black uppercase tracking-[0.2em]">Categories</h2>
          <div className="space-y-3">
            {categories.length === 0 && (
              <p className="text-xs text-[#f5f5f0]/40">No categories yet.</p>
            )}
            {categories.map((category) => (
              <div key={category.id} className="border border-[#f5f5f0]/10 bg-[#111] p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold">{category.name}</p>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={category.published}
                      onChange={() => handleTogglePublished(category)}
                      className="accent-[#ff3d1a] w-3.5 h-3.5"
                    />
                    <span className="text-[9px] uppercase tracking-[0.15em] text-[#f5f5f0]/50">
                      Live
                    </span>
                  </label>
                </div>
                <p className="mt-1 text-[10px] font-mono text-[#f5f5f0]/35">
                  order {category.sort_order}
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setForm(rowToForm(category))}
                    className="border border-[#f5f5f0]/15 px-3 py-2 text-xs uppercase tracking-[0.16em]"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(category.id)}
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

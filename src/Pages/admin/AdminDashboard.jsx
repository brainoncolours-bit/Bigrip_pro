import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import AdminLayout from "./AdminLayout";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [videoCount, setVideoCount] = useState(0);
  const [publishedCount, setPublishedCount] = useState(0);

  useEffect(() => {
    async function loadStats() {
      const { data } = await supabase
        .from("home_videos")
        .select("published");

      if (data) {
        setVideoCount(data.length);
        setPublishedCount(data.filter((v) => v.published).length);
      }
    }
    loadStats();
  }, []);

  return (
    <AdminLayout>
      <div className="mb-8">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#ff3d1a]">
          Admin / Dashboard
        </p>
        <h1 className="text-3xl md:text-4xl font-black uppercase">
          Dashboard
        </h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <button
          type="button"
          onClick={() => navigate("/admin/home-videos")}
          className="border border-[#f5f5f0]/10 bg-[#111] p-6 rounded text-left hover:border-[#ff3d1a]/40 transition-colors group"
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#ff3d1a] mb-2">
            Video Upload
          </p>
          <h2 className="text-xl font-black uppercase mb-1 group-hover:text-[#ff3d1a] transition-colors">
            Upload Videos
          </h2>
          <p className="text-xs text-[#f5f5f0]/40 font-mono">
            {publishedCount} of {videoCount} sections active
          </p>
        </button>

        <button
          type="button"
          onClick={() => navigate("/admin/works")}
          className="border border-[#f5f5f0]/10 bg-[#111] p-6 rounded text-left hover:border-[#ff3d1a]/40 transition-colors group"
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#ff3d1a] mb-2">
            Upload Work
          </p>
          <h2 className="text-xl font-black uppercase mb-1 group-hover:text-[#ff3d1a] transition-colors">
            Upload Work
          </h2>
          <p className="text-xs text-[#f5f5f0]/40 font-mono">
            Upload and manage portfolio work
          </p>
        </button>

        <button
          type="button"
          onClick={() => navigate("/admin/categories")}
          className="border border-[#f5f5f0]/10 bg-[#111] p-6 rounded text-left hover:border-[#ff3d1a]/40 transition-colors group"
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#ff3d1a] mb-2">
            Artist Page
          </p>
          <h2 className="text-xl font-black uppercase mb-1 group-hover:text-[#ff3d1a] transition-colors">
            Categories
          </h2>
          <p className="text-xs text-[#f5f5f0]/40 font-mono">
            Create artist page category groups
          </p>
        </button>

        <button
          type="button"
          onClick={() => navigate("/admin/artists")}
          className="border border-[#f5f5f0]/10 bg-[#111] p-6 rounded text-left hover:border-[#ff3d1a]/40 transition-colors group"
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#ff3d1a] mb-2">
            Artist Page
          </p>
          <h2 className="text-xl font-black uppercase mb-1 group-hover:text-[#ff3d1a] transition-colors">
            Artists
          </h2>
          <p className="text-xs text-[#f5f5f0]/40 font-mono">
            Add artists and assign a category
          </p>
        </button>

        <button
          type="button"
          onClick={() => navigate("/admin/artist-works")}
          className="border border-[#f5f5f0]/10 bg-[#111] p-6 rounded text-left hover:border-[#ff3d1a]/40 transition-colors group"
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#ff3d1a] mb-2">
            Artist Page
          </p>
          <h2 className="text-xl font-black uppercase mb-1 group-hover:text-[#ff3d1a] transition-colors">
            Artist Works
          </h2>
          <p className="text-xs text-[#f5f5f0]/40 font-mono">
            Add portfolio images / videos per artist
          </p>
        </button>
      </div>
    </AdminLayout>
  );
}

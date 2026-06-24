import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    navigate("/admin/works");
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-6 py-28 text-[#f5f5f0]">
      <section className="mx-auto max-w-md">
        <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#ff3d1a]">
          Admin
        </p>
        <h1 className="mb-8 text-4xl font-black uppercase">Sign in</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-[#f5f5f0]/55">
              Email
            </span>
            <input
              className="w-full border border-[#f5f5f0]/15 bg-[#111] px-4 py-3 text-sm outline-none focus:border-[#ff3d1a]"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-[#f5f5f0]/55">
              Password
            </span>
            <input
              className="w-full border border-[#f5f5f0]/15 bg-[#111] px-4 py-3 text-sm outline-none focus:border-[#ff3d1a]"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {error && <p className="text-sm text-[#ff7a55]">{error}</p>}

          <button
            className="w-full bg-[#ff3d1a] px-4 py-3 text-sm font-black uppercase tracking-[0.2em] text-[#0a0a0a] disabled:opacity-50"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}

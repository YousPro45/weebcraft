"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Lock, Eye, EyeOff, Building2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading]  = useState(false);
  const [error, setError]      = useState("");

  const handleLogin = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error ?? "Identifiants incorrects.");
        setLoading(false);
      }
    } catch {
      setError("Erreur réseau. Réessayez.");
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(135deg,#0D1F3C 0%,#1A3A6B 100%)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md px-4"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-[#1A3A6B] flex items-center justify-center mb-4">
              <Building2 size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#0D1F3C]">WebCraft Admin</h1>
            <p className="text-[#5A738A] text-sm mt-1">Connectez-vous à votre espace</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-[#0D1F3C] mb-1.5">
                Nom d&apos;utilisateur
              </label>
              <div className="relative">
                <User size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5A738A]" />
                <input
                  required
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  autoComplete="username"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#EAF2FA] focus:border-[#1E90D4] focus:outline-none text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-[#0D1F3C] mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5A738A]" />
                <input
                  required
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full pl-11 pr-11 py-3 rounded-xl border border-[#EAF2FA] focus:border-[#1E90D4] focus:outline-none text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5A738A] hover:text-[#1E90D4]"
                  aria-label={showPwd ? "Masquer" : "Afficher"}
                >
                  {showPwd ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 rounded-xl px-4 py-3 border border-red-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary justify-center py-3.5 text-base disabled:opacity-60"
            >
              {loading ? "Connexion..." : "Se Connecter"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

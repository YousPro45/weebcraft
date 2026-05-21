"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Save, RefreshCw } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import { createClient } from "@/lib/supabase-browser";

type Setting = { id:string; key:string; value:string; label:string; grp:string; type:string };

const groups: Record<string,string> = { general:"Général", contact:"Contact & Coordonnées", social:"Réseaux Sociaux" };

export default function SettingsPage() {
  const sb = createClient();
  const [settings, setSettings] = useState<Setting[]>([]);
  const [values, setValues] = useState<Record<string,string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = async () => { const { data } = await sb.from("settings").select("*").order("grp"); setSettings(data??[]); const v: Record<string,string>={}; (data??[]).forEach((s:Setting)=>{ v[s.key]=s.value??"";}); setValues(v); setLoading(false); };
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    setSaving(true);
    await Promise.all(settings.map(s => sb.from("settings").update({ value: values[s.key]??"" }).eq("id", s.id)));
    setSaving(false); setSaved(true); setTimeout(()=>setSaved(false), 2500);
  };

  const grouped = Object.keys(groups).map(grp => ({
    grp, label: groups[grp], items: settings.filter(s=>s.grp===grp)
  }));

  return (
    <div className="flex flex-col min-h-full">
      <AdminHeader title="Paramètres" subtitle="Configuration générale du site"
        action={
          <button onClick={handleSave} disabled={saving}
            className={`btn-primary text-sm py-2 px-5 flex items-center gap-1.5 ${saved?"bg-green-600":""}`}>
            {saving ? <RefreshCw size={15} className="animate-spin" /> : <Save size={15} />}
            {saved ? "Sauvegardé !" : saving ? "Sauvegarde..." : "Sauvegarder"}
          </button>
        } />
      <main className="flex-1 p-6 max-w-3xl">
        {loading ? <div className="bg-white rounded-2xl p-12 text-center text-[#5A738A]">Chargement...</div> : (
          <div className="space-y-6">
            {grouped.map(({ grp, label, items }) => items.length === 0 ? null : (
              <motion.div key={grp} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="font-bold text-[#0D1F3C] text-sm">{label}</h2>
                </div>
                <div className="p-6 space-y-4">
                  {items.map(s => (
                    <div key={s.key}>
                      <label className="block text-xs font-semibold text-[#0D1F3C] mb-1.5">{s.label || s.key}</label>
                      <input
                        value={values[s.key]??""}
                        onChange={e=>setValues(v=>({...v,[s.key]:e.target.value}))}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#EAF2FA] focus:border-[#1E90D4] focus:outline-none text-sm text-[#0D1F3C] transition-colors"
                        placeholder={`Entrez ${s.label||s.key}...`}
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}

            {/* Env vars info */}
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: 0.3 }}
              className="rounded-2xl p-5 border-2 border-dashed border-[#1E90D4]/30 bg-[#EAF2FA]">
              <h3 className="font-bold text-[#0D1F3C] text-sm mb-3">Variables d&apos;environnement requises</h3>
              <div className="space-y-2 font-mono text-xs">
                {["NEXT_PUBLIC_SUPABASE_URL","NEXT_PUBLIC_SUPABASE_ANON_KEY","SUPABASE_SERVICE_ROLE_KEY"].map(k=>(
                  <div key={k} className="flex items-center gap-2">
                    <code className="bg-white px-2 py-1 rounded text-[#1A3A6B] border border-[#1E90D4]/20">{k}</code>
                  </div>
                ))}
              </div>
              <p className="text-[#5A738A] text-xs mt-3">Ajoutez ces variables dans le fichier <code className="bg-white px-1 rounded">.env.local</code> à la racine du projet.</p>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
}

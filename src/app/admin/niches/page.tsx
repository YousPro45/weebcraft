"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2 } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import { createClient } from "@/lib/supabase-browser";

type Niche = { id: string; name: string; slug: string; emoji: string; color: string; is_active: boolean; sort_order: number };
const empty: Omit<Niche,"id"> = { name:"", slug:"", emoji:"🏢", color:"#1E90D4", is_active:true, sort_order:0 };

export default function NichesPage() {
  const sb = createClient();
  const [items, setItems] = useState<Niche[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; data: Partial<Niche> }>({ open: false, data: empty });
  const [saving, setSaving] = useState(false);

  const load = async () => { const { data } = await sb.from("niches").select("*").order("sort_order"); setItems(data ?? []); setLoading(false); };
  useEffect(() => { load(); }, []);

  const toSlug = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  const handleSave = async () => {
    setSaving(true);
    const d = { ...modal.data, slug: modal.data.slug || toSlug(modal.data.name ?? "") };
    if (modal.data.id) await sb.from("niches").update(d).eq("id", modal.data.id);
    else await sb.from("niches").insert(d);
    setSaving(false); setModal({ open: false, data: empty }); load();
  };

  const handleDelete = async (id: string) => { if (!confirm("Supprimer ce secteur ?")) return; await sb.from("niches").delete().eq("id", id); load(); };

  return (
    <div className="flex flex-col min-h-full">
      <AdminHeader title="Secteurs d'Activité" subtitle="Gérez les niches et catégories"
        action={<button onClick={() => setModal({ open: true, data: empty })} className="btn-primary text-sm py-2 px-4 flex items-center gap-1.5"><Plus size={15} />Ajouter</button>} />
      <main className="flex-1 p-6">
        {loading ? <div className="bg-white rounded-2xl p-12 text-center text-[#5A738A]">Chargement...</div> : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ backgroundColor: item.color + "20" }}>
                  {item.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#0D1F3C] text-sm">{item.name}</p>
                  <p className="text-[#5A738A] text-xs">{item.slug}</p>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold ${item.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {item.is_active ? "Actif" : "Inactif"}
                  </span>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => setModal({ open: true, data: item })} className="w-8 h-8 rounded-lg bg-[#EAF2FA] text-[#1A3A6B] flex items-center justify-center hover:bg-[#1A3A6B] hover:text-white transition-colors"><Edit2 size={13} /></button>
                  <button onClick={() => handleDelete(item.id)} className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"><Trash2 size={13} /></button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {modal.open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-[#0D1F3C]">{modal.data.id ? "Modifier" : "Ajouter"} un Secteur</h3>
              <button onClick={() => setModal({ open: false, data: empty })} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              {[{ label: "Nom *", key: "name" }, { label: "Slug", key: "slug" }].map(({ label, key }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-[#0D1F3C] mb-1.5">{label}</label>
                  <input value={(modal.data as Record<string,string>)[key] ?? ""} onChange={e => setModal(m => ({ ...m, data: { ...m.data, [key]: e.target.value } }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#EAF2FA] focus:border-[#1E90D4] focus:outline-none text-sm" />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0D1F3C] mb-1.5">Emoji</label>
                  <input value={modal.data.emoji ?? "🏢"} onChange={e => setModal(m => ({ ...m, data: { ...m.data, emoji: e.target.value } }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#EAF2FA] focus:border-[#1E90D4] focus:outline-none text-sm text-2xl" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0D1F3C] mb-1.5">Couleur</label>
                  <input type="color" value={modal.data.color ?? "#1E90D4"} onChange={e => setModal(m => ({ ...m, data: { ...m.data, color: e.target.value } }))}
                    className="w-full h-10 rounded-xl border border-[#EAF2FA] cursor-pointer" />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={modal.data.is_active ?? true} onChange={e => setModal(m => ({ ...m, data: { ...m.data, is_active: e.target.checked } }))} className="w-4 h-4 accent-[#1E90D4]" />
                Actif
              </label>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setModal({ open: false, data: empty })} className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600">Annuler</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary text-sm py-2 px-5">{saving ? "Enregistrement..." : "Enregistrer"}</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

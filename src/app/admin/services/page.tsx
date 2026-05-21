"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import { createClient } from "@/lib/supabase-browser";

type Service = {
  id: string; title: string; slug: string; short_desc: string;
  color: string; is_featured: boolean; is_active: boolean; sort_order: number;
};
const empty: Omit<Service, "id"> = { title: "", slug: "", short_desc: "", color: "#1E90D4", is_featured: false, is_active: true, sort_order: 0 };

export default function ServicesPage() {
  const sb = createClient();
  const [items, setItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; data: Partial<Service> }>({ open: false, data: empty });
  const [saving, setSaving] = useState(false);

  const load = async () => { const { data } = await sb.from("services").select("*").order("sort_order"); setItems(data ?? []); setLoading(false); };
  useEffect(() => { load(); }, []);

  const toSlug = (s: string) => s.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  const handleSave = async () => {
    setSaving(true);
    const d = { ...modal.data, slug: modal.data.slug || toSlug(modal.data.title ?? "") };
    if (modal.data.id) {
      await sb.from("services").update(d).eq("id", modal.data.id);
    } else {
      await sb.from("services").insert(d);
    }
    setSaving(false); setModal({ open: false, data: empty }); load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce service ?")) return;
    await sb.from("services").delete().eq("id", id); load();
  };

  const toggleActive = async (item: Service) => {
    await sb.from("services").update({ is_active: !item.is_active }).eq("id", item.id); load();
  };

  return (
    <div className="flex flex-col min-h-full">
      <AdminHeader
        title="Services" subtitle="Gérez vos offres de services"
        action={
          <button onClick={() => setModal({ open: true, data: empty })} className="btn-primary text-sm py-2 px-4 flex items-center gap-1.5">
            <Plus size={15} /> Ajouter
          </button>
        }
      />
      <main className="flex-1 p-6">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-[#5A738A]">Chargement...</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-[#F4F7FB] border-b border-gray-100">
                <tr>{["Titre","Description","Statut","En vedette","Actions"].map(h => <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-[#5A738A] uppercase">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {items.map((item) => (
                  <motion.tr key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="font-semibold text-[#0D1F3C]">{item.title}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[#5A738A] max-w-xs truncate">{item.short_desc}</td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => toggleActive(item)} className="flex items-center gap-1.5 text-xs font-semibold">
                        {item.is_active ? <ToggleRight size={20} className="text-green-500" /> : <ToggleLeft size={20} className="text-gray-400" />}
                        <span className={item.is_active ? "text-green-600" : "text-gray-400"}>{item.is_active ? "Actif" : "Inactif"}</span>
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${item.is_featured ? "bg-[#1E90D4]/15 text-[#1E90D4]" : "bg-gray-100 text-gray-500"}`}>
                        {item.is_featured ? "Oui" : "Non"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-2">
                        <button onClick={() => setModal({ open: true, data: item })} className="w-8 h-8 rounded-lg bg-[#EAF2FA] text-[#1A3A6B] flex items-center justify-center hover:bg-[#1A3A6B] hover:text-white transition-colors"><Edit2 size={14} /></button>
                        <button onClick={() => handleDelete(item.id)} className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* Modal */}
      {modal.open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-[#0D1F3C]">{modal.data.id ? "Modifier" : "Ajouter"} un Service</h3>
              <button onClick={() => setModal({ open: false, data: empty })} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: "Titre *", key: "title", type: "text" },
                { label: "Slug (URL)", key: "slug", type: "text" },
                { label: "Description courte", key: "short_desc", type: "text" },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-[#0D1F3C] mb-1.5">{label}</label>
                  <input type={type} value={(modal.data as Record<string, string>)[key] ?? ""} onChange={e => setModal(m => ({ ...m, data: { ...m.data, [key]: e.target.value } }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#EAF2FA] focus:border-[#1E90D4] focus:outline-none text-sm" />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0D1F3C] mb-1.5">Couleur</label>
                  <input type="color" value={modal.data.color ?? "#1E90D4"} onChange={e => setModal(m => ({ ...m, data: { ...m.data, color: e.target.value } }))}
                    className="w-full h-10 rounded-xl border border-[#EAF2FA] cursor-pointer" />
                </div>
                <div className="flex flex-col gap-2 pt-5">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={modal.data.is_featured ?? false} onChange={e => setModal(m => ({ ...m, data: { ...m.data, is_featured: e.target.checked } }))} className="w-4 h-4 accent-[#1E90D4]" />
                    En vedette
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={modal.data.is_active ?? true} onChange={e => setModal(m => ({ ...m, data: { ...m.data, is_active: e.target.checked } }))} className="w-4 h-4 accent-[#1E90D4]" />
                    Actif
                  </label>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setModal({ open: false, data: empty })} className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">Annuler</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary text-sm py-2 px-5">{saving ? "Enregistrement..." : "Enregistrer"}</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

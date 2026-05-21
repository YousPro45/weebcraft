"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, Star } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import { createClient } from "@/lib/supabase-browser";

type Plan = {
  id: string; name: string; subtitle: string; price: number;
  currency: string; period: string; features: string[];
  is_featured: boolean; is_active: boolean; sort_order: number;
};
const emptyPlan: Omit<Plan, "id"> = { name: "", subtitle: "", price: 0, currency: "MAD", period: "paiement unique", features: [], is_featured: false, is_active: true, sort_order: 0 };

export default function PricingPage() {
  const sb = createClient();
  const [items, setItems] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; data: Partial<Plan> }>({ open: false, data: emptyPlan });
  const [featuresText, setFeaturesText] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => { const { data } = await sb.from("pricing_plans").select("*").order("sort_order"); setItems(data ?? []); setLoading(false); };
  useEffect(() => { load(); }, []);

  const openModal = (data?: Plan) => {
    setModal({ open: true, data: data ?? emptyPlan });
    setFeaturesText(data ? (data.features ?? []).join("\n") : "");
  };

  const handleSave = async () => {
    setSaving(true);
    const features = featuresText.split("\n").map(s => s.trim()).filter(Boolean);
    const d = { ...modal.data, features };
    if (modal.data.id) await sb.from("pricing_plans").update(d).eq("id", modal.data.id);
    else await sb.from("pricing_plans").insert(d);
    setSaving(false); setModal({ open: false, data: emptyPlan }); load();
  };

  const handleDelete = async (id: string) => { if (!confirm("Supprimer ce plan ?")) return; await sb.from("pricing_plans").delete().eq("id", id); load(); };

  return (
    <div className="flex flex-col min-h-full">
      <AdminHeader title="Tarifs" subtitle="Gérez vos packs et plans tarifaires"
        action={<button onClick={() => openModal()} className="btn-primary text-sm py-2 px-4 flex items-center gap-1.5"><Plus size={15} />Ajouter</button>} />
      <main className="flex-1 p-6">
        <div className="grid md:grid-cols-3 gap-6">
          {loading ? <div className="col-span-3 p-12 text-center text-[#5A738A]">Chargement...</div> :
            items.map((plan) => (
              <motion.div key={plan.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className={`bg-white rounded-2xl shadow-sm overflow-hidden border-2 ${plan.is_featured ? "border-[#1E90D4]" : "border-transparent"}`}>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-[#0D1F3C] text-lg">{plan.name}</h3>
                        {plan.is_featured && <Star size={16} className="text-[#1E90D4] fill-[#1E90D4]" />}
                      </div>
                      <p className="text-[#5A738A] text-sm">{plan.subtitle}</p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${plan.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {plan.is_active ? "Actif" : "Inactif"}
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-[#1E90D4] mb-1">{plan.price.toLocaleString()} <span className="text-lg">{plan.currency}</span></p>
                  <p className="text-[#5A738A] text-xs mb-4">{plan.period}</p>
                  <ul className="space-y-1.5 mb-5">
                    {(plan.features ?? []).slice(0, 4).map((f, i) => (
                      <li key={i} className="text-xs text-[#5A738A] flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1E90D4] flex-shrink-0" /> {f}
                      </li>
                    ))}
                    {(plan.features ?? []).length > 4 && <li className="text-xs text-[#5A738A]">+{(plan.features ?? []).length - 4} autres...</li>}
                  </ul>
                  <div className="flex gap-2">
                    <button onClick={() => openModal(plan)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-[#EAF2FA] text-[#1A3A6B] text-xs font-semibold hover:bg-[#EAF2FA] transition-colors"><Edit2 size={13} /> Modifier</button>
                    <button onClick={() => handleDelete(plan.id)} className="w-9 h-9 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"><Trash2 size={14} /></button>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
      </main>

      {modal.open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-8">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-[#0D1F3C]">{modal.data.id ? "Modifier" : "Ajouter"} un Plan</h3>
              <button onClick={() => setModal({ open: false, data: emptyPlan })} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[{ label: "Nom *", key: "name" }, { label: "Sous-titre", key: "subtitle" }].map(({ label, key }) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold text-[#0D1F3C] mb-1.5">{label}</label>
                    <input value={(modal.data as Record<string, string>)[key] ?? ""} onChange={e => setModal(m => ({ ...m, data: { ...m.data, [key]: e.target.value } }))}
                      className="w-full px-3 py-2.5 rounded-xl border border-[#EAF2FA] focus:border-[#1E90D4] focus:outline-none text-sm" />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0D1F3C] mb-1.5">Prix *</label>
                  <input type="number" value={modal.data.price ?? 0} onChange={e => setModal(m => ({ ...m, data: { ...m.data, price: +e.target.value } }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#EAF2FA] focus:border-[#1E90D4] focus:outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0D1F3C] mb-1.5">Devise</label>
                  <input value={modal.data.currency ?? "MAD"} onChange={e => setModal(m => ({ ...m, data: { ...m.data, currency: e.target.value } }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#EAF2FA] focus:border-[#1E90D4] focus:outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0D1F3C] mb-1.5">Période</label>
                  <input value={modal.data.period ?? ""} onChange={e => setModal(m => ({ ...m, data: { ...m.data, period: e.target.value } }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#EAF2FA] focus:border-[#1E90D4] focus:outline-none text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0D1F3C] mb-1.5">Fonctionnalités (une par ligne)</label>
                <textarea rows={6} value={featuresText} onChange={e => setFeaturesText(e.target.value)}
                  placeholder="Design responsive&#10;SEO inclus&#10;Hébergement 1 an"
                  className="w-full px-3 py-2.5 rounded-xl border border-[#EAF2FA] focus:border-[#1E90D4] focus:outline-none text-sm resize-none" />
              </div>
              <div className="flex gap-6">
                {[{ label: "En vedette", key: "is_featured" }, { label: "Actif", key: "is_active" }].map(({ label, key }) => (
                  <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={(modal.data as Record<string, boolean>)[key] ?? false} onChange={e => setModal(m => ({ ...m, data: { ...m.data, [key]: e.target.checked } }))} className="w-4 h-4 accent-[#1E90D4]" />
                    {label}
                  </label>
                ))}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setModal({ open: false, data: emptyPlan })} className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600">Annuler</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary text-sm py-2 px-5">{saving ? "Enregistrement..." : "Enregistrer"}</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

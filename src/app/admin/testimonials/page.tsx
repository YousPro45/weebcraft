"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, Star, ToggleLeft, ToggleRight } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import { createClient } from "@/lib/supabase-browser";

type Testimonial = { id:string; name:string; role:string; company:string; niche:string; niche_emoji:string; content:string; rating:number; is_published:boolean };
const empty: Omit<Testimonial,"id"> = { name:"", role:"", company:"", niche:"", niche_emoji:"⭐", content:"", rating:5, is_published:false };

export default function TestimonialsPage() {
  const sb = createClient();
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open:boolean; data:Partial<Testimonial> }>({ open:false, data:empty });
  const [saving, setSaving] = useState(false);

  const load = async () => { const { data } = await sb.from("testimonials").select("*").order("sort_order"); setItems(data ?? []); setLoading(false); };
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    setSaving(true);
    if (modal.data.id) await sb.from("testimonials").update(modal.data).eq("id", modal.data.id);
    else await sb.from("testimonials").insert(modal.data);
    setSaving(false); setModal({ open:false, data:empty }); load();
  };

  const toggle = async (item:Testimonial) => { await sb.from("testimonials").update({ is_published: !item.is_published }).eq("id", item.id); load(); };
  const del = async (id:string) => { if (!confirm("Supprimer ?")) return; await sb.from("testimonials").delete().eq("id", id); load(); };

  return (
    <div className="flex flex-col min-h-full">
      <AdminHeader title="Témoignages" subtitle="Gérez les avis clients"
        action={<button onClick={() => setModal({ open:true, data:empty })} className="btn-primary text-sm py-2 px-4 flex items-center gap-1.5"><Plus size={15} />Ajouter</button>} />
      <main className="flex-1 p-6">
        {loading ? <div className="bg-white rounded-2xl p-12 text-center text-[#5A738A]">Chargement...</div> : (
          <div className="grid md:grid-cols-2 gap-5">
            {items.map((item) => (
              <motion.div key={item.id} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="bg-white rounded-2xl shadow-sm p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                      style={{ background:"linear-gradient(135deg,#1A3A6B,#1E90D4)" }}>{item.name.charAt(0)}</div>
                    <div>
                      <p className="font-bold text-[#0D1F3C] text-sm">{item.name}</p>
                      <p className="text-[#5A738A] text-xs">{item.role} — {item.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => toggle(item)}>
                      {item.is_published ? <ToggleRight size={22} className="text-green-500" /> : <ToggleLeft size={22} className="text-gray-400" />}
                    </button>
                    <button onClick={() => setModal({ open:true, data:item })} className="w-8 h-8 rounded-lg bg-[#EAF2FA] text-[#1A3A6B] flex items-center justify-center hover:bg-[#1A3A6B] hover:text-white transition-colors"><Edit2 size={13} /></button>
                    <button onClick={() => del(item.id)} className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"><Trash2 size={13} /></button>
                  </div>
                </div>
                <div className="flex gap-1 mb-2">{Array.from({ length: item.rating }).map((_,j) => <Star key={j} size={12} className="text-[#1E90D4] fill-[#1E90D4]" />)}</div>
                <p className="text-[#5A738A] text-sm italic line-clamp-3">&ldquo;{item.content}&rdquo;</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-sm">{item.niche_emoji}</span>
                  <span className="text-xs text-[#5A738A]">{item.niche}</span>
                  <span className={`ml-auto px-2 py-0.5 rounded-full text-xs font-semibold ${item.is_published ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {item.is_published ? "Publié" : "Brouillon"}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {modal.open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-8">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-[#0D1F3C]">{modal.data.id ? "Modifier" : "Ajouter"} un Témoignage</h3>
              <button onClick={() => setModal({ open:false, data:empty })} className="text-gray-400 text-xl">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[{l:"Nom *",k:"name"},{l:"Rôle",k:"role"},{l:"Entreprise",k:"company"},{l:"Secteur",k:"niche"}].map(({l,k}) => (
                  <div key={k}>
                    <label className="block text-xs font-semibold text-[#0D1F3C] mb-1.5">{l}</label>
                    <input value={(modal.data as Record<string,string>)[k]??""} onChange={e => setModal(m=>({...m,data:{...m.data,[k]:e.target.value}}))}
                      className="w-full px-3 py-2.5 rounded-xl border border-[#EAF2FA] focus:border-[#1E90D4] focus:outline-none text-sm" />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0D1F3C] mb-1.5">Emoji</label>
                  <input value={modal.data.niche_emoji??""} onChange={e=>setModal(m=>({...m,data:{...m.data,niche_emoji:e.target.value}}))}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#EAF2FA] text-xl text-center" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-[#0D1F3C] mb-1.5">Note (1-5)</label>
                  <input type="number" min="1" max="5" value={modal.data.rating??5} onChange={e=>setModal(m=>({...m,data:{...m.data,rating:+e.target.value}}))}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#EAF2FA] focus:border-[#1E90D4] focus:outline-none text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0D1F3C] mb-1.5">Témoignage *</label>
                <textarea rows={4} value={modal.data.content??""} onChange={e=>setModal(m=>({...m,data:{...m.data,content:e.target.value}}))}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#EAF2FA] focus:border-[#1E90D4] focus:outline-none text-sm resize-none" />
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={modal.data.is_published??false} onChange={e=>setModal(m=>({...m,data:{...m.data,is_published:e.target.checked}}))} className="w-4 h-4 accent-[#1E90D4]" />
                Publier immédiatement
              </label>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setModal({ open:false, data:empty })} className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600">Annuler</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary text-sm py-2 px-5">{saving ? "Enregistrement..." : "Enregistrer"}</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

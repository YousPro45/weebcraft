"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, Star } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import { createClient } from "@/lib/supabase-browser";

type Project = { id:string; name:string; slug:string; niche_id:string; short_desc:string; cover_image:string; tags:string[]; is_featured:boolean; is_active:boolean };
type Niche = { id:string; name:string; emoji:string };
const emptyP: Omit<Project,"id"> = { name:"", slug:"", niche_id:"", short_desc:"", cover_image:"", tags:[], is_featured:false, is_active:true };

export default function PortfolioPage() {
  const sb = createClient();
  const [items, setItems] = useState<Project[]>([]);
  const [niches, setNiches] = useState<Niche[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open:boolean; data:Partial<Project>; tagsText:string }>({ open:false, data:emptyP, tagsText:"" });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const [p, n] = await Promise.all([
      sb.from("portfolio_projects").select("*").order("sort_order"),
      sb.from("niches").select("id,name,emoji").order("sort_order"),
    ]);
    setItems(p.data??[]); setNiches(n.data??[]); setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const toSlug = (s:string) => s.toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"");

  const openModal = (data?: Project) => setModal({
    open:true, data:data??emptyP,
    tagsText: data ? (data.tags??[]).join(", ") : ""
  });

  const handleSave = async () => {
    setSaving(true);
    const tags = modal.tagsText.split(",").map(s=>s.trim()).filter(Boolean);
    const d = { ...modal.data, tags, slug: modal.data.slug||toSlug(modal.data.name??"") };
    if (modal.data.id) await sb.from("portfolio_projects").update(d).eq("id",modal.data.id);
    else await sb.from("portfolio_projects").insert(d);
    setSaving(false); setModal({open:false,data:emptyP,tagsText:""}); load();
  };

  const del = async (id:string) => { if (!confirm("Supprimer ce projet ?")) return; await sb.from("portfolio_projects").delete().eq("id",id); load(); };
  const toggleFeatured = async (item:Project) => { await sb.from("portfolio_projects").update({ is_featured:!item.is_featured }).eq("id",item.id); load(); };

  return (
    <div className="flex flex-col min-h-full">
      <AdminHeader title="Portfolio" subtitle="Gérez vos projets et réalisations"
        action={<button onClick={()=>openModal()} className="btn-primary text-sm py-2 px-4 flex items-center gap-1.5"><Plus size={15}/>Ajouter</button>} />
      <main className="flex-1 p-6">
        {loading ? <div className="bg-white rounded-2xl p-12 text-center text-[#5A738A]">Chargement...</div> : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#F4F7FB] border-b border-gray-100">
                <tr>{["Projet","Secteur","Tags","Vedette","Statut","Actions"].map(h=><th key={h} className="px-5 py-3 text-left text-xs font-semibold text-[#5A738A] uppercase">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {items.map(item => {
                  const niche = niches.find(n=>n.id===item.niche_id);
                  return (
                    <motion.tr key={item.id} initial={{opacity:0}} animate={{opacity:1}} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="font-semibold text-[#0D1F3C]">{item.name}</p>
                        <p className="text-[#5A738A] text-xs truncate max-w-xs">{item.short_desc}</p>
                      </td>
                      <td className="px-5 py-3.5 text-[#5A738A]">{niche ? `${niche.emoji} ${niche.name}` : "—"}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex flex-wrap gap-1">
                          {(item.tags??[]).slice(0,2).map(t=><span key={t} className="px-2 py-0.5 rounded-full text-xs bg-[#EAF2FA] text-[#1A3A6B]">{t}</span>)}
                          {(item.tags??[]).length>2 && <span className="text-xs text-[#5A738A]">+{(item.tags??[]).length-2}</span>}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <button onClick={()=>toggleFeatured(item)}>
                          <Star size={18} className={item.is_featured?"text-[#1E90D4] fill-[#1E90D4]":"text-gray-300"} />
                        </button>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${item.is_active?"bg-green-100 text-green-700":"bg-gray-100 text-gray-500"}`}>
                          {item.is_active?"Actif":"Inactif"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex gap-2">
                          <button onClick={()=>openModal(item)} className="w-8 h-8 rounded-lg bg-[#EAF2FA] text-[#1A3A6B] flex items-center justify-center hover:bg-[#1A3A6B] hover:text-white transition-colors"><Edit2 size={13}/></button>
                          <button onClick={()=>del(item.id)} className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"><Trash2 size={13}/></button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {modal.open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-8">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-[#0D1F3C]">{modal.data.id?"Modifier":"Ajouter"} un Projet</h3>
              <button onClick={()=>setModal({open:false,data:emptyP,tagsText:""})} className="text-gray-400 text-xl">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              {[{l:"Nom du projet *",k:"name"},{l:"Slug",k:"slug"},{l:"Description courte",k:"short_desc"},{l:"Image de couverture (URL)",k:"cover_image"}].map(({l,k})=>(
                <div key={k}>
                  <label className="block text-xs font-semibold text-[#0D1F3C] mb-1.5">{l}</label>
                  <input value={(modal.data as Record<string,string>)[k]??""} onChange={e=>setModal(m=>({...m,data:{...m.data,[k]:e.target.value}}))}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#EAF2FA] focus:border-[#1E90D4] focus:outline-none text-sm" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-[#0D1F3C] mb-1.5">Secteur</label>
                <select value={modal.data.niche_id??""} onChange={e=>setModal(m=>({...m,data:{...m.data,niche_id:e.target.value}}))}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#EAF2FA] focus:border-[#1E90D4] focus:outline-none text-sm bg-white">
                  <option value="">— Choisir —</option>
                  {niches.map(n=><option key={n.id} value={n.id}>{n.emoji} {n.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0D1F3C] mb-1.5">Tags (séparés par virgule)</label>
                <input value={modal.tagsText} onChange={e=>setModal(m=>({...m,tagsText:e.target.value}))}
                  placeholder="SEO, Réservation, Mobile"
                  className="w-full px-3 py-2.5 rounded-xl border border-[#EAF2FA] focus:border-[#1E90D4] focus:outline-none text-sm" />
              </div>
              <div className="flex gap-6">
                {[{l:"En vedette",k:"is_featured"},{l:"Actif",k:"is_active"}].map(({l,k})=>(
                  <label key={k} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={(modal.data as Record<string,boolean>)[k]??false} onChange={e=>setModal(m=>({...m,data:{...m.data,[k]:e.target.checked}}))} className="w-4 h-4 accent-[#1E90D4]" />
                    {l}
                  </label>
                ))}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={()=>setModal({open:false,data:emptyP,tagsText:""})} className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600">Annuler</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary text-sm py-2 px-5">{saving?"Enregistrement...":"Enregistrer"}</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

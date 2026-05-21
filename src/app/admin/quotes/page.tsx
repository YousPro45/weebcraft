"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Eye, Trash2 } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import { createClient } from "@/lib/supabase-browser";

type Quote = { id:string; name:string; email:string; phone:string; company:string; niche:string; budget:string; description:string; selected_plan:string; status:string; created_at:string };

const statusConfig: Record<string,{label:string;color:string}> = {
  new:       { label:"Nouveau",      color:"bg-yellow-100 text-yellow-700" },
  contacted: { label:"Contacté",     color:"bg-blue-100 text-blue-700" },
  in_progress:{ label:"En cours",    color:"bg-purple-100 text-purple-700" },
  completed: { label:"Complété",     color:"bg-green-100 text-green-700" },
  cancelled: { label:"Annulé",       color:"bg-red-100 text-red-600" },
};

export default function QuotesPage() {
  const sb = createClient();
  const [items, setItems] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<Quote|null>(null);
  const [filter, setFilter] = useState("all");

  const load = async () => {
    let q = sb.from("quote_requests").select("*").order("created_at", { ascending: false });
    if (filter !== "all") q = q.eq("status", filter);
    const { data } = await q; setItems(data ?? []); setLoading(false);
  };
  useEffect(() => { load(); }, [filter]);

  const setStatus = async (id:string, status:string) => { await sb.from("quote_requests").update({ status }).eq("id", id); load(); };
  const del = async (id:string) => { if (!confirm("Supprimer ce devis ?")) return; await sb.from("quote_requests").delete().eq("id", id); load(); setDetail(null); };

  return (
    <div className="flex flex-col min-h-full">
      <AdminHeader title="Demandes de Devis" subtitle={`${items.length} demande(s)`} />
      <main className="flex-1 p-6">
        {/* Filter */}
        <div className="flex gap-2 flex-wrap mb-5">
          {[["all","Tous"],["new","Nouveaux"],["contacted","Contactés"],["in_progress","En cours"],["completed","Complétés"],["cancelled","Annulés"]].map(([v,l]) => (
            <button key={v} onClick={() => setFilter(v)} className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${filter===v?"bg-[#1A3A6B] text-white":"bg-white text-[#5A738A] hover:bg-[#EAF2FA]"}`}>{l}</button>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {loading ? <div className="p-12 text-center text-[#5A738A]">Chargement...</div> :
            items.length === 0 ? <div className="p-12 text-center text-[#5A738A]">Aucune demande de devis.</div> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#F4F7FB] border-b border-gray-100">
                  <tr>{["Client","Email","Secteur","Budget","Plan","Statut","Date","Actions"].map(h=><th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#5A738A] uppercase">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {items.map(q => (
                    <motion.tr key={q.id} initial={{opacity:0}} animate={{opacity:1}} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3.5 font-semibold text-[#0D1F3C]">{q.name}</td>
                      <td className="px-4 py-3.5 text-[#5A738A]">{q.email}</td>
                      <td className="px-4 py-3.5 text-[#5A738A]">{q.niche || "—"}</td>
                      <td className="px-4 py-3.5 text-[#5A738A]">{q.budget || "—"}</td>
                      <td className="px-4 py-3.5"><span className="px-2 py-0.5 rounded-full text-xs bg-[#EAF2FA] text-[#1A3A6B] font-semibold">{q.selected_plan || "—"}</span></td>
                      <td className="px-4 py-3.5">
                        <select value={q.status} onChange={e=>setStatus(q.id,e.target.value)}
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold border-0 outline-none cursor-pointer ${statusConfig[q.status]?.color}`}>
                          {Object.entries(statusConfig).map(([v,{label}])=><option key={v} value={v}>{label}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-3.5 text-[#5A738A] text-xs">{new Date(q.created_at).toLocaleDateString("fr")}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex gap-1.5">
                          <button onClick={() => setDetail(q)} className="w-8 h-8 rounded-lg bg-[#EAF2FA] text-[#1A3A6B] flex items-center justify-center hover:bg-[#1A3A6B] hover:text-white transition-colors"><Eye size={13} /></button>
                          <button onClick={() => del(q.id)} className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"><Trash2 size={13} /></button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detail modal */}
        {detail && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[#0D1F3C]">Détail de la Demande</h3>
                <button onClick={()=>setDetail(null)} className="text-gray-400 text-xl">&times;</button>
              </div>
              <dl className="space-y-3 text-sm">
                {[
                  ["Client",detail.name], ["Email",detail.email], ["Téléphone",detail.phone||"—"],
                  ["Entreprise",detail.company||"—"], ["Secteur",detail.niche||"—"],
                  ["Budget",detail.budget||"—"], ["Plan",detail.selected_plan||"—"],
                ].map(([k,v])=>(
                  <div key={k} className="flex gap-3">
                    <dt className="w-28 text-[#5A738A] font-semibold flex-shrink-0">{k}</dt>
                    <dd className="text-[#0D1F3C]">{v}</dd>
                  </div>
                ))}
                <div>
                  <dt className="text-[#5A738A] font-semibold mb-1.5">Description du projet</dt>
                  <dd className="text-[#0D1F3C] bg-[#F4F7FB] rounded-xl p-3 leading-relaxed">{detail.description||"—"}</dd>
                </div>
              </dl>
              <div className="flex justify-end gap-2 mt-5">
                <a href={`mailto:${detail.email}`} onClick={()=>setStatus(detail.id,"contacted")}
                  className="btn-primary text-sm py-2 px-5">Contacter par Email</a>
                <button onClick={()=>setDetail(null)} className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600">Fermer</button>
              </div>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
}

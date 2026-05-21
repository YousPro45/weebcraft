"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trash2, Download, ToggleLeft, ToggleRight } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import { createClient } from "@/lib/supabase-browser";

type Sub = { id:string; email:string; is_active:boolean; source:string; created_at:string };

export default function NewsletterPage() {
  const sb = createClient();
  const [items, setItems] = useState<Sub[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => { const { data } = await sb.from("newsletter_subscribers").select("*").order("created_at", { ascending: false }); setItems(data ?? []); setLoading(false); };
  useEffect(() => { load(); }, []);

  const toggle = async (item:Sub) => { await sb.from("newsletter_subscribers").update({ is_active: !item.is_active }).eq("id", item.id); load(); };
  const del = async (id:string) => { if (!confirm("Supprimer cet abonné ?")) return; await sb.from("newsletter_subscribers").delete().eq("id", id); load(); };

  const exportCSV = () => {
    const csv = ["email,source,date_inscription",...items.map(s => `${s.email},${s.source},${new Date(s.created_at).toLocaleDateString("fr")}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "newsletter_subscribers.csv"; a.click();
  };

  const active = items.filter(s => s.is_active).length;

  return (
    <div className="flex flex-col min-h-full">
      <AdminHeader title="Newsletter" subtitle={`${items.length} abonnés · ${active} actifs`}
        action={<button onClick={exportCSV} className="btn-accent text-sm py-2 px-4 flex items-center gap-1.5"><Download size={15} />Exporter CSV</button>} />
      <main className="flex-1 p-6">
        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label:"Total Abonnés", value:items.length, color:"#1E90D4" },
            { label:"Actifs",         value:active,       color:"#2255A4" },
            { label:"Inactifs",       value:items.length-active, color:"#5A738A" },
          ].map(c => (
            <div key={c.label} className="bg-white rounded-2xl p-5 shadow-sm">
              <p className="text-3xl font-bold" style={{ color: c.color }}>{c.value}</p>
              <p className="text-[#5A738A] text-xs mt-1">{c.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {loading ? <div className="p-12 text-center text-[#5A738A]">Chargement...</div> :
            items.length === 0 ? <div className="p-12 text-center text-[#5A738A]">Aucun abonné pour le moment.</div> : (
            <table className="w-full text-sm">
              <thead className="bg-[#F4F7FB] border-b border-gray-100">
                <tr>{["Email","Source","Date","Statut","Actions"].map(h=><th key={h} className="px-5 py-3 text-left text-xs font-semibold text-[#5A738A] uppercase">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {items.map(sub => (
                  <motion.tr key={sub.id} initial={{opacity:0}} animate={{opacity:1}} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-[#0D1F3C]">{sub.email}</td>
                    <td className="px-5 py-3.5 text-[#5A738A]">{sub.source}</td>
                    <td className="px-5 py-3.5 text-[#5A738A] text-xs">{new Date(sub.created_at).toLocaleDateString("fr")}</td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => toggle(sub)} className="flex items-center gap-1.5 text-xs font-semibold">
                        {sub.is_active ? <ToggleRight size={20} className="text-green-500" /> : <ToggleLeft size={20} className="text-gray-400" />}
                        <span className={sub.is_active ? "text-green-600" : "text-gray-400"}>{sub.is_active ? "Actif" : "Inactif"}</span>
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => del(sub.id)} className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"><Trash2 size={13} /></button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}

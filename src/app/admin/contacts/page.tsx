"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Eye, Archive, Reply, Trash2 } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import { createClient } from "@/lib/supabase-browser";

type Contact = { id:string; name:string; email:string; phone:string; subject:string; message:string; status:string; created_at:string };

const statusColors: Record<string,string> = { new:"bg-yellow-100 text-yellow-700", read:"bg-blue-100 text-blue-700", replied:"bg-green-100 text-green-700", archived:"bg-gray-100 text-gray-500" };
const statusLabels: Record<string,string> = { new:"Nouveau", read:"Lu", replied:"Répondu", archived:"Archivé" };

export default function ContactsPage() {
  const sb = createClient();
  const [items, setItems] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [detail, setDetail] = useState<Contact|null>(null);

  const load = async () => {
    let q = sb.from("contact_submissions").select("*").order("created_at", { ascending: false });
    if (filter !== "all") q = q.eq("status", filter);
    const { data } = await q; setItems(data ?? []); setLoading(false);
  };
  useEffect(() => { load(); }, [filter]);

  const setStatus = async (id:string, status:string) => { await sb.from("contact_submissions").update({ status }).eq("id", id); load(); if (detail?.id === id) setDetail(d => d ? { ...d, status } : null); };
  const del = async (id:string) => { if (!confirm("Supprimer ce message ?")) return; await sb.from("contact_submissions").delete().eq("id", id); load(); setDetail(null); };

  return (
    <div className="flex flex-col min-h-full">
      <AdminHeader title="Messages de Contact" subtitle={`${items.length} message(s)`} />
      <main className="flex-1 p-6 flex gap-5">
        {/* List */}
        <div className={`flex flex-col gap-4 ${detail ? "w-1/2" : "w-full"} transition-all`}>
          {/* Filter tabs */}
          <div className="flex gap-2 flex-wrap">
            {[["all","Tous"],["new","Nouveaux"],["read","Lus"],["replied","Répondus"],["archived","Archivés"]].map(([val,label]) => (
              <button key={val} onClick={() => setFilter(val)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${filter===val?"bg-[#1A3A6B] text-white":"bg-white text-[#5A738A] hover:bg-[#EAF2FA]"}`}>{label}</button>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {loading ? <div className="p-12 text-center text-[#5A738A]">Chargement...</div> :
              items.length === 0 ? <div className="p-12 text-center text-[#5A738A]">Aucun message.</div> :
              <div className="divide-y divide-gray-50">
                {items.map((c) => (
                  <div key={c.id} onClick={() => { setDetail(c); setStatus(c.id, c.status==="new"?"read":c.status); }}
                    className={`flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50/60 transition-colors ${detail?.id===c.id?"bg-[#EAF2FA]":""} ${c.status==="new"?"border-l-2 border-[#1E90D4]":""}`}>
                    <div className="w-9 h-9 rounded-full bg-[#EAF2FA] flex items-center justify-center text-[#1A3A6B] font-bold text-sm flex-shrink-0">{c.name.charAt(0).toUpperCase()}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm truncate ${c.status==="new"?"font-bold text-[#0D1F3C]":"font-medium text-[#0D1F3C]"}`}>{c.name}</p>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 ${statusColors[c.status]}`}>{statusLabels[c.status]}</span>
                      </div>
                      <p className="text-[#5A738A] text-xs truncate">{c.subject || "(sans objet)"}</p>
                    </div>
                    <span className="text-[#5A738A] text-xs flex-shrink-0">{new Date(c.created_at).toLocaleDateString("fr")}</span>
                  </div>
                ))}
              </div>
            }
          </div>
        </div>

        {/* Detail panel */}
        {detail && (
          <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} className="w-1/2 bg-white rounded-2xl shadow-sm p-6 flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-[#0D1F3C] text-lg">{detail.name}</h3>
                <p className="text-[#5A738A] text-sm">{detail.email} {detail.phone && `· ${detail.phone}`}</p>
              </div>
              <button onClick={() => setDetail(null)} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
            </div>
            <div className="mb-3 pb-3 border-b border-gray-100">
              <p className="text-xs text-[#5A738A] mb-0.5">Sujet</p>
              <p className="font-semibold text-[#0D1F3C] text-sm">{detail.subject || "(sans objet)"}</p>
            </div>
            <div className="flex-1 mb-5">
              <p className="text-xs text-[#5A738A] mb-1.5">Message</p>
              <p className="text-[#0D1F3C] text-sm leading-relaxed whitespace-pre-wrap">{detail.message}</p>
            </div>
            <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
              <a href={`mailto:${detail.email}`} onClick={() => setStatus(detail.id,"replied")}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1A3A6B] text-white text-xs font-semibold hover:bg-[#2255A4] transition-colors">
                <Reply size={13} /> Répondre
              </a>
              <button onClick={() => setStatus(detail.id,"archived")}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-100 text-gray-600 text-xs font-semibold hover:bg-gray-200 transition-colors">
                <Archive size={13} /> Archiver
              </button>
              <button onClick={() => del(detail.id)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 text-red-500 text-xs font-semibold hover:bg-red-500 hover:text-white transition-colors ml-auto">
                <Trash2 size={13} /> Supprimer
              </button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}

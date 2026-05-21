"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, Eye } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import { createClient } from "@/lib/supabase-browser";

type Post = { id:string; title:string; slug:string; excerpt:string; status:string; category_id:string; tags:string[]; published_at:string; created_at:string };
type Cat = { id:string; name:string; slug:string };
const emptyPost: Omit<Post,"id"> = { title:"", slug:"", excerpt:"", status:"draft", category_id:"", tags:[], published_at:"", created_at:"" };

export default function BlogPage() {
  const sb = createClient();
  const [posts, setPosts] = useState<Post[]>([]);
  const [cats, setCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open:boolean; data:Partial<Post>; content:string }>({ open:false, data:emptyPost, content:"" });
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("all");

  const load = async () => {
    const [p, c] = await Promise.all([
      sb.from("blog_posts").select("id,title,slug,excerpt,status,category_id,tags,published_at,created_at").order("created_at",{ascending:false}),
      sb.from("blog_categories").select("*").order("name"),
    ]);
    setPosts(p.data??[]); setCats(c.data??[]); setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const toSlug = (s:string) => s.toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"");

  const handleSave = async () => {
    setSaving(true);
    const slug = modal.data.slug || toSlug(modal.data.title ?? "");
    const published_at = modal.data.status === "published" ? new Date().toISOString() : null;
    const content = modal.content;
    if (modal.data.id) {
      await sb.from("blog_posts").update({ title: modal.data.title, slug, excerpt: modal.data.excerpt, content, status: modal.data.status, category_id: modal.data.category_id, tags: modal.data.tags, published_at }).eq("id", modal.data.id);
    } else {
      await sb.from("blog_posts").insert({ title: modal.data.title ?? "", slug, excerpt: modal.data.excerpt, content, status: modal.data.status ?? "draft", category_id: modal.data.category_id, tags: modal.data.tags ?? [], published_at });
    }
    setSaving(false); setModal({ open:false, data:emptyPost, content:"" }); load();
  };

  const del = async (id:string) => { if (!confirm("Supprimer cet article ?")) return; await sb.from("blog_posts").delete().eq("id", id); load(); };

  const filtered = filter==="all" ? posts : posts.filter(p=>p.status===filter);

  const statusBadge = (s:string) => {
    const m: Record<string,string> = { draft:"bg-yellow-100 text-yellow-700", published:"bg-green-100 text-green-700", archived:"bg-gray-100 text-gray-500" };
    const l: Record<string,string> = { draft:"Brouillon", published:"Publié", archived:"Archivé" };
    return <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${m[s]}`}>{l[s]}</span>;
  };

  return (
    <div className="flex flex-col min-h-full">
      <AdminHeader title="Blog" subtitle="Gérez vos articles et publications"
        action={<button onClick={()=>setModal({open:true,data:emptyPost,content:""})} className="btn-primary text-sm py-2 px-4 flex items-center gap-1.5"><Plus size={15}/>Nouvel Article</button>} />
      <main className="flex-1 p-6">
        <div className="flex gap-2 flex-wrap mb-5">
          {[["all","Tous"],["draft","Brouillons"],["published","Publiés"],["archived","Archivés"]].map(([v,l])=>(
            <button key={v} onClick={()=>setFilter(v)} className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${filter===v?"bg-[#1A3A6B] text-white":"bg-white text-[#5A738A] hover:bg-[#EAF2FA]"}`}>{l}</button>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {loading ? <div className="p-12 text-center text-[#5A738A]">Chargement...</div> :
            filtered.length===0 ? <div className="p-12 text-center text-[#5A738A]">Aucun article.</div> :
            <table className="w-full text-sm">
              <thead className="bg-[#F4F7FB] border-b border-gray-100">
                <tr>{["Titre","Catégorie","Statut","Date","Actions"].map(h=><th key={h} className="px-5 py-3 text-left text-xs font-semibold text-[#5A738A] uppercase">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(post=>(
                  <motion.tr key={post.id} initial={{opacity:0}} animate={{opacity:1}} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5 max-w-xs">
                      <p className="font-semibold text-[#0D1F3C] truncate">{post.title}</p>
                      <p className="text-[#5A738A] text-xs truncate">{post.excerpt}</p>
                    </td>
                    <td className="px-5 py-3.5 text-[#5A738A]">{cats.find(c=>c.id===post.category_id)?.name||"—"}</td>
                    <td className="px-5 py-3.5">{statusBadge(post.status)}</td>
                    <td className="px-5 py-3.5 text-[#5A738A] text-xs">{new Date(post.created_at).toLocaleDateString("fr")}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-2">
                        <button onClick={()=>setModal({open:true,data:post,content:""})} className="w-8 h-8 rounded-lg bg-[#EAF2FA] text-[#1A3A6B] flex items-center justify-center hover:bg-[#1A3A6B] hover:text-white transition-colors"><Edit2 size={13}/></button>
                        <button onClick={()=>del(post.id)} className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"><Trash2 size={13}/></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          }
        </div>
      </main>

      {modal.open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-[#0D1F3C]">{modal.data.id?"Modifier":"Nouvel"} Article</h3>
              <button onClick={()=>setModal({open:false,data:emptyPost,content:""})} className="text-gray-400 text-xl">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#0D1F3C] mb-1.5">Titre *</label>
                <input value={modal.data.title??""} onChange={e=>setModal(m=>({...m,data:{...m.data,title:e.target.value}}))}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#EAF2FA] focus:border-[#1E90D4] focus:outline-none text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0D1F3C] mb-1.5">Slug</label>
                  <input value={modal.data.slug??""} onChange={e=>setModal(m=>({...m,data:{...m.data,slug:e.target.value}}))}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#EAF2FA] focus:border-[#1E90D4] focus:outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0D1F3C] mb-1.5">Catégorie</label>
                  <select value={modal.data.category_id??""} onChange={e=>setModal(m=>({...m,data:{...m.data,category_id:e.target.value}}))}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#EAF2FA] focus:border-[#1E90D4] focus:outline-none text-sm bg-white">
                    <option value="">— Choisir —</option>
                    {cats.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0D1F3C] mb-1.5">Résumé</label>
                <textarea rows={2} value={modal.data.excerpt??""} onChange={e=>setModal(m=>({...m,data:{...m.data,excerpt:e.target.value}}))}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#EAF2FA] focus:border-[#1E90D4] focus:outline-none text-sm resize-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0D1F3C] mb-1.5">Contenu (Markdown)</label>
                <textarea rows={8} value={modal.content} onChange={e=>setModal(m=>({...m,content:e.target.value}))}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#EAF2FA] focus:border-[#1E90D4] focus:outline-none text-sm resize-none font-mono" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0D1F3C] mb-1.5">Statut</label>
                <select value={modal.data.status??"draft"} onChange={e=>setModal(m=>({...m,data:{...m.data,status:e.target.value}}))}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#EAF2FA] focus:border-[#1E90D4] focus:outline-none text-sm bg-white">
                  <option value="draft">Brouillon</option>
                  <option value="published">Publier</option>
                  <option value="archived">Archiver</option>
                </select>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={()=>setModal({open:false,data:emptyPost,content:""})} className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600">Annuler</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary text-sm py-2 px-5">{saving?"Enregistrement...":"Enregistrer"}</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

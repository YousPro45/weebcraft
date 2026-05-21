"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  FolderOpen, Mail, Star, Send, MessageSquare,
  TrendingUp, Users, Globe, BookOpen, ArrowUpRight,
} from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import { createClient } from "@/lib/supabase-browser";
import Link from "next/link";

type Stats = {
  projects: number;
  contacts: number;
  testimonials: number;
  subscribers: number;
  quotes: number;
  posts: number;
};

type RecentContact = { id: string; name: string; email: string; subject: string; created_at: string; status: string };

const statCards = (s: Stats) => [
  { label: "Projets Portfolio", value: s.projects,     icon: FolderOpen,    color: "#1E90D4", href: "/admin/portfolio" },
  { label: "Messages Reçus",    value: s.contacts,     icon: Mail,          color: "#1A3A6B", href: "/admin/contacts" },
  { label: "Demandes de Devis", value: s.quotes,       icon: MessageSquare, color: "#2255A4", href: "/admin/quotes" },
  { label: "Témoignages",       value: s.testimonials, icon: Star,          color: "#4FB3E8", href: "/admin/testimonials" },
  { label: "Abonnés Newsletter",value: s.subscribers,  icon: Send,          color: "#1A3A6B", href: "/admin/newsletter" },
  { label: "Articles Blog",     value: s.posts,        icon: BookOpen,      color: "#1E90D4", href: "/admin/blog" },
];

export default function DashboardPage() {
  const supabase = useRef(createClient());
  const [stats, setStats] = useState<Stats>({ projects: 0, contacts: 0, testimonials: 0, subscribers: 0, quotes: 0, posts: 0 });
  const [recentContacts, setRecentContacts] = useState<RecentContact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [projects, contacts, testimonials, subscribers, quotes, posts, recent] = await Promise.all([
        supabase.current.from("portfolio_projects").select("id", { count: "exact", head: true }),
        supabase.current.from("contact_submissions").select("id", { count: "exact", head: true }),
        supabase.current.from("testimonials").select("id", { count: "exact", head: true }),
        supabase.current.from("newsletter_subscribers").select("id", { count: "exact", head: true }),
        supabase.current.from("quote_requests").select("id", { count: "exact", head: true }),
        supabase.current.from("blog_posts").select("id", { count: "exact", head: true }),
        supabase.current.from("contact_submissions").select("id,name,email,subject,created_at,status").order("created_at", { ascending: false }).limit(5),
      ]);
      setStats({
        projects: projects.count ?? 0,
        contacts: contacts.count ?? 0,
        testimonials: testimonials.count ?? 0,
        subscribers: subscribers.count ?? 0,
        quotes: quotes.count ?? 0,
        posts: posts.count ?? 0,
      });
      setRecentContacts((recent.data as RecentContact[]) ?? []);
      setLoading(false);
    }
    load();
  }, []);

  const statusBadge = (status: string) => {
    const map: Record<string, string> = { new: "bg-yellow-100 text-yellow-700", read: "bg-gray-100 text-gray-600", replied: "bg-green-100 text-green-700", archived: "bg-red-100 text-red-600" };
    const labels: Record<string, string> = { new: "Nouveau", read: "Lu", replied: "Répondu", archived: "Archivé" };
    return <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${map[status] ?? "bg-gray-100 text-gray-600"}`}>{labels[status] ?? status}</span>;
  };

  return (
    <div className="flex flex-col min-h-full">
      <AdminHeader title="Tableau de Bord" subtitle="Vue d'ensemble de votre plateforme" />
      <main className="flex-1 p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {statCards(stats).map((card, i) => (
            <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <Link href={card.href} className="block bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: card.color + "18" }}>
                    <card.icon size={22} style={{ color: card.color }} />
                  </div>
                  <ArrowUpRight size={16} className="text-gray-300 group-hover:text-[#1E90D4] transition-colors" />
                </div>
                <p className="text-2xl font-bold text-[#0D1F3C]">{loading ? "—" : card.value}</p>
                <p className="text-[#5A738A] text-xs mt-1">{card.label}</p>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
              <h2 className="font-bold text-[#0D1F3C] text-sm">Derniers Messages</h2>
              <Link href="/admin/contacts" className="text-[#1E90D4] text-xs font-semibold hover:underline">Voir tout</Link>
            </div>
            {loading ? (
              <div className="p-8 text-center text-[#5A738A] text-sm">Chargement...</div>
            ) : recentContacts.length === 0 ? (
              <div className="p-8 text-center text-[#5A738A] text-sm">Aucun message pour le moment.</div>
            ) : (
              <div className="divide-y divide-gray-50">
                {recentContacts.map((c) => (
                  <div key={c.id} className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50/60 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-[#EAF2FA] flex items-center justify-center text-[#1A3A6B] font-bold text-sm flex-shrink-0">
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#0D1F3C] text-sm truncate">{c.name}</p>
                      <p className="text-[#5A738A] text-xs truncate">{c.subject || c.email}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {statusBadge(c.status)}
                      <span className="text-[#5A738A] text-xs">{new Date(c.created_at).toLocaleDateString("fr")}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Quick Links */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-sm p-5">
            <h2 className="font-bold text-[#0D1F3C] text-sm mb-4">Actions Rapides</h2>
            <div className="space-y-2">
              {[
                { href: "/admin/portfolio", label: "Ajouter un projet", icon: FolderOpen, color: "#1E90D4" },
                { href: "/admin/blog",      label: "Nouvel article",    icon: BookOpen,   color: "#2255A4" },
                { href: "/admin/testimonials", label: "Ajouter un avis", icon: Star,     color: "#1A3A6B" },
                { href: "/admin/pricing",   label: "Modifier les tarifs", icon: TrendingUp, color: "#4FB3E8" },
                { href: "/admin/settings",  label: "Paramètres du site", icon: Globe,    color: "#1A3A6B" },
              ].map((item) => (
                <Link key={item.href} href={item.href}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#EAF2FA] transition-colors group">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: item.color + "18" }}>
                    <item.icon size={16} style={{ color: item.color }} />
                  </div>
                  <span className="text-[#0D1F3C] text-sm font-medium group-hover:text-[#1E90D4] transition-colors">{item.label}</span>
                  <ArrowUpRight size={14} className="ml-auto text-gray-300 group-hover:text-[#1E90D4] transition-colors" />
                </Link>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Site Performance Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="rounded-2xl p-6 flex items-center gap-6"
          style={{ background: "linear-gradient(135deg,#0D1F3C,#1A3A6B)" }}
        >
          <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
            <Users size={24} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-white font-bold">Connectez Supabase pour les statistiques en temps réel</p>
            <p className="text-white/60 text-sm mt-0.5">Ajoutez vos clés dans .env.local pour activer toutes les fonctionnalités.</p>
          </div>
          <Link href="/admin/settings" className="btn-accent text-sm py-2 px-5 flex-shrink-0">
            Configurer
          </Link>
        </motion.div>
      </main>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Monitor, FolderOpen, Grid3x3, Star,
  Mail, FileText, CreditCard, BookOpen, Send, Settings,
  LogOut, Building2, ChevronLeft, ChevronRight, Eye,
  MessageSquare,
} from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";

const navItems = [
  { href: "/admin",             icon: LayoutDashboard, label: "Tableau de Bord" },
  { href: "/admin/portfolio",   icon: FolderOpen,      label: "Portfolio" },
  { href: "/admin/services",    icon: Monitor,         label: "Services" },
  { href: "/admin/niches",      icon: Grid3x3,         label: "Secteurs" },
  { href: "/admin/pricing",     icon: CreditCard,      label: "Tarifs" },
  { href: "/admin/blog",        icon: BookOpen,        label: "Blog" },
  { href: "/admin/testimonials",icon: Star,            label: "Témoignages" },
  { href: "/admin/contacts",    icon: Mail,            label: "Contacts" },
  { href: "/admin/quotes",      icon: MessageSquare,   label: "Devis" },
  { href: "/admin/newsletter",  icon: Send,            label: "Newsletter" },
  { href: "/admin/settings",    icon: Settings,        label: "Paramètres" },
];

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="relative flex-shrink-0 flex flex-col bg-[#0D1F3C] overflow-hidden"
      style={{ minHeight: "100vh" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10 overflow-hidden">
        <div className="w-9 h-9 rounded-xl bg-[#1E90D4] flex items-center justify-center flex-shrink-0">
          <Building2 size={18} className="text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="overflow-hidden"
            >
              <p className="text-white font-bold text-sm leading-none whitespace-nowrap">WebCraft Admin</p>
              <p className="text-[#4FB3E8] text-xs mt-0.5 whitespace-nowrap">Panneau de Gestion</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors relative overflow-hidden ${
                active
                  ? "bg-[#1E90D4]/20 text-[#4FB3E8] border-r-2 border-[#1E90D4]"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon size={19} className="flex-shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="whitespace-nowrap font-medium"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* Bottom: view site + logout */}
      <div className="border-t border-white/10 p-3 space-y-1">
        <a
          href="/"
          target="_blank"
          title={collapsed ? "Voir le site" : undefined}
          className="flex items-center gap-3 px-3 py-2 text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-sm"
        >
          <Eye size={18} className="flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="whitespace-nowrap">
                Voir le site
              </motion.span>
            )}
          </AnimatePresence>
        </a>
        <button
          onClick={handleLogout}
          title={collapsed ? "Déconnexion" : undefined}
          className="w-full flex items-center gap-3 px-3 py-2 text-red-400/70 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors text-sm"
        >
          <LogOut size={18} className="flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="whitespace-nowrap">
                Déconnexion
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-[#1E90D4] flex items-center justify-center text-white shadow-lg z-10"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </motion.aside>
  );
}

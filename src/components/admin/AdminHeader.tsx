"use client";

import { Bell } from "lucide-react";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export default function AdminHeader({ title, subtitle, action }: AdminHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
      <div>
        <h1 className="font-bold text-[#0D1F3C] text-lg">{title}</h1>
        {subtitle && <p className="text-[#5A738A] text-xs mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        {action}
        <button className="w-9 h-9 rounded-full bg-[#EAF2FA] flex items-center justify-center text-[#1A3A6B] hover:bg-[#1A3A6B] hover:text-white transition-colors">
          <Bell size={16} />
        </button>
      </div>
    </header>
  );
}

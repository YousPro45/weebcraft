// Server Component — can export route segment config
// force-dynamic cascades to ALL child pages under /admin/*
// This prevents build-time static prerendering which fails without Vercel env vars
export const dynamic = "force-dynamic";

import AdminShell from "@/components/admin/AdminShell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}

"use client";

import { useRef, useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";

// ── Social icons as plain data (no JSX at module level — prevents hydration mismatch)
const socialIcons = [
  {
    label: "Facebook",
    href: "#",
    paths: ["M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"],
    rects: [] as { w: string; h: string; x: string; y: string; rx?: string; ry?: string }[],
    circles: [] as { cx: string; cy: string; r: string }[],
    lines: [] as { x1: string; x2: string; y1: string; y2: string }[],
  },
  {
    label: "Instagram",
    href: "#",
    paths: ["M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"],
    rects: [{ w: "20", h: "20", x: "2", y: "2", rx: "5", ry: "5" }],
    circles: [],
    lines: [{ x1: "17.5", x2: "17.51", y1: "6.5", y2: "6.5" }],
  },
  {
    label: "LinkedIn",
    href: "#",
    paths: ["M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"],
    rects: [{ w: "4", h: "12", x: "2", y: "9" }],
    circles: [{ cx: "4", cy: "4", r: "2" }],
    lines: [],
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/212658242225",
    paths: [
      "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z",
    ],
    rects: [],
    circles: [],
    lines: [],
  },
];

const services = [
  "Création Site Web", "E-commerce", "Référencement SEO",
  "Développement Sur Mesure", "Réseaux Sociaux", "Design & Identité",
];
const quickLinks = [
  { label: "Accueil",   href: "#hero" },
  { label: "Services",  href: "#services" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Tarifs",    href: "#pricing" },
  { label: "Contact",   href: "#contact" },
];

// ── NewsletterForm ────────────────────────────────────────────────────────────
function NewsletterForm() {
  // createClient() inside useRef — runs only once, only on the client
  const supabase = useRef(createClient());
  const [email,  setEmail]  = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    const { error } = await supabase.current
      .from("newsletter_subscribers")
      .upsert({ email, source: "footer" }, { onConflict: "email" });
    setStatus(error ? "error" : "done");
    if (!error) setEmail("");
    setTimeout(() => setStatus("idle"), 4000);
  };

  return (
    <form className="flex gap-2" onSubmit={handleSubmit}>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Votre email"
        className="flex-1 px-3 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-[#1E90D4]"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-accent text-sm py-2 px-4 disabled:opacity-60"
      >
        {status === "done" ? "✓" : status === "loading" ? "..." : "OK"}
      </button>
    </form>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
export default function Footer() {
  return (
    <footer className="bg-[#0D1F3C] text-white">
      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-full bg-[#1E90D4] flex items-center justify-center">
              <span className="text-white font-bold text-lg">W</span>
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-none">WebCraft</p>
              <p className="text-[#4FB3E8] text-xs">Agence Web — Maroc</p>
            </div>
          </div>

          <p className="text-white/60 text-sm leading-relaxed mb-6">
            Nous créons des sites web professionnels pour tous les secteurs :
            restaurants, cliniques, hôtels, e-commerce et bien plus encore.
          </p>

          {/* Social icons — rendered from plain data, no module-level JSX */}
          <div className="flex gap-3">
            {socialIcons.map((icon) => (
              <a
                key={icon.label}
                href={icon.href}
                target={icon.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                aria-label={icon.label}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#1E90D4] flex items-center justify-center transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16" height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {icon.rects.map((r, i) => (
                    <rect key={i} width={r.w} height={r.h} x={r.x} y={r.y} rx={r.rx} ry={r.ry} />
                  ))}
                  {icon.paths.map((d, i) => (
                    <path key={i} d={d} />
                  ))}
                  {icon.circles.map((c, i) => (
                    <circle key={i} cx={c.cx} cy={c.cy} r={c.r} />
                  ))}
                  {icon.lines.map((l, i) => (
                    <line key={i} x1={l.x1} x2={l.x2} y1={l.y1} y2={l.y2} />
                  ))}
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Services */}
        <div>
          <h3 className="font-bold text-lg mb-5 text-white">Nos Services</h3>
          <ul className="space-y-2.5">
            {services.map((s) => (
              <li key={s}>
                <a
                  href="#services"
                  className="text-white/60 hover:text-[#4FB3E8] text-sm transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1E90D4] inline-block" />
                  {s}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-bold text-lg mb-5 text-white">Navigation</h3>
          <ul className="space-y-2.5">
            {quickLinks.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className="text-white/60 hover:text-[#4FB3E8] text-sm transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1E90D4] inline-block" />
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact + Newsletter */}
        <div>
          <h3 className="font-bold text-lg mb-5 text-white">Contact</h3>
          <div className="space-y-4">
            <a
              href="tel:+212658242225"
              className="flex items-start gap-3 text-white/60 hover:text-[#4FB3E8] text-sm transition-colors"
            >
              <Phone size={16} className="mt-0.5 text-[#1E90D4] flex-shrink-0" />
              +212 658 242 225
            </a>
            <a
              href="mailto:webcraft50@gmail.com"
              className="flex items-start gap-3 text-white/60 hover:text-[#4FB3E8] text-sm transition-colors"
            >
              <Mail size={16} className="mt-0.5 text-[#1E90D4] flex-shrink-0" />
              webcraft50@gmail.com
            </a>
            <div className="flex items-start gap-3 text-white/60 text-sm">
              <MapPin size={16} className="mt-0.5 text-[#1E90D4] flex-shrink-0" />
              Maroc
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm text-white/60 mb-3">Recevez nos offres et conseils web</p>
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-white/40 text-sm">
          <p>© 2025 WebCraft Maroc. Tous droits réservés.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-white/70 transition-colors">Politique de confidentialité</a>
            <a href="#" className="hover:text-white/70 transition-colors">Mentions légales</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

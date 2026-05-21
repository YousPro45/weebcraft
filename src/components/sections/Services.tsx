"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Monitor, Search, ShoppingCart, Code2, Share2, Palette } from "lucide-react";

const services = [
  {
    icon: Monitor,
    title: "Création de Site Web",
    desc: "Sites vitrines, portfolios, sites corporate — modernes, rapides et adaptés à tous les écrans.",
    color: "#1E90D4",
    tag: "Le plus demandé",
  },
  {
    icon: ShoppingCart,
    title: "E-commerce",
    desc: "Boutiques en ligne complètes avec paiement, gestion des commandes et tableau de bord.",
    color: "#1A3A6B",
    tag: null,
  },
  {
    icon: Search,
    title: "Référencement SEO",
    desc: "Optimisation pour Google afin que vos clients vous trouvent en premier sur le web.",
    color: "#2255A4",
    tag: null,
  },
  {
    icon: Code2,
    title: "Développement Sur Mesure",
    desc: "Applications web complexes, portails clients, systèmes de réservation et plateformes.",
    color: "#1E90D4",
    tag: null,
  },
  {
    icon: Share2,
    title: "Réseaux Sociaux",
    desc: "Gestion de contenu, publicités Meta & Google, et stratégie digitale complète.",
    color: "#1A3A6B",
    tag: null,
  },
  {
    icon: Palette,
    title: "Design & Identité",
    desc: "Logo, charte graphique, branding complet pour une image professionnelle et cohérente.",
    color: "#2255A4",
    tag: null,
  },
];

export default function Services() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="services" ref={ref} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-[#1E90D4] font-semibold text-sm uppercase tracking-widest mb-3">Ce Que Nous Faisons</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0D1F3C]">Nos Services Digitaux</h2>
          <div className="w-16 h-1 mx-auto mt-4 rounded-full" style={{ background: "linear-gradient(90deg,#1A3A6B,#1E90D4)" }} />
          <p className="text-[#5A738A] mt-4 max-w-xl mx-auto text-sm leading-relaxed">
            De la création web au marketing digital, on vous accompagne sur tous vos besoins en ligne.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group relative p-7 rounded-2xl border border-[#EAF2FA] hover:border-[#1E90D4]/30 bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {s.tag && (
                <span className="absolute top-4 right-4 text-xs font-bold px-2.5 py-1 rounded-full bg-[#1E90D4] text-white">
                  {s.tag}
                </span>
              )}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                style={{ backgroundColor: s.color + "15" }}
              >
                <s.icon size={26} style={{ color: s.color }} />
              </div>
              <h3 className="font-bold text-[#0D1F3C] text-lg mb-3">{s.title}</h3>
              <p className="text-[#5A738A] text-sm leading-relaxed">{s.desc}</p>
              <a
                href="#contact"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
                style={{ color: s.color }}
              >
                En savoir plus
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

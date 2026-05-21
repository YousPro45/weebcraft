"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CheckCircle2, Zap } from "lucide-react";

const plans = [
  {
    name: "Starter",
    subtitle: "Site Vitrine",
    price: "2 500",
    currency: "MAD",
    period: "paiement unique",
    color: "#1A3A6B",
    featured: false,
    features: [
      "5 pages professionnelles",
      "Design responsive (mobile)",
      "Formulaire de contact",
      "Optimisation SEO de base",
      "Hébergement 1 an inclus",
      "Livraison en 7 jours",
    ],
    notIncluded: ["E-commerce", "Blog", "Système de réservation"],
  },
  {
    name: "Business",
    subtitle: "Site Pro Complet",
    price: "5 500",
    currency: "MAD",
    period: "paiement unique",
    color: "#1E90D4",
    featured: true,
    features: [
      "10 pages personnalisées",
      "Design premium sur mesure",
      "Blog / Actualités",
      "Système de réservation en ligne",
      "SEO avancé + Google Maps",
      "Hébergement 1 an inclus",
      "Formation + support 3 mois",
      "Livraison en 10 jours",
    ],
    notIncluded: ["Boutique e-commerce"],
  },
  {
    name: "E-commerce",
    subtitle: "Boutique en Ligne",
    price: "9 900",
    currency: "MAD",
    period: "paiement unique",
    color: "#2255A4",
    featured: false,
    features: [
      "Boutique complète (produits illimités)",
      "Paiement en ligne sécurisé",
      "Gestion des commandes",
      "Dashboard admin",
      "SEO e-commerce",
      "Hébergement 1 an inclus",
      "Formation + support 6 mois",
      "Livraison en 14 jours",
    ],
    notIncluded: [],
  },
];

export default function Pricing() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="pricing" ref={ref} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-[#1E90D4] font-semibold text-sm uppercase tracking-widest mb-3">Nos Tarifs</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0D1F3C]">Des Prix Transparents, Sans Surprise</h2>
          <div className="w-16 h-1 mx-auto mt-4 rounded-full" style={{ background: "linear-gradient(90deg,#1A3A6B,#1E90D4)" }} />
          <p className="text-[#5A738A] mt-4 max-w-xl mx-auto text-sm">
            Choisissez le pack adapté à votre projet. Devis personnalisé disponible gratuitement.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className={`relative rounded-3xl flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
                plan.featured
                  ? "shadow-2xl scale-[1.03] ring-2 ring-[#1E90D4]"
                  : "shadow-sm hover:shadow-lg border border-[#EAF2FA]"
              }`}
              style={{ background: plan.featured ? `linear-gradient(135deg, #0D1F3C, #1A3A6B)` : "#fff" }}
            >
              {plan.featured && (
                <div className="absolute top-0 left-0 right-0 flex justify-center">
                  <span className="bg-[#1E90D4] text-white text-xs font-bold px-5 py-1.5 rounded-b-xl flex items-center gap-1.5">
                    <Zap size={13} /> Le Plus Populaire
                  </span>
                </div>
              )}

              <div className={`p-8 ${plan.featured ? "pt-12" : ""}`}>
                {/* Header */}
                <div className="mb-6">
                  <p className={`font-bold text-xl mb-0.5 ${plan.featured ? "text-white" : "text-[#0D1F3C]"}`}>
                    {plan.name}
                  </p>
                  <p className={`text-sm ${plan.featured ? "text-white/60" : "text-[#5A738A]"}`}>{plan.subtitle}</p>
                </div>

                {/* Price */}
                <div className="mb-6 pb-6 border-b" style={{ borderColor: plan.featured ? "rgba(255,255,255,0.15)" : "#EAF2FA" }}>
                  <div className="flex items-end gap-1">
                    <span className={`text-4xl font-bold ${plan.featured ? "text-white" : "text-[#0D1F3C]"}`}>
                      {plan.price}
                    </span>
                    <span className={`text-lg font-semibold mb-1 ${plan.featured ? "text-[#4FB3E8]" : "text-[#1E90D4]"}`}>
                      {plan.currency}
                    </span>
                  </div>
                  <p className={`text-xs mt-1 ${plan.featured ? "text-white/50" : "text-[#5A738A]"}`}>
                    {plan.period}
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-3 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle2 size={16} className="flex-shrink-0 mt-0.5" style={{ color: plan.featured ? "#4FB3E8" : "#1E90D4" }} />
                      <span className={plan.featured ? "text-white/85" : "text-[#0D1F3C]"}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <div className="px-8 pb-8 mt-auto">
                <a
                  href="#contact"
                  className={`w-full flex items-center justify-center py-3.5 rounded-full font-bold text-sm transition-all duration-300 hover:-translate-y-0.5 ${
                    plan.featured
                      ? "bg-[#1E90D4] text-white hover:bg-[#4FB3E8] shadow-lg"
                      : "bg-[#1A3A6B] text-white hover:bg-[#2255A4]"
                  }`}
                >
                  Commencer ce Pack
                </a>
                <p className={`text-xs text-center mt-3 ${plan.featured ? "text-white/40" : "text-[#5A738A]"}`}>
                  Devis gratuit · Sans engagement
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Custom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center p-8 rounded-3xl border-2 border-dashed border-[#1E90D4]/30 bg-[#EAF2FA]"
        >
          <p className="text-[#0D1F3C] font-bold text-lg mb-2">Vous avez un projet spécifique ?</p>
          <p className="text-[#5A738A] text-sm mb-5">
            Contactez-nous pour un devis personnalisé adapté à votre budget et vos besoins.
          </p>
          <a href="#contact" className="btn-accent">
            Obtenir un Devis Gratuit
          </a>
        </motion.div>
      </div>
    </section>
  );
}

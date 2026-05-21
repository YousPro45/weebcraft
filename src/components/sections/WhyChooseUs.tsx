"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Rocket, Shield, Clock, HeartHandshake, Smartphone, Search } from "lucide-react";

const reasons = [
  {
    icon: Rocket,
    title: "Livraison en 7 Jours",
    desc: "Votre site est en ligne rapidement. Pas de délais interminables — on respecte les délais convenus.",
  },
  {
    icon: Smartphone,
    title: "100% Mobile Responsive",
    desc: "Chaque site est parfaitement adapté aux mobiles, tablettes et ordinateurs. Aucun compromis.",
  },
  {
    icon: Search,
    title: "SEO Optimisé Dès le Départ",
    desc: "Votre site est construit pour être trouvé sur Google. Référencement naturel inclus dans tous nos packs.",
  },
  {
    icon: Shield,
    title: "Sécurisé & Performant",
    desc: "SSL, hébergement rapide, backups réguliers. Votre site tourne 24h/24 sans interruption.",
  },
  {
    icon: HeartHandshake,
    title: "Adapté à Votre Secteur",
    desc: "Nous comprenons les besoins spécifiques de chaque métier. Pas de template générique — du sur mesure.",
  },
  {
    icon: Clock,
    title: "Support Continu",
    desc: "Nous sommes disponibles après la livraison pour modifications, questions et maintenance.",
  },
];

export default function WhyChooseUs() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0D1F3C 0%, #1A3A6B 100%)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-[#4FB3E8] font-semibold text-sm uppercase tracking-widest mb-3">Pourquoi Nous Choisir</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Ce Qui Nous Distingue
          </h2>
          <div className="w-16 h-1 mx-auto mt-4 rounded-full bg-[#1E90D4]" />
          <p className="text-white/60 mt-4 max-w-xl mx-auto text-sm leading-relaxed">
            Des centaines de clients nous font confiance. Voici pourquoi ils reviennent et nous recommandent.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reasons.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group glass-card p-6 hover:bg-white/15 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-[#1E90D4]/20 flex items-center justify-center mb-4 group-hover:bg-[#1E90D4]/40 transition-colors">
                <r.icon size={24} className="text-[#4FB3E8]" />
              </div>
              <h3 className="font-bold text-white text-base mb-2">{r.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{r.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

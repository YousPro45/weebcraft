"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CheckCircle2, Globe, Users, Award } from "lucide-react";

const highlights = [
  "Plus de 5 ans d'expérience en développement web",
  "200+ sites livrés dans 20+ secteurs d'activité",
  "Équipe multilingue : Arabe, Français, Anglais",
  "Designs sur mesure adaptés à chaque métier",
  "Support technique et maintenance disponible",
  "Livraison rapide : site en ligne en 7 à 14 jours",
];

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" ref={ref} className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-14 items-center">
        {/* Left: Visual */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div
            className="relative rounded-3xl overflow-hidden h-96 lg:h-[500px]"
            style={{ background: "linear-gradient(135deg, #0D1F3C 0%, #1A3A6B 60%, #2255A4 100%)" }}
          >
            {/* Animated browser mockups */}
            <div className="absolute inset-0 p-6 flex flex-col gap-4 justify-center">
              {["Restaurant 🍽️", "Clinique 🏥", "Gym 💪"].map((label, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.5 + i * 0.2 }}
                  className="bg-white/10 border border-white/20 rounded-xl p-3"
                >
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="w-2 h-2 rounded-full bg-red-400/60" />
                    <span className="w-2 h-2 rounded-full bg-yellow-400/60" />
                    <span className="w-2 h-2 rounded-full bg-green-400/60" />
                    <span className="flex-1 bg-white/10 rounded text-white/40 text-xs px-2 py-0.5 mx-1">
                      www.{label.split(" ")[0].toLowerCase()}.ma ✓
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-2 bg-white/20 rounded flex-1" />
                    <div className="h-2 bg-[#1E90D4]/40 rounded w-12" />
                  </div>
                  <p className="text-white/60 text-xs mt-2">{label} — Site Professionnel</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="absolute -bottom-6 -right-4 sm:right-6 bg-white rounded-2xl shadow-xl p-5 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-[#1E90D4]/15 flex items-center justify-center">
              <Award size={24} className="text-[#1E90D4]" />
            </div>
            <div>
              <p className="font-bold text-2xl text-[#0D1F3C]">20+</p>
              <p className="text-[#5A738A] text-xs">Secteurs d&apos;activité</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Right: Content */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="text-[#1E90D4] font-semibold text-sm uppercase tracking-widest mb-3">Notre Histoire</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0D1F3C] leading-tight mb-4">
            Votre Partenaire Web<br />Depuis 2019
          </h2>
          <div className="w-16 h-1 rounded-full mb-6" style={{ background: "linear-gradient(90deg,#1A3A6B,#1E90D4)" }} />
          <p className="text-[#5A738A] leading-relaxed mb-4 text-sm">
            WebCraft Maroc est une agence web professionnelle basée au Maroc. Notre mission est simple : créer des sites web modernes et performants pour <strong className="text-[#1A3A6B]">n&apos;importe quel type de business</strong>, du restaurant de quartier à la grande clinique.
          </p>
          <p className="text-[#5A738A] leading-relaxed mb-8 text-sm">
            Nous combinons design moderne, technologie de pointe et compréhension des besoins locaux pour livrer des sites qui <strong className="text-[#1A3A6B]">attirent et convertissent</strong> vos clients en ligne.
          </p>

          <ul className="space-y-3 mb-10">
            {highlights.map((h, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                className="flex items-start gap-3 text-sm text-[#0D1F3C]"
              >
                <CheckCircle2 size={18} className="text-[#1E90D4] flex-shrink-0 mt-0.5" />
                {h}
              </motion.li>
            ))}
          </ul>

          <div className="flex gap-8">
            {[{ icon: Users, val: "150+", lab: "Clients" }, { icon: Globe, val: "200+", lab: "Sites" }, { icon: Award, val: "20+", lab: "Niches" }].map((s) => (
              <div key={s.lab} className="flex flex-col items-center text-center">
                <s.icon size={22} className="text-[#1E90D4] mb-1" />
                <p className="font-bold text-xl text-[#0D1F3C]">{s.val}</p>
                <p className="text-[#5A738A] text-xs">{s.lab}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

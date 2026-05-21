"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Karim El Fassi",
    role: "Propriétaire — Restaurant Le Jardin",
    text: "WebCraft a créé notre site en moins de 10 jours. Les réservations en ligne ont augmenté de 40% le premier mois ! Design magnifique, très professionnel.",
    rating: 5,
    niche: "Restaurant",
    emoji: "🍽️",
  },
  {
    name: "Dr. Samira Benali",
    role: "Médecin Généraliste — Clinique MediCare",
    text: "Le site de ma clinique est parfait. Les patients prennent rendez-vous en ligne maintenant, ce qui me fait gagner beaucoup de temps. Je recommande vivement.",
    rating: 5,
    niche: "Clinique",
    emoji: "🏥",
  },
  {
    name: "Youssef Tachfine",
    role: "Gérant — FitZone Gym",
    text: "Notre salle de sport a doublé ses inscriptions depuis la mise en ligne du site. La page abonnements en ligne est exactement ce qu'il nous fallait.",
    rating: 5,
    niche: "Gym",
    emoji: "💪",
  },
  {
    name: "Fatima Zahra Idrissi",
    role: "Fondatrice — Boutique Chériffa",
    text: "Ma boutique e-commerce fonctionne parfaitement. Les commandes arrivent même la nuit ! L'équipe WebCraft m'a tout expliqué et le support est excellent.",
    rating: 5,
    niche: "E-commerce",
    emoji: "🛒",
  },
];

export default function Testimonials() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);

  return (
    <section id="testimonials" ref={ref} className="py-20 bg-[#EAF2FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-[#1E90D4] font-semibold text-sm uppercase tracking-widest mb-3">Avis Clients</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0D1F3C]">Ils Nous Font Confiance</h2>
          <div className="w-16 h-1 mx-auto mt-4 rounded-full" style={{ background: "linear-gradient(90deg,#1A3A6B,#1E90D4)" }} />
          <p className="text-[#5A738A] mt-4 text-sm">Restaurants, cliniques, gyms, e-commerce... nos clients témoignent.</p>
        </motion.div>

        {/* Desktop: 2-col grid */}
        <div className="hidden md:grid md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bg-white rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow relative"
            >
              <Quote size={36} className="text-[#EAF2FA] absolute top-5 right-5" />
              {/* Niche badge */}
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-[#EAF2FA] text-[#1A3A6B] mb-4">
                {t.emoji} {t.niche}
              </span>
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={16} className="text-[#1E90D4] fill-[#1E90D4]" />
                ))}
              </div>
              <p className="text-[#5A738A] text-sm leading-relaxed mb-6 italic">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #1A3A6B, #1E90D4)" }}>
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-[#0D1F3C] text-sm">{t.name}</p>
                  <p className="text-[#5A738A] text-xs">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile: slider */}
        <div className="md:hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-[#EAF2FA] text-[#1A3A6B] mb-4">
                {testimonials[current].emoji} {testimonials[current].niche}
              </span>
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonials[current].rating }).map((_, j) => (
                  <Star key={j} size={16} className="text-[#1E90D4] fill-[#1E90D4]" />
                ))}
              </div>
              <p className="text-[#5A738A] text-sm leading-relaxed mb-5 italic">&ldquo;{testimonials[current].text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #1A3A6B, #1E90D4)" }}>
                  {testimonials[current].name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-[#0D1F3C] text-sm">{testimonials[current].name}</p>
                  <p className="text-[#5A738A] text-xs">{testimonials[current].role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="flex justify-center gap-3 mt-6">
            <button onClick={prev} className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center hover:bg-[#1A3A6B] hover:text-white transition-colors">
              <ChevronLeft size={20} />
            </button>
            <div className="flex gap-2 items-center">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)}
                  className={`h-2 rounded-full transition-all ${i === current ? "bg-[#1A3A6B] w-4" : "bg-[#5A738A]/40 w-2"}`}
                />
              ))}
            </div>
            <button onClick={next} className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center hover:bg-[#1A3A6B] hover:text-white transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

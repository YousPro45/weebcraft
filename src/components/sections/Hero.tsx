"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const niches = [
  "Restaurant 🍽️", "Clinique 🏥", "Hôtel 🏨", "Gym 💪",
  "E-commerce 🛒", "Immobilier 🏠", "Avocat ⚖️", "Salon 💇",
  "Agence 🏢", "Construction 🔨", "Pharmacie 💊", "Traiteur 🥘",
];

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0D1F3C 0%, #1A3A6B 60%, #2255A4 100%)" }}
    >
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1800&q=75"
          alt="Agence web digitale"
          fill
          className="object-cover opacity-10"
          priority
          sizes="100vw"
        />
      </div>

      {/* Background glow orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #1E90D4, transparent)" }} />
        <div className="absolute bottom-32 left-10 w-72 h-72 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #4FB3E8, transparent)" }} />
        <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-20 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left: Text */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-[#4FB3E8] animate-pulse" />
            <span className="text-[#4FB3E8] text-sm font-medium">Agence Web Professionnelle — Maroc</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
          >
            Votre{" "}
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(90deg, #4FB3E8, #1E90D4)" }}>
              Site Web Pro
            </span>{" "}
            Pour N&apos;importe Quel Business
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-white/70 text-lg leading-relaxed mb-6 max-w-lg"
          >
            Restaurant, clinique, hôtel, e-commerce, gym... Peu importe votre secteur, nous créons un site web moderne, rapide et optimisé qui convertit vos visiteurs en clients.
          </motion.p>

          {/* Niche scroll ticker */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="overflow-hidden mb-8"
          >
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
              className="flex gap-3 w-max"
            >
              {[...niches, ...niches].map((n, i) => (
                <span key={i}
                  className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/70 text-sm whitespace-nowrap">
                  {n}
                </span>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="flex flex-wrap gap-4"
          >
            <a href="#portfolio" className="btn-accent">
              Voir nos Réalisations <ArrowRight size={18} />
            </a>
            <a href="#contact" className="btn-outline-white">
              Devis Gratuit
            </a>
          </motion.div>

          {/* Trust logos */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-10 flex items-center gap-4 flex-wrap"
          >
            <p className="text-white/40 text-xs">Nos clients nous font confiance :</p>
            {["Google", "Meta", "WordPress", "Shopify"].map((brand) => (
              <span key={brand} className="text-white/50 text-xs font-semibold border border-white/15 px-3 py-1 rounded-full">
                {brand}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Right: Multi-device mockup */}
        <div className="hidden lg:block relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="relative"
          >
            {/* Main laptop mockup */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/20">
              <Image
                src="https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=700&q=80"
                alt="Site web professionnel sur laptop"
                width={700}
                height={430}
                className="w-full object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D1F3C]/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="glass-card p-3 inline-flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-white text-xs font-medium">Site en ligne — Livré en 7 jours</span>
                </div>
              </div>
            </div>

            {/* Floating stat cards */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="absolute -top-5 -right-5 glass-card p-4 shadow-xl"
            >
              <p className="text-white font-bold text-2xl">200+</p>
              <p className="text-white/60 text-xs">Sites Créés</p>
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.5 }}
              className="absolute -bottom-5 -left-5 glass-card p-4 shadow-xl"
            >
              <p className="text-white font-bold text-2xl">98%</p>
              <p className="text-white/60 text-xs">Satisfaction Client</p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-white/40 text-xs">Défiler</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-5 h-8 rounded-full border border-white/30 flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-2 rounded-full bg-white/60" />
        </motion.div>
      </motion.div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const niches = [
  {
    id: 1,
    label: "Restaurant",
    tag: "RESTAURANT",
    headline: "Cuisine raffinée,\nExpérience unique",
    desc: "Sites avec menu interactif, réservation en ligne et galerie appétissante.",
    img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
    accent: "#C0392B",
    span: "col-span-1 row-span-2",
  },
  {
    id: 2,
    label: "Santé / Clinique",
    tag: "SANTÉ / CLINIQUE",
    headline: "Votre santé,\nnotre priorité",
    desc: "Prise de RDV en ligne, fiche praticiens et services médicaux.",
    img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80",
    accent: "#2255A4",
    span: "col-span-1",
  },
  {
    id: 3,
    label: "Commerce / E-Commerce",
    tag: "COMMERCE / E-COMMERCE",
    headline: "Découvrez nos produits\nde qualité supérieure",
    desc: "Boutiques en ligne complètes avec paiement sécurisé.",
    img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
    accent: "#1E90D4",
    span: "col-span-1",
  },
  {
    id: 4,
    label: "Services / Agence",
    tag: "SERVICES",
    headline: "Des solutions sur-mesure\npour faire grandir votre entreprise",
    desc: "Sites corporate, agences, cabinets de conseil.",
    img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    accent: "#1A3A6B",
    span: "col-span-1",
  },
  {
    id: 5,
    label: "Hôtellerie / Hôtel",
    tag: "HÔTELLERIE / HÔTEL",
    headline: "Luxe, confort\net sérénité",
    desc: "Réservation de chambres, galerie et gestion des disponibilités.",
    img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    accent: "#0D1F3C",
    span: "col-span-1 row-span-2",
  },
  {
    id: 6,
    label: "Fitness / Gym",
    tag: "FITNESS / GYM",
    headline: "Dépassez vos limites,\ndevenez votre meilleure version",
    desc: "Abonnements en ligne, planning de cours, espace membre.",
    img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
    accent: "#E67E22",
    span: "col-span-1",
  },
  {
    id: 7,
    label: "Salon de Beauté",
    tag: "SALON DE BEAUTÉ",
    headline: "Révélez votre\nbeauté naturelle",
    desc: "Réservation en ligne, catalogue soins et boutique beauté.",
    img: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80",
    accent: "#8E44AD",
    span: "col-span-1",
  },
  {
    id: 8,
    label: "Avocat / Cabinet Juridique",
    tag: "AVOCAT / CABINET JURIDIQUE",
    headline: "Défendre vos droits,\nprotéger vos intérêts",
    desc: "Blog juridique, consultation en ligne et présentation du cabinet.",
    img: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80",
    accent: "#1A3A6B",
    span: "col-span-1",
  },
  {
    id: 9,
    label: "Construction / BTP",
    tag: "CONSTRUCTION / BTP",
    headline: "Construisons aujourd'hui\nle monde de demain",
    desc: "Portfolio de réalisations, demande de devis, présentation équipe.",
    img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80",
    accent: "#D4A017",
    span: "col-span-2",
  },
];

export default function NicheShowcase() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} id="niches" className="py-20 bg-[#0D1F3C] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-[#4FB3E8] font-semibold text-sm uppercase tracking-widest mb-3">Tous les Secteurs</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Un Site Pro pour{" "}
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(90deg,#4FB3E8,#1E90D4)" }}>
              Chaque Métier
            </span>
          </h2>
          <div className="w-16 h-1 mx-auto mt-4 rounded-full bg-[#1E90D4]" />
          <p className="text-white/60 mt-4 max-w-xl mx-auto text-sm">
            Restaurant, clinique, hôtel, gym, boutique... nous avons créé des centaines de sites pour tous les secteurs.
          </p>
        </motion.div>

        {/* Masonry-style grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {niches.map((niche, i) => (
            <motion.div
              key={niche.id}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className={`group relative overflow-hidden rounded-2xl cursor-pointer ${
                niche.id === 9 ? "sm:col-span-2 lg:col-span-2" : ""
              } ${niche.id === 1 || niche.id === 5 ? "sm:row-span-1" : ""}`}
              style={{ minHeight: niche.id === 9 ? "220px" : "280px" }}
            >
              {/* Image */}
              <Image
                src={niche.img}
                alt={niche.label}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />

              {/* Overlay gradient */}
              <div
                className="absolute inset-0 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(to top, ${niche.accent}ee 0%, ${niche.accent}88 40%, transparent 100%)`,
                }}
              />

              {/* Dark overlay on hover */}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6">
                {/* Tag */}
                <span className="inline-block text-xs font-bold tracking-widest text-white/80 mb-2 uppercase">
                  {niche.tag}
                </span>

                {/* Headline */}
                <h3 className="text-white font-bold text-lg sm:text-xl leading-snug mb-3 whitespace-pre-line">
                  {niche.headline}
                </h3>

                {/* Description — visible on hover */}
                <p className="text-white/80 text-sm leading-relaxed mb-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400 max-w-sm">
                  {niche.desc}
                </p>

                {/* CTA */}
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 text-white text-sm font-bold opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400 delay-75"
                >
                  <span className="underline underline-offset-4">Site similaire pour moi</span>
                  <ArrowRight size={15} />
                </a>
              </div>

              {/* Corner badge */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold text-white border border-white/30 bg-white/10 backdrop-blur-sm">
                  {niche.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <a href="#contact" className="btn-accent">
            Demander un Devis Gratuit
          </a>
        </motion.div>
      </div>
    </section>
  );
}

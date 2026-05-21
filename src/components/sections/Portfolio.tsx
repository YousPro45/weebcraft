"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { ExternalLink, Monitor } from "lucide-react";

type Category = "Tous" | "Restaurant" | "Santé" | "Commerce" | "Services" | "Hôtellerie" | "Fitness";

type Project = {
  id: number;
  name: string;
  niche: string;
  category: Exclude<Category, "Tous">;
  description: string;
  tags: string[];
  img: string;
  imgAlt: string;
};

const projects: Project[] = [
  {
    id: 1, name: "Le Palais Gastronomique", niche: "Restaurant", category: "Restaurant",
    description: "Menu interactif, réservation en ligne, galerie appétissante et présentation du chef.",
    tags: ["Réservation", "Menu Digital", "SEO"],
    img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80",
    imgAlt: "Restaurant élégant",
  },
  {
    id: 2, name: "Clinique MediCare", niche: "Clinique", category: "Santé",
    description: "Prise de rendez-vous en ligne, présentation des médecins et services médicaux.",
    tags: ["RDV en ligne", "Praticiens", "Mobile"],
    img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80",
    imgAlt: "Clinique médicale",
  },
  {
    id: 3, name: "Hotel Atlas Prestige", niche: "Hôtel", category: "Hôtellerie",
    description: "Réservation de chambres, galerie luxueuse et intégration paiement en ligne.",
    tags: ["Réservation", "Galerie", "Paiement"],
    img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
    imgAlt: "Hôtel de luxe",
  },
  {
    id: 4, name: "FitPro Gym", niche: "Salle de Sport", category: "Fitness",
    description: "Abonnements en ligne, programme d'entraînement et espace membre dédié.",
    tags: ["Abonnements", "Planning", "App"],
    img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80",
    imgAlt: "Salle de sport",
  },
  {
    id: 5, name: "ModaShop Online", niche: "E-commerce Mode", category: "Commerce",
    description: "Boutique en ligne avec catalogue produits, paiement sécurisé et suivi commandes.",
    tags: ["E-commerce", "Paiement", "Stock"],
    img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80",
    imgAlt: "Boutique en ligne",
  },
  {
    id: 6, name: "Cabinet Maître Alaoui", niche: "Avocat", category: "Services",
    description: "Blog juridique, consultation en ligne et présentation complète du cabinet.",
    tags: ["Blog", "Consultation", "Pro"],
    img: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&q=80",
    imgAlt: "Cabinet d'avocat",
  },
  {
    id: 7, name: "Glam Beauty Studio", niche: "Salon de Beauté", category: "Services",
    description: "Réservation de soins, présentation des prestations et boutique de produits beauté.",
    tags: ["RDV", "Boutique", "Galerie"],
    img: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80",
    imgAlt: "Salon de beauté",
  },
  {
    id: 8, name: "Construction BTP Pro", niche: "BTP", category: "Services",
    description: "Portfolio de réalisations, demande de devis en ligne et présentation des équipes.",
    tags: ["Portfolio", "Devis", "Projets"],
    img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=80",
    imgAlt: "Construction BTP",
  },
  {
    id: 9, name: "Travel Prestige", niche: "Agence de Voyage", category: "Hôtellerie",
    description: "Catalogue de séjours, réservation de circuits et blog de destinations de rêve.",
    tags: ["Réservation", "Circuits", "Blog"],
    img: "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=600&q=80",
    imgAlt: "Agence de voyage",
  },
];

const filters: Category[] = ["Tous", "Restaurant", "Santé", "Commerce", "Services", "Hôtellerie", "Fitness"];

export default function Portfolio() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [activeFilter, setActiveFilter] = useState<Category>("Tous");

  const filtered = activeFilter === "Tous" ? projects : projects.filter((p) => p.category === activeFilter);

  return (
    <section id="portfolio" ref={ref} className="py-20 bg-[#EAF2FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <p className="text-[#1E90D4] font-semibold text-sm uppercase tracking-widest mb-3">Nos Réalisations</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0D1F3C]">Sites Créés Pour Tous les Secteurs</h2>
          <div className="w-16 h-1 mx-auto mt-4 rounded-full" style={{ background: "linear-gradient(90deg,#1A3A6B,#1E90D4)" }} />
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeFilter === f
                  ? "bg-[#1A3A6B] text-white shadow-md"
                  : "bg-white text-[#5A738A] hover:bg-[#1A3A6B]/10 hover:text-[#1A3A6B]"
              }`}
            >
              {f}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project, i) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
              className="property-card group"
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <Image
                  src={project.img}
                  alt={project.imgAlt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1F3C]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Hover CTA */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                  <a
                    href="#contact"
                    className="px-4 py-2 rounded-full bg-white text-[#1A3A6B] text-sm font-bold flex items-center gap-1.5 hover:bg-[#1E90D4] hover:text-white transition-colors shadow-lg"
                  >
                    <ExternalLink size={14} /> Projet Similaire
                  </a>
                </div>

                {/* Niche badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full text-xs font-bold text-white bg-[#1A3A6B]/80 backdrop-blur-sm">
                    {project.niche}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-bold text-[#0D1F3C] text-base mb-1 group-hover:text-[#1A3A6B] transition-colors">
                  {project.name}
                </h3>
                <p className="text-[#5A738A] text-sm leading-relaxed mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-[#1E90D4]/10 text-[#1E90D4] font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
                <a
                  href="#contact"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full border border-[#1A3A6B] text-[#1A3A6B] text-sm font-semibold hover:bg-[#1A3A6B] hover:text-white transition-all duration-300"
                >
                  <Monitor size={15} /> Site Similaire pour Moi
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <a href="#contact" className="btn-primary">Demander un Devis Gratuit</a>
        </motion.div>
      </div>
    </section>
  );
}

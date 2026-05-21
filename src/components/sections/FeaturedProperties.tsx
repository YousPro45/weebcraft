"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Bed, Bath, Maximize, MapPin, Heart, Eye } from "lucide-react";

type Property = {
  id: number;
  title: string;
  price: string;
  location: string;
  beds: number;
  baths: number;
  area: number;
  type: "Villa" | "Appartement" | "Penthouse" | "Commercial";
  badge?: string;
  bgColor: string;
};

const properties: Property[] = [
  { id: 1, title: "Villa Palmeraie Prestige", price: "4 500 000 MAD", location: "Palmeraie, Marrakech", beds: 5, baths: 4, area: 450, type: "Villa", badge: "Coup de Cœur", bgColor: "#1A3A6B" },
  { id: 2, title: "Appartement Guéliz Vue Panoramique", price: "1 200 000 MAD", location: "Guéliz, Marrakech", beds: 3, baths: 2, area: 180, type: "Appartement", bgColor: "#2255A4" },
  { id: 3, title: "Penthouse Hivernage Exclusif", price: "3 200 000 MAD", location: "Hivernage, Marrakech", beds: 4, baths: 3, area: 320, type: "Penthouse", badge: "Nouveau", bgColor: "#0D1F3C" },
  { id: 4, title: "Villa Agdal avec Piscine", price: "2 800 000 MAD", location: "Agdal, Marrakech", beds: 4, baths: 3, area: 380, type: "Villa", bgColor: "#1E90D4" },
  { id: 5, title: "Local Commercial Médina Premium", price: "950 000 MAD", location: "Médina, Marrakech", beds: 0, baths: 2, area: 220, type: "Commercial", bgColor: "#2255A4" },
  { id: 6, title: "Appartement Targa Neuf", price: "850 000 MAD", location: "Targa, Marrakech", beds: 2, baths: 2, area: 120, type: "Appartement", badge: "Neuf", bgColor: "#1A3A6B" },
];

const filters = ["Tous", "Villa", "Appartement", "Penthouse", "Commercial"] as const;
type Filter = (typeof filters)[number];

export default function FeaturedProperties() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [activeFilter, setActiveFilter] = useState<Filter>("Tous");
  const [liked, setLiked] = useState<number[]>([]);

  const filtered = activeFilter === "Tous" ? properties : properties.filter((p) => p.type === activeFilter);

  return (
    <section id="properties" ref={ref} className="py-20 bg-[#EAF2FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <p className="text-[#1E90D4] font-semibold text-sm uppercase tracking-widest mb-3">Notre Sélection</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0D1F3C]">Propriétés en Vedette</h2>
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

        {/* Property Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((prop, i) => (
            <motion.div
              key={prop.id}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="property-card group"
            >
              {/* Image Placeholder */}
              <div className="relative h-52 overflow-hidden" style={{ backgroundColor: prop.bgColor }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin size={40} className="text-white/20 mx-auto mb-2" />
                    <p className="text-white/30 text-sm">{prop.location}</p>
                  </div>
                </div>
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: "linear-gradient(to top, rgba(13,31,60,0.8), transparent)" }}
                />
                {prop.badge && (
                  <span className="absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full bg-[#1E90D4] text-white">
                    {prop.badge}
                  </span>
                )}
                <button
                  onClick={() => setLiked((prev) => prev.includes(prop.id) ? prev.filter((id) => id !== prop.id) : [...prev, prop.id])}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/40 transition-colors"
                >
                  <Heart
                    size={16}
                    className={liked.includes(prop.id) ? "text-red-400 fill-red-400" : "text-white"}
                  />
                </button>
                <span className="absolute bottom-3 right-3 text-xs font-bold px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white">
                  {prop.type}
                </span>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-bold text-[#0D1F3C] text-base mb-1 group-hover:text-[#1A3A6B] transition-colors">
                  {prop.title}
                </h3>
                <div className="flex items-center gap-1.5 text-[#5A738A] text-xs mb-3">
                  <MapPin size={12} />
                  {prop.location}
                </div>
                <p className="text-[#1E90D4] font-bold text-xl mb-4">{prop.price}</p>

                <div className="flex items-center gap-4 text-[#5A738A] text-xs border-t border-[#EAF2FA] pt-4">
                  {prop.beds > 0 && (
                    <span className="flex items-center gap-1.5">
                      <Bed size={14} /> {prop.beds} Ch.
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Bath size={14} /> {prop.baths} SdB
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Maximize size={14} /> {prop.area} m²
                  </span>
                </div>

                <a
                  href="#contact"
                  className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-full border border-[#1A3A6B] text-[#1A3A6B] text-sm font-semibold hover:bg-[#1A3A6B] hover:text-white transition-all duration-300"
                >
                  <Eye size={15} /> Voir le Détail
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
          <a href="#contact" className="btn-primary">
            Voir Toutes les Propriétés
          </a>
        </motion.div>
      </div>
    </section>
  );
}

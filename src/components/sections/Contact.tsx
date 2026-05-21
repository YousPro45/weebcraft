"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Phone, Mail, MapPin, Send, MessageCircle, CheckCircle2, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";

const empty = { name: "", email: "", phone: "", subject: "", message: "" };

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  // useRef ensures createClient() runs once, only on the client — prevents SSR/client mismatch
  const supabase = useRef(createClient());
  const [form, setForm] = useState(empty);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setStatus("loading");
    const { error } = await supabase.current.from("contact_submissions").insert({
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      subject: form.subject || null,
      message: form.message,
      status: "new",
    });
    if (error) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    } else {
      setStatus("success");
      setForm(empty);
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  return (
    <section id="contact" ref={ref} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-[#1E90D4] font-semibold text-sm uppercase tracking-widest mb-3">Contactez-Nous</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0D1F3C]">Parlons de Votre Projet</h2>
          <div className="w-16 h-1 mx-auto mt-4 rounded-full" style={{ background: "linear-gradient(90deg,#1A3A6B,#1E90D4)" }} />
          <p className="text-[#5A738A] mt-4 max-w-xl mx-auto text-sm">
            Notre équipe est à votre disposition pour répondre à toutes vos questions et vous accompagner.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Info column */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="lg:col-span-2 flex flex-col gap-5"
          >
            {[
              { icon: Phone,  label: "Téléphone / WhatsApp", value: "+212 658 242 225",   href: "https://wa.me/212658242225" },
              { icon: Mail,   label: "Email",                 value: "webcraft50@gmail.com", href: "mailto:webcraft50@gmail.com" },
              { icon: MapPin, label: "Adresse",               value: "Maroc",               href: "#" },
            ].map((item) => (
              <a key={item.label} href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="flex items-start gap-4 p-5 rounded-2xl border border-[#EAF2FA] hover:border-[#1E90D4]/30 hover:shadow-md transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-[#1E90D4]/10 flex items-center justify-center flex-shrink-0">
                  <item.icon size={20} className="text-[#1E90D4]" />
                </div>
                <div>
                  <p className="text-[#5A738A] text-xs mb-0.5">{item.label}</p>
                  <p className="font-semibold text-[#0D1F3C] text-sm">{item.value}</p>
                </div>
              </a>
            ))}

            <a href="https://wa.me/212658242225" target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 py-4 rounded-2xl text-white font-semibold transition-all hover:-translate-y-1"
              style={{ background: "linear-gradient(135deg,#25D366,#128C7E)" }}
            >
              <MessageCircle size={20} />
              Discuter sur WhatsApp
            </a>

            <div className="rounded-2xl overflow-hidden h-44 border border-[#EAF2FA]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6883063.651508421!2d-8.0!3d31.79!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd0b88619651f0b1%3A0xd9d28af711c5be41!2sMaroc!5e0!3m2!1sfr!2sma!4v1685000000001"
                width="100%" height="100%" style={{ border: 0 }}
                allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localisation Maroc"
              />
            </div>
          </motion.div>

          {/* Form column */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="lg:col-span-3"
          >
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-[#EAF2FA] shadow-sm p-8 flex flex-col gap-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-[#0D1F3C] mb-1.5">Nom complet *</label>
                  <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Votre nom"
                    className="w-full px-4 py-3 rounded-xl border border-[#EAF2FA] focus:border-[#1E90D4] focus:outline-none text-sm placeholder:text-[#5A738A]/60 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0D1F3C] mb-1.5">Email *</label>
                  <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="votre@email.com"
                    className="w-full px-4 py-3 rounded-xl border border-[#EAF2FA] focus:border-[#1E90D4] focus:outline-none text-sm placeholder:text-[#5A738A]/60 transition-colors" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-[#0D1F3C] mb-1.5">Téléphone</label>
                  <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                    placeholder="+212 ..."
                    className="w-full px-4 py-3 rounded-xl border border-[#EAF2FA] focus:border-[#1E90D4] focus:outline-none text-sm placeholder:text-[#5A738A]/60 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0D1F3C] mb-1.5">Sujet</label>
                  <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#EAF2FA] focus:border-[#1E90D4] focus:outline-none text-sm transition-colors bg-white text-[#5A738A]">
                    <option value="">Sélectionner...</option>
                    <option>Création Site Web</option>
                    <option>E-commerce</option>
                    <option>Référencement SEO</option>
                    <option>Devis / Tarifs</option>
                    <option>Autre</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0D1F3C] mb-1.5">Message *</label>
                <textarea required rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder="Décrivez votre projet web..."
                  className="w-full px-4 py-3 rounded-xl border border-[#EAF2FA] focus:border-[#1E90D4] focus:outline-none text-sm placeholder:text-[#5A738A]/60 transition-colors resize-none" />
              </div>

              {/* Status messages */}
              {status === "success" && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm">
                  <CheckCircle2 size={18} /> Message envoyé ! Nous vous répondons sous 24h.
                </motion.div>
              )}
              {status === "error" && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                  <AlertCircle size={18} /> Une erreur est survenue. Contactez-nous directement sur WhatsApp.
                </motion.div>
              )}

              <button type="submit" disabled={status === "loading"}
                className="btn-primary justify-center text-base py-3.5 mt-1 disabled:opacity-60">
                {status === "loading" ? "Envoi en cours..." :
                 status === "success" ? <><CheckCircle2 size={18} /> Message Envoyé</> :
                 <><Send size={18} /> Envoyer le Message</>}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

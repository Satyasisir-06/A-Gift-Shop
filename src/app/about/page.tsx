"use client";

import React from 'react';
import { Sparkles, Heart, Award, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

export default function About() {
  const pillars = [
    {
      icon: <Award size={28} />,
      title: "Handcrafted Heritage",
      desc: "Every order starts in our workshop, where master artisans shape raw materials into objects built to last generations."
    },
    {
      icon: <Sparkles size={28} />,
      title: "Gold Foil Standard",
      desc: "Signature gift wrapping in black structured paper with hand-tied metallic ribbon and a handwritten note."
    },
    {
      icon: <Heart size={28} />,
      title: "Care Pledge",
      desc: "We verify every name and proof individually. If it is not perfect, we recraft it before shipment."
    }
  ];

  return (
    <div className="bg-beige min-h-screen">
      <div className="bg-gray-50 border-b border-gray-100 py-16 text-center">
        <div className="section">
          <span className="text-[10px] uppercase tracking-[0.2em] text-gold font-bold">Our Journey</span>
          <h1 className="font-heading text-3xl font-bold uppercase tracking-widest text-black mt-2">
            The A Gift Shop Legacy
          </h1>
          <div className="divider-gold mx-auto mt-4" />
        </div>
      </div>

      <div className="section max-w-4xl py-16 space-y-12">
        <div className="space-y-6 text-center sm:text-left">
          <h2 className="font-heading text-xl uppercase font-bold text-gray-900">
            Crafting Tangible Memories
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Founded in 2021, A Gift Shop began with a simple belief: gifts should not be temporary novelties but permanent statements of love, honor and achievement. We select only solid walnut timber, thick lead-free brass plates, top-grain Italian leathers and 18k gold-plated alloys.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed">
            By combining traditional hand-polishing with state-of-the-art CO2 laser engraving, we achieve a fidelity that digital printing cannot recreate. Every piece carries structural weight, designed to live forever.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-gray-100">
          {pillars.map((p, idx) => (
            <motion.div key={p.title} {...fadeUp(idx * 0.08)} className="space-y-3">
              <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100 text-gold">
                {p.icon}
              </div>
              <h4 className="font-heading font-bold text-xs uppercase tracking-widest text-black">{p.title}</h4>
              <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

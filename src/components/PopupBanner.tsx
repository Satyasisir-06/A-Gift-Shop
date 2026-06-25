"use client";

import React, { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import { DB, PopupOffer } from '@/lib/db';
import { motion, AnimatePresence } from 'framer-motion';

const DISMISSED_KEY = 'gs_popup_dismissed';

export default function PopupBanner() {
  const [offers, setOffers] = useState<PopupOffer[]>([]);
  const [activeOffer, setActiveOffer] = useState<PopupOffer | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const all = await DB.getPopupOffers();
        const active = all.filter(o => o.active);
        setOffers(active);

        if (active.length > 0) {
          const dismissed = sessionStorage.getItem(DISMISSED_KEY);
          if (!dismissed) {
            setActiveOffer(active[0]);
            setIsOpen(true);
          }
        }
      } catch (err) {
        console.error("Failed to load popup offers:", err);
      }
    };
    load();
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem(DISMISSED_KEY, 'true');
    setTimeout(() => setActiveOffer(null), 300);
  };

  if (!activeOffer) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Popup Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
            className="relative w-full max-w-lg bg-white rounded-2xl overflow-hidden shadow-2xl border border-gold/20"
          >
            {/* Gold accent top bar */}
            <div className="h-1 bg-gradient-to-r from-gold via-gold-300 to-gold" />

            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-neutral-200 flex items-center justify-center text-neutral-500 hover:text-neutral-800 hover:border-neutral-300 transition-all shadow-sm"
            >
              <X size={14} />
            </button>

            {/* Image */}
            {activeOffer.image_url && (
              <div className="relative w-full aspect-[16/9] bg-neutral-100 overflow-hidden">
                  <img
                  src={activeOffer.image_url}
                  alt={activeOffer.title}
                  className="w-full h-full object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>
            )}

            {/* Content */}
            <div className="p-6 sm:p-8 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-gold" />
                <span className="text-[10px] font-heading font-bold uppercase tracking-[0.18em] text-gold">
                  Special Offer
                </span>
              </div>

              <h3 className="font-heading font-bold text-xl text-black leading-tight">
                {activeOffer.title}
              </h3>

              {activeOffer.description && (
                <p className="text-gray-600 text-sm leading-relaxed">
                  {activeOffer.description}
                </p>
              )}

              <button
                onClick={handleClose}
                className="mt-2 w-full py-3 rounded-xl bg-black text-white hover:bg-gold hover:text-black text-xs font-heading font-bold uppercase tracking-widest transition-all duration-300 shadow-lg hover:shadow-gold/15 active:scale-[0.98]"
              >
                Shop Now
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

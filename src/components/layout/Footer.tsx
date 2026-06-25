"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, CheckCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const navGroups = [
    {
      title: "Collections",
      links: [
        { label: "Bracelets", href: "/shop?category=Bracelets" },
        { label: "Prestige Pens", href: "/shop?category=Pens" },
        { label: "Keychains", href: "/shop?category=Keychains" },
        { label: "Gold Rim Mugs", href: "/shop?category=Mugs" },
        { label: "Photo Frames", href: "/shop?category=Photo%20Frames" },
      ],
    },
    {
      title: "Boutique",
      links: [
        { label: "Our Heritage", href: "/about" },
        { label: "Custom Orders", href: "/contact" },
        { label: "FAQ & Support", href: "/faq" },
        { label: "Shipping Policy", href: "/terms" },
      ],
    },
    {
      title: "Connect",
      links: [
        { label: "+91 72079 32026", href: "tel:+917207932026" },
        { label: "curator@agiftshop.com", href: "mailto:curator@agiftshop.com" },
        { label: "Gold Crest Plaza, Mumbai", href: "#" },
      ],
    },
  ];

  return (
    <footer className="bg-[#0a0a0a] border-t border-gray-800/50">
      {/* Top divider line */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent mx-auto max-w-[200px]" />

      {/* ============ MAIN CONTENT ============ */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-12">
          {/* --- Brand Column (2 cols) --- */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="inline-block">
              <div className="flex items-center gap-2.5">
                <img src="/logo.png" alt="A Gift Shop Logo" className="h-[66px] w-[66px] rounded-full object-contain border border-gold/10" />
                <span className="font-heading text-xl font-bold tracking-[0.08em] text-white">
                  A Gift<span className="text-gold"> Shop</span>
                </span>
              </div>
            </Link>
            <p className="text-neutral-300 text-sm leading-relaxed max-w-sm">
              Personalized heirloom gifts handcrafted from walnut wood, solid brass, Italian leather, and 18k gold plate.
            </p>
            <div className="pt-2">
              <p className="text-[11px] text-gold font-medium uppercase tracking-[0.12em]">
                Crafted in India
              </p>
            </div>
          </div>

          {/* --- Nav Columns (1 col each) --- */}
          {navGroups.map((group) => (
            <div key={group.title} className="lg:col-span-1">
              <h4 
                className="font-heading text-[11px] uppercase tracking-[0.15em] font-bold mb-5"
                style={{ color: 'white' }}
              >
                {group.title}
              </h4>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors duration-200"
                      style={{ color: 'white' }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* --- Newsletter & Copyright Row --- */}
        <div className="mt-14 pt-10 border-t border-gray-800/60 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Newsletter (6 cols) */}
          <div className="lg:col-span-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <div className="flex-shrink-0">
                <h4 className="font-heading text-[11px] uppercase tracking-[0.15em] font-bold text-neutral-300 mb-1">
                  The Journal
                </h4>
                <p className="text-neutral-400 text-xs">
                  10% off your first order
                </p>
              </div>
              <div className="flex-1 w-full sm:max-w-sm">
                {subscribed ? (
                  <div className="flex items-center gap-2.5 text-sm text-gold">
                    <CheckCircle size={16} />
                    <span className="font-medium">You're subscribed.</span>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex gap-2">
                    <div className="relative flex-1">
                      <Mail
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none"
                      />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full bg-transparent border border-gray-700 rounded-md pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold/50 transition-colors placeholder:text-gray-600"
                      />
                    </div>
                    <button
                      type="submit"
                      aria-label="Subscribe"
                      className="bg-white text-black px-4 py-2.5 rounded-md text-xs font-semibold hover:bg-gold hover:text-black transition-all active:scale-95 flex items-center gap-1.5"
                    >
                      Subscribe <ArrowRight size={14} />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Copyright & misc (6 cols) */}
          <div className="lg:col-span-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-xs text-neutral-400">
              &copy; {new Date().getFullYear()} A Gift Shop. All rights reserved.
            </p>
            <div className="flex items-center gap-5 text-xs text-neutral-400">
              <Link href="/privacy" className="hover:text-gray-300 transition-colors">
                Privacy Policy
              </Link>
              <span className="text-gray-700">/</span>
              <Link href="/terms" className="hover:text-gray-300 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

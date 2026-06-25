"use client";

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && msg) {
      setSubmitted(true);
      setName('');
      setEmail('');
      setMsg('');
    }
  };

  return (
    <div className="bg-beige min-h-screen">
      <div className="bg-gray-50 border-b border-gray-100 py-16 text-center">
        <div className="section">
          <span className="text-[10px] uppercase tracking-[0.2em] text-gold font-bold">Contact Studio</span>
          <h1 className="font-heading text-3xl font-bold uppercase tracking-widest text-black mt-2">
            Get In Touch
          </h1>
          <div className="divider-gold mx-auto mt-4" />
        </div>
      </div>

      <div className="section max-w-6xl py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="font-heading text-lg font-bold uppercase tracking-wider text-gray-900">
              The Curator Desk
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed max-w-md">
              Have a bulk corporate gifting query? Need a custom sizing configuration? Our studio team will respond within 4 hours.
            </p>
          </div>

          <div className="space-y-6 text-sm text-gray-600">
            {[
              { icon: <Phone size={18} />, label: "Call Us", value: "+91 72079 32026" },
              { icon: <Mail size={18} />, label: "Email", value: "curator@agiftshop.com" },
              { icon: <MapPin size={18} />, label: "Studio", value: "Gold Crest Plaza, Mumbai, IN" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gold">
                  {item.icon}
                </div>
                <div>
                  <span className="block text-[9px] uppercase tracking-wider text-gray-400 font-bold">{item.label}</span>
                  <span className="font-semibold text-gray-900">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-4">
          <h3 className="font-heading text-xs uppercase tracking-widest font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-1.5">
            <MessageCircle size={16} className="text-gold" /> Send a Message
          </h3>

          {submitted ? (
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white border border-green-200 text-gray-800 p-6 text-center text-xs font-semibold rounded-xl space-y-2"
            >
              <p className="text-green-600 font-bold text-sm">Message Sent</p>
              <p className="text-gray-400">We will respond within 4 hours.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-heading font-bold text-gray-700 uppercase">Name *</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="input text-sm" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-heading font-bold text-gray-700 uppercase">Email *</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="input text-sm" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-heading font-bold text-gray-700 uppercase">Message *</label>
                <textarea rows={4} required value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Tell us about your custom order..." className="input text-sm resize-none" />
              </div>
              <button type="submit" className="btn btn-gold w-full text-xs h-11 flex items-center justify-center gap-2">
                <Send size={16} /> Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

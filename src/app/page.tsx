"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Star, Gift, Award, Clock, ShieldCheck } from 'lucide-react';
import { DB, Product, Announcement, Collection } from '@/lib/db';
import { motion, useReducedMotion } from 'framer-motion';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [bestsellerIds, setBestsellerIds] = useState<string[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [activeAnnIdx, setActiveAnnIdx] = useState(0);
  const [activeCardId, setActiveCardId] = useState<string>('p3');
  const [carouselPaused, setCarouselPaused] = useState(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduce = useReducedMotion();

  const pauseCarousel = useCallback(() => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
    setCarouselPaused(true);
  }, []);

  const scheduleResume = useCallback(() => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
    }
    resumeTimerRef.current = setTimeout(() => {
      setCarouselPaused(false);
      resumeTimerRef.current = null;
    }, 3000);
  }, []);

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [prodData, annData, bestIds, collData] = await Promise.all([
          DB.getProducts(),
          DB.getAnnouncements(),
          DB.getBestsellers(),
          DB.getCollections(),
        ]);
        setAllProducts(prodData);
        setProducts(bestIds.length > 0
          ? prodData.filter(p => bestIds.includes(p.id)).slice(0, 4)
          : prodData.slice(0, 4)
        );
        setBestsellerIds(bestIds);
        setCollections(collData);
        setAnnouncements(annData);
      } catch (err) {
        console.error("Failed to load homepage data:", err);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (announcements.length <= 1) return;
    const interval = setInterval(() => {
      setActiveAnnIdx((prev) => (prev + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [announcements]);

  // Auto-carousel for 3D card stack — cycles every 1.5s, pauses on interaction
  useEffect(() => {
    if (reduce || carouselPaused) return;
    const interval = setInterval(() => {
      setActiveCardId((prev) => {
        const currIdx = heroCardIds.indexOf(prev);
        return heroCardIds[(currIdx + 1) % heroCardIds.length];
      });
    }, 1500);
    return () => clearInterval(interval);
  }, [reduce, carouselPaused]);

  const features = [
    { icon: <Sparkles size={24} />, title: "Complimentary Engraving", desc: "Every item includes bespoke laser engraving or hot foil stamping at no extra cost." },
    { icon: <Gift size={24} />, title: "Signature Gift Box", desc: "Black structured paper with hand-tied gold ribbon and a handwritten card." },
    { icon: <Award size={24} />, title: "Premium Materials", desc: "Solid brass, Italian leather, walnut wood and 18k gold-plated finishes." },
    { icon: <Clock size={24} />, title: "48-Hour Dispatch", desc: "Custom orders designed, engraved and dispatched within 48 hours." },
  ];

  const testimonials = [
    { name: "Rohan Malhotra", location: "Delhi", quote: "The wooden signature pen exceeded all expectations. The engraving is sharp, clean, and looks incredibly executive. Excellent corporate gifting.", stars: 5 },
    { name: "Ananya Sen", location: "Mumbai", quote: "Bought the gold cuff bracelet for my husband's birthday. Adjusts perfectly, doesn't tarnish, and the gold rim gift wrapping was gorgeous.", stars: 5 },
    { name: "Kabir Mehta", location: "Bangalore", quote: "Amazing customer support. I needed a custom photo frame shipped within 24 hours. The team handled it promptly and it arrived right on time.", stars: 5 },
  ];

  const heroCards = [
    {
      id: 'p1',
      name: 'Luxury Engraved Gold Bracelet',
      price: 1499,
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop',
      tag: 'Bestseller'
    },
    {
      id: 'p2',
      name: 'Classic Wooden Signature Pen',
      price: 999,
      image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?q=80&w=600&auto=format&fit=crop',
      tag: 'Handcrafted'
    },
    {
      id: 'p3',
      name: 'Monogram Leather Keychain',
      price: 499,
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop',
      tag: 'Premium Leather'
    },
  ];

  const heroCardIds = heroCards.map(c => c.id);

  return (
    <div className="bg-beige">
      {/* Announcement Bar */}
      {announcements.length > 0 && (
        <div className="bg-beige-100 border-b border-beige-200 py-2.5">
          <div className="section flex items-center justify-center text-center">
            <motion.div
              key={activeAnnIdx}
              initial={reduce ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-gray-700 text-[11px] font-medium tracking-wide flex items-center gap-2"
            >
              <Sparkles size={12} className="text-gold" />
              <span className="font-semibold">{announcements[activeAnnIdx].title}</span>
              <span className="hidden sm:inline text-gray-400 mx-1">-</span>
              <span className="hidden sm:inline text-gray-500 font-normal">{announcements[activeAnnIdx].description}</span>
            </motion.div>
          </div>
        </div>
      )}

      {/* Asymmetric Hero */}
      <section className="relative overflow-hidden bg-beige-100 border-b border-beige-200">
        <div className="section py-16 md:py-24 lg:py-28 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* Text */}
          <motion.div
            {...fadeUp()}
            className="lg:col-span-5 space-y-6 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold text-[10px] font-bold uppercase tracking-[0.18em]">
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              Personalized Luxury Boutique
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold tracking-tight text-black leading-[1.08]">
              Gifts That Tell<br />
              <span className="text-gold-gradient">Your Story</span>
            </h1>
            <p className="text-gray-600 text-base sm:text-lg max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Personalized luxury products handcrafted from walnut wood, solid brass, Italian leather, and 18k gold plate. Everyday objects become family heirlooms.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <Link href="/shop" className="btn btn-primary">
                Customize Now <ArrowRight size={14} />
              </Link>
              <Link href="/about" className="btn btn-secondary">
                Our Heritage
              </Link>
            </div>
          </motion.div>

          {/* 3D Card Stack - Staggered Reveal */}
          <div
            className="lg:col-span-7 relative min-h-[480px] sm:min-h-[600px] pt-4"
            style={{ perspective: '1000px' }}
            onMouseEnter={pauseCarousel}
            onMouseLeave={scheduleResume}
          >
            {heroCards.map((card, idx) => {
              const isActive = activeCardId === card.id;

              // Base Y shift to push the entire stack downward
              const BASE_Y = 145;

              // Default cascade: cards fan from center downward-right
              // Card 2 (last) is front: largest, centered, on top
              // Card 0 (first) is back: smallest, offset far, behind
              const defaultX = (2 - idx) * -1;
              const defaultY = (2 - idx) * 18 + BASE_Y;
              const defaultRotY = -4 + idx * 3;
              const defaultScale = 0.82 + idx * 0.08;

              // Active card pops to center front
              const animateX = isActive ? 0 : defaultX;
              const animateY = isActive ? 4 + BASE_Y : defaultY;
              const animateRotY = isActive ? 0 : defaultRotY;
              const animateScale = isActive ? 1.03 : defaultScale;

              return (
                <motion.div
                  key={card.id}
                  initial={reduce ? false : {
                    opacity: 0,
                    y: 80,
                    rotateY: 20,
                    scale: 0.8,
                    x: 40,
                  }}
                  animate={{
                    opacity: 1,
                    y: animateY,
                    rotateY: animateRotY,
                    scale: animateScale,
                    x: animateX,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 220,
                    damping: 28,
                    delay: reduce || isActive ? 0 : 0.25 + idx * 0.25,
                  }}
                  style={{
                    zIndex: isActive ? 20 : idx,
                    transformStyle: 'preserve-3d',
                    transformOrigin: 'center bottom',
                  }}
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-[min(80vw,400px)] will-change-transform cursor-pointer select-none"
                  onClick={() => {
                    pauseCarousel();
                    scheduleResume();
                    setActiveCardId(card.id);
                  }}
                  whileHover={{
                    y: animateY - 8,
                    transition: { duration: 0.3 },
                  }}
                >
                  <div className="relative rounded-2xl overflow-hidden bg-white border border-gray-200/80 shadow-xl hover:shadow-2xl transition-shadow duration-500">
                    {/* Image */}
                    <div className="aspect-[4/3] overflow-hidden bg-gray-50">
                      <img
                        src={card.image}
                        alt={card.name}
                        loading="eager"
                        fetchPriority="high"
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                    </div>
                    {/* Gradient overlay + content */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent flex flex-col justify-end p-5 sm:p-6">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-gold font-bold">
                        {card.tag}
                      </span>
                      <h3 className="text-white font-heading font-bold text-base sm:text-lg leading-tight mt-0.5 max-w-[90%]">
                        {card.name}
                      </h3>
                      <p className="text-gray-300 text-xs mt-1 font-medium">
                        From <span className="text-white">₹{card.price.toLocaleString('en-IN')}</span>
                      </p>
                    </div>
                    {/* Subtle gold edge accent */}
                    <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 pointer-events-none" />
                    {/* Hover shine */}
                    <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-tr from-white/0 via-white/5 to-white/10" />
                    {/* Active indicator ring */}
                    {isActive && (
                      <div className="absolute inset-0 rounded-2xl ring-2 ring-gold/40 pointer-events-none" />
                    )}
                  </div>
                </motion.div>
              );
            })}

            {/* Decorative background glows */}
            <div className="absolute -bottom-6 -right-4 w-36 h-36 border border-gold/15 rounded-full hidden lg:block pointer-events-none" />
            <div className="absolute top-12 -left-6 w-24 h-24 bg-gold/5 rounded-full blur-2xl hidden lg:block pointer-events-none" />
            <div className="absolute top-1/2 -translate-y-1/2 right-4 w-40 h-40 bg-gold/3 rounded-full blur-3xl pointer-events-none" />
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20 bg-beige">
        <div className="section">
          <div className="text-center space-y-2 mb-12">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold uppercase tracking-widest text-black">
              Explore Collections
            </h2>
            <div className="divider-gold mx-auto" />
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Select a category to begin designing your personalized piece.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {collections.map((cat, idx) => (
              <motion.div key={cat.name} {...fadeUp(idx * 0.08)}>
                <Link href={`/shop?category=${cat.name}`} className="group block relative rounded-xl overflow-hidden aspect-[3/4] bg-gray-100 border border-gray-200">
                  <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent flex flex-col justify-end p-4 sm:p-5">
                    <h4 className="font-heading font-bold text-sm uppercase tracking-widest text-white mb-0.5">{cat.name}</h4>
                    <span className="text-[10px] text-gray-300">{cat.count}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="py-20 bg-beige-100 border-t border-b border-beige-200">
        <div className="section">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
            <div className="text-center sm:text-left space-y-2">
              <h2 className="text-2xl sm:text-3xl font-heading font-bold uppercase tracking-widest text-black">
                Bestsellers
              </h2>
              <div className="divider-gold sm:mx-0 mx-auto" />
            </div>
            <Link href="/shop" className="text-xs uppercase tracking-widest font-heading font-bold text-gray-900 hover:text-gold transition-colors flex items-center gap-1 group">
              View All <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, idx) => (
              <motion.div key={product.id} {...fadeUp(idx * 0.08)} className="card card-hover flex flex-col overflow-hidden">
                <Link href={`/shop/${product.id}`} className="block relative aspect-square bg-gray-50 overflow-hidden">
                  {product.customizable && (
                    <span className="absolute top-3 left-3 z-10 badge badge-gold text-[9px]">
                      Customizable
                    </span>
                  )}
                  <img src={product.image_url} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                </Link>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{product.category}</span>
                    <Link href={`/shop/${product.id}`}>
                      <h3 className="font-heading font-semibold text-sm text-gray-900 hover:text-gold transition-colors line-clamp-1">{product.name}</h3>
                    </Link>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (<Star key={i} size={10} className="fill-gold text-gold" />))}
                      <span className="text-[9px] text-gray-500 ml-1">4.9</span>
                    </div>
                  </div>
                  <div className="pt-3 flex items-center justify-between border-t border-gray-100">
                    <span className="font-bold text-gray-900 text-sm">₹{product.price.toLocaleString('en-IN')}</span>
                    <Link href={`/shop/${product.id}`} className="text-[11px] font-heading font-bold text-gold hover:text-black transition-colors">
                      Personalize &rarr;
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-beige">
        <div className="section">
          <div className="text-center space-y-2 mb-16">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold uppercase tracking-widest text-black">
              The A Gift Shop Standard
            </h2>
            <div className="divider-gold mx-auto" />
            <p className="text-gray-500 text-sm max-w-lg mx-auto">
              Every detail is considered, from material selection to final presentation.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {features.map((f, idx) => (
              <motion.div key={f.title} {...fadeUp(idx * 0.08)} className="text-center lg:text-left space-y-3">
                <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100 mx-auto lg:mx-0 text-gold">
                  {f.icon}
                </div>
                <h4 className="font-heading font-bold text-xs uppercase tracking-widest text-black">{f.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-beige-100 border-t border-beige-200">
        <div className="section max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-full border border-gray-200 shadow-sm mb-6">
            <Star size={18} className="text-gold fill-gold" />
          </div>
          <h2 className="text-xl sm:text-2xl font-heading font-bold uppercase tracking-widest text-black mb-10">
            Our Patrons
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {testimonials.map((t, idx) => (
              <motion.div key={t.name} {...fadeUp(idx * 0.08)} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-3">
                <div className="flex gap-0.5">
                  {[...Array(t.stars)].map((_, i) => (<Star key={i} size={12} className="fill-gold text-gold" />))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">"{t.quote}"</p>
                <div>
                  <p className="font-heading font-bold text-xs text-gray-900 uppercase">{t.name}</p>
                  <span className="text-[10px] text-gray-400 font-medium">{t.location}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/context/CartContext';
import { DB, Coupon } from '@/lib/db';
import { Trash2, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartPage() {
  const { cart, subtotal, deliveryCharge, discount, total, activeCoupon, applyCoupon, updateQuantity, removeFromCart } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState(false);
  const [couponSuccess, setCouponSuccess] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);

  React.useEffect(() => {
    DB.getCoupons().then(coupons => setAvailableCoupons(coupons.filter(c => c.active)));
  }, []);

  const bestCoupon = availableCoupons.length > 0 
    ? availableCoupons.reduce((prev, current) => (prev.discount_percent > current.discount_percent) ? prev : current)
    : null;

  const targetAmount = bestCoupon ? bestCoupon.discount_percent * 200 : 3000;
  const progressPercent = Math.min((subtotal / targetAmount) * 100, 100);
  const isTargetReached = subtotal >= targetAmount;

  React.useEffect(() => {
    if (isTargetReached && bestCoupon && !activeCoupon && !couponSuccess) {
      applyCoupon(bestCoupon.code).then(success => {
        if (success) setCouponSuccess(true);
      });
    }
  }, [isTargetReached, bestCoupon, activeCoupon, couponSuccess, applyCoupon]);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(false);
    setCouponSuccess(false);
    const success = await applyCoupon(couponCode);
    if (success) {
      setCouponSuccess(true);
    } else {
      setCouponError(true);
    }
  };

  return (
    <div className="bg-beige min-h-screen py-12 sm:py-20">
      <div className="section max-w-5xl">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-widest text-black mb-10 text-center">
          Your Cart
        </h1>

        {bestCoupon && cart.length > 0 && (
          <div className="mb-8 bg-white border border-gold/30 rounded-xl p-5 shadow-sm relative overflow-hidden">
            <AnimatePresence>
              {isTargetReached && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 bg-gold/5 z-0 pointer-events-none" 
                />
              )}
            </AnimatePresence>
            <div className="relative z-10">
              <div className="flex justify-between items-end mb-3">
                <div className="text-sm font-medium text-neutral-800">
                  {isTargetReached 
                    ? <span className="text-gold font-bold flex items-center gap-1">✨ You've unlocked {bestCoupon.discount_percent}% OFF! Code {bestCoupon.code} applied.</span>
                    : <span>Add <span className="font-bold font-mono">₹{(targetAmount - subtotal).toLocaleString('en-IN')}</span> more to unlock <span className="font-bold text-gold">{bestCoupon.discount_percent}% OFF</span></span>
                  }
                </div>
              </div>
              <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                <motion.div 
                  className={`h-full rounded-full ${isTargetReached ? 'bg-gold' : 'bg-neutral-800'}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
        )}

        {cart.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center space-y-4 shadow-sm">
            <ShoppingBag size={48} className="text-gray-300 mx-auto" />
            <p className="text-gray-400 font-medium text-sm">Your cart is empty.</p>
            <Link href="/shop" className="btn btn-primary">Browse Boutique</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Items */}
            <div className="lg:col-span-8 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-5 flex gap-4 sm:gap-6 shadow-sm">
                  <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="font-heading font-semibold text-sm text-gray-900 truncate">{item.name}</h3>
                        <button onClick={() => removeFromCart(item.id)} className="p-1 text-gray-400 hover:text-red-500 transition-colors" title="Remove">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-gold font-bold text-sm mt-0.5">₹{item.price.toLocaleString('en-IN')}</p>
                      {(item.custom_text || item.custom_color) && (
                        <div className="text-[11px] text-gray-500 bg-gray-50 rounded-lg p-2.5 mt-2 space-y-0.5 border border-gray-100 max-w-md">
                          {item.custom_text && <div>Text: <strong className="text-gray-800">"{item.custom_text}"</strong></div>}
                          {item.custom_color && <div>Color: <span className="text-gray-800 font-medium">{item.custom_color}</span></div>}
                          {item.custom_font && <div>Font: <span className="text-gray-800 font-medium">{item.custom_font}</span></div>}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-4">
                      <span className="text-[10px] uppercase font-bold text-gray-400">Qty</span>
                      <div className="flex items-center border border-gray-200 rounded-md">
                        <button onClick={() => updateQuantity(item.id, Math.max(item.min_quantity || 1, item.quantity - 1))} className="px-3 py-1 text-gray-500 hover:text-black font-semibold text-xs transition-colors">-</button>
                        <span className="px-3 text-gray-800 text-xs font-semibold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 text-gray-500 hover:text-black font-semibold text-xs transition-colors">+</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4 sticky top-24">
                <h3 className="font-heading text-xs uppercase tracking-widest font-bold text-gray-900 border-b border-gray-100 pb-3">
                  Order Summary
                </h3>

                {/* Coupon */}
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Coupon code"
                      className="input text-xs pl-8 py-2"
                    />
                    <Tag size={12} className="absolute left-2.5 top-3 text-gray-400" />
                  </div>
                  <button type="submit" className="bg-black text-white hover:bg-gray-800 px-4 py-2 rounded-md text-xs font-heading font-bold tracking-widest transition-colors">
                    Apply
                  </button>
                </form>
                {couponSuccess && <p className="text-[10px] text-green-600 font-semibold">10% discount applied!</p>}
                {couponError && <p className="text-[10px] text-red-500 font-semibold">Invalid coupon code.</p>}

                <div className="space-y-2.5 text-xs text-gray-600">
                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex items-center justify-between text-green-600 font-medium">
                      <span>Discount</span>
                      <span>-₹{discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span>Shipping</span>
                    <span>{deliveryCharge === 0 ? "Free" : `₹${deliveryCharge}`}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-heading font-bold text-gray-900 pt-3 border-t border-gray-100">
                    <span>Total</span>
                    <span>₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <Link href="/checkout" className="btn btn-gold w-full text-center text-xs">
                  Checkout <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

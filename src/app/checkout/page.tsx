"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/context/CartContext';
import { useAuth } from '@/lib/context/AuthContext';
import { CreditCard, Check, QrCode, ArrowRight, Truck, ShieldCheck, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Checkout() {
  const router = useRouter();
  const { cart, total, subtotal, deliveryCharge, discount, placeOrder, applyCoupon, clearCart } = useCart();
  const { user, login, register } = useAuth();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'COD' | 'Card'>('UPI');
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState(false);
  const [couponSuccess, setCouponSuccess] = useState(false);

  const [showUPIModal, setShowUPIModal] = useState(false);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const isPlacingOrder = useRef(false);

  useEffect(() => {
    if (cart.length === 0 && !showUPIModal && !isPlacingOrder.current) {
      router.push('/shop');
    }
  }, [cart, showUPIModal, router]);

  const handleGuestLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;
    setAuthLoading(true);
    try {
      try {
        await login(email);
      } catch (loginErr) {
        await register(email, name, phone);
      }
    } catch (err) {
      console.error("Failed to authenticate checkout guest:", err);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(false);
    setCouponSuccess(false);
    const success = applyCoupon(couponCode);
    if (success) setCouponSuccess(true);
    else setCouponError(true);
  };

  const validateShipping = () => street.trim() !== '' && city.trim() !== '' && state.trim() !== '' && zip.trim() !== '';

  const handleSubmitCheckout = async () => {
    if (!validateShipping()) {
      alert("Please fill in all shipping details.");
      return;
    }
    const fullAddress = `${street}, ${city}, ${state} - ${zip}`;
    if (paymentMethod === 'UPI') {
      setShowUPIModal(true);
    } else {
      setLoadingOrder(true);
      isPlacingOrder.current = true;
      try {
        const order = await placeOrder(fullAddress, paymentMethod);
        clearCart();
        router.push(`/order-success?id=${order.id}`);
      } catch (err) {
        isPlacingOrder.current = false;
        alert("Failed to place order. Please try again.");
      } finally {
        setLoadingOrder(false);
      }
    }
  };

  const handleConfirmUPIPayment = async () => {
    setShowUPIModal(false);
    setLoadingOrder(true);
    isPlacingOrder.current = true;
    const fullAddress = `${street}, ${city}, ${state} - ${zip}`;
    try {
      const order = await placeOrder(fullAddress, 'UPI');
      clearCart();
      router.push(`/order-success?id=${order.id}`);
    } catch (err) {
      isPlacingOrder.current = false;
      alert("Failed to place order. Please try again.");
    } finally {
      setLoadingOrder(false);
    }
  };

  if (cart.length === 0 && !showUPIModal && !isPlacingOrder.current) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-beige min-h-screen py-12 sm:py-20">
      <div className="section max-w-7xl">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-widest text-black mb-10 text-center">
          Secure Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left */}
          <div className="lg:col-span-7 space-y-8">
            {/* Step 1: Customer */}
            {!user ? (
              <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6 shadow-sm">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                  <span className="w-7 h-7 rounded-full bg-black text-gold flex items-center justify-center font-heading text-xs font-bold">1</span>
                  <h3 className="font-heading text-sm uppercase tracking-widest font-bold text-gray-900">Customer Details</h3>
                </div>
                <form onSubmit={handleGuestLogin} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-heading font-bold text-gray-700 uppercase">Name *</label>
                      <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="input text-sm" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-heading font-bold text-gray-700 uppercase">Email *</label>
                      <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="input text-sm" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-heading font-bold text-gray-700 uppercase">Phone (for tracking)</label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 72079 32026" className="input text-sm" />
                  </div>
                  <button type="submit" disabled={authLoading} className="btn btn-primary w-full text-xs">
                    {authLoading ? "Please wait..." : "Continue"}
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center">
                    <UserIcon size={18} className="text-gold" />
                  </div>
                  <div>
                    <h4 className="font-heading text-xs uppercase tracking-widest font-bold text-gray-900">{user.name}</h4>
                    <p className="text-gray-500 text-xs mt-0.5">{user.email}</p>
                  </div>
                </div>
                <span className="badge badge-success text-[9px]">Verified</span>
              </div>
            )}

            {/* Step 2: Shipping */}
            <div className={`bg-white rounded-xl border border-gray-200 p-6 space-y-6 shadow-sm transition-all ${!user ? 'opacity-40 pointer-events-none' : ''}`}>
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <span className="w-7 h-7 rounded-full bg-black text-gold flex items-center justify-center font-heading text-xs font-bold">2</span>
                <h3 className="font-heading text-sm uppercase tracking-widest font-bold text-gray-900">Shipping Address</h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-heading font-bold text-gray-700 uppercase">Street Address *</label>
                  <input type="text" required value={street} onChange={(e) => setStreet(e.target.value)} placeholder="Street, area, building" className="input text-sm" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-heading font-bold text-gray-700 uppercase">City *</label>
                    <input type="text" required value={city} onChange={(e) => setCity(e.target.value)} placeholder="Mumbai" className="input text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-heading font-bold text-gray-700 uppercase">State *</label>
                    <input type="text" required value={state} onChange={(e) => setState(e.target.value)} placeholder="Maharashtra" className="input text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-heading font-bold text-gray-700 uppercase">ZIP *</label>
                    <input type="text" required value={zip} onChange={(e) => setZip(e.target.value)} placeholder="400001" className="input text-sm" />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Payment */}
            <div className={`bg-white rounded-xl border border-gray-200 p-6 space-y-6 shadow-sm transition-all ${!user ? 'opacity-40 pointer-events-none' : ''}`}>
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <span className="w-7 h-7 rounded-full bg-black text-gold flex items-center justify-center font-heading text-xs font-bold">3</span>
                <h3 className="font-heading text-sm uppercase tracking-widest font-bold text-gray-900">Payment Method</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { method: 'UPI' as const, icon: <QrCode size={22} />, label: "UPI QR", desc: "GPay / PhonePe" },
                  { method: 'COD' as const, icon: <Truck size={22} />, label: "Cash on Delivery", desc: "Pay on arrival" },
                  { method: 'Card' as const, icon: <CreditCard size={22} />, label: "Card Payment", desc: "Visa / MasterCard" },
                ].map((opt) => (
                  <button key={opt.method} type="button" onClick={() => setPaymentMethod(opt.method)}
                    className={`p-4 border rounded-xl flex flex-col items-center justify-center gap-3 text-center transition-all ${
                      paymentMethod === opt.method ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-black text-gray-600'
                    }`}
                  >
                    <span className={paymentMethod === opt.method ? 'text-gold' : 'text-gray-400'}>{opt.icon}</span>
                    <div>
                      <span className="block text-xs uppercase tracking-wider font-semibold">{opt.label}</span>
                      <span className="block text-[9px] text-gray-400 font-normal mt-0.5">{opt.desc}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4 sticky top-24">
              <h3 className="font-heading text-xs uppercase tracking-widest font-bold text-gray-900 border-b border-gray-100 pb-3">
                Order Summary
              </h3>

              <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3 items-center">
                    <div className="w-12 h-12 bg-gray-50 rounded overflow-hidden border border-gray-100 flex-shrink-0">
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-heading font-semibold text-xs text-gray-900 truncate">{item.name}</h4>
                      <span className="text-[10px] text-gray-500">Qty: {item.quantity}</span>
                    </div>
                    <span className="font-bold text-xs text-gray-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              <form onSubmit={handleApplyCoupon} className="flex gap-2 pt-4 border-t border-gray-100">
                <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="Coupon: ELEGANCE" className="input text-xs flex-1" />
                <button type="submit" className="bg-black text-white hover:bg-gray-800 px-4 py-2 rounded-md text-xs font-heading font-bold tracking-widest transition-colors">Apply</button>
              </form>
              {couponSuccess && <p className="text-[10px] text-green-600 font-semibold">10% discount applied!</p>}
              {couponError && <p className="text-[10px] text-red-500 font-semibold">Invalid code.</p>}

              <div className="pt-4 border-t border-gray-100 space-y-2 text-xs text-gray-600">
                <div className="flex items-center justify-between"><span>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
                {discount > 0 && <div className="flex items-center justify-between text-green-600 font-medium"><span>Discount</span><span>-₹{discount.toLocaleString('en-IN')}</span></div>}
                <div className="flex items-center justify-between"><span>Shipping</span><span>{deliveryCharge === 0 ? "Free" : `₹${deliveryCharge}`}</span></div>
                <div className="flex items-center justify-between text-sm font-heading font-bold text-gray-900 pt-3 border-t border-gray-100"><span>Total</span><span>₹{total.toLocaleString('en-IN')}</span></div>
              </div>

              <button onClick={handleSubmitCheckout} disabled={!user || loadingOrder}
                className={`btn btn-gold w-full text-xs ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {loadingOrder ? "Processing..." : "Place Order"} <ArrowRight size={14} />
              </button>
              {!user && <p className="text-[10px] text-red-500 font-semibold text-center">Complete customer details to proceed.</p>}

              <div className="pt-4 border-t border-gray-100 text-center space-y-2">
                <ShieldCheck size={18} className="text-gold mx-auto" />
                <h5 className="font-heading text-[10px] uppercase tracking-widest font-bold text-gray-800">Secure Checkout</h5>
                <p className="text-[10px] text-gray-400">256-bit SSL encrypted payment</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* UPI Modal */}
      <AnimatePresence>
        {showUPIModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black" />
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl p-6 sm:p-8 max-w-md w-full text-center space-y-6">
                <div className="space-y-1">
                  <h3 className="font-heading font-bold text-lg text-gray-900 uppercase tracking-wider">Pay with UPI</h3>
                  <p className="text-xs text-gray-500">Amount: <span className="font-bold text-gray-900">₹{total.toLocaleString('en-IN')}</span></p>
                </div>

                {/* QR Code */}
                <div className="w-48 h-48 mx-auto bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center justify-center shadow-inner">
                  <svg viewBox="0 0 100 100" className="w-full h-full text-gray-900">
                    <rect x="0" y="0" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="6" />
                    <rect x="5" y="5" width="15" height="15" fill="currentColor" />
                    <rect x="75" y="0" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="6" />
                    <rect x="80" y="5" width="15" height="15" fill="currentColor" />
                    <rect x="0" y="75" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="6" />
                    <rect x="5" y="80" width="15" height="15" fill="currentColor" />
                    <rect x="35" y="5" width="8" height="8" fill="currentColor" />
                    <rect x="50" y="15" width="12" height="6" fill="currentColor" />
                    <rect x="10" y="35" width="14" height="8" fill="currentColor" />
                    <rect x="35" y="35" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="4" />
                    <rect x="42" y="42" width="6" height="6" fill="currentColor" />
                    <rect x="68" y="35" width="10" height="12" fill="currentColor" />
                    <rect x="78" y="55" width="14" height="6" fill="currentColor" />
                    <rect x="35" y="65" width="18" height="10" fill="currentColor" />
                    <rect x="65" y="65" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="4" />
                    <rect x="75" y="75" width="8" height="8" fill="currentColor" />
                    <rect x="40" y="40" width="20" height="20" fill="white" />
                    <rect x="43" y="43" width="14" height="14" fill="#D4AF37" />
                  </svg>
                </div>

                <div className="text-xs text-gray-500 space-y-1 bg-gray-50 rounded-lg p-3">
                  <p>Scan with any UPI app (GPay, PhonePe, Paytm)</p>
                  <p className="font-semibold text-gray-800">UPI ID: agiftshop@icici</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button onClick={() => setShowUPIModal(false)} className="btn btn-secondary flex-1 text-xs h-11">Cancel</button>
                  <button onClick={handleConfirmUPIPayment} className="btn btn-gold flex-1 text-xs h-11">
                    <Check size={14} /> Confirm Payment
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

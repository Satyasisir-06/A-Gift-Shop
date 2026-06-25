"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { DB, Order } from '@/lib/db';
import { CheckCircle2, Package, MapPin, Truck, Calendar, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');
  const [order, setOrder] = useState<Order | undefined>(undefined);

  useEffect(() => {
    if (orderId) {
      const loadOrder = async () => {
        try {
          const orders = await DB.getOrders();
          const found = orders.find(o => o.id === orderId);
          setOrder(found);
        } catch (e) {
          console.error("Error loading order success details:", e);
        }
      };
      loadOrder();
    }
  }, [orderId]);

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-gold animate-spin mb-4" />
        <h2 className="font-heading text-lg font-bold text-gray-900">Loading order...</h2>
      </div>
    );
  }

  const orderDate = new Date(order.created_at);
  const deliveryDate = new Date(orderDate.getTime() + 4 * 24 * 60 * 60 * 1000);

  const trackerSteps = [
    { label: "Pending", desc: "Payment received", active: true },
    { label: "Design", desc: "Layout & sizing", active: order.status !== 'Pending' },
    { label: "Production", desc: "Hand-engraving & QC", active: ['Production', 'Shipped', 'Delivered'].includes(order.status) },
    { label: "Shipped", desc: "Trackable courier", active: ['Shipped', 'Delivered'].includes(order.status) },
  ];

  return (
    <div className="bg-beige min-h-screen py-12 sm:py-20">
      <div className="section max-w-3xl space-y-8">
        {/* Success Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mx-auto text-green-600">
            <CheckCircle2 size={36} />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-heading font-bold text-gold uppercase tracking-widest">Order Confirmed</span>
            <h1 className="font-heading text-xl sm:text-2xl font-bold text-gray-900 uppercase">
              Thank You
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              Order ID: <span className="font-mono text-gray-900 font-bold select-all">{order.id}</span>
            </p>
          </div>
          <p className="text-gray-600 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            We have received your specifications. Our design team is preparing proofs. A confirmation has been sent to <span className="font-semibold text-gray-800">{order.user_email}</span>.
          </p>
        </div>

        {/* WhatsApp Upload Section */}
        {order.whatsapp_code && (
          <div className="bg-white rounded-xl border border-gold/30 p-6 sm:p-8 space-y-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-bl-full -z-10" />
            <div className="flex flex-col items-center text-center space-y-3">
              <h3 className="font-heading text-lg font-bold text-gray-900 uppercase">
                Photos Required for Engraving
              </h3>
              <p className="text-gray-600 text-sm max-w-sm">
                Please send your high-resolution images via WhatsApp so our design team can prepare your custom proofs.
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-lg py-3 px-6 mt-2 mb-4 w-full sm:w-auto">
                <p className="text-xs text-gray-500 uppercase tracking-widest font-heading font-bold mb-1">Your Order Code</p>
                <p className="text-xl font-mono font-bold text-black select-all">{order.whatsapp_code}</p>
              </div>
              <a 
                href={`https://wa.me/917207932026?text=Hi%2C%20I%20am%20sending%20photos%20for%20my%20custom%20engraving.%20My%20Order%20Code%20is%3A%20${order.whatsapp_code}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-gold w-full sm:w-auto text-xs flex items-center justify-center gap-2"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Send Photos on WhatsApp
              </a>
            </div>
          </div>
        )}

        {/* Tracker */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <h3 className="font-heading text-xs uppercase tracking-widest font-bold text-gray-900 flex items-center gap-1.5 border-b border-gray-100 pb-3">
            <Package size={16} className="text-gold" /> Order Progress
          </h3>
          <div className="relative pl-6 border-l-2 border-gray-100 space-y-6 ml-3 py-2">
            {trackerSteps.map((step, idx) => (
              <div key={idx} className="relative">
                <span className={`absolute -left-[31px] top-1 w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center ${
                  step.active ? 'border-gold bg-black text-gold' : 'border-gray-200 bg-white text-gray-300'
                }`}>
                  {step.active && <span className="w-1.5 h-1.5 rounded-full bg-gold" />}
                </span>
                <div>
                  <h4 className={`font-heading text-xs uppercase tracking-wider font-bold ${step.active ? 'text-gray-900' : 'text-gray-400'}`}>
                    {step.label}
                  </h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery & Address */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3 shadow-sm">
            <Calendar size={22} className="text-gold" />
            <h4 className="font-heading text-xs uppercase tracking-widest font-bold text-gray-900">Estimated Delivery</h4>
            <p className="text-gray-600 text-sm font-semibold">
              {deliveryDate.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <p className="text-[10px] text-gray-400">Express courier with tracking</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3 shadow-sm">
            <MapPin size={22} className="text-gold" />
            <h4 className="font-heading text-xs uppercase tracking-widest font-bold text-gray-900">Shipping To</h4>
            <p className="text-gray-600 text-xs line-clamp-2 leading-relaxed">{order.shipping_address}</p>
            <p className="text-[10px] text-gray-400">Phone: {order.user_phone}</p>
          </div>
        </div>

        {/* Invoice */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
          <h3 className="font-heading text-xs uppercase tracking-widest font-bold text-gray-900 border-b border-gray-100 pb-3">
            Invoice
          </h3>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4 items-center">
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
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-heading font-bold text-gray-900">
            <span>Total Paid ({order.payment_method})</span>
            <span>₹{order.total_price.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/shop" className="btn btn-primary justify-center">
            Continue Shopping <ArrowRight size={14} />
          </Link>
          <Link href="/dashboard" className="btn btn-secondary justify-center text-xs">
            View Orders
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-beige flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-gold animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}

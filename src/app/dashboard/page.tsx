"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { DB, Order } from '@/lib/db';
import { ShoppingBag, ChevronRight, Calendar, Truck } from 'lucide-react';
import Link from 'next/link';

export default function UserDashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    const loadUserOrders = async () => {
      try {
        const orderData = await DB.getOrdersByUser(user.id);
        setOrders(orderData);
      } catch (err) {
        console.error("Failed to load user orders:", err);
      }
    };
    loadUserOrders();
  }, [user, router]);

  if (!user) {
    return (
      <div className="min-h-screen bg-beige flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-beige min-h-screen py-12">
      <div className="section max-w-5xl space-y-8">
        {/* Profile Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
            <div className="w-16 h-16 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gold text-xl font-bold font-heading">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-500 text-xs mt-0.5">{user.email}</p>
              {user.role === 'admin' && (
                <span className="inline-block mt-2 badge badge-gold text-[9px]">
                  Administrator
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            {user.role === 'admin' && (
              <Link href="/admin" className="btn btn-primary text-xs h-10">Admin Console</Link>
            )}
            <button onClick={() => { logout(); router.push('/'); }} className="btn btn-secondary text-xs h-10 px-6">
              Sign Out
            </button>
          </div>
        </div>

        {/* Orders */}
        <div className="space-y-4">
          <h3 className="font-heading text-xs uppercase tracking-widest font-bold text-gray-800 flex items-center gap-2">
            <ShoppingBag size={14} className="text-gold" /> Orders ({orders.length})
          </h3>

          {orders.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center space-y-4 shadow-sm">
              <p className="text-gray-400 font-medium text-sm">No orders yet.</p>
              <Link href="/shop" className="btn btn-primary">Browse Collection</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  {/* Header */}
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
                      <div>
                        <span className="block text-[9px] uppercase tracking-wider text-gray-400 font-bold">Date</span>
                        <span className="text-xs text-gray-700 font-semibold">
                          {new Date(order.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[9px] uppercase tracking-wider text-gray-400 font-bold">Total</span>
                        <span className="text-xs text-gray-900 font-bold">₹{order.total_price.toLocaleString('en-IN')}</span>
                      </div>
                      <div>
                        <span className="block text-[9px] uppercase tracking-wider text-gray-400 font-bold">Order ID</span>
                        <span className="text-xs font-mono font-semibold text-gray-600">{order.id}</span>
                      </div>
                    </div>
                    <span className={`text-[10px] border px-3 py-1 rounded font-bold uppercase tracking-wider ${
                      order.status === 'Pending' ? 'bg-orange-50 border-orange-200 text-orange-700' :
                      order.status === 'Confirmed' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                      order.status === 'Delivered' ? 'bg-green-50 border-green-200 text-green-700' :
                      'bg-gray-100 border-gray-200 text-gray-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="px-6 py-5 space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex gap-4 items-start">
                        <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-heading font-semibold text-xs sm:text-sm text-gray-900 truncate">{item.name}</h4>
                          <p className="text-[10px] text-gray-400 mt-0.5">₹{item.price.toLocaleString('en-IN')} &bull; Qty: {item.quantity}</p>
                          {(item.custom_text || item.custom_color) && (
                            <div className="text-[11px] text-gray-500 bg-gray-50 rounded-lg p-2.5 mt-2 space-y-0.5 border border-gray-100 max-w-sm">
                              {item.custom_text && <div>Text: <span className="text-gray-800 font-semibold italic">"{item.custom_text}"</span></div>}
                              {item.custom_color && <div>Color: <span className="text-gray-800 font-semibold">{item.custom_color}</span></div>}
                              {item.custom_font && <div>Font: <span className="text-gray-800 font-semibold">{item.custom_font}</span></div>}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="bg-gray-50/50 border-t border-gray-100 px-6 py-3.5 text-[11px] text-gray-500 flex flex-col sm:flex-row gap-2 justify-between">
                    <span>Deliver to: <strong className="text-gray-700 font-medium">{order.shipping_address}</strong></span>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 self-end sm:self-auto text-[10px]">
                      {order.shipping_carrier && (
                        <span className="flex items-center gap-1 text-green-700 font-bold bg-green-50 px-2 py-0.5 rounded border border-green-100">
                          <Truck size={10} /> {order.shipping_carrier}: {order.tracking_number}
                        </span>
                      )}
                      <span>Payment: <strong className="text-gray-700 font-semibold uppercase">{order.payment_method}</strong></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

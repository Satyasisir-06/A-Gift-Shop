"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { OrderItem, DB, Order } from '@/lib/db';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: OrderItem[];
  cartCount: number;
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  total: number;
  addToCart: (item: Omit<OrderItem, 'id'>) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, qty: number) => void;
  applyCoupon: (code: string) => Promise<boolean>;
  clearCart: () => void;
  placeOrder: (shippingAddress: string, paymentMethod: Order['payment_method']) => Promise<Order>;
  activeCoupon: string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [activeCoupon, setActiveCoupon] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('gs_cart');
    if (stored) {
      setCart(JSON.parse(stored));
    }
  }, []);

  const saveCart = (newCart: OrderItem[]) => {
    setCart(newCart);
    try {
      localStorage.setItem('gs_cart', JSON.stringify(newCart));
    } catch (e) {
      console.warn("Storage quota exceeded, could not save cart to localStorage:", e);
    }
  };

  const addToCart = (item: Omit<OrderItem, 'id'>) => {
    const newCart = [...cart];
    // Check if item is already in cart with exact same customization details
    const existingIdx = newCart.findIndex(i => 
      i.product_id === item.product_id &&
      i.custom_text === item.custom_text &&
      i.custom_color === item.custom_color &&
      i.custom_font === item.custom_font &&
      i.custom_image === item.custom_image
    );

    if (existingIdx >= 0) {
      newCart[existingIdx].quantity += item.quantity;
    } else {
      const uniqueId = "item_" + Math.random().toString(36).substr(2, 9);
      newCart.push({ ...item, id: uniqueId });
    }
    saveCart(newCart);
  };

  const removeFromCart = (itemId: string) => {
    const newCart = cart.filter(i => i.id !== itemId);
    saveCart(newCart);
  };

  const updateQuantity = (itemId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(itemId);
      return;
    }
    const newCart = cart.map(i => i.id === itemId ? { ...i, quantity: qty } : i);
    saveCart(newCart);
  };

  const applyCoupon = async (code: string): Promise<boolean> => {
    const cleanCode = code.toUpperCase().trim();
    const coupons = await DB.getCoupons();
    const validCoupon = coupons.find(c => c.code === cleanCode && c.active);
    
    if (validCoupon) {
      setDiscountPercent(validCoupon.discount_percent);
      setActiveCoupon(cleanCode);
      return true;
    }
    return false;
  };

  const clearCart = () => {
    saveCart([]);
    setDiscountPercent(0);
    setActiveCoupon('');
  };

  const placeOrder = async (shippingAddress: string, paymentMethod: Order['payment_method']): Promise<Order> => {
    if (!user) throw new Error("Must be logged in to place an order");

    const orderData: Omit<Order, 'id' | 'created_at'> = {
      user_id: user.id,
      user_name: user.name,
      user_email: user.email,
      user_phone: user.phone || '',
      items: [...cart],
      total_price: total,
      status: 'Pending',
      shipping_address: shippingAddress,
      payment_method: paymentMethod
    };

    const newOrder = await DB.createOrder(orderData);
    // Don't clear cart here — let the checkout page clear it after
    // successful navigation to prevent premature redirect to /shop.
    return newOrder;
  };

  const cartCount = cart.reduce((acc, i) => acc + i.quantity, 0);
  const subtotal = cart.reduce((acc, i) => acc + (i.price * i.quantity), 0);
  const deliveryCharge = subtotal > 0 ? (subtotal >= 1500 ? 0 : 99) : 0;
  const discount = Math.round(subtotal * (discountPercent / 100));
  const total = subtotal - discount + deliveryCharge;

  return (
    <CartContext.Provider value={{
      cart,
      cartCount,
      subtotal,
      deliveryCharge,
      discount,
      total,
      addToCart,
      removeFromCart,
      updateQuantity,
      applyCoupon,
      clearCart,
      placeOrder,
      activeCoupon
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

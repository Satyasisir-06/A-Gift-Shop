"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { DB, Product, Order, Announcement, PopupOffer, CATEGORIES, Collection } from '@/lib/db';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, Volume2, DollarSign, ShoppingBag, Boxes, 
  LogOut, Edit2, Search, Printer, Truck, X, Package, LayoutDashboard,
  Settings, GripVertical, ArrowUp, ArrowDown, Check,
  Terminal, Cpu, Clock, Database, Wifi, Activity, Minimize2,
  RefreshCw, Copy, Sparkles, ChevronRight, Eye, AlertCircle
} from 'lucide-react';

// ─── Real-time system clock hook ───
const useSystemClock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return time;
};

// ─── Uptime counter ───
const useUptime = (startTime: number) => {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);
  return elapsed;
};

// ─── Format uptime ───
const formatUptime = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

// ─── Activity log entry ───
interface LogEntry {
  id: string;
  timestamp: Date;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'system';
}

const generateUUID = () => {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const ORDER_STEPS: Order['status'][] = ['Pending', 'Confirmed', 'Designing', 'Production', 'Shipped', 'Delivered'];

export default function AdminPanel() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'announcements' | 'popups' | 'homepage'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [bestsellerIds, setBestsellerIds] = useState<string[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);

  // Search & Filter
  const [orderSearch, setOrderSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | Order['status']>('All');
  const [orderCurrentPage, setOrderCurrentPage] = useState(1);

  // Edit Product states
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState(0);
  const [editCategory, setEditCategory] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editImg, setEditImg] = useState('');
  const [editCustom, setEditCustom] = useState(true);

  // Tracking details update states
  const [trackingOrder, setTrackingOrder] = useState<string | null>(null);

  // Console state
  const now = useSystemClock();
  const startTime = useRef(Date.now());
  const uptime = useUptime(startTime.current);
  const [activityLog, setActivityLog] = useState<LogEntry[]>([
    { id: 'sys-1', timestamp: new Date(), message: 'Bespoke Studio console initialized.', type: 'system' },
    { id: 'sys-2', timestamp: new Date(), message: 'Established secure connection to database stores.', type: 'system' },
  ]);
  const [showActivityLog, setShowActivityLog] = useState(false);
  const [booted, setBooted] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const addLog = useCallback((message: string, type: LogEntry['type'] = 'info') => {
    setActivityLog(prev => [...prev, { id: `log-${Date.now()}-${Math.random()}`, timestamp: new Date(), message, type }]);
  }, []);

  // Initial boot sequence
  useEffect(() => {
    const bootTimer = setTimeout(() => setBooted(true), 900);
    const logTimer1 = setTimeout(() => addLog('Synchronizing catalog assets...', 'system'), 200);
    const logTimer2 = setTimeout(() => addLog('Loading personalized orders list...', 'system'), 450);
    const logTimer3 = setTimeout(() => addLog('Ready. Welcome back, Administrator.', 'success'), 750);
    return () => { 
      clearTimeout(bootTimer); 
      clearTimeout(logTimer1); 
      clearTimeout(logTimer2); 
      clearTimeout(logTimer3); 
    };
  }, [addLog]);

  // Auto-scroll activity log
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activityLog]);

  const [carrierInput, setCarrierInput] = useState('');
  const [trackingNumInput, setTrackingNumInput] = useState('');

  useEffect(() => {
    if (editingProduct) {
      setEditName(editingProduct.name);
      setEditPrice(editingProduct.price);
      setEditCategory(editingProduct.category);
      setEditDesc(editingProduct.description || '');
      setEditImg(editingProduct.image_url);
      setEditCustom(editingProduct.customizable);
    }
  }, [editingProduct]);

  const [showAddProduct, setShowAddProduct] = useState(false);
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState(999);
  const [prodCategory, setProdCategory] = useState(CATEGORIES[0]);
  const [customCategoryInput, setCustomCategoryInput] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodImg, setProdImg] = useState('https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=400&auto=format&fit=crop');
  const [prodCustom, setProdCustom] = useState(true);
  const [editCustomCategoryInput, setEditCustomCategoryInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const [annTitle, setAnnTitle] = useState('');
  const [annDesc, setAnnDesc] = useState('');

  // Popup Offers state
  const [popupOffers, setPopupOffers] = useState<PopupOffer[]>([]);
  const [popTitle, setPopTitle] = useState('');
  const [popDesc, setPopDesc] = useState('');
  const [popImg, setPopImg] = useState('');
  const [popActive, setPopActive] = useState(true);
  const [popUploading, setPopUploading] = useState(false);

  const [reloadTrigger, setReloadTrigger] = useState(0);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/login');
      return;
    }
    const loadData = async () => {
      try {
        const [orderData, prodData, annData, bestIds, collData, popData] = await Promise.all([
          DB.getOrders(),
          DB.getProducts(),
          DB.getAnnouncements(),
          DB.getBestsellers(),
          DB.getCollections(),
          DB.getPopupOffers(),
        ]);
        setOrders(orderData);
        setProducts(prodData);
        setAnnouncements(annData);
        setBestsellerIds(bestIds);
        setCollections(collData);
        setPopupOffers(popData);
      } catch (err) {
        console.error("Failed to load admin panel data:", err);
      }
    };
    loadData();
  }, [user, reloadTrigger, router]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-beige flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-gold animate-spin" />
          <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">Restoring Session</p>
        </div>
      </div>
    );
  }

  const handleUpdateStatus = async (orderId: string, status: Order['status']) => {
    if (status === 'Shipped') {
      const order = orders.find(o => o.id === orderId);
      setTrackingOrder(orderId);
      setCarrierInput(order?.shipping_carrier || '');
      setTrackingNumInput(order?.tracking_number || '');
    }
    await DB.updateOrderStatus(orderId, status);
    addLog(`Order ${orderId.slice(0, 8)} status changed to ${status}`, 'info');
    setReloadTrigger(prev => prev + 1);
  };

  const handleUpdateImagesReceived = async (orderId: string, received: boolean) => {
    await DB.updateImagesReceived(orderId, received);
    addLog(`Images received status for order ${orderId.slice(0, 8)} updated to ${received}`, 'info');
    setReloadTrigger(prev => prev + 1);
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editName || editPrice <= 0) return;
    const finalCategory = editCategory === 'NEW_CATEGORY_TRIGGER' ? editCustomCategoryInput.trim() : editCategory;
    if (!finalCategory) { alert("Please specify a category."); return; }
    const updated: Product = { ...editingProduct, name: editName, price: editPrice, category: finalCategory, description: editDesc, image_url: editImg, customizable: editCustom };
    addLog(`Product "${updated.name}" details updated.`, 'success');
    await DB.saveProduct(updated);
    setEditingProduct(null);
    setEditCustomCategoryInput('');
    setReloadTrigger(prev => prev + 1);
  };

  const handleSaveTracking = async (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    addLog(`Tracking saved: ${carrierInput} (${trackingNumInput})`, 'success');
    await DB.updateOrderStatus(orderId, order.status, carrierInput, trackingNumInput);
    setTrackingOrder(null);
    setCarrierInput('');
    setTrackingNumInput('');
    setReloadTrigger(prev => prev + 1);
  };

  const handlePrintInvoice = (order: Order) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const itemsHtml = order.items.map(item => `
      <tr style="border-bottom:1px solid #eee"><td style="padding:12px 0"><div style="font-weight:bold;font-size:14px;color:#111">${item.name}</div>${item.custom_text?`<div style="font-size:12px;color:#D4AF37;margin-top:4px;font-family:Georgia,serif;font-style:italic">Engraving: &quot;${item.custom_text}&quot;</div>`:''}${item.custom_font?`<div style="font-size:12px;color:#666">Font style: ${item.custom_font}</div>`:''}${item.custom_color?`<div style="font-size:12px;color:#666">HUE: ${item.custom_color}</div>`:''}</td><td style="padding:12px 0;text-align:center;color:#444">${item.quantity}</td><td style="padding:12px 0;text-align:right;color:#444">₹${item.price.toLocaleString('en-IN')}</td><td style="padding:12px 0;text-align:right;color:#444">₹${(item.price*item.quantity).toLocaleString('en-IN')}</td></tr>
    `).join('');
    
    printWindow.document.write(`<html><head><title>Invoice - ${order.id.slice(0,8)}</title><style>body{font-family:'Poppins',system-ui,sans-serif;padding:50px;color:#111;background:#fff}.header{display:flex;justify-content:space-between;border-bottom:1px solid #D4AF37;padding-bottom:25px}.section{margin:30px 0}.grid{display:flex;justify-content:space-between}.col{flex:1}table{width:100%;border-collapse:collapse}th{text-align:left;border-bottom:2px solid #111;padding-bottom:10px;font-size:12px;text-transform:uppercase;color:#888;letter-spacing:1px}.total{text-align:right;font-size:20px;font-weight:bold;margin-top:30px;color:#D4AF37}</style></head><body><div class="header"><div><h1 style="margin:0;font-size:28px;letter-spacing:3px;color:#111;font-weight:700">A GIFT SHOP</h1><p style="margin:5px 0 0 0;font-size:12px;color:#999;letter-spacing:2px;text-transform:uppercase">Boutique Personalized Gifts</p></div><div style="text-align:right"><h3 style="margin:0;font-size:14px;color:#111;letter-spacing:1px;font-weight:600">OFFICIAL INVOICE</h3><p style="margin:5px 0 0 0;font-size:12px;color:#888">Date: ${new Date(order.created_at).toLocaleDateString()}</p><p style="margin:2px 0 0 0;font-size:12px;color:#888">Ref: #${order.id}</p></div></div><div class="section grid"><div class="col"><h4 style="margin:0 0 8px 0;font-size:11px;color:#999;text-transform:uppercase;letter-spacing:1px">Client Details</h4><p style="margin:0;font-size:14px;font-weight:bold;color:#111">${order.user_name}</p><p style="margin:3px 0 0 0;font-size:13px;color:#555">Email: ${order.user_email}</p><p style="margin:2px 0 0 0;font-size:13px;color:#555">Phone: ${order.user_phone}</p></div><div class="col" style="text-align:right"><h4 style="margin:0 0 8px 0;font-size:11px;color:#999;text-transform:uppercase;letter-spacing:1px">Shipping Destination</h4><p style="margin:0;font-size:13px;color:#555;line-height:1.5">${order.shipping_address}</p><p style="margin:8px 0 0 0;font-size:13px;color:#111"><strong>Payment:</strong> ${order.payment_method}</p></div></div><div class="section"><table><thead><tr><th>Personalized Articulation</th><th style="text-align:center">Qty</th><th style="text-align:right">Price</th><th style="text-align:right">Total</th></tr></thead><tbody>${itemsHtml}</tbody></table></div><div class="total">Grand Total: ₹${order.total_price.toLocaleString('en-IN')}</div><div style="margin-top:70px;text-align:center;font-size:12px;color:#aaa;border-top:1px solid #eee;padding-top:20px;letter-spacing:1px">Thank you for patronizing A Gift Shop.</div><script>window.onload=function(){window.print()}</script></body></html>`);
    printWindow.document.close();
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || prodPrice <= 0) return;
    const finalCategory = prodCategory === 'NEW_CATEGORY_TRIGGER' ? customCategoryInput.trim() : prodCategory;
    if (!finalCategory) { alert("Please specify a category."); return; }
    const newProduct: Product = { id: generateUUID(), name: prodName, price: prodPrice, description: prodDesc, category: finalCategory, stock: 100, image_url: prodImg, customizable: prodCustom };
    addLog(`Product "${newProduct.name}" cataloged.`, 'success');
    await DB.saveProduct(newProduct);
    setShowAddProduct(false);
    setProdName(''); setProdPrice(999); setProdDesc(''); setCustomCategoryInput('');
    setReloadTrigger(prev => prev + 1);
  };

  const handleProdImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try { setIsUploading(true); const url = await DB.uploadProductImage(file); setProdImg(url); }
    catch (err) { console.error("Upload error:", err); alert("Failed to upload image."); }
    finally { setIsUploading(false); }
  };

  const handleEditImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try { setIsUploading(true); const url = await DB.uploadProductImage(file); setEditImg(url); }
    catch (err) { console.error("Upload error:", err); alert("Failed to upload image."); }
    finally { setIsUploading(false); }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm("Permanently archive this product from catalog?")) {
      addLog('Product removed.', 'warning');
      await DB.deleteProduct(id);
      setReloadTrigger(prev => prev + 1);
    }
  };

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle) return;
    const newAnn: Announcement = { id: generateUUID(), title: annTitle, description: annDesc, created_at: new Date().toISOString() };
    addLog(`Banner campaign "${newAnn.title}" launched.`, 'success');
    await DB.saveAnnouncement(newAnn);
    setAnnTitle(''); setAnnDesc('');
    setReloadTrigger(prev => prev + 1);
  };

  const handleDeleteAnnouncement = async (id: string) => {
    addLog('Banner campaign removed.', 'warning');
    await DB.deleteAnnouncement(id);
    setReloadTrigger(prev => prev + 1);
  };

  const handleCreatePopupOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!popTitle) return;
    const newOffer: PopupOffer = {
      id: generateUUID(),
      title: popTitle,
      description: popDesc,
      image_url: popImg,
      active: popActive,
      created_at: new Date().toISOString()
    };
    addLog(`Popup offer "${newOffer.title}" launched.`, 'success');
    await DB.savePopupOffer(newOffer);
    setPopTitle(''); setPopDesc(''); setPopImg(''); setPopActive(true);
    setReloadTrigger(prev => prev + 1);
  };

  const handleDeletePopupOffer = async (id: string) => {
    addLog('Popup offer removed.', 'warning');
    await DB.deletePopupOffer(id);
    setReloadTrigger(prev => prev + 1);
  };

  const handleTogglePopupActive = async (offer: PopupOffer) => {
    const updated = { ...offer, active: !offer.active };
    addLog(`Popup offer "${offer.title}" ${updated.active ? 'activated' : 'deactivated'}.`, 'info');
    await DB.savePopupOffer(updated);
    setReloadTrigger(prev => prev + 1);
  };

  const handlePopupImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setPopUploading(true);
      const url = await DB.uploadProductImage(file);
      setPopImg(url);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload image.");
    } finally {
      setPopUploading(false);
    }
  };

  const toggleBestseller = async (productId: string) => {
    let updated: string[];
    if (bestsellerIds.includes(productId)) {
      updated = bestsellerIds.filter(id => id !== productId);
    } else {
      if (bestsellerIds.length >= 4) {
        alert("Maximum 4 bestsellers allowed.");
        return;
      }
      updated = [...bestsellerIds, productId];
    }
    setBestsellerIds(updated);
    await DB.setBestsellers(updated);
    const productName = products.find(p => p.id === productId)?.name || productId;
    if (bestsellerIds.includes(productId)) {
      addLog(`Bestseller status revoked for "${productName}".`, 'info');
    } else {
      addLog(`Bestseller status granted for "${productName}".`, 'success');
    }
  };

  const moveBestseller = async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= bestsellerIds.length) return;
    const updated = [...bestsellerIds];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setBestsellerIds(updated);
    addLog(`Bestsellers priority reordered.`, 'info');
    await DB.setBestsellers(updated);
  };

  const updateCollection = async (index: number, field: keyof Collection, value: string) => {
    const updated = [...collections];
    updated[index] = { ...updated[index], [field]: value };
    setCollections(updated);
    await DB.saveCollections(updated);
  };

  const addCollection = async () => {
    const updated = [...collections, { name: "New Collection", count: "0 items", img: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=400&auto=format&fit=crop" }];
    setCollections(updated);
    addLog('New homepage collection tag defined.', 'success');
    await DB.saveCollections(updated);
  };

  const deleteCollection = async (index: number) => {
    const name = collections[index]?.name || `#${index + 1}`;
    const updated = collections.filter((_, i) => i !== index);
    setCollections(updated);
    addLog(`Collection "${name}" card deleted.`, 'warning');
    await DB.saveCollections(updated);
  };

  const moveCollection = async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= collections.length) return;
    const updated = [...collections];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setCollections(updated);
    addLog(`Collections display priority updated.`, 'info');
    await DB.saveCollections(updated);
  };

  const copyToClipboard = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    addLog(`Copied ID to clipboard: ${id.slice(0, 8)}`, 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const totalRevenue = orders.reduce((sum, o) => sum + o.total_price, 0);
  const activeOrders = orders.filter(o => o.status !== 'Delivered').length;
  const handleLogoutClick = () => { addLog('Session securely terminated.', 'system'); logout(); router.push('/login'); };
  const dynamicCategories = Array.from(new Set([...CATEGORIES, ...products.map(p => p.category)]));

  useEffect(() => {
    setOrderCurrentPage(1);
  }, [orderSearch, statusFilter]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.user_name.toLowerCase().includes(orderSearch.toLowerCase()) || order.user_email.toLowerCase().includes(orderSearch.toLowerCase()) || (order.user_phone && order.user_phone.includes(orderSearch)) || order.id.toLowerCase().includes(orderSearch.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const ORDERS_PER_PAGE = 3;
  const orderTotalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice((orderCurrentPage - 1) * ORDERS_PER_PAGE, orderCurrentPage * ORDERS_PER_PAGE);

  const filteredProducts = products.filter(product => {
    const query = productSearch.toLowerCase().trim();
    if (!query) return true;
    return product.name.toLowerCase().includes(query) || product.category.toLowerCase().includes(query) || (product.description && product.description.toLowerCase().includes(query));
  });

  const bestsellerProducts = bestsellerIds.map(id => products.find(p => p.id === id)).filter(Boolean) as Product[];

  const sidebarItems = [
    { id: 'orders', label: 'Client Orders', icon: ShoppingBag, count: orders.length },
    { id: 'products', label: 'Catalog Assets', icon: Package, count: products.length },
    { id: 'announcements', label: 'Marketing Banners', icon: Volume2, count: announcements.length },
    { id: 'popups', label: 'Popup Offers', icon: Eye, count: popupOffers.length },
    { id: 'homepage', label: 'Homepage Editor', icon: LayoutDashboard },
  ] as const;

  const activeLogEntries = activityLog.slice(-50);

  const logColors: Record<string, string> = {
    info: 'text-neutral-500',
    success: 'text-gold font-semibold',
    warning: 'text-amber-500',
    error: 'text-red-500',
    system: 'text-neutral-400 font-mono',
  };

  const tabVariants = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -16 },
  };

  return (
    <div className="bg-[#FAF8F4] min-h-screen flex antialiased">
      {/* Boot splash overlay */}
      {!booted && (
        <div className="fixed inset-0 z-[100] bg-neutral-950 flex items-center justify-center">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-white border border-gold/20 flex items-center justify-center shadow-2xl relative overflow-hidden">
              <img src="/logo.png" alt="A Gift Shop Logo" className="w-full h-full object-contain" />
            </div>
            <div className="space-y-2">
              <div className="admin-gold-bar w-16 mx-auto mb-3" />
              <p className="text-white font-heading font-bold text-xl uppercase tracking-[0.3em]">A Gift Shop</p>
              <p className="text-gold text-xs font-mono tracking-widest uppercase">Signature Dashboard v3.0</p>
            </div>
            <div className="w-60 h-[2px] bg-neutral-800 rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-gradient-to-r from-gold via-gold-300 to-gold rounded-full" style={{ animation: 'boot-progress 0.9s ease-out forwards' }} />
            </div>
            <p className="text-neutral-400 text-xs font-mono tracking-widest uppercase">Connecting securely...</p>
          </div>
        </div>
      )}

      {/* Sidebar - Deep Charcoal Luxury Design */}
      <aside className="w-64 bg-neutral-950 text-white flex flex-col flex-shrink-0 relative z-30 shadow-2xl">
        {/* Fine vertical line highlighting gold accent */}
        <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-neutral-900" />
        
        {/* Brand header */}
        <div className="p-6 pt-7 border-b border-neutral-900">
          <div className="flex items-center gap-3.5">
            <img src="/logo.png" alt="A Gift Shop Logo" className="w-14 h-14 rounded-full object-contain border border-gold/10" />
            <div>
              <h1 className="text-white text-base font-heading font-bold uppercase tracking-[0.18em] leading-tight">
                A Gift Shop
              </h1>
              <p className="text-xs text-gold/60 font-mono tracking-widest uppercase mt-0.5">Studio Admin</p>
            </div>
          </div>
        </div>

        {/* System status strip inside sidebar */}
        <div className="px-6 py-3.5 border-b border-neutral-900 bg-neutral-900/20">
          <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] admin-status-pulse" />
              <span className="text-neutral-300 font-semibold tracking-wider">ONLINE</span>
            </span>
            <span className="flex items-center gap-1 bg-neutral-900/80 px-2 py-0.5 rounded border border-neutral-800">
              <Database size={10} className="text-gold" />
              <span className="text-neutral-400">{products.length} Items</span>
            </span>
          </div>
        </div>

        {/* Main Menu tabs */}
        <nav className="flex-1 p-4 space-y-1.5">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id as any); addLog(`Switched view to ${item.label}`, 'info'); }}
                className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-lg text-sm font-medium transition-all duration-300 relative group text-left ${
                  isActive
                    ? 'text-white font-semibold'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/50'
                }`}
              >
                {/* Active hover pill styling */}
                {isActive && (
                  <motion.div 
                    layoutId="activeSidebarPill"
                    className="absolute inset-0 rounded-lg bg-gradient-to-r from-gold/15 to-transparent border-l-[3px] border-gold"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                
                <span className={`relative z-10 w-6 h-6 rounded flex items-center justify-center transition-colors duration-300 ${
                  isActive 
                    ? 'text-gold bg-gold/10' 
                    : 'text-neutral-500 group-hover:text-neutral-300'
                }`}>
                  <Icon size={16} />
                </span>
                
                <span className="relative z-10 flex-1">{item.label}</span>
                
                {'count' in item && item.count !== undefined && (
                  <span className={`relative z-10 text-xs font-mono px-2 py-0.5 rounded-full ${
                    isActive 
                      ? 'bg-gold/20 text-gold font-bold' 
                      : 'bg-neutral-900 text-neutral-500 group-hover:bg-neutral-800'
                  }`}>{item.count}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* System Activity Log panel toggle */}
        <div className="px-4 mb-2">
          <button
            onClick={() => setShowActivityLog(!showActivityLog)}
            className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-mono border transition-all duration-300 ${
              showActivityLog 
                ? 'text-gold bg-gold/10 border-gold/30 shadow-[0_0_12px_rgba(212,175,55,0.05)]' 
                : 'text-neutral-500 hover:text-neutral-300 bg-neutral-900/30 border-transparent hover:bg-neutral-900/60'
            }`}
          >
            <Activity size={12} className={showActivityLog ? "text-gold" : "text-neutral-500"} />
            <span className="flex-1 text-left uppercase tracking-wider">Activity Log</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
              showActivityLog ? 'bg-gold text-black' : 'bg-neutral-800 text-neutral-500'
            }`}>{activeLogEntries.length}</span>
          </button>
        </div>

        {/* Footer controls */}
        <div className="p-4 border-t border-neutral-900 space-y-1">
          <button onClick={() => router.push('/')} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-mono text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900/30 transition-all duration-200">
            <Settings size={12} className="text-neutral-600" /> View Live Store
          </button>
          <button onClick={handleLogoutClick} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-mono text-red-500/70 hover:text-red-400 hover:bg-red-950/20 transition-all duration-200">
            <LogOut size={12} /> Secure Logout
          </button>
        </div>
      </aside>

      {/* Main Command Workspace */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        
        {/* Premium Header */}
        <header className="bg-white px-8 py-4.5 flex items-center justify-between border-b border-neutral-200/70 relative z-20 shadow-sm">
          {/* Gold ribbon accent on bottom border */}
          <div className="absolute bottom-0 left-0 right-0 h-[1.5px]" style={{background: 'linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.4) 15%, rgba(212,175,55,0.2) 50%, rgba(212,175,55,0.4) 85%, transparent 100%)'}} />
          
          <div className="flex items-center gap-5">
            {/* Live system clock status capsules */}
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-500">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-50 border border-neutral-200/60 font-semibold shadow-sm">
                <Clock size={12} className="text-gold" />
                {now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-50 border border-neutral-200/60 font-semibold shadow-sm">
                <Cpu size={12} className="text-neutral-400" />
                UPTIME: {formatUptime(uptime)}
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-50 border border-neutral-200/60 font-semibold shadow-sm">
                <Wifi size={12} className="text-emerald-500" />
                CAMPAIGNS: {announcements.length}
              </span>
            </div>
            
            {/* Manual refresh command */}
            <button 
              onClick={() => {
                setReloadTrigger(prev => prev + 1);
                addLog('Manual data re-synchronization triggered.', 'system');
              }}
              className="p-2 rounded-full border border-neutral-200/70 hover:border-neutral-300 text-neutral-400 hover:text-neutral-700 bg-white hover:shadow-sm active:scale-95 transition-all duration-200"
              title="Resync Database Store"
            >
              <RefreshCw size={13} />
            </button>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="text-right">
              <p className="text-sm font-heading font-bold text-neutral-800 uppercase tracking-wider">{user.name}</p>
              <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest mt-0.5">Master Curator</p>
            </div>
            <span className="h-6 w-[1px] bg-neutral-200" />
            <span className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-gold/15 to-gold/5 border border-gold/25 text-gold text-xs font-heading font-bold uppercase tracking-widest shadow-sm">
              Curator admin
            </span>
          </div>
        </header>

        {/* Scrollable Canvas Area */}
        <div className="flex-1 overflow-y-auto bg-[#FAF8F4]">
          <div className="p-8 max-w-7xl mx-auto space-y-8">
            
            {/* Elegant Stats Cards (Staggered Animation) */}
            {activeTab !== 'homepage' && (
              <motion.div 
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
              >
                {[
                  { label: 'Bespoke Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: DollarSign, color: 'text-gold', bg: 'bg-gold/5 border-gold/20', bar: totalRevenue > 0 ? 88 : 0 },
                  { label: 'Studio Pipeline', value: `${activeOrders} Active`, icon: ShoppingBag, color: 'text-emerald-600', bg: 'bg-emerald-500/5 border-emerald-500/15', bar: orders.length > 0 ? Math.round((activeOrders / orders.length) * 100) : 0 },
                  { label: 'Design Catalog', value: `${products.length} Styles`, icon: Boxes, color: 'text-blue-600', bg: 'bg-blue-500/5 border-blue-500/15', bar: Math.min(products.length * 10, 100) },
                  { label: 'Active Campaigns', value: `${announcements.length} Banners`, icon: Volume2, color: 'text-purple-600', bg: 'bg-purple-500/5 border-purple-500/15', bar: announcements.length * 50 },
                ].map((stat, idx) => (
                  <motion.div 
                    key={stat.label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.08, ease: 'easeOut' }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="bg-white border border-neutral-200/80 rounded-xl p-5 space-y-4 shadow-sm relative overflow-hidden group"
                  >
                    {/* Top gold border tag */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-neutral-100 group-hover:bg-gold transition-colors duration-500" />
                    
                    {/* Subtle glow circle decoration */}
                    <div className="absolute -right-8 -bottom-8 w-24 h-24 rounded-full bg-neutral-50/50 group-hover:bg-gold/5 transition-colors duration-500 pointer-events-none" />

                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest">{stat.label}</span>
                      <span className={`w-9 h-9 rounded-full flex items-center justify-center shadow-sm ${stat.bg} ${stat.color}`}>
                        <stat.icon size={16} />
                      </span>
                    </div>

                    <div className="space-y-1">
                      <p className={`font-heading font-bold text-3xl tracking-tight ${stat.label.includes('Revenue') ? 'admin-gold-shimmer' : 'text-neutral-900'}`}>
                        {stat.value}
                      </p>
                    </div>

                    {/* Progress tracking line */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between text-xs font-mono text-neutral-400">
                        <span>Utilization</span>
                        <span>{stat.bar}%</span>
                      </div>
                      <div className="admin-mini-bar">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(stat.bar, 100)}%` }}
                          transition={{ duration: 1.2, delay: 0.3 + idx * 0.1, ease: 'easeOut' }}
                          className={`admin-mini-bar-fill ${
                            stat.color.includes('gold') ? 'bg-gold' :
                            stat.color.includes('emerald') ? 'bg-emerald-500' :
                            stat.color.includes('blue') ? 'bg-blue-500' : 'bg-purple-500'
                          }`} 
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Main Tabs Container */}
            <AnimatePresence mode="wait">
              {activeTab === 'orders' && (
                <motion.div key="orders" variants={tabVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3, ease: 'easeOut' }} className="space-y-5">
                  
                  {/* Search Bar & Filtering Canvas */}
                  <div className="flex flex-col md:flex-row items-center gap-4 bg-white border border-neutral-200/80 rounded-xl p-4.5 shadow-sm">
                    <div className="relative flex-1 w-full">
                      <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input 
                        type="text" 
                        placeholder="Search by name, email, phone or invoice reference..." 
                        value={orderSearch} 
                        onChange={(e) => setOrderSearch(e.target.value)} 
                        className="w-full bg-neutral-50/60 border border-neutral-200/80 rounded-lg px-3.5 py-2.5 pl-10 text-sm text-neutral-700 placeholder-neutral-400 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 font-mono transition-all duration-200" 
                      />
                      {orderSearch && (
                        <button onClick={() => setOrderSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors">
                          <X size={14} />
                        </button>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3 w-full md:w-auto">
                      <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest whitespace-nowrap">Filter status:</span>
                      <select 
                        value={statusFilter} 
                        onChange={(e: any) => setStatusFilter(e.target.value)} 
                        className="bg-neutral-50/60 border border-neutral-200/80 rounded-lg px-3 py-2.5 text-sm text-neutral-700 focus:outline-none focus:border-gold font-mono w-full md:w-44 cursor-pointer"
                      >
                        <option value="All">All statuses</option>
                        {ORDER_STEPS.map(step => <option key={step} value={step}>{step}</option>)}
                      </select>
                    </div>

                    <div className="text-xs font-mono text-neutral-400 bg-neutral-50 border border-neutral-200/60 px-3 py-2.5 rounded-lg whitespace-nowrap">
                      {filteredOrders.length} {filteredOrders.length === 1 ? 'record' : 'records'} match
                    </div>
                  </div>

                  {/* Empty state */}
                  {filteredOrders.length === 0 ? (
                    <div className="bg-white border border-neutral-200/80 rounded-xl p-20 text-center shadow-sm max-w-2xl mx-auto space-y-4">
                      <div className="w-14 h-14 mx-auto rounded-full bg-neutral-50 border border-neutral-200 flex items-center justify-center shadow-inner">
                        <ShoppingBag size={24} className="text-neutral-300" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-neutral-800 text-base font-medium">No order files detected</p>
                        <p className="text-neutral-400 text-xs font-mono">
                          {orderSearch ? 'Try revising your search criteria.' : 'Bespoke customer orders will catalog here.'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                    {/* Orders list */}
                    <div className="space-y-5">
                      {paginatedOrders.map((order) => (
                        <motion.div 
                          key={order.id} 
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white border border-neutral-200/80 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                        >
                          {/* Order Header */}
                          <div className="bg-neutral-50/60 px-6 py-4.5 border-b border-neutral-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                              <div>
                                <span className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest">Client Patron</span>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <p className="text-sm text-neutral-900 font-bold tracking-wide">{order.user_name}</p>
                                  <span className="w-1 h-1 rounded-full bg-neutral-300" />
                                  <p className="text-xs font-mono text-neutral-500">{order.user_email}</p>
                                </div>
                              </div>
                              <div className="border-l border-neutral-200 h-6 hidden md:block" />
                              <div>
                                <span className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest">Phone contact</span>
                                <p className="text-xs font-mono text-neutral-700 mt-0.5">{order.user_phone || 'None provided'}</p>
                              </div>
                              <div className="border-l border-neutral-200 h-6 hidden md:block" />
                              <div>
                                <span className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest">Curator Order Ref</span>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <p className="text-xs font-mono text-neutral-700 font-bold truncate max-w-[120px]">
                                    #{order.id.slice(0, 8)}
                                  </p>
                                  <button 
                                    onClick={() => copyToClipboard(order.id)}
                                    className="p-1.5 rounded hover:bg-neutral-200/60 text-neutral-400 hover:text-neutral-700 transition-colors"
                                    title="Copy full reference ID"
                                  >
                                    {copiedId === order.id ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                                  </button>
                                </div>
                              </div>
                              <div className="border-l border-neutral-200 h-6 hidden md:block" />
                              <div>
                                <span className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest">WhatsApp Code</span>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <p className="text-xs font-mono text-neutral-700 font-bold truncate">
                                    {order.whatsapp_code || 'N/A'}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              {order.whatsapp_code && (
                                <label className="flex items-center gap-1.5 cursor-pointer mr-2">
                                  <input 
                                    type="checkbox" 
                                    checked={order.images_received} 
                                    onChange={(e) => handleUpdateImagesReceived(order.id, e.target.checked)} 
                                    className="w-4 h-4 rounded border-neutral-300 text-emerald-500 focus:ring-emerald-500"
                                  />
                                  <span className="text-xs font-mono text-neutral-600">Images Received</span>
                                </label>
                              )}
                              <select 
                                value={order.status} 
                                onChange={(e: any) => handleUpdateStatus(order.id, e.target.value)} 
                                className="bg-white border border-neutral-200/80 rounded-lg px-2.5 py-1.5 text-xs font-mono text-neutral-700 focus:outline-none focus:border-gold cursor-pointer"
                              >
                                {ORDER_STEPS.map(step => <option key={step} value={step}>{step}</option>)}
                              </select>
                            </div>
                          </div>

                          {/* Interactive Pipeline Progress bar */}
                          <div className="px-6 py-5.5 bg-white border-b border-neutral-100">
                            <div className="relative flex items-center justify-between w-full">
                              
                              {/* Background connection line */}
                              <div className="absolute left-3 right-3 top-3 h-[2px] bg-neutral-100 z-0">
                                <div 
                                  className="h-full bg-gold transition-all duration-500" 
                                  style={{ 
                                    width: `${(ORDER_STEPS.indexOf(order.status) / (ORDER_STEPS.length - 1)) * 100}%` 
                                  }} 
                                />
                              </div>

                              {ORDER_STEPS.map((step, idx) => {
                                const stepIndex = ORDER_STEPS.indexOf(order.status);
                                const isCurrent = order.status === step;
                                const isPast = stepIndex >= idx;
                                
                                return (
                                  <div key={step} className="flex flex-col items-center z-10 relative">
                                    <div 
                                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-all duration-500 shadow ${
                                        isCurrent 
                                          ? 'bg-gold text-black ring-4 ring-gold/15' 
                                          : isPast 
                                            ? 'bg-neutral-900 text-white' 
                                            : 'bg-white border border-neutral-200 text-neutral-400'
                                      }`}
                                    >
                                      {isPast && !isCurrent ? <Check size={12} className="stroke-[2.5]" /> : idx + 1}
                                    </div>
                                    <span 
                                      className={`text-[10.5px] font-mono uppercase tracking-widest mt-2 transition-colors duration-300 ${
                                        isCurrent 
                                          ? 'text-gold font-bold' 
                                          : isPast 
                                            ? 'text-neutral-900 font-semibold' 
                                            : 'text-neutral-400'
                                      }`}
                                    >
                                      {step}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Item list details */}
                          <div className="px-6 py-5 space-y-4">
                            {order.items.map((item) => {
                              // Truncate name if it looks like a hash or numbers
                              const cleanName = item.name.length > 30 && /^\d+/.test(item.name)
                                ? `Bespoke Creation (Ref: ${item.name.slice(0, 10)}...)`
                                : item.name;

                              return (
                                <div key={item.id} className="flex flex-col md:flex-row gap-5 items-start justify-between">
                                  <div className="flex gap-4 items-start flex-1 min-w-0">
                                    <div className="w-12 h-12 rounded-lg bg-neutral-50 overflow-hidden flex-shrink-0 border border-neutral-100 shadow-sm">
                                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="space-y-1.5 flex-1 min-w-0">
                                      <p className="text-sm text-neutral-900 font-bold truncate tracking-wide" title={item.name}>
                                        {cleanName}
                                      </p>
                                      <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                                        <span className="text-neutral-700 font-medium">₹{item.price.toLocaleString('en-IN')}</span>
                                        <span>&bull;</span>
                                        <span>Quantity: {item.quantity}</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Custom Personalization details styled like a physical luxury card */}
                                  {(item.custom_text || item.custom_color || item.custom_font) && (
                                    <div className="w-full md:w-96 bg-[#FAF8F4] border border-gold/15 rounded-lg p-3.5 space-y-1.5 shadow-inner">
                                      <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-gold uppercase tracking-widest pb-1 border-b border-gold/5">
                                        <Sparkles size={10} /> Custom Engraving Specifications
                                      </div>
                                      
                                      {item.custom_text && (
                                        <div className="text-xs font-mono text-neutral-500">
                                          Inscription: <span className="text-neutral-900 font-serif italic text-sm font-semibold">&quot;{item.custom_text}&quot;</span>
                                        </div>
                                      )}
                                      
                                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-0.5">
                                        {item.custom_color && (
                                          <div className="text-xs font-mono text-neutral-500 flex items-center gap-1.5">
                                            <span>Tone:</span>
                                            <span className="w-2.5 h-2.5 rounded-full border border-neutral-300" style={{ backgroundColor: item.custom_color }} />
                                            <span className="text-neutral-800 font-medium">{item.custom_color}</span>
                                          </div>
                                        )}
                                        {item.custom_font && (
                                          <div className="text-xs font-mono text-neutral-500">
                                            Font style: <span className="text-neutral-800 font-semibold">{item.custom_font}</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {/* Order Footer summary info */}
                          <div className="bg-neutral-50/40 border-t border-neutral-100 px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-neutral-500 min-w-0">
                              <span className="truncate">Destination: <span className="text-neutral-800 font-semibold">{order.shipping_address}</span></span>
                              
                              {order.shipping_carrier && (
                                <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded">
                                  <Truck size={10} /> {order.shipping_carrier} &bull; {order.tracking_number}
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-center justify-between sm:justify-end gap-3 flex-shrink-0">
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => handlePrintInvoice(order)} 
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 bg-white text-neutral-600 hover:text-neutral-900 hover:border-neutral-300 text-xs font-mono font-bold transition-all shadow-sm active:scale-95"
                                >
                                  <Printer size={12} /> Invoice
                                </button>
                                <button 
                                  onClick={() => { 
                                    setTrackingOrder(order.id); 
                                    setCarrierInput(order.shipping_carrier || ''); 
                                    setTrackingNumInput(order.tracking_number || ''); 
                                  }} 
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 bg-white text-neutral-600 hover:text-gold hover:border-gold/40 text-xs font-mono font-bold transition-all shadow-sm active:scale-95"
                                >
                                  <Truck size={12} /> Tracking
                                </button>
                              </div>
                              <span className="h-5 w-[1px] bg-neutral-200" />
                              <span className="text-sm font-mono font-bold text-neutral-800 pl-1">
                                {order.payment_method} &bull; ₹{order.total_price.toLocaleString('en-IN')}
                              </span>
                            </div>
                          </div>

                          {/* Dynamic tracking submission drawer */}
                          {trackingOrder === order.id && (
                            <div className="px-6 py-4.5 bg-gold/5 border-t border-gold/10 flex flex-col md:flex-row gap-4 items-end">
                              <div className="flex-1 w-full space-y-1.5">
                                <label className="text-[10px] font-mono font-bold text-gold uppercase tracking-widest">Shipping Logistics Carrier</label>
                                <input 
                                  type="text" 
                                  placeholder="e.g. DTDC, Blue Dart, FedEx" 
                                  value={carrierInput} 
                                  onChange={(e) => setCarrierInput(e.target.value)} 
                                  className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-sm text-neutral-700 focus:outline-none focus:border-gold font-mono placeholder-neutral-400 shadow-sm" 
                                />
                              </div>
                              <div className="flex-1 w-full space-y-1.5">
                                <label className="text-[10px] font-mono font-bold text-gold uppercase tracking-widest">Waybill / tracking code</label>
                                <input 
                                  type="text" 
                                  placeholder="AWB / Tracking Number" 
                                  value={trackingNumInput} 
                                  onChange={(e) => setTrackingNumInput(e.target.value)} 
                                  className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-sm text-neutral-700 focus:outline-none focus:border-gold font-mono placeholder-neutral-400 shadow-sm" 
                                />
                              </div>
                              <div className="flex gap-2 w-full md:w-auto justify-end">
                                <button onClick={() => setTrackingOrder(null)} className="px-3 py-2 text-xs font-mono text-neutral-500 hover:text-neutral-800 transition-colors">Cancel</button>
                                <button onClick={() => handleSaveTracking(order.id)} className="px-4 py-2 rounded-lg bg-gold text-black text-xs font-mono font-bold hover:bg-gold-600 transition-all shadow-md shadow-gold/10">Save Logistics</button>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                    
                    {/* Pagination Controls */}
                    {orderTotalPages > 1 && (
                      <div className="flex items-center justify-between bg-white border border-neutral-200/80 rounded-xl px-6 py-4 shadow-sm mt-4">
                        <button
                          onClick={() => setOrderCurrentPage(p => Math.max(1, p - 1))}
                          disabled={orderCurrentPage === 1}
                          className="px-4 py-2 rounded-lg border border-neutral-200 bg-white text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-mono font-bold transition-all"
                        >
                          &larr; Previous
                        </button>
                        <span className="text-xs font-mono text-neutral-500">
                          Page <span className="font-bold text-neutral-900">{orderCurrentPage}</span> of {orderTotalPages}
                        </span>
                        <button
                          onClick={() => setOrderCurrentPage(p => Math.min(orderTotalPages, p + 1))}
                          disabled={orderCurrentPage === orderTotalPages}
                          className="px-4 py-2 rounded-lg border border-neutral-200 bg-white text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-mono font-bold transition-all"
                        >
                          Next &rarr;
                        </button>
                      </div>
                    )}
                    </>
                  )}
                </motion.div>
              )}

              {activeTab === 'products' && (
                <motion.div key="products" variants={tabVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3, ease: 'easeOut' }} className="space-y-5">
                  
                  {/* Catalog Header section */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gold/10 border border-gold/25 flex items-center justify-center shadow-inner">
                        <Package size={16} className="text-gold" />
                      </div>
                      <div>
                        <h3 className="text-sm font-mono font-bold text-neutral-400 uppercase tracking-widest">Product Catalog</h3>
                        <p className="text-xs font-mono text-neutral-500 mt-0.5">{products.length} registered styles &middot; {dynamicCategories.length} categories</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowAddProduct(!showAddProduct)} 
                      className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-lg bg-black text-white hover:bg-gold hover:text-black text-xs font-mono font-bold transition-all duration-300 shadow-lg hover:shadow-gold/15 active:scale-95"
                    >
                      <Plus size={14} /> New Design Entry
                    </button>
                  </div>

                  {/* Add Product drawer form */}
                  {showAddProduct && (
                    <form onSubmit={handleCreateProduct} className="bg-white border border-neutral-200/80 rounded-xl p-6.5 space-y-5 shadow-md">
                      <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                        <h4 className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest">New Catalog Entry Form</h4>
                        <button type="button" onClick={() => setShowAddProduct(false)} className="text-neutral-400 hover:text-neutral-700"><X size={15} /></button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="space-y-1.5">
                          <label className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest">Name *</label>
                          <input type="text" required value={prodName} onChange={(e) => setProdName(e.target.value)} placeholder="e.g. Fine Walnut Stationery Case" className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3.5 py-2 text-sm text-neutral-700 focus:outline-none focus:border-gold font-mono placeholder-neutral-400 shadow-sm" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest">Price in ₹ *</label>
                          <input type="number" required value={prodPrice} onChange={(e) => setProdPrice(Number(e.target.value))} className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3.5 py-2 text-sm text-neutral-700 focus:outline-none focus:border-gold font-mono shadow-sm" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest">Category</label>
                          <select value={prodCategory} onChange={(e) => setProdCategory(e.target.value)} className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3.5 py-2 text-sm text-neutral-700 focus:outline-none focus:border-gold font-mono shadow-sm cursor-pointer">
                            {dynamicCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            <option value="NEW_CATEGORY_TRIGGER">+ Define New Category...</option>
                          </select>
                          {prodCategory === 'NEW_CATEGORY_TRIGGER' && (
                            <input type="text" required value={customCategoryInput} onChange={(e) => setCustomCategoryInput(e.target.value)} placeholder="Custom category name" className="w-full bg-white border border-gold/40 rounded-lg px-3 py-2 text-sm text-neutral-700 focus:outline-none focus:border-gold font-mono mt-2 shadow-sm" />
                          )}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest">Artisan Description</label>
                        <textarea rows={2} required value={prodDesc} onChange={(e) => setProdDesc(e.target.value)} placeholder="Describe the materials, craftsmanship details, sizing..." className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3.5 py-2.5 text-sm text-neutral-700 focus:outline-none focus:border-gold font-mono placeholder-neutral-400 resize-none shadow-sm" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest">Image Artwork URL</label>
                          <div className="flex gap-2">
                            <input type="text" value={prodImg} onChange={(e) => setProdImg(e.target.value)} placeholder="https://images.unsplash.com/..." className="flex-1 bg-neutral-50 border border-neutral-200 rounded-lg px-3.5 py-2 text-sm text-neutral-700 focus:outline-none focus:border-gold font-mono placeholder-neutral-400 shadow-sm" />
                            <label className="px-3.5 py-2 rounded-lg border border-neutral-200 bg-white text-neutral-500 hover:text-neutral-800 text-xs font-mono font-bold cursor-pointer hover:border-neutral-300 transition-all flex items-center shadow-sm select-none">
                              <span>{isUploading ? 'Uploading...' : 'Browse file'}</span>
                              <input type="file" accept="image/*" disabled={isUploading} onChange={handleProdImageUpload} className="hidden" />
                            </label>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 pt-4.5">
                          <input type="checkbox" id="prodCustom" checked={prodCustom} onChange={(e) => setProdCustom(e.target.checked)} className="rounded bg-white border-neutral-300 text-gold focus:ring-gold w-4 h-4 cursor-pointer" />
                          <label htmlFor="prodCustom" className="text-sm font-mono text-neutral-600 cursor-pointer select-none">Enable Custom Laser Engraving canvas</label>
                        </div>
                      </div>

                      <div className="flex gap-3 justify-end pt-3.5 border-t border-neutral-100">
                        <button type="button" onClick={() => setShowAddProduct(false)} className="px-4 py-2 rounded-lg border border-neutral-200 bg-white text-neutral-600 hover:text-neutral-800 text-xs font-mono transition-all shadow-sm">Cancel</button>
                        <button type="submit" className="px-5 py-2 rounded-lg bg-black text-white hover:bg-gold hover:text-black text-xs font-mono font-bold transition-all shadow-md">Create Catalog Item</button>
                      </div>
                    </form>
                  )}

                  {/* Search Bar for products */}
                  <div className="flex items-center gap-3 bg-white border border-neutral-200/80 rounded-xl p-4.5 shadow-sm">
                    <div className="relative flex-1 max-w-md">
                      <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input 
                        type="text" 
                        placeholder="Search products by title, category, keywords..." 
                        value={productSearch} 
                        onChange={(e) => setProductSearch(e.target.value)} 
                        className="w-full bg-neutral-50/60 border border-neutral-200/80 rounded-lg px-3.5 py-2.5 pl-10 text-sm text-neutral-700 placeholder-neutral-400 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 font-mono transition-all duration-200" 
                      />
                      {productSearch && (
                        <button onClick={() => setProductSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"><X size={14} /></button>
                      )}
                    </div>
                    <span className="text-xs font-mono text-neutral-400 ml-auto">
                      Showing {filteredProducts.length} of {products.length} catalog items
                    </span>
                  </div>

                  {/* Products Catalog Table layout */}
                  <div className="bg-white border border-neutral-200/80 rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm border-collapse">
                        <thead>
                          <tr className="bg-neutral-50/60 border-b border-neutral-200/80 text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest">
                            <th className="px-6 py-4 w-18">Asset</th>
                            <th className="px-6 py-4">Bespoke Design</th>
                            <th className="px-6 py-4">Category Badge</th>
                            <th className="px-6 py-4">Base Price</th>
                            <th className="px-6 py-4">Laser Engraving</th>
                            <th className="px-6 py-4 text-right pr-7">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 text-neutral-700">
                          {filteredProducts.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="px-6 py-20 text-center">
                                <div className="w-12 h-12 mx-auto mb-3.5 rounded-full bg-neutral-50 border border-neutral-200 flex items-center justify-center shadow-inner">
                                  <Package size={22} className="text-neutral-300" />
                                </div>
                                <p className="text-neutral-800 text-base font-medium">No catalog items match</p>
                                <p className="text-neutral-400 text-xs font-mono">
                                  {productSearch ? 'Try clearing or modifying the search keyword.' : 'Define your first product entry to launch catalog.'}
                                </p>
                              </td>
                            </tr>
                          ) : (
                            filteredProducts.map((p, idx) => (
                              <motion.tr 
                                key={p.id}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.02, duration: 0.2 }}
                                className="hover:bg-neutral-50/40 transition-colors group"
                              >
                                <td className="px-6 py-3.5">
                                  <img src={p.image_url} className="w-11 h-11 object-cover rounded-lg bg-neutral-50 border border-neutral-200 shadow-sm" />
                                </td>
                                <td className="px-6 py-3.5">
                                  <p className="text-neutral-900 font-bold text-sm tracking-wide">{p.name}</p>
                                  <p className="text-xs font-mono text-neutral-400 mt-0.5">Reference ID: {p.id.slice(0, 8)}</p>
                                </td>
                                <td className="px-6 py-3.5">
                                  <span className="inline-block px-2.5 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-600 text-xs font-mono font-semibold">
                                    {p.category}
                                  </span>
                                </td>
                                <td className="px-6 py-3.5 text-neutral-900 font-mono font-bold">
                                  ₹{p.price.toLocaleString('en-IN')}
                                </td>
                                <td className="px-6 py-3.5">
                                  {p.customizable ? (
                                    <span className="text-xs font-mono font-bold text-gold bg-gold/10 border border-gold/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                      Supported
                                    </span>
                                  ) : (
                                    <span className="text-xs font-mono text-neutral-400 bg-neutral-50 border border-neutral-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                      Disabled
                                    </span>
                                  )}
                                </td>
                                <td className="px-6 py-3.5 text-right pr-7">
                                  <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <button 
                                      onClick={() => setEditingProduct(p)} 
                                      className="p-1.5 rounded-lg border border-neutral-200 hover:border-gold/30 hover:bg-gold/5 text-neutral-400 hover:text-gold transition-all" 
                                      title="Edit Product Details"
                                    >
                                      <Edit2 size={14} />
                                    </button>
                                    <button 
                                      onClick={() => handleDeleteProduct(p.id)} 
                                      className="p-1.5 rounded-lg border border-neutral-200 hover:border-red-200 hover:bg-red-50 text-neutral-400 hover:text-red-500 transition-all" 
                                      title="Delete Product"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </td>
                              </motion.tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'announcements' && (
                <motion.div key="announcements" variants={tabVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3, ease: 'easeOut' }} className="grid grid-cols-12 gap-6">
                  
                  {/* Create campaign column */}
                  <div className="col-span-12 md:col-span-5 bg-white border border-neutral-200/80 rounded-xl p-6.5 space-y-4.5 h-fit shadow-sm">
                    <h4 className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest border-b border-neutral-100 pb-3 flex items-center gap-2">
                      <Volume2 size={16} className="text-gold" /> Add Marketing Banner Campaign
                    </h4>
                    
                    <form onSubmit={handleCreateAnnouncement} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest">Campaign Title *</label>
                        <input type="text" required value={annTitle} onChange={(e) => setAnnTitle(e.target.value)} placeholder="e.g. Free Gift Wrapping on bracelets" className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3.5 py-2 text-sm text-neutral-700 focus:outline-none focus:border-gold font-mono placeholder-neutral-400 shadow-sm" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest">Detail Description</label>
                        <textarea rows={3} value={annDesc} onChange={(e) => setAnnDesc(e.target.value)} placeholder="e.g. Enjoy complimentary gold wax-sealed wrapping. Use code BRACELETGOLD at checkout." className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3.5 py-2.5 text-sm text-neutral-700 focus:outline-none focus:border-gold font-mono placeholder-neutral-400 resize-none shadow-sm" />
                      </div>
                      <button type="submit" className="w-full py-3 rounded-lg bg-black text-white hover:bg-gold hover:text-black text-xs font-mono font-bold transition-all duration-300 shadow-lg active:scale-98">
                        Launch Banner Campaign
                      </button>
                    </form>
                  </div>
                  
                  {/* Banners display column */}
                  <div className="col-span-12 md:col-span-7 space-y-4">
                    <h3 className="text-sm font-mono font-bold text-neutral-400 uppercase tracking-widest">Active Campaigns ({announcements.length})</h3>
                    
                    {announcements.length === 0 ? (
                      <div className="bg-white border border-neutral-200/80 rounded-xl p-20 text-center shadow-sm">
                        <p className="text-neutral-400 text-sm font-mono">No active announcements campaigns found.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {announcements.map((ann) => (
                          <div key={ann.id} className="bg-white border border-neutral-200/80 rounded-xl p-5.5 flex items-start justify-between gap-5 shadow-sm hover:shadow transition-all duration-300 relative group">
                            {/* Gold bar design indicator */}
                            <div className="absolute top-0 bottom-0 left-0 w-[3px] bg-gold" />
                            
                            <div className="space-y-1.5 pl-2">
                              <h4 className="text-sm text-neutral-900 font-bold tracking-wide">{ann.title}</h4>
                              <p className="text-sm text-neutral-500 leading-relaxed">{ann.description}</p>
                              <span className="text-xs font-mono text-neutral-400 block pt-1.5">Published: {new Date(ann.created_at).toLocaleString('en-IN')}</span>
                            </div>
                            <button 
                              onClick={() => handleDeleteAnnouncement(ann.id)} 
                              className="p-1.5 rounded-lg border border-neutral-100 hover:border-red-200 bg-neutral-50 hover:bg-red-50 text-neutral-400 hover:text-red-500 transition-colors flex-shrink-0"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'popups' && (
                <motion.div key="popups" variants={tabVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3, ease: 'easeOut' }} className="grid grid-cols-12 gap-6">
                  
                  {/* Create popup column */}
                  <div className="col-span-12 md:col-span-5 bg-white border border-neutral-200/80 rounded-xl p-6.5 space-y-4.5 h-fit shadow-sm">
                    <h4 className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest border-b border-neutral-100 pb-3 flex items-center gap-2">
                      <Eye size={16} className="text-gold" /> New Popup Offer
                    </h4>
                    
                    <form onSubmit={handleCreatePopupOffer} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest">Offer Title *</label>
                        <input type="text" required value={popTitle} onChange={(e) => setPopTitle(e.target.value)} placeholder="e.g. Diwali Special: 20% Off" className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3.5 py-2 text-sm text-neutral-700 focus:outline-none focus:border-gold font-mono placeholder-neutral-400 shadow-sm" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest">Description</label>
                        <textarea rows={3} value={popDesc} onChange={(e) => setPopDesc(e.target.value)} placeholder="Describe the offer details..." className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3.5 py-2.5 text-sm text-neutral-700 focus:outline-none focus:border-gold font-mono placeholder-neutral-400 resize-none shadow-sm" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest">Banner Image</label>
                        <div className="flex gap-2">
                          <input type="text" value={popImg} onChange={(e) => setPopImg(e.target.value)} placeholder="Image URL or click Browse" className="flex-1 bg-neutral-50 border border-neutral-200 rounded-lg px-3.5 py-2 text-sm text-neutral-700 focus:outline-none focus:border-gold font-mono placeholder-neutral-400 shadow-sm" />
                          <label className="px-3.5 py-2 rounded-lg border border-neutral-200 bg-white text-neutral-500 hover:text-neutral-800 text-xs font-mono font-bold cursor-pointer hover:border-neutral-300 transition-all flex items-center shadow-sm select-none">
                            <span>{popUploading ? 'Uploading...' : 'Browse'}</span>
                            <input type="file" accept="image/*" disabled={popUploading} onChange={handlePopupImageUpload} className="hidden" />
                          </label>
                        </div>
                        {popImg && (
                          <div className="mt-2 rounded-lg overflow-hidden border border-neutral-200 h-32 bg-neutral-50">
                            <img src={popImg} alt="Preview" className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3 pt-1">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked={popActive} onChange={(e) => setPopActive(e.target.checked)} className="sr-only peer" />
                          <div className="w-9 h-5 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gold"></div>
                        </label>
                        <span className="text-xs font-mono text-neutral-600 font-semibold">Active on publish</span>
                      </div>
                      <button type="submit" className="w-full py-3 rounded-lg bg-black text-white hover:bg-gold hover:text-black text-xs font-mono font-bold transition-all duration-300 shadow-lg active:scale-98">
                        Launch Popup Offer
                      </button>
                    </form>
                  </div>
                  
                  {/* Popup offers list column */}
                  <div className="col-span-12 md:col-span-7 space-y-4">
                    <h3 className="text-sm font-mono font-bold text-neutral-400 uppercase tracking-widest">All Popup Offers ({popupOffers.length})</h3>
                    
                    {popupOffers.length === 0 ? (
                      <div className="bg-white border border-neutral-200/80 rounded-xl p-20 text-center shadow-sm">
                        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-neutral-50 border border-neutral-200 flex items-center justify-center shadow-inner">
                          <Eye size={24} className="text-neutral-300" />
                        </div>
                        <p className="text-neutral-400 text-sm font-mono">No popup offers created yet.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {popupOffers.map((offer) => (
                          <div key={offer.id} className="bg-white border border-neutral-200/80 rounded-xl overflow-hidden shadow-sm hover:shadow transition-all duration-300 relative group">
                            <div className={`absolute top-0 bottom-0 left-0 w-[3px] ${offer.active ? 'bg-gold' : 'bg-neutral-300'}`} />
                            
                            <div className="flex flex-col sm:flex-row gap-4 p-5.5 pl-6">
                              {offer.image_url && (
                                <div className="w-full sm:w-28 h-24 rounded-lg overflow-hidden bg-neutral-50 border border-neutral-200 flex-shrink-0">
                                  <img src={offer.image_url} alt={offer.title} className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                </div>
                              )}
                              <div className="flex-1 min-w-0 space-y-1.5">
                                <div className="flex items-center gap-2">
                                  <h4 className="text-sm text-neutral-900 font-bold tracking-wide">{offer.title}</h4>
                                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                    offer.active
                                      ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                                      : 'text-neutral-400 bg-neutral-50 border border-neutral-200'
                                  }`}>
                                    {offer.active ? 'Active' : 'Inactive'}
                                  </span>
                                </div>
                                {offer.description && (
                                  <p className="text-sm text-neutral-500 leading-relaxed line-clamp-2">{offer.description}</p>
                                )}
                                <span className="text-xs font-mono text-neutral-400 block pt-1">
                                  Created: {new Date(offer.created_at).toLocaleString('en-IN')}
                                </span>
                              </div>
                              <div className="flex items-start gap-1.5 flex-shrink-0">
                                <button
                                  onClick={() => handleTogglePopupActive(offer)}
                                  className={`p-1.5 rounded-lg border transition-all ${
                                    offer.active
                                      ? 'border-neutral-200 hover:border-amber-200 hover:bg-amber-50 text-neutral-400 hover:text-amber-500'
                                      : 'border-neutral-200 hover:border-emerald-200 hover:bg-emerald-50 text-neutral-400 hover:text-emerald-500'
                                  }`}
                                  title={offer.active ? 'Deactivate' : 'Activate'}
                                >
                                  {offer.active ? <Eye size={14} /> : <Eye size={14} />}
                                </button>
                                <button
                                  onClick={() => handleDeletePopupOffer(offer.id)}
                                  className="p-1.5 rounded-lg border border-neutral-200 hover:border-red-200 hover:bg-red-50 text-neutral-400 hover:text-red-500 transition-all"
                                  title="Delete"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'homepage' && (
                <motion.div key="homepage" variants={tabVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3, ease: 'easeOut' }} className="space-y-8">
                  
                  {/* Bestsellers management section */}
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-sm font-mono font-bold text-neutral-400 uppercase tracking-widest">Bestseller Curations</h3>
                        <p className="text-xs font-mono text-neutral-500 mt-0.5">Select up to 4 custom products to prioritize for the store's primary showcases.</p>
                      </div>
                      <span className="text-xs font-mono text-gold bg-gold/10 border border-gold/20 px-3 py-1 rounded-full font-bold select-none">
                        {bestsellerIds.length} of 4 featured
                      </span>
                    </div>

                    {/* Checkbox grid selector */}
                    <div className="bg-white border border-neutral-200/80 rounded-xl p-5 shadow-sm">
                      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                        {products.map((product) => {
                          const isSelected = bestsellerIds.includes(product.id);
                          return (
                            <button
                              key={product.id}
                              onClick={() => toggleBestseller(product.id)}
                              className={`relative rounded-lg border text-left transition-all duration-300 overflow-hidden flex flex-col group ${
                                isSelected 
                                  ? 'border-gold/50 bg-gold/5 ring-1 ring-gold/25' 
                                  : 'border-neutral-200 bg-white hover:border-gold/30 hover:bg-neutral-50/30'
                              }`}
                            >
                              <div className="aspect-square bg-neutral-50 overflow-hidden border-b border-neutral-100">
                                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                              </div>
                              <div className="p-2 flex-1 flex flex-col justify-between">
                                <p className="text-xs font-bold text-neutral-700 truncate leading-tight">{product.name}</p>
                                <p className="text-xs font-mono text-neutral-400 mt-1 font-semibold">₹{product.price}</p>
                              </div>
                              {isSelected && (
                                <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-gold flex items-center justify-center shadow-md">
                                  <Check size={10} className="text-black stroke-[3.5]" />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Custom priority sorter */}
                    {bestsellerProducts.length > 0 && (
                      <div className="bg-white border border-neutral-200/80 rounded-xl overflow-hidden shadow-sm mt-4.5">
                        <div className="px-5 py-3 bg-neutral-50 border-b border-neutral-200/80">
                          <span className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest">Display Priority Sequence</span>
                        </div>
                        <div className="divide-y divide-neutral-100">
                          {bestsellerProducts.map((product, index) => (
                            <div key={product.id} className="flex items-center gap-4 px-5 py-3 hover:bg-neutral-50/30 transition-colors">
                              <div className="flex flex-col gap-0.5">
                                <button onClick={() => moveBestseller(index, 'up')} disabled={index === 0} className="text-neutral-400 hover:text-neutral-800 disabled:text-neutral-200 disabled:cursor-not-allowed transition-colors"><ArrowUp size={14} /></button>
                                <button onClick={() => moveBestseller(index, 'down')} disabled={index === bestsellerProducts.length - 1} className="text-neutral-400 hover:text-neutral-800 disabled:text-neutral-200 disabled:cursor-not-allowed transition-colors"><ArrowDown size={14} /></button>
                              </div>
                              <GripVertical size={14} className="text-neutral-300 flex-shrink-0" />
                              <div className="w-10 h-10 rounded bg-neutral-50 overflow-hidden flex-shrink-0 border border-neutral-200"><img src={product.image_url} className="w-full h-full object-cover" /></div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-neutral-900 font-bold truncate tracking-wide">{product.name}</p>
                                <p className="text-xs font-mono text-neutral-400 mt-0.5">₹{product.price} &middot; {product.category}</p>
                              </div>
                              <span className="text-xs font-mono text-gold bg-gold/10 border border-gold/20 px-2 py-0.5 rounded font-bold">Priority #{index + 1}</span>
                              <button onClick={() => toggleBestseller(product.id)} className="p-1.5 rounded-lg border border-transparent hover:border-neutral-200 text-neutral-400 hover:text-red-500 transition-all"><X size={14} /></button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Homepage Collections banner manager */}
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-sm font-mono font-bold text-neutral-400 uppercase tracking-widest">Explore Collection Cards</h3>
                        <p className="text-xs font-mono text-neutral-500 mt-0.5">Customize visual tags, counts and details for the front page's navigation boxes.</p>
                      </div>
                      <button onClick={addCollection} className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-lg bg-black text-white hover:bg-gold hover:text-black text-xs font-mono font-bold transition-all shadow-md active:scale-95"><Plus size={14} /> Add Card</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {collections.map((col, index) => (
                        <div key={index} className="bg-white border border-neutral-200/80 rounded-xl p-5.5 space-y-4 shadow-sm hover:shadow transition-shadow duration-300 relative group">
                          <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                            <span className="text-xs font-mono text-gold bg-gold/10 px-2 py-0.5 rounded font-bold">Collection Card #{index + 1}</span>
                            <div className="flex items-center gap-1">
                              <button onClick={() => moveCollection(index, 'up')} disabled={index === 0} className="p-1 rounded text-neutral-400 hover:text-neutral-700 disabled:text-neutral-200 disabled:cursor-not-allowed transition-colors"><ArrowUp size={14} /></button>
                              <button onClick={() => moveCollection(index, 'down')} disabled={index === collections.length - 1} className="p-1 rounded text-neutral-400 hover:text-neutral-700 disabled:text-neutral-200 disabled:cursor-not-allowed transition-colors"><ArrowDown size={14} /></button>
                              <span className="w-1.5 h-3 border-r border-neutral-200 mx-1" />
                              <button onClick={() => deleteCollection(index)} className="p-1 rounded text-neutral-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                            </div>
                          </div>

                          <div className="flex gap-4">
                            <div className="w-18 h-18 rounded-lg bg-neutral-50 overflow-hidden flex-shrink-0 border border-neutral-200 shadow-sm relative">
                              <img src={col.img} alt={col.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 space-y-2">
                              <div className="space-y-1">
                                <label className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">Headline Title</label>
                                <input
                                  type="text"
                                  value={col.name}
                                  onChange={(e) => updateCollection(index, 'name', e.target.value)}
                                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-1.5 text-sm text-neutral-800 focus:outline-none focus:border-gold font-mono shadow-sm"
                                  placeholder="Headline Title"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">Subtitle Details</label>
                                <input
                                  type="text"
                                  value={col.count}
                                  onChange={(e) => updateCollection(index, 'count', e.target.value)}
                                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs text-neutral-500 focus:outline-none focus:border-gold font-mono shadow-sm"
                                  placeholder="e.g. 5 items"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">Background Image URL</label>
                                <input
                                  type="text"
                                  value={col.img}
                                  onChange={(e) => updateCollection(index, 'img', e.target.value)}
                                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs text-neutral-400 focus:outline-none focus:border-gold font-mono placeholder-neutral-400 shadow-sm"
                                  placeholder="Image URL link"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Retractable System Terminal console */}
          {showActivityLog && (
            <div className="border-t border-neutral-800 bg-neutral-950 text-neutral-300 relative z-30 shadow-2xl">
              <div className="flex items-center justify-between px-6 py-2.5 border-b border-neutral-900 bg-neutral-900">
                <div className="flex items-center gap-2">
                  <Terminal size={12} className="text-gold" />
                  <span className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest">Bespoke Studio Terminal Monitor</span>
                </div>
                <button onClick={() => setShowActivityLog(false)} className="text-neutral-500 hover:text-neutral-300 transition-colors p-1 hover:bg-neutral-800 rounded">
                  <Minimize2 size={13} />
                </button>
              </div>
              
              <div className="h-44 overflow-y-auto p-4 space-y-1 font-mono text-xs leading-relaxed">
                {activeLogEntries.length === 0 ? (
                  <span className="text-neutral-500">Terminal buffer is empty.</span>
                ) : (
                  activeLogEntries.map((entry) => (
                    <div key={entry.id} className="console-log-entry flex items-start gap-3 hover:bg-neutral-900/45 px-1 rounded transition-colors duration-150">
                      <span className="text-neutral-600 flex-shrink-0 select-none">
                        [{entry.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}]
                      </span>
                      <span className={logColors[entry.type] || 'text-neutral-400'}>
                        {entry.type === 'system' && '$ systemctl_hook: '}
                        {entry.type === 'success' && '[SUCCESS] '}
                        {entry.type === 'warning' && '[WARN] '}
                        {entry.type === 'error' && '[ERROR] '}
                        {entry.type === 'info' && '[INFO] '}
                        {entry.message}
                      </span>
                    </div>
                  ))
                )}
                <div ref={logEndRef} />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white border border-neutral-200 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest">Update Catalog Asset</h3>
              <button onClick={() => setEditingProduct(null)} className="p-1 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors"><X size={15} /></button>
            </div>
            
            <form onSubmit={handleUpdateProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest">Name *</label>
                  <input type="text" required value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-700 focus:outline-none focus:border-gold font-mono" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest">Price in ₹ *</label>
                  <input type="number" required value={editPrice} onChange={(e) => setEditPrice(Number(e.target.value))} className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-700 focus:outline-none focus:border-gold font-mono" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest">Category</label>
                  <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)} className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-700 focus:outline-none focus:border-gold font-mono cursor-pointer">
                    {dynamicCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    <option value="NEW_CATEGORY_TRIGGER">+ Define New Category...</option>
                  </select>
                  {editCategory === 'NEW_CATEGORY_TRIGGER' && (
                    <input type="text" required value={editCustomCategoryInput} onChange={(e) => setEditCustomCategoryInput(e.target.value)} placeholder="Custom category name" className="w-full bg-white border border-gold/40 rounded-lg px-3 py-2 text-sm text-neutral-700 focus:outline-none focus:border-gold font-mono mt-2" />
                  )}
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest">Artisan Description</label>
                <textarea rows={2} required value={editDesc} onChange={(e) => setEditDesc(e.target.value)} className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2.5 text-sm text-neutral-700 focus:outline-none focus:border-gold font-mono resize-none" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest">Image Artwork URL</label>
                  <div className="flex gap-2">
                    <input type="text" value={editImg} onChange={(e) => setEditImg(e.target.value)} placeholder="URL link or upload..." className="flex-1 bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-700 focus:outline-none focus:border-gold font-mono placeholder-neutral-400" />
                    <label className="px-3 py-2 rounded-lg border border-neutral-200 bg-white text-neutral-500 hover:text-neutral-800 text-xs font-mono font-bold cursor-pointer hover:border-neutral-300 transition-all flex items-center shadow-sm select-none">
                      <span>{isUploading ? 'Uploading...' : 'Browse file'}</span>
                      <input type="file" accept="image/*" disabled={isUploading} onChange={handleEditImageUpload} className="hidden" />
                    </label>
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-4.5">
                  <input type="checkbox" id="editCustom" checked={editCustom} onChange={(e) => setEditCustom(e.target.checked)} className="rounded bg-white border-neutral-300 text-gold focus:ring-gold w-4 h-4 cursor-pointer" />
                  <label htmlFor="editCustom" className="text-sm font-mono text-neutral-600 cursor-pointer select-none">Enable Custom Laser Engraving canvas</label>
                </div>
              </div>
              
              <div className="flex gap-3 justify-end pt-3.5 border-t border-neutral-100">
                <button type="button" onClick={() => setEditingProduct(null)} className="px-4 py-2 rounded-lg border border-neutral-200 bg-white text-neutral-600 hover:text-neutral-800 text-xs font-mono transition-all shadow-sm">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-lg bg-black text-white hover:bg-gold hover:text-black text-xs font-mono font-bold transition-all shadow-md">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

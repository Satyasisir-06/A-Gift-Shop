"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, ShoppingBag, User, LogOut, ArrowRight, Trash2, Search, Sparkles } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import { useAuth } from '@/lib/context/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';
import { DB, Product, CATEGORIES } from '@/lib/db';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { cart, cartCount, total, updateQuantity, removeFromCart } = useCart();
  const { user, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const dynamicCategories = Array.from(new Set([...CATEGORIES, ...products.map(p => p.category)]));

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') ||
        ((e.metaKey || e.ctrlKey) && e.key === 'k')
      ) {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isSearchOpen) {
      const fetchProducts = async () => {
        try {
          const prodData = await DB.getProducts();
          setProducts(prodData);
        } catch (err) {
          console.error("Failed to load products for search:", err);
        }
      };
      fetchProducts();
    }
  }, [isSearchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const filteredProducts = searchQuery
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'Our Work', href: '/our-work' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Trust Bar */}
      <div className="bg-[#0A0A0A] text-white text-[10px] uppercase tracking-[0.2em] py-2 text-center px-4 font-medium border-b border-gold/10 flex items-center justify-center gap-2 select-none">
        <span className="w-1.5 h-1.5 rounded-full bg-gold" />
        Complimentary engraving + premium gift wrap on all orders
      </div>

      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-lg border-b border-gray-200/60">
        <div className="section flex items-center justify-between h-[72px]">
          {/* Mobile Menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 -ml-2 text-gray-600 hover:text-black transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <img src="/logo.png" alt="A Gift Story Logo" className="h-[66px] w-[66px] rounded-full object-contain border border-gold/10 group-hover:scale-105 transition-transform" />
            <span className="font-heading text-lg font-bold tracking-[0.18em] uppercase text-black">
              A Gift<span className="text-gold group-hover:text-gold-600 transition-colors"> Story</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-xs uppercase tracking-[0.15em] font-semibold transition-colors py-1 ${
                    isActive ? 'text-gold' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="navActive"
                      className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gold rounded-full"
                    />
                  )}
                </Link>
              );
            })}
            {user?.role === 'admin' && (
              <Link
                href="/admin"
                className="text-xs uppercase tracking-[0.15em] font-bold text-gold hover:text-black transition-colors px-3 py-1.5 border border-gold/40 rounded-md bg-gold/5"
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-gray-500 hover:text-black relative transition-colors mr-1"
              aria-label="Search"
              title="Search Catalog (Press '/')"
            >
              <Search size={20} />
            </button>
            {user ? (
              <div className="hidden sm:flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="text-xs uppercase tracking-wider font-semibold text-gray-600 hover:text-black transition-colors"
                >
                  {user.name.split(' ')[0]}
                </Link>
                <button
                  onClick={logout}
                  className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="p-2 text-gray-500 hover:text-black transition-colors"
                title="Login"
              >
                <User size={20} />
              </Link>
            )}

            <button
              onClick={() => setCartDrawerOpen(true)}
              className="p-2 text-gray-500 hover:text-black relative transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-black text-gold text-[9px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center border border-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-x-0 top-[114px] z-30 bg-white border-b border-gray-200 shadow-xl py-6 px-6 flex flex-col gap-3"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm uppercase tracking-widest font-semibold text-gray-800 hover:text-gold py-2 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {user?.role === 'admin' && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm uppercase tracking-widest font-bold text-gold py-2"
              >
                Admin
              </Link>
            )}
            <div className="border-t border-gray-100 pt-4 mt-2 flex flex-col gap-3">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm uppercase tracking-widest font-semibold text-gray-800"
                  >
                    {user.name}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-sm uppercase tracking-widest font-semibold text-red-500 text-left"
                  >
                    <LogOut size={16} /> Log Out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm uppercase tracking-widest font-semibold text-gray-800"
                >
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {cartDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartDrawerOpen(false)}
              className="fixed inset-0 z-50 bg-black"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-[440px] bg-white z-50 shadow-2xl flex flex-col border-l border-gray-200"
            >
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={18} className="text-gold" />
                  <span className="font-heading font-semibold text-sm text-gray-900 uppercase tracking-widest">
                    Cart ({cartCount})
                  </span>
                </div>
                <button
                  onClick={() => setCartDrawerOpen(false)}
                  className="p-1 hover:bg-gray-50 rounded-full transition-colors"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <ShoppingBag size={40} className="text-gray-300" />
                    <p className="text-gray-400 text-sm font-medium">Your cart is empty</p>
                    <Link
                      href="/shop"
                      onClick={() => setCartDrawerOpen(false)}
                      className="btn btn-primary text-xs"
                    >
                      Browse Products
                    </Link>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex gap-3 p-3 border border-gray-100 rounded-lg hover:border-gray-200 transition-all">
                      <div className="w-[72px] h-[72px] bg-gray-50 rounded overflow-hidden flex-shrink-0">
                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-heading font-semibold text-sm text-gray-900 truncate mb-0.5">{item.name}</h4>
                        <p className="text-gold font-bold text-sm mb-2">₹{item.price.toLocaleString('en-IN')}</p>
                        {(item.custom_text || item.custom_color) && (
                          <div className="text-[10px] text-gray-500 bg-gray-50 rounded p-1.5 mb-2 space-y-0.5">
                            {item.custom_text && <div>"{item.custom_text}"</div>}
                            {item.custom_color && <div>Color: {item.custom_color}</div>}
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center border border-gray-200 rounded">
                            <button onClick={() => updateQuantity(item.id, Math.max(item.min_quantity || 1, item.quantity - 1))} className="px-2.5 py-1 text-gray-500 hover:text-black text-xs font-semibold transition-colors">-</button>
                            <span className="px-2.5 text-gray-800 text-xs font-semibold">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2.5 py-1 text-gray-500 hover:text-black text-xs font-semibold transition-colors">+</button>
                          </div>
                          <button onClick={() => removeFromCart(item.id)} className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="px-6 py-5 border-t border-gray-100 space-y-3">
                  <div className="flex items-center justify-between font-heading font-bold text-gray-900">
                    <span className="text-xs tracking-wider">TOTAL</span>
                    <span>₹{total.toLocaleString('en-IN')}</span>
                  </div>
                  <Link
                    href="/checkout"
                    onClick={() => setCartDrawerOpen(false)}
                    className="btn btn-gold w-full text-center text-xs"
                  >
                    Checkout <ArrowRight size={14} />
                  </Link>
                  <Link
                    href="/cart"
                    onClick={() => setCartDrawerOpen(false)}
                    className="btn btn-secondary w-full text-center text-xs"
                  >
                    View Cart
                  </Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Global Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSearchOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: -24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed inset-x-0 top-0 z-50 bg-white shadow-2xl border-b border-gray-200"
            >
              <div className="max-w-4xl mx-auto px-6 py-8 md:py-12 flex flex-col gap-6">
                <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                  <Search size={24} className="absolute left-0 text-gray-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search by product name, category, or engravings..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-xl sm:text-2xl font-heading font-medium tracking-wide placeholder-gray-400 bg-transparent border-b-2 border-gray-200 py-3 pl-10 pr-12 focus:outline-none focus:border-gold transition-all"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-10 p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-black cursor-pointer"
                    >
                      <X size={18} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="absolute right-0 p-1 text-gray-400 hover:text-black transition-colors cursor-pointer"
                    aria-label="Close search"
                  >
                    <X size={24} />
                  </button>
                </form>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 min-h-[250px] overflow-y-auto max-h-[60vh] pr-2">
                  {!searchQuery ? (
                    <>
                      <div className="md:col-span-1 space-y-4">
                        <h4 className="font-heading text-[10px] font-bold uppercase tracking-[0.2em] text-gold flex items-center gap-1.5">
                          <Sparkles size={12} /> Curated Categories
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {dynamicCategories.map((cat) => (
                            <button
                              key={cat}
                              onClick={() => {
                                router.push(`/shop?category=${encodeURIComponent(cat)}`);
                                setIsSearchOpen(false);
                              }}
                              className="text-[10px] uppercase font-bold tracking-wider py-2 px-3 border border-gray-200 rounded-md hover:border-gold hover:bg-gold/5 transition-all text-gray-700 hover:text-black cursor-pointer"
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="md:col-span-2 space-y-4">
                        <h4 className="font-heading text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                          Trending Creations
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {products.slice(0, 4).map((item) => (
                            <Link
                              key={item.id}
                              href={`/shop/${item.id}`}
                              onClick={() => setIsSearchOpen(false)}
                              className="flex items-center gap-3 p-2 rounded-xl border border-gray-100 hover:border-gold hover:shadow-sm transition-all bg-gray-50/50 hover:bg-white"
                            >
                              <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="min-w-0">
                                <h5 className="font-semibold text-xs text-gray-900 truncate">{item.name}</h5>
                                <span className="text-[10px] text-gold font-bold">₹{item.price.toLocaleString('en-IN')}</span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="md:col-span-3 space-y-4">
                      <div className="flex justify-between items-center text-gray-400">
                        <h4 className="font-heading text-[10px] font-bold uppercase tracking-[0.2em]">
                          Search Results ({filteredProducts.length})
                        </h4>
                        {filteredProducts.length > 0 && (
                          <span className="text-[9px] uppercase tracking-wider font-semibold">Press Enter to view all</span>
                        )}
                      </div>
                      {filteredProducts.length === 0 ? (
                        <div className="text-center py-12 space-y-2">
                          <p className="text-sm font-medium text-gray-400">No boutique products match your query.</p>
                          <span className="text-xs text-gray-400">Try looking for "bracelet", "pen", "mug", or "frame".</span>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {filteredProducts.slice(0, 5).map((item) => (
                            <Link
                              key={item.id}
                              href={`/shop/${item.id}`}
                              onClick={() => setIsSearchOpen(false)}
                              className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-gold hover:shadow-md transition-all bg-white hover:bg-gray-50/40 group"
                            >
                              <div className="flex items-center gap-4 min-w-0">
                                <div className="w-14 h-14 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="min-w-0">
                                  <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">{item.category}</span>
                                  <h5 className="font-heading font-semibold text-sm text-gray-900 group-hover:text-gold transition-colors truncate">{item.name}</h5>
                                  {item.customizable && (
                                    <span className="inline-flex text-[8px] uppercase tracking-wider font-extrabold text-gold bg-gold/10 px-1.5 py-0.5 rounded-sm mt-0.5">Personalized</span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-3 pl-3">
                                <span className="font-bold text-gray-900 text-sm">₹{item.price.toLocaleString('en-IN')}</span>
                                <ArrowRight size={14} className="text-gray-300 group-hover:text-gold group-hover:translate-x-1 transition-all" />
                              </div>
                            </Link>
                          ))}
                          {filteredProducts.length > 5 && (
                            <button
                              type="submit"
                              className="w-full py-3 text-center text-xs uppercase tracking-widest font-heading font-bold text-gold hover:text-black transition-colors border border-dashed border-gray-200 rounded-xl hover:border-gold hover:bg-gold/5 mt-3 flex items-center justify-center gap-2 cursor-pointer"
                            >
                              View all {filteredProducts.length} results <ArrowRight size={12} />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

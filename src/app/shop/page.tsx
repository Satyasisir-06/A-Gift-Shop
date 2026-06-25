"use client";

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, Star, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { DB, Product, CATEGORIES } from '@/lib/db';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<'popular' | 'price-low' | 'price-high'>('popular');
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const ITEMS_PER_PAGE = 6;
  const desktopSearchInputRef = useRef<HTMLInputElement>(null);

  const dynamicCategories = Array.from(new Set([...CATEGORIES, ...products.map(p => p.category)]));

  useEffect(() => {
    const handleShopKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' && 
        document.activeElement?.tagName !== 'INPUT' && 
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        desktopSearchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleShopKeyDown);
    return () => window.removeEventListener('keydown', handleShopKeyDown);
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const prodData = await DB.getProducts();
        setProducts(prodData);
      } catch (err) {
        console.error("Failed to load products:", err);
      }
    };
    loadProducts();
    
    const cat = searchParams.get('category');
    if (cat) {
      setSelectedCategory(cat);
    } else {
      setSelectedCategory(null);
    }

    const q = searchParams.get('search');
    if (q) {
      setSearchQuery(q);
    } else {
      setSearchQuery('');
    }
  }, [searchParams]);

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortOption === 'price-low') return a.price - b.price;
      if (sortOption === 'price-high') return b.price - a.price;
      return 0;
    });

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, sortOption]);

  const clearFilters = () => {
    setSelectedCategory(null);
    setSearchQuery('');
    router.push('/shop');
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-100 py-14 text-center">
        <div className="section">
          <span className="text-[10px] uppercase tracking-[0.2em] text-gold font-bold">Curated Catalog</span>
          <h1 className="font-heading text-3xl font-bold uppercase tracking-widest text-black mt-2">
            The Boutique
          </h1>
          <div className="divider-gold mx-auto mt-4" />
        </div>
      </div>

      <div className="section py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0 space-y-8">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-xs uppercase tracking-widest font-bold text-gray-900">Search</h3>
                <kbd className="text-[9px] font-mono text-gray-400 bg-gray-50 border border-gray-200 px-1.5 py-0.5 rounded font-normal">/</kbd>
              </div>
              <div className="relative flex items-center">
                <input
                  ref={desktopSearchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Bracelet, pen..."
                  className="w-full bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-lg py-2.5 pl-9 pr-9 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gold focus:bg-white focus:ring-4 focus:ring-gold/10 transition-all"
                />
                <Search size={14} className="absolute left-3 text-gray-400" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 p-1 hover:bg-gray-150 rounded-full transition-colors text-gray-400 hover:text-black cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-xs uppercase tracking-widest font-bold text-gray-900">Categories</h3>
                {selectedCategory && (
                  <button onClick={() => setSelectedCategory(null)} className="text-[10px] text-gray-400 hover:text-red-500 uppercase tracking-widest">Clear</button>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                {dynamicCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                    className={`text-left text-xs uppercase tracking-wider py-2 px-3 rounded-md transition-all ${
                      selectedCategory === cat
                        ? 'bg-black text-gold font-semibold'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {(selectedCategory || searchQuery) && (
              <button onClick={clearFilters} className="btn btn-secondary w-full text-xs h-10">
                Clear All
              </button>
            )}
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-gray-100 pb-4">
              <p className="text-xs text-gray-500 font-medium">
                {filteredProducts.length === 0
                  ? '0 products'
                  : `Showing ${(currentPage - 1) * ITEMS_PER_PAGE + 1}–${Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} of ${filteredProducts.length} ${filteredProducts.length === 1 ? 'product' : 'products'}`}
              </p>
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-2 border border-gray-200 rounded-md px-4 py-2 text-xs font-semibold text-gray-700 hover:text-black"
                >
                  <SlidersHorizontal size={14} /> Filters
                </button>
                <select
                  value={sortOption}
                  onChange={(e: any) => setSortOption(e.target.value)}
                  className="bg-white border border-gray-200 rounded-md px-4 py-2 text-xs font-semibold text-gray-700 focus:outline-none focus:border-gold"
                >
                  <option value="popular">Sort: Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <div className="py-24 text-center space-y-4">
                <p className="text-gray-400 font-medium text-sm">No products found.</p>
                <button onClick={clearFilters} className="btn btn-primary text-xs">Clear Filters</button>
              </div>
            )}

            {/* Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <AnimatePresence mode="popLayout">
                {paginatedProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="card card-hover flex flex-col overflow-hidden"
                  >
                    <Link href={`/shop/${product.id}`} className="block relative aspect-square bg-gray-50 overflow-hidden">
                      {product.customizable && (
                        <span className="absolute top-3 left-3 z-10 badge badge-gold text-[9px]">Personalized</span>
                      )}
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                    </Link>
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-2">
                      <div className="space-y-1">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{product.category}</span>
                        <Link href={`/shop/${product.id}`}>
                          <h3 className="font-heading font-semibold text-xs sm:text-sm text-gray-900 hover:text-gold transition-colors line-clamp-2">{product.name}</h3>
                        </Link>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (<Star key={i} size={10} className="fill-gold text-gold" />))}
                          <span className="text-[9px] text-gray-400 ml-1">4.9</span>
                        </div>
                      </div>
                      <div className="pt-3 flex items-center justify-between border-t border-gray-100">
                        <span className="font-bold text-gray-900 text-xs sm:text-sm">₹{product.price.toLocaleString('en-IN')}</span>
                        <Link href={`/shop/${product.id}`} className="text-[11px] font-heading font-bold text-gold hover:text-black transition-colors">
                          Customize &rarr;
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 pt-4 pb-2" role="navigation" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-gray-600 hover:text-black disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={14} /> Prev
                </button>
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                        currentPage === page
                          ? 'bg-black text-gold'
                          : 'text-gray-500 hover:bg-gray-50 hover:text-black'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-gray-600 hover:text-black disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 z-50 bg-black"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-white z-50 p-6 flex flex-col space-y-6 overflow-y-auto shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h3 className="font-heading font-bold text-sm text-gray-900 uppercase tracking-widest">Filters</h3>
                <button onClick={() => setMobileFiltersOpen(false)} className="p-1 hover:bg-gray-50 rounded">
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              <div className="space-y-2">
                <h4 className="font-heading text-xs uppercase tracking-widest font-bold text-gray-800">Search</h4>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search boutique..."
                    className="w-full bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-lg py-2.5 pl-9 pr-9 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gold focus:bg-white focus:ring-4 focus:ring-gold/10 transition-all"
                  />
                  <Search size={14} className="absolute left-3 text-gray-400" />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 p-1 hover:bg-gray-150 rounded-full transition-colors text-gray-400 hover:text-black cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-heading text-xs uppercase tracking-widest font-bold text-gray-800">Categories</h4>
                <div className="flex flex-col gap-1.5">
                  {dynamicCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { setSelectedCategory(selectedCategory === cat ? null : cat); setMobileFiltersOpen(false); }}
                      className={`text-left text-xs uppercase tracking-wider py-2 px-3 rounded-md transition-all ${
                        selectedCategory === cat ? 'bg-black text-gold font-semibold' : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => { clearFilters(); setMobileFiltersOpen(false); }}
                className="btn btn-secondary w-full text-xs h-10"
              >
                Clear All
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Shop() {
  return (
    <Suspense fallback={
      <div className="bg-beige min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-gold animate-spin" />
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}

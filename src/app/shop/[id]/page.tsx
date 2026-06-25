"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Star, Shield, Sparkles, Upload, AlertCircle, ShoppingBag, Check } from 'lucide-react';
import { DB, Product, CUSTOM_FONTS, CUSTOM_COLORS } from '@/lib/db';
import { useCart } from '@/lib/context/CartContext';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ProductDetails() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const productId = params?.id as string;

  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  const [customText, setCustomText] = useState('');
  const [selectedFont, setSelectedFont] = useState(CUSTOM_FONTS[0]);
  const [selectedColor, setSelectedColor] = useState(CUSTOM_COLORS[0]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedAlert, setAddedAlert] = useState(false);

  useEffect(() => {
    if (productId) {
      const loadProduct = async () => {
        try {
          const prod = await DB.getProductById(productId);
          setProduct(prod);
        } catch (err) {
          console.error("Failed to load product details:", err);
        } finally {
          setLoading(false);
        }
      };
      loadProduct();
    }
  }, [productId]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      try {
        const compressedFile = await DB.compressImage(file);
        const reader = new FileReader();
        reader.onloadend = () => setUploadedImage(reader.result as string);
        reader.readAsDataURL(compressedFile);
      } catch (err) {
        console.error("Personalization image compression failed:", err);
        const reader = new FileReader();
        reader.onloadend = () => setUploadedImage(reader.result as string);
        reader.readAsDataURL(file);
      }
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      product_id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image_url: product.image_url,
      custom_text: product.customizable ? customText : undefined,
      custom_color: product.customizable ? selectedColor.name : undefined,
      custom_font: product.customizable ? selectedFont.name : undefined,
      custom_image: product.customizable && uploadedImage ? uploadedImage : undefined,
      special_instructions: specialInstructions || undefined,
    });
    setAddedAlert(true);
    setTimeout(() => setAddedAlert(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-gold animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="text-red-400 mb-4" size={48} />
        <h1 className="font-heading text-2xl font-bold text-gray-900 uppercase">Not Found</h1>
        <p className="text-gray-500 text-sm max-w-sm mt-2 mb-6">This product does not exist or has been removed.</p>
        <Link href="/shop" className="btn btn-primary">Back to Shop</Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-10 sm:py-16">
      <div className="section">
        {/* Breadcrumb */}
        <div className="text-xs text-gray-400 font-medium mb-8 flex items-center gap-1.5">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-black transition-colors">Boutique</Link>
          <span>/</span>
          <span className="text-gray-600 truncate max-w-[200px]">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Preview Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 shadow-sm">
              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />

              {product.customizable && (customText || uploadedImage) && (
                <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center p-6 text-center">
                  {uploadedImage && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-16 h-16 rounded-lg border border-white/50 bg-white/95 p-1 mb-4 flex items-center justify-center shadow-lg"
                    >
                      <img src={uploadedImage} alt="Upload" className="max-h-full max-w-full object-contain" />
                    </motion.div>
                  )}
                  {customText && (
                    <motion.div
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      style={{ color: selectedColor.value }}
                      className={`text-center font-heading text-lg sm:text-2xl px-4 py-2 border border-white/10 rounded-lg bg-black/30 shadow-xl max-w-full break-words select-none ${selectedFont.value}`}
                    >
                      {customText}
                    </motion.div>
                  )}
                  <span className="absolute bottom-4 text-[10px] text-white/70 uppercase tracking-widest font-semibold bg-black/50 px-3 py-1 rounded-full">
                    Engraving Preview
                  </span>
                </div>
              )}
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-center gap-3">
              <Shield size={18} className="text-gold flex-shrink-0" />
              <p className="text-[11px] text-gray-500">
                Custom details are optimized by our design team before production to ensure perfect alignment and finish.
              </p>
            </div>
          </div>

          {/* Details Column */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-widest font-heading font-semibold text-gold">
                {product.category}
              </span>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight leading-snug">
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (<Star key={i} size={14} className="fill-gold text-gold" />))}
                  <span className="text-xs font-semibold text-gray-800 ml-1">4.9/5</span>
                </div>
                <span className="text-gray-300">|</span>
                <span className="text-xs text-gray-500 font-medium">Verified Reviews</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 font-heading">
                ₹{product.price.toLocaleString('en-IN')}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
            </div>

            {/* Customization Console */}
            {product.customizable && (
              <div className="border border-gray-200 rounded-2xl p-6 bg-gray-50/50 space-y-6">
                <h3 className="font-heading text-xs uppercase tracking-widest font-bold text-gray-900 flex items-center gap-1.5 border-b border-gray-200 pb-3">
                  <Sparkles size={14} className="text-gold" /> Personalization
                </h3>

                <div className="space-y-2">
                  <label className="block text-xs font-heading font-bold text-gray-800 uppercase tracking-wider">Engraving Text</label>
                  <input
                    type="text"
                    maxLength={32}
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="Name, monogram or date..."
                    className="input text-sm"
                  />
                  <span className="block text-[10px] text-gray-400 text-right">{customText.length}/32</span>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-heading font-bold text-gray-800 uppercase tracking-wider">Font Style</label>
                  <div className="grid grid-cols-2 gap-2">
                    {CUSTOM_FONTS.map((font) => (
                      <button
                        key={font.name}
                        onClick={() => setSelectedFont(font)}
                        className={`py-2 px-3 border rounded-md text-xs transition-all ${
                          selectedFont.name === font.name
                            ? 'border-black bg-black text-gold font-semibold'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-black'
                        }`}
                      >
                        {font.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2.5">
                  <label className="block text-xs font-heading font-bold text-gray-800 uppercase tracking-wider">Engraving Color</label>
                  <div className="flex items-center gap-3">
                    {CUSTOM_COLORS.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                          selectedColor.name === color.name ? 'border-black' : 'border-gray-200'
                        }`}
                        style={{ backgroundColor: color.value === '#FFFFFF' ? '#F5F5F4' : color.value }}
                        title={color.name}
                      >
                        {selectedColor.name === color.name && (
                          <span className={`w-1.5 h-1.5 rounded-full ${color.value === '#FFFFFF' || color.value === '#C0C0C0' ? 'bg-black' : 'bg-white'}`} />
                        )}
                      </button>
                    ))}
                  </div>
                  <span className="text-[10px] text-gray-400 font-semibold block">{selectedColor.name}</span>
                </div>

                <div className="space-y-2.5">
                  <label className="block text-xs font-heading font-bold text-gray-800 uppercase tracking-wider">Photos for Customization</label>
                  <div className="border border-gold/30 bg-gold/5 rounded-xl p-4 flex gap-3 items-start">
                    <Upload size={18} className="text-gold flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-700 leading-relaxed font-medium">
                      You can securely send us your high-resolution photos via WhatsApp after confirming your order. A direct upload link will be provided at checkout.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-heading font-bold text-gray-800 uppercase tracking-wider">Special Instructions</label>
                  <textarea
                    rows={2}
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="Placement, capitalization, notes..."
                    className="input text-xs resize-none"
                  />
                </div>
              </div>
            )}

            {/* Add to Cart */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-4">
                <span className="text-xs uppercase tracking-wider font-heading font-bold text-gray-700">Qty</span>
                <div className="flex items-center border border-gray-200 rounded-md bg-white">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3.5 py-1.5 text-gray-500 hover:text-black font-bold text-sm transition-colors">-</button>
                  <span className="px-3.5 text-gray-900 font-semibold text-sm">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="px-3.5 py-1.5 text-gray-500 hover:text-black font-bold text-sm transition-colors">+</button>
                </div>
              </div>

              <button onClick={handleAddToCart} className="btn btn-gold w-full text-center">
                <ShoppingBag size={16} /> Add to Cart
              </button>

              {addedAlert && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-900 border border-gold/20 text-gold p-3 text-xs font-semibold rounded-lg text-center flex items-center justify-center gap-2"
                >
                  <Check size={14} /> Added to your cart
                </motion.div>
              )}
            </div>

            {/* Features */}
            {product.features && (
              <div className="pt-6 border-t border-gray-100 space-y-3">
                <h4 className="font-heading text-xs uppercase tracking-widest font-bold text-gray-800">Specifications</h4>
                <ul className="space-y-2">
                  {product.features.map((f, idx) => (
                    <li key={idx} className="text-gray-500 text-xs flex items-center gap-2 font-medium">
                      <span className="w-1 h-1 rounded-full bg-gold" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

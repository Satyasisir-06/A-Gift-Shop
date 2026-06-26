import { supabase } from './supabase';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image_url: string;
  images?: string[];
  customizable: boolean;
  min_quantity?: number;
  features?: string[];
  colors?: string[];
}

export interface Announcement {
  id: string;
  title: string;
  description: string;
  created_at: string;
}

export interface PopupOffer {
  id: string;
  title: string;
  description: string;
  image_url: string;
  active: boolean;
  created_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_percent: number;
  active: boolean;
  created_at: string;
}

export interface StudioVideo {
  url: string;
  thumbnail?: string;
}

export interface PaymentConfig {
  qrUrl: string;
  upiId: string;
}

export interface OrderItem {
  id: string;
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
  custom_text?: string;
  custom_image?: string;
  custom_color?: string;
  custom_font?: string;
  special_instructions?: string;
  min_quantity?: number;
}

export interface Order {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  items: OrderItem[];
  total_price: number;
  status: 'Pending' | 'Confirmed' | 'Designing' | 'Production' | 'Shipped' | 'Delivered';
  shipping_address: string;
  payment_method: 'UPI' | 'COD' | 'Card';
  shipping_carrier?: string;
  tracking_number?: string;
  whatsapp_code?: string;
  images_received?: boolean;
  created_at: string;
}

export const CATEGORIES = [
  "Bracelets",
  "Pens",
  "Keychains",
  "Mugs",
  "Photo Frames",
  "T-Shirts",
  "Stickers",
  "Name Plates"
];

export const CUSTOM_FONTS = [
  { name: "Elegant Script", value: "font-serif italic" },
  { name: "Modern Sans", value: "font-sans uppercase font-bold tracking-widest" },
  { name: "Classic Serif", value: "font-serif" },
  { name: "Playful Round", value: "font-sans font-semibold italic" }
];

export const CUSTOM_COLORS = [
  { name: "Imperial Gold", value: "#C9A84C" },
  { name: "Pure White", value: "#FFFFFF" },
  { name: "Matte Black", value: "#1A1A1A" },
  { name: "Rose Gold", value: "#E0A99A" },
  { name: "Classic Silver", value: "#C0C0C0" }
];

export interface Collection {
  name: string;
  count: string;
  img: string;
}

const INITIAL_COLLECTIONS: Collection[] = [
  { name: "Bracelets", count: "3 styles", img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=400&auto=format&fit=crop" },
  { name: "Pens", count: "2 finishes", img: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?q=80&w=400&auto=format&fit=crop" },
  { name: "Keychains", count: "3 shades", img: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=400&auto=format&fit=crop" },
  { name: "Mugs", count: "2 combos", img: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=400&auto=format&fit=crop" },
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Luxury Engraved Gold Bracelet",
    description: "A premium stainless steel cuff bracelet, beautifully gold-plated and engraved with your chosen words. Elegant, minimalist, and perfectly adjustable.",
    price: 1499,
    category: "Bracelets",
    stock: 50,
    image_url: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop",
    customizable: true,
    features: ["18k Gold Plated", "Water-resistant coating", "Hypoallergenic material", "Sizing: Adjustable"],
    colors: ["Gold", "Silver", "Rose Gold"]
  },
  {
    id: "p2",
    name: "Classic Wooden Signature Pen",
    description: "Write your next chapter with this handcrafted walnut wood rollerball pen. Personalized laser engraving adds a touch of high prestige.",
    price: 999,
    category: "Pens",
    stock: 120,
    image_url: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?q=80&w=600&auto=format&fit=crop",
    customizable: true,
    features: ["Walnut Wood Case", "Schneider Schmidt refills", "Premium leather pouch included", "Gold clip finishes"],
    colors: ["Walnut Gold", "Ebony Silver"]
  },
  {
    id: "p3",
    name: "Monogram Embossed Leather Keychain",
    description: "Premium full-grain leather keychain with gold hardware. Monogrammed with hot foil brass stamps for a permanent, luxurious texture.",
    price: 499,
    category: "Keychains",
    stock: 200,
    image_url: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop",
    customizable: true,
    features: ["Full-grain Italian Leather", "Solid brass gold rings", "Individually hand-stitched"],
    colors: ["Classic Tan", "Noble Black", "Emerald Green"]
  },
  {
    id: "p4",
    name: "Luxury Matte Gold Ceramic Mug",
    description: "Start the morning with high-caliber design. Elegant black matte ceramic exterior with a custom gold metallic lettering finish.",
    price: 699,
    category: "Mugs",
    stock: 80,
    image_url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop",
    customizable: true,
    features: ["350ml Ceramic mug", "Hand-painted gold handles", "Dishwasher safe"],
    colors: ["Matte Black & Gold", "Classic White & Gold"]
  },
  {
    id: "p5",
    name: "Floating Oak Glass Photo Frame",
    description: "Elevate your favorite photo into modern museum-style wall art. Real oak framing surrounds two floating sheets of polished crystal glass.",
    price: 1899,
    category: "Photo Frames",
    stock: 35,
    image_url: "https://images.unsplash.com/photo-1544273677-c433136021d4?q=80&w=600&auto=format&fit=crop",
    customizable: true,
    features: ["Real Red Oak Frame", "Double-paned floating glass", "Mounting hardware included"],
    colors: ["Natural Oak", "Charcoal Black"]
  },
  {
    id: "p6",
    name: "Tailored Premium Cotton T-Shirt",
    description: "Luxury heavy cotton t-shirt with customized high-definition heat-transferred sticker prints. Perfect modern fit.",
    price: 1199,
    category: "T-Shirts",
    stock: 150,
    image_url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop",
    customizable: true,
    features: ["100% Ring-spun cotton", "240 GSM heavy fabric", "Seamless double-needle collar"],
    colors: ["Chalk White", "Off-Black"]
  },
  {
    id: "p7",
    name: "Custom Brass Office Name Plate",
    description: "A solid, polished brass plaque mounted on premium teak wood. Engraved text is filled with black enamel for professional executive style.",
    price: 2499,
    category: "Name Plates",
    stock: 25,
    image_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop",
    customizable: true,
    features: ["Solid Brass Plaque", "Burmese Teak Base", "Heavy counter-weight feel"],
    colors: ["Traditional Brass", "Polished Steel"]
  },
  {
    id: "p8",
    name: "Premium Sticker Pack (Set of 10)",
    description: "Waterproof, matte finish vinyl stickers customized with your private artwork/illustrations.",
    price: 299,
    category: "Stickers",
    stock: 500,
    image_url: "https://images.unsplash.com/photo-1572375995301-372076a26e2a?q=80&w=600&auto=format&fit=crop",
    customizable: true,
    features: ["Die-cut Premium Vinyl", "UV-resistant ink protection", "100% residue-free removal"]
  }
];

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "a1",
    title: "✨ Personalized Festival Collection Live",
    description: "Enjoy complimentary gold leaf gift wrapping on all customizable items. Use code ELEGANCE at checkout.",
    created_at: new Date().toISOString()
  },
  {
    id: "a2",
    title: "🚚 Nationwide Express Delivery Guaranteed",
    description: "Custom orders placed today will ship within 48 hours with guaranteed secure tracking.",
    created_at: new Date(Date.now() - 86400000).toISOString()
  }
];

const INITIAL_COUPONS: Coupon[] = [
  {
    id: "c1",
    code: "ELEGANCE",
    discount_percent: 10,
    active: true,
    created_at: new Date().toISOString()
  },
  {
    id: "c2",
    code: "WELCOME10",
    discount_percent: 10,
    active: true,
    created_at: new Date().toISOString()
  }
];

// Helper database manager persisting local changes in localStorage
export class DB {
  static async updateImagesReceived(orderId: string, received: boolean): Promise<void> {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ images_received: received })
        .eq('id', orderId);
        
      if (error) {
        console.error("Supabase update images_received error:", error);
        throw error;
      }
    } catch (e) {
      console.error("DB Error updating images_received:", e);
      throw e;
    }
  }

  static async getProducts(): Promise<Product[]> {
    // 1. Try to fetch from Supabase Products database table
    try {
      const { data: dbProducts, error } = await supabase
        .from('products')
        .select('*')
        .order('name');
      
      if (!error && dbProducts && dbProducts.length > 0) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('gs_products', JSON.stringify(dbProducts));
        }
        return dbProducts;
      }
    } catch (e) {
      console.warn("Supabase products table not accessible:", e);
    }

    // 2. Check if we already have local products saved in localStorage (to prevent overwriting local edits)
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('gs_products');
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as Product[];
          if (parsed.length > 0) {
            return parsed;
          }
        } catch (e) {}
      }
    }

    // 3. Try to fetch from Supabase Storage 'items' bucket (as initial seed data)
    try {
      const { data: files, error } = await supabase.storage.from('items').list('', {
        limit: 100
      });

      if (!error && files && files.length > 0) {
        // Filter out videos and other non-image files
        const imageFiles = files.filter(file => {
          const name = file.name.toLowerCase();
          const isImageExt = name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.png') || name.endsWith('.webp') || name.endsWith('.gif');
          const isImageMime = file.metadata?.mimetype?.startsWith('image/');
          return isImageExt || isImageMime;
        });

        const storageProducts: Product[] = imageFiles.map((file, index) => {
          const publicUrl = supabase.storage.from('items').getPublicUrl(file.name).data.publicUrl;
          
          // Clean SaveClip.App prefix and format nicely
          let cleanName = file.name
            .replace(/SaveClip\.App_/g, '')
            .replace(/_[0-9]+_[0-9]+_[0-9]+_n/g, '')
            .replace(/\.[^/.]+$/, '')
            .replace(/_/g, ' ')
            .trim();
          
          if (!cleanName || cleanName.match(/^\d+$/)) {
            cleanName = `Exclusive Gift Creation #${index + 1}`;
          }

          // Capitalize first letter of each word
          cleanName = cleanName.replace(/\b\w/g, c => c.toUpperCase());

          // Match categories
          let category = "Bracelets";
          const lowerName = cleanName.toLowerCase();
          if (lowerName.includes('pen')) category = "Pens";
          else if (lowerName.includes('keychain')) category = "Keychains";
          else if (lowerName.includes('mug')) category = "Mugs";
          else if (lowerName.includes('frame')) category = "Photo Frames";
          else if (lowerName.includes('shirt')) category = "T-Shirts";
          else if (lowerName.includes('sticker')) category = "Stickers";
          else if (lowerName.includes('plate')) category = "Name Plates";
          else {
            const categories = ["Bracelets", "Pens", "Keychains", "Mugs", "Photo Frames", "T-Shirts", "Stickers", "Name Plates"];
            category = categories[index % categories.length];
          }

          return {
            id: file.id || `sb-${index}-${file.name}`,
            name: cleanName,
            description: `A unique, luxury personalized handcrafted ${category.toLowerCase().replace(/s$/, '')} tailored to your specifications. Customize font, colors, and engraving on our live customizer canvas.`,
            price: 599 + (index * 150) % 1200,
            category: category,
            stock: 80,
            image_url: publicUrl,
            customizable: true,
            features: ["High-durability craftsmanship", "Water-resistant premium glaze", "Luxury corporate gift packaging"],
            colors: ["Imperial Gold", "Matte Black", "Pure White"]
          };
        });

        if (typeof window !== 'undefined') {
          localStorage.setItem('gs_products', JSON.stringify(storageProducts));
        }
        return storageProducts;
      }
    } catch (e) {
      console.warn("Supabase storage bucket 'items' not accessible:", e);
    }

    // 3. Fallback to LocalStorage or INITIAL_PRODUCTS
    if (typeof window === 'undefined') return INITIAL_PRODUCTS;
    const stored = localStorage.getItem('gs_products');
    if (!stored) {
      localStorage.setItem('gs_products', JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    return JSON.parse(stored);
  }

  static async getProductById(id: string): Promise<Product | undefined> {
    const products = await this.getProducts();
    return products.find(p => p.id === id);
  }

  static async saveProduct(product: Product): Promise<void> {
    try {
      // Ensure arrays are always present for Supabase TEXT[] columns
      const sanitized = {
        ...product,
        features: product.features ?? [],
        colors: product.colors ?? [],
      };
      const { error } = await supabase.from('products').upsert(sanitized);
      if (error) console.error("Supabase save error:", error.message);
    } catch (e) {
      // Supabase unavailable — silently fall back to localStorage
    }

    if (typeof window === 'undefined') return;
    const products = await this.getProducts();
    const idx = products.findIndex(p => p.id === product.id);
    if (idx >= 0) {
      products[idx] = product;
    } else {
      products.push(product);
    }
    localStorage.setItem('gs_products', JSON.stringify(products));
  }

  static async deleteProduct(id: string): Promise<void> {
    try {
      const products = await this.getProducts();
      const product = products.find(p => p.id === id);
      if (product && product.image_url && product.image_url.includes('supabase.co')) {
        try {
          const pathParts = product.image_url.split('/storage/v1/object/public/items/');
          if (pathParts.length > 1) {
            await supabase.storage.from('items').remove([pathParts[1]]);
          }
        } catch (imgErr) {
          console.warn("Failed to delete product image from storage:", imgErr);
        }
      }

      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) console.error("Error deleting product from Supabase:", error);
    } catch (e) {}

    if (typeof window === 'undefined') return;
    const currentProducts = (await this.getProducts()).filter(p => p.id !== id);
    localStorage.setItem('gs_products', JSON.stringify(currentProducts));
  }

  static async getAnnouncements(): Promise<Announcement[]> {
    try {
      const { data: dbAnns, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && dbAnns && dbAnns.length > 0) {
        const filteredAnns = dbAnns.filter(a => a.id !== '00000000-0000-0000-0000-000000000001' && a.id !== '00000000-0000-0000-0000-000000000002' && a.id !== '00000000-0000-0000-0000-000000000003');
        if (typeof window !== 'undefined') {
          localStorage.setItem('gs_announcements', JSON.stringify(filteredAnns));
        }
        return filteredAnns;
      }
    } catch (e) {
      console.warn("Supabase announcements table not accessible:", e);
    }

    if (typeof window === 'undefined') return INITIAL_ANNOUNCEMENTS;
    const stored = localStorage.getItem('gs_announcements');
    if (!stored) {
      localStorage.setItem('gs_announcements', JSON.stringify(INITIAL_ANNOUNCEMENTS));
      return INITIAL_ANNOUNCEMENTS;
    }
    return JSON.parse(stored);
  }

  static async saveAnnouncement(ann: Announcement): Promise<void> {
    try {
      const { error } = await supabase.from('announcements').upsert({
        id: ann.id.includes('ann_') ? undefined : ann.id,
        title: ann.title,
        description: ann.description,
        created_at: ann.created_at
      });
      if (error) console.error("Error saving announcement to Supabase:", error);
    } catch (e) {}

    if (typeof window === 'undefined') return;
    const anns = await this.getAnnouncements();
    const idx = anns.findIndex(a => a.id === ann.id);
    if (idx >= 0) {
      anns[idx] = ann;
    } else {
      anns.unshift(ann);
    }
    localStorage.setItem('gs_announcements', JSON.stringify(anns));
  }

  static async deleteAnnouncement(id: string): Promise<void> {
    try {
      const { error } = await supabase.from('announcements').delete().eq('id', id);
      if (error) console.error("Error deleting announcement from Supabase:", error);
    } catch (e) {}

    if (typeof window === 'undefined') return;
    const anns = (await this.getAnnouncements()).filter(a => a.id !== id);
    localStorage.setItem('gs_announcements', JSON.stringify(anns));
  }

  static async getPopupOffers(): Promise<PopupOffer[]> {
    try {
      const { data: dbOffers, error } = await supabase
        .from('popup_offers')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && dbOffers && dbOffers.length > 0) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('gs_popup_offers', JSON.stringify(dbOffers));
        }
        return dbOffers;
      }
    } catch (e) {
      console.warn("Supabase popup_offers table not accessible:", e);
    }

    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem('gs_popup_offers');
    return stored ? JSON.parse(stored) : [];
  }

  static async savePopupOffer(offer: PopupOffer): Promise<void> {
    try {
      const { error } = await supabase.from('popup_offers').upsert({
        id: offer.id.includes('pop_') && !offer.id.match(/^[0-9a-f-]{36}$/) ? undefined : offer.id,
        title: offer.title,
        description: offer.description,
        image_url: offer.image_url,
        active: offer.active,
        created_at: offer.created_at
      });
      if (error) console.error("Error saving popup offer to Supabase:", JSON.stringify(error), error.message || error);
    } catch (e) {}

    if (typeof window === 'undefined') return;
    const offers = await this.getPopupOffers();
    const idx = offers.findIndex(o => o.id === offer.id);
    if (idx >= 0) {
      offers[idx] = offer;
    } else {
      offers.unshift(offer);
    }
    localStorage.setItem('gs_popup_offers', JSON.stringify(offers));
  }

  static async deletePopupOffer(id: string): Promise<void> {
    try {
      const offers = await this.getPopupOffers();
      const offer = offers.find(o => o.id === id);
      if (offer && offer.image_url && offer.image_url.includes('supabase.co')) {
        try {
          const pathParts = offer.image_url.split('/storage/v1/object/public/items/');
          if (pathParts.length > 1) {
            await supabase.storage.from('items').remove([pathParts[1]]);
          }
        } catch (imgErr) {
          console.warn("Failed to delete image from storage:", imgErr);
        }
      }

      const { error } = await supabase.from('popup_offers').delete().eq('id', id);
      if (error) console.error("Error deleting popup offer from Supabase:", error);
    } catch (e) {}

    if (typeof window === 'undefined') return;
    const currentOffers = (await this.getPopupOffers()).filter(o => o.id !== id);
    localStorage.setItem('gs_popup_offers', JSON.stringify(currentOffers));
  }

  static async getCoupons(): Promise<Coupon[]> {
    try {
      const { data: dbCoupons, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && dbCoupons && dbCoupons.length > 0) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('gs_coupons', JSON.stringify(dbCoupons));
        }
        return dbCoupons;
      }
    } catch (e) {
      console.warn("Supabase coupons table not accessible:", e);
    }

    if (typeof window === 'undefined') return INITIAL_COUPONS;
    const stored = localStorage.getItem('gs_coupons');
    if (!stored) {
      localStorage.setItem('gs_coupons', JSON.stringify(INITIAL_COUPONS));
      return INITIAL_COUPONS;
    }
    return JSON.parse(stored);
  }

  static async saveCoupon(coupon: Coupon): Promise<void> {
    try {
      const { error } = await supabase.from('coupons').upsert({
        id: coupon.id.includes('c_') ? undefined : coupon.id,
        code: coupon.code.toUpperCase(),
        discount_percent: coupon.discount_percent,
        active: coupon.active,
        created_at: coupon.created_at
      });
      if (error) console.error("Error saving coupon to Supabase:", error?.message || JSON.stringify(error));
    } catch (e) {}

    if (typeof window === 'undefined') return;
    const coupons = await this.getCoupons();
    const idx = coupons.findIndex(c => c.id === coupon.id);
    if (idx >= 0) {
      coupons[idx] = { ...coupon, code: coupon.code.toUpperCase() };
    } else {
      coupons.unshift({ ...coupon, code: coupon.code.toUpperCase() });
    }
    localStorage.setItem('gs_coupons', JSON.stringify(coupons));
  }

  static async deleteCoupon(id: string): Promise<void> {
    try {
      const { error } = await supabase.from('coupons').delete().eq('id', id);
      if (error) console.error("Error deleting coupon from Supabase:", error?.message || JSON.stringify(error));
    } catch (e) {}

    if (typeof window === 'undefined') return;
    const coupons = (await this.getCoupons()).filter(c => c.id !== id);
    localStorage.setItem('gs_coupons', JSON.stringify(coupons));
  }

  static async getOrders(): Promise<Order[]> {
    try {
      const { data: dbOrders, error } = await supabase
        .from('orders')
        .select(`
          id,
          user_id,
          user_name,
          user_email,
          user_phone,
          total_price,
          status,
          shipping_address,
          payment_method,
          shipping_carrier,
          tracking_number,
          whatsapp_code,
          images_received,
          created_at,
          order_items (
            id,
            product_id,
            name,
            price,
            quantity,
            image_url,
            custom_text,
            custom_image,
            custom_color,
            custom_font,
            special_instructions,
            min_quantity
          )
        `)
        .order('created_at', { ascending: false });
      
      if (!error && dbOrders) {
        const mappedOrders: Order[] = dbOrders.map((o: any) => ({
          id: o.id,
          user_id: o.user_id,
          user_name: o.user_name,
          user_email: o.user_email,
          user_phone: o.user_phone,
          total_price: o.total_price,
          status: o.status,
          shipping_address: o.shipping_address,
          payment_method: o.payment_method,
          shipping_carrier: o.shipping_carrier || undefined,
          tracking_number: o.tracking_number || undefined,
          whatsapp_code: o.whatsapp_code || undefined,
          images_received: o.images_received || false,
          created_at: o.created_at,
          items: o.order_items || []
        }));

        // Merge with any local-only orders (mock fallback orders that failed Supabase insert)
        if (typeof window !== 'undefined') {
          try {
            const localStored = localStorage.getItem('gs_orders');
            if (localStored) {
              const localOrders = JSON.parse(localStored) as Order[];
              for (const lo of localOrders) {
                if (!mappedOrders.some(mo => mo.id === lo.id)) {
                  mappedOrders.push(lo);
                }
              }
            }
          } catch (e) {}
        }

        // Sort by created_at descending
        mappedOrders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('gs_orders', JSON.stringify(mappedOrders));
          } catch (e) {
            console.warn("Storage quota exceeded, could not save orders cache:", e);
          }
        }
        return mappedOrders;
      } else if (error) {
        const isColumnMismatch = error.code === '42703' || 
                                 (error.message && (error.message.includes('column') || error.message.includes('does not exist')));
        if (isColumnMismatch) {
          console.log("Supabase orders table missing tracking columns; running fallback query.");
        } else {
          console.error("Supabase getOrders error:", error.message || JSON.stringify(error) || error);
        }
        
        // Resilient fallback query if main query fails (e.g. columns don't exist)
        const { data: dbOrdersFallback, error: fallbackError } = await supabase
            .from('orders')
            .select(`
              id,
              user_id,
              user_name,
              user_email,
              user_phone,
              total_price,
              status,
              shipping_address,
              payment_method,
              whatsapp_code,
              images_received,
              created_at,
              order_items (
                id,
                product_id,
                name,
                price,
                quantity,
                image_url,
                custom_text,
                custom_image,
                custom_color,
                custom_font,
                special_instructions,
                min_quantity
              )
            `)
            .order('created_at', { ascending: false });
          
          if (!fallbackError && dbOrdersFallback) {
            const mappedOrders: Order[] = dbOrdersFallback.map((o: any) => ({
              id: o.id,
              user_id: o.user_id,
              user_name: o.user_name,
              user_email: o.user_email,
              user_phone: o.user_phone,
              total_price: o.total_price,
              status: o.status,
              shipping_address: o.shipping_address,
              payment_method: o.payment_method,
              whatsapp_code: o.whatsapp_code || undefined,
              images_received: o.images_received || false,
              created_at: o.created_at,
              items: o.order_items || []
            }));
            
            // Try to merge with any local tracking numbers stored in localStorage
            if (typeof window !== 'undefined') {
              try {
                const localOrders = localStorage.getItem('gs_orders');
                if (localOrders) {
                  try {
                    const parsedLocal = JSON.parse(localOrders) as Order[];
                    mappedOrders.forEach(mo => {
                      const lo = parsedLocal.find(p => p.id === mo.id);
                      if (lo) {
                        mo.shipping_carrier = lo.shipping_carrier;
                        mo.tracking_number = lo.tracking_number;
                      }
                    });
                  } catch (e) {}
                }
                localStorage.setItem('gs_orders', JSON.stringify(mappedOrders));
              } catch (e) {
                console.warn("Storage quota exceeded, could not save orders cache:", e);
              }
            }
            return mappedOrders;
          }
        }
    } catch (e) {
      console.warn("Supabase orders table not accessible:", e);
    }

    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem('gs_orders');
    return stored ? JSON.parse(stored) : [];
  }

  static async getOrdersByUser(userId: string): Promise<Order[]> {
    const orders = await this.getOrders();
    return orders.filter(o => o.user_id === userId || o.user_id === userId.toLowerCase());
  }

  static async createOrder(order: Omit<Order, 'id' | 'created_at' | 'whatsapp_code' | 'images_received'>): Promise<Order> {
    const mockId = "ord_" + Math.random().toString(36).substr(2, 9);
    const mockCreatedAt = new Date().toISOString();
    
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let generatedCode = 'AGS-';
    for (let i = 0; i < 4; i++) {
      generatedCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    let createdOrder: Order = {
      ...order,
      id: mockId,
      whatsapp_code: generatedCode,
      images_received: false,
      created_at: mockCreatedAt
    };

    try {
      // 1. Insert order header
      const { data: headerData, error: headerError } = await supabase
        .from('orders')
        .insert({
          user_id: order.user_id,
          user_name: order.user_name,
          user_email: order.user_email,
          user_phone: order.user_phone,
          total_price: order.total_price,
          status: order.status,
          shipping_address: order.shipping_address,
          payment_method: order.payment_method,
          whatsapp_code: generatedCode
        })
        .select()
        .single();
      
      if (headerError) {
        throw new Error(`Header insert error: ${headerError.message}`);
      }

      if (headerData) {
        const orderId = headerData.id;
        const createdAt = headerData.created_at;

        // 2. Prepare order items
        const itemsToInsert = order.items.map(item => ({
          order_id: orderId,
          product_id: item.product_id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image_url: item.image_url,
          custom_text: item.custom_text || null,
          custom_image: item.custom_image || null,
          custom_color: item.custom_color || null,
          custom_font: item.custom_font || null,
          special_instructions: item.special_instructions || null
        }));

        // 3. Insert order items
        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(itemsToInsert);

        if (itemsError) {
          console.error("Error inserting order items:", itemsError?.message || JSON.stringify(itemsError));
        }
        
        createdOrder = {
          ...order,
          id: orderId,
          whatsapp_code: generatedCode,
          images_received: false,
          created_at: createdAt
        };
      }
    } catch (e) {
      console.warn("Failed to save order in Supabase, using mock fallback:", e);
    }

    if (typeof window !== 'undefined') {
      try {
        const orders = await this.getOrders();
        if (!orders.some(o => o.id === createdOrder.id)) {
          orders.unshift(createdOrder);
        }
        localStorage.setItem('gs_orders', JSON.stringify(orders));
      } catch (e) {}
    }

    return createdOrder;
  }

  static async updateOrderStatus(
    orderId: string, 
    status: Order['status'], 
    shippingCarrier?: string, 
    trackingNumber?: string
  ): Promise<void> {
    try {
      const updateData: any = { status: status };
      if (shippingCarrier !== undefined) updateData.shipping_carrier = shippingCarrier;
      if (trackingNumber !== undefined) updateData.tracking_number = trackingNumber;

      const { error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId);
      
      if (error) {
        console.error("Error updating order status in Supabase:", error?.message || JSON.stringify(error));
        
        // Fallback: If column not found error, update only the status column (guaranteed to exist)
        if (error.code === '42703' && (shippingCarrier !== undefined || trackingNumber !== undefined)) {
          console.log("Tracking columns not found. Performing status-only update fallback...");
          const { error: statusOnlyError } = await supabase
            .from('orders')
            .update({ status: status })
            .eq('id', orderId);
          if (statusOnlyError) console.error("Error in status-only update fallback:", statusOnlyError);
        }
      }
    } catch (e) {}

    if (typeof window === 'undefined') return;
    const orders = await this.getOrders();
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx >= 0) {
      orders[idx].status = status;
      if (shippingCarrier !== undefined) orders[idx].shipping_carrier = shippingCarrier;
      if (trackingNumber !== undefined) orders[idx].tracking_number = trackingNumber;
      try {
        localStorage.setItem('gs_orders', JSON.stringify(orders));
      } catch (e) {
        console.warn("Storage quota exceeded, could not update orders cache:", e);
      }
    }
  }

  static compressImage(file: File, maxW = 800, maxH = 800): Promise<File> {
    if (typeof window === 'undefined') return Promise.resolve(file);
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxW) {
              height = Math.round((height * maxW) / width);
              width = maxW;
            }
          } else {
            if (height > maxH) {
              width = Math.round((width * maxH) / height);
              height = maxH;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now()
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          }, 'image/jpeg', 0.7);
        };
        img.onerror = () => resolve(file);
      };
      reader.onerror = () => resolve(file);
    });
  }

  static async uploadProductImage(file: File): Promise<string> {
    try {
      const compressedFile = await this.compressImage(file);
      const fileExt = compressedFile.name.split('.').pop() || 'jpg';
      const fileName = `${Math.random().toString(36).substring(2, 15)}-${Date.now()}.${fileExt}`;
      const filePath = `product-images/${fileName}`;

      const { data, error } = await supabase.storage
        .from('items')
        .upload(filePath, compressedFile, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.warn("Supabase storage upload failed, falling back to base64:", error);
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('items')
        .getPublicUrl(filePath);
      
      return publicUrl;
    } catch (e) {
      const compressedFile = await this.compressImage(file);
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(compressedFile);
      });
    }
  }

  static async getBestsellers(): Promise<string[]> {
    try {
      const { data, error } = await supabase.from('announcements').select('description').eq('id', '00000000-0000-0000-0000-000000000001').single();
      if (!error && data && data.description) {
        if (typeof window !== 'undefined') localStorage.setItem('gs_bestsellers', data.description);
        return JSON.parse(data.description);
      }
    } catch (e) {}

    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem('gs_bestsellers');
    return stored ? JSON.parse(stored) : [];
  }

  static async setBestsellers(ids: string[]): Promise<void> {
    try {
      await supabase.from('announcements').upsert({
        id: '00000000-0000-0000-0000-000000000001',
        title: 'system_bestsellers',
        description: JSON.stringify(ids),
        type: 'system',
        created_at: new Date().toISOString()
      });
    } catch (e) {}

    if (typeof window === 'undefined') return;
    localStorage.setItem('gs_bestsellers', JSON.stringify(ids));
  }

  static async getCollections(): Promise<Collection[]> {
    try {
      const { data, error } = await supabase.from('announcements').select('description').eq('id', '00000000-0000-0000-0000-000000000002').single();
      if (!error && data && data.description) {
        if (typeof window !== 'undefined') localStorage.setItem('gs_collections', data.description);
        return JSON.parse(data.description);
      }
    } catch (e) {}

    if (typeof window === 'undefined') return INITIAL_COLLECTIONS;
    const stored = localStorage.getItem('gs_collections');
    if (!stored) {
      localStorage.setItem('gs_collections', JSON.stringify(INITIAL_COLLECTIONS));
      return INITIAL_COLLECTIONS;
    }
    return JSON.parse(stored);
  }

  static async saveCollections(collections: Collection[]): Promise<void> {
    try {
      await supabase.from('announcements').upsert({
        id: '00000000-0000-0000-0000-000000000002',
        title: 'system_collections',
        description: JSON.stringify(collections),
        type: 'system',
        created_at: new Date().toISOString()
      });
    } catch (e) {}

    if (typeof window === 'undefined') return;
    localStorage.setItem('gs_collections', JSON.stringify(collections));
  }

  static async getStudioVideos(): Promise<StudioVideo[]> {
    try {
      const { data, error } = await supabase.from('announcements').select('description').eq('id', '00000000-0000-0000-0000-000000000003').single();
      if (!error && data && data.description) {
        if (typeof window !== 'undefined') localStorage.setItem('gs_studio_videos', data.description);
        
        // Handle backwards compatibility (if it was an array of strings, convert to objects)
        const parsed = JSON.parse(data.description);
        if (parsed.length > 0 && typeof parsed[0] === 'string') {
          return parsed.map((url: string) => ({ url }));
        }
        return parsed;
      }
    } catch (e) {}

    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem('gs_studio_videos');
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    if (parsed.length > 0 && typeof parsed[0] === 'string') {
      return parsed.map((url: string) => ({ url }));
    }
    return parsed;
  }

  static async setStudioVideos(videos: StudioVideo[]): Promise<void> {
    try {
      await supabase.from('announcements').upsert({
        id: '00000000-0000-0000-0000-000000000003',
        title: 'system_studio_videos',
        description: JSON.stringify(videos),
        type: 'system',
        created_at: new Date().toISOString()
      });
    } catch (e) {}

    if (typeof window === 'undefined') return;
    localStorage.setItem('gs_studio_videos', JSON.stringify(videos));
  }

  static async getPaymentConfig(): Promise<PaymentConfig> {
    const defaultCfg = { qrUrl: '/payment-qr.jpg', upiId: 'agiftstory@icici' };
    try {
      const { data, error } = await supabase.from('announcements').select('description').eq('id', '00000000-0000-0000-0000-000000000004').single();
      if (!error && data && data.description) {
        if (typeof window !== 'undefined') localStorage.setItem('gs_payment_cfg', data.description);
        return JSON.parse(data.description);
      }
    } catch (e) {}

    if (typeof window === 'undefined') return defaultCfg;
    const stored = localStorage.getItem('gs_payment_cfg');
    return stored ? JSON.parse(stored) : defaultCfg;
  }

  static async setPaymentConfig(cfg: PaymentConfig): Promise<void> {
    try {
      await supabase.from('announcements').upsert({
        id: '00000000-0000-0000-0000-000000000004',
        title: 'system_payment_cfg',
        description: JSON.stringify(cfg),
        type: 'system',
        created_at: new Date().toISOString()
      });
    } catch (e) {}

    if (typeof window === 'undefined') return;
    localStorage.setItem('gs_payment_cfg', JSON.stringify(cfg));
  }
}

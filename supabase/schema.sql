-- =========================================================================
-- A GIFT STORY — Database Schema
-- Supabase PostgreSQL Migrations File
-- =========================================================================

-- Enable UUID extension if not already present
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL DEFAULT 'password123',
    name TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Seed default admin account
INSERT INTO public.users (email, password, name, phone, role)
VALUES ('admin@agiftstory.com', 'admin123', 'A Gift Story Admin', '+91 99999 88888', 'admin')
ON CONFLICT (email) DO NOTHING;

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price INT NOT NULL DEFAULT 0 CHECK (price >= 0),
    category TEXT NOT NULL,
    stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
    image_url TEXT NOT NULL,
    customizable BOOLEAN NOT NULL DEFAULT TRUE,
    features TEXT[] DEFAULT '{}',
    colors TEXT[] DEFAULT '{}',
    images TEXT[] DEFAULT '{}',
    min_quantity INT NOT NULL DEFAULT 1 CHECK (min_quantity >= 1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Index for category searches
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);

-- 3. ANNOUNCEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3b. POPUP OFFERS TABLE (promotional popup banners shown to visitors)
CREATE TABLE IF NOT EXISTS public.popup_offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL DEFAULT '',
    active BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3c. COUPONS TABLE (Dynamic coupon codes)
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    discount_percent INT NOT NULL CHECK (discount_percent > 0 AND discount_percent <= 100),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL, -- references users.id or client session id
    user_name TEXT NOT NULL,
    user_email TEXT NOT NULL,
    user_phone TEXT,
    total_price INT NOT NULL CHECK (total_price >= 0),
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed', 'Designing', 'Production', 'Shipped', 'Delivered', 'Cancelled')),
    shipping_address TEXT NOT NULL,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('UPI', 'COD', 'Card')),
    whatsapp_code VARCHAR(10),
    images_received BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Index for looking up customer history
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);

-- 5. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    name TEXT NOT NULL,
    price INT NOT NULL CHECK (price >= 0),
    quantity INT NOT NULL CHECK (quantity > 0),
    image_url TEXT NOT NULL,
    
    -- Personalization Customizations
    custom_text VARCHAR(32),
    custom_image TEXT, -- Base64 payload or public storage url
    custom_color TEXT,
    custom_font TEXT,
    special_instructions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Index for searching item groups
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);

-- =========================================================================
-- Row Level Security (RLS) Configuration
-- =========================================================================

-- Disable RLS on all tables so client-side queries can read/write without complex JWT configurations
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.popup_offers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items DISABLE ROW LEVEL SECURITY;

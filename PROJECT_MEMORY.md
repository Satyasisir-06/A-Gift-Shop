# Project Memory: A Gift Shop

## Project Overview
**A Gift Shop** is a premium, mobile-first customizable gifts e-commerce platform. It provides a boutique-quality shopping experience for personalized bracelets, pens, keychains, stickers, mugs, and photo frames. The interface boasts a high-end luxury styling with white, black, and gold colors, smooth Framer Motion micro-animations, and full self-service customization features.

---

## Architecture Decisions
1. **Frontend Framework**: Next.js 15 (App Router) + TypeScript + React + Tailwind CSS.
2. **Styling & Theme**: Vanilla CSS and Tailwind CSS using a luxury palette (White, Black, Gold accents: `#C9A84C`). Font typography imports: Poppins, Inter, and Outfit.
3. **Animations**: Framer Motion for elegant layouts and transition micro-animations.
4. **Backend Database & Storage**: Supabase integration. A fully decoupled local storage mock state is implemented to allow testing and development out-of-the-box when environment variables are not supplied.
5. **State Management**: React context-based custom store matching local storage hooks to handle cart checkout, authentication simulation, and order status updates.

---

## Folder Structure
```text
/supabase
  - schema.sql               (Supabase DDL schema, indexes & RLS rules)
/src
  /app
    - layout.tsx             (Global Layout & Providers)
    - page.tsx               (Landing Showcase Page)
    - about/page.tsx         (Heritage Details)
    - admin/page.tsx         (Admin Control Panel)
    - cart/page.tsx          (Cart Details View)
    - checkout/page.tsx      (Checkout Form & UPI Modal)
    - contact/page.tsx       (Contact Form)
    - dashboard/page.tsx     (Customer Portal & Trackers)
    - login/page.tsx         (Sign-in page & Admin login)
    - order-success/page.tsx (Interactive order success tracking)
    - shop/page.tsx          (Curated Product Grid with filtering)
    - shop/[id]/page.tsx     (Personalization Canvas)
  /components
    - AnnouncementBar.tsx    (Global promotions ticker)
    - CartDrawer.tsx         (Sliding overlay bag)
    - Navbar.tsx             (Boutique Header controls)
  /lib
    - db.ts                  (Database client interface & local storage mock)
    /context
      - AuthContext.tsx      (User authentication provider)
      - CartContext.tsx      (Context cart actions provider)
```

---

## Database Schema (Supabase PostgreSQL)

### `products`
- `id` (uuid, primary key)
- `name` (text)
- `description` (text)
- `price` (integer)
- `category` (text)
- `stock` (integer)
- `image_url` (text)
- `customizable` (boolean)
- `features` (text array)
- `colors` (text array)
- `created_at` (timestamp)

### `orders`
- `id` (uuid, primary key)
- `user_id` (text)
- `user_name` (text)
- `user_email` (text)
- `user_phone` (text)
- `total_price` (integer)
- `status` (text: 'Pending' | 'Confirmed' | 'Designing' | 'Production' | 'Shipped' | 'Delivered')
- `shipping_address` (text)
- `payment_method` (text)
- `created_at` (timestamp)

### `order_items`
- `id` (uuid, primary key)
- `order_id` (uuid references orders.id)
- `product_id` (text)
- `name` (text)
- `price` (integer)
- `quantity` (integer)
- `image_url` (text)
- `custom_text` (text)
- `custom_image` (text)
- `custom_color` (text)
- `custom_font` (text)
- `special_instructions` (text)

### `announcements`
- `id` (uuid, primary key)
- `title` (text)
- `description` (text)
- `created_at` (timestamp)

---

## API & Mock Endpoints
All database interactions are managed by the unified database interface in `src/lib/db.ts`. It acts as an ORM layer:
- Automatically loads default items, admin users, and promotion announcements on first run.
- Seamlessly falls back to `localStorage` sync if live Supabase keys are not present.

---

## Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase public key
- `NEXT_PUBLIC_UPI_ID`: Merchant UPI address for payment QR codes (defaults to `agiftshop@icici`)

---

## Third-Party Integrations
- **Supabase**: Auth, PostgreSQL Database, and Storage (buckets for products and customizations).
- **UPI QR Rendering**: Custom vector SVG generator translating transaction IDs into scan codes.

---

## Design System Rules
- **Color Palette**:
  - Primary Backgrounds: `#FFFFFF` (Light Mode), `#000000` (Dark/Accent Panels)
  - Text: `#121212` (Dark Grey/Black), `#FFFFFF` (White text on black accents)
  - Luxury Gold Accent: `#C9A84C` (Primary Gold), `#B8942F` (Darker Gold hover)
  - Soft Grays: `#F5F5F5` (Card background), `#E5E5E5` (Borders)
- **Typography**: Poppins/Outfit for headers, Inter for body content.

---

## Coding Conventions
- Standard TypeScript with strict compiler options.
- Client state decoupled into unified contexts `AuthContext` and `CartContext`.

---

## Known Limitations & Technical Debt
- Local Mock storage fallback needs syncing when Supabase environment variables are connected.
- File uploads for custom designs default to local Base64/mock links in the local storage mode.

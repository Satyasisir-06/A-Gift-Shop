# its a Gift Story  Implementation Plan

## Goal
Build a premium, mobile-friendly Next.js 15 e-commerce application for a customizable gifts store featuring luxury aesthetics (white, black, and gold theme), live product customization preview, customer checkout/tracking, and an admin management dashboard.

## Tasks
- [ ] **Task 1: Initialize Next.js 15 App** → Run `npx create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm` in `e:\GiftShop`. Verify by confirming standard files like `src/app/page.tsx` exist.
- [ ] **Task 2: Configure Premium Style & Typography** → Update Tailwind CSS setup to include custom gold colors (`#D4AF37`, `#AA7C11`), premium typography (Poppins/Inter font imports), and modern transitions. Verify style classes compile.
- [ ] **Task 3: Install Core Dependencies** → Install `lucide-react` (icons) and `framer-motion` (premium animation effects). Verify package additions in `package.json`.
- [ ] **Task 4: Build Core Context State Management** → Create state managers for Auth, Cart, Products, and Announcements with dual modes: Supabase backend binding and a persistent Mock State fallback so the app is fully functional instantly. Verify mock storage loads properly.
- [ ] **Task 5: Create Responsive Navigation & Footer** → Build premium headers (with cart count badges, search trigger) and footers matching the luxury gold-accented style. Verify menu collapses on mobile view.
- [ ] **Task 6: Create Homepage & Category Browsing** → Build Hero banner ("Turn Memories Into Gifts"), custom gift box animation, why-choose-us cards, featured product list, and testimonials carousel. Verify category filters filter products dynamically.
- [ ] **Task 7: Build Product Details & Live Customization Module** → Build interactive customization panel: live text input with font/color preview on the product mock canvas, file uploader (for photos), and special instructions field. Verify instant preview matches selected options.
- [ ] **Task 8: Build Cart & Premium Checkout Flow** → Build cart preview slider and detailed checkout page supporting Name, Email, Address, UPI payment QR display, and mock credit card forms. Verify subtotal/total recalculates dynamically.
- [ ] **Task 9: Build User Order Tracking Dashboard** → Create a user page displaying order history and progress meters showing standard statuses: Pending, Confirmed, Designing, Production, Shipped, Delivered. Verify status bar displays mock progression.
- [ ] **Task 10: Build Secure Admin Dashboard** → Build Admin Panel for viewing revenue analytics, managing product stock/pricing, updating order statuses, and publishing homepage announcements. Verify dashboard requires credentials and saves changes.
- [ ] **Task 11: Setup Supabase Database Schema** → Write DB migration script `supabase/schema.sql` defining `products`, `orders`, `order_items`, `announcements`, and `users` tables. Verify SQL syntax is valid.

## Done When
- [ ] Premium, responsive React interface displays correct Poppins/Inter fonts and black-gold aesthetic.
- [ ] Customers can browse products, search, customize options (text & image uploads), add to cart, and simulate a successful checkout.
- [ ] Customers can track order status through the 6 stages of processing.
- [ ] Admins can log in and update products, manage orders, and write announcements that automatically propagate.
- [ ] Project builds successfully using `npm run build` and runs without runtime exceptions.

## Notes
- To make the project easy to evaluate and run immediately, all features will fall back to a rich **Local Storage / React Context Mock State** if Supabase environment variables are missing.
- UPI QR Codes will be rendered dynamically based on standard UPI URI format (e.g. `upi://pay?pa=merchant@upi&pn=CraftifyGifts...`).

# Graph Report - GiftShop  (2026-06-26)

## Corpus Check
- 41 files · ~66,537 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 240 nodes · 303 edges · 25 communities (17 shown, 8 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8fb886bf`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Admin Panel and Dashboard|Admin Panel and Dashboard]]
- [[_COMMUNITY_App Layout and Fonts|App Layout and Fonts]]
- [[_COMMUNITY_Package Dependencies|Package Dependencies]]
- [[_COMMUNITY_Database Utility and Functions|Database Utility and Functions]]
- [[_COMMUNITY_TypeScript Configuration|TypeScript Configuration]]
- [[_COMMUNITY_Cart and Checkout|Cart and Checkout]]
- [[_COMMUNITY_ESLint Configuration|ESLint Configuration]]
- [[_COMMUNITY_Next.js Configuration|Next.js Configuration]]
- [[_COMMUNITY_PostCSS Configuration|PostCSS Configuration]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]

## God Nodes (most connected - your core abstractions)
1. `DB` - 31 edges
2. `compilerOptions` - 16 edges
3. `useAuth()` - 13 edges
4. `Project Memory: A Gift Story` - 11 edges
5. `UI Redesign Plan for GiftShop` - 10 edges
6. `useCart()` - 9 edges
7. `2026-06-23 21:00` - 7 edges
8. `2026-06-23 21:10` - 7 edges
9. `2026-06-23 21:40` - 7 edges
10. `Product` - 6 edges

## Surprising Connections (you probably didn't know these)
- `AdminPanel()` --calls--> `useAuth()`  [EXTRACTED]
  src/app/admin/page.tsx → src/lib/context/AuthContext.tsx
- `CartPage()` --calls--> `useCart()`  [EXTRACTED]
  src/app/cart/page.tsx → src/lib/context/CartContext.tsx
- `Checkout()` --calls--> `useCart()`  [EXTRACTED]
  src/app/checkout/page.tsx → src/lib/context/CartContext.tsx
- `UserDashboard()` --calls--> `useAuth()`  [EXTRACTED]
  src/app/dashboard/page.tsx → src/lib/context/AuthContext.tsx
- `LoginPage()` --calls--> `useAuth()`  [EXTRACTED]
  src/app/login/page.tsx → src/lib/context/AuthContext.tsx

## Import Cycles
- None detected.

## Communities (25 total, 8 thin omitted)

### Community 0 - "Admin Panel and Dashboard"
Cohesion: 0.22
Nodes (10): AdminPanel(), formatUptime(), LogEntry, ORDER_STEPS, useSystemClock(), useUptime(), fadeUp(), Home() (+2 more)

### Community 1 - "App Layout and Fonts"
Cohesion: 0.20
Nodes (9): Checkout(), AuthContext, AuthContextType, AuthProvider(), useAuth(), User, UserDashboard(), supabase (+1 more)

### Community 2 - "Package Dependencies"
Cohesion: 0.08
Nodes (24): dependencies, framer-motion, lucide-react, next, react, react-dom, @supabase/supabase-js, devDependencies (+16 more)

### Community 4 - "TypeScript Configuration"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 5 - "Cart and Checkout"
Cohesion: 0.14
Nodes (14): CartPage(), CartContext, CartContextType, useCart(), ProductDetails(), CATEGORIES, CUSTOM_COLORS, CUSTOM_FONTS (+6 more)

### Community 12 - "Community 12"
Cohesion: 0.09
Nodes (22): 2026-06-23 21:00, 2026-06-23 21:10, 2026-06-23 21:40, Agent Name, Agent Name, Agent Name, AI Changelog: Gift Story, Changes Made (+14 more)

### Community 13 - "Community 13"
Cohesion: 0.09
Nodes (21): Approach, Color Palette, Context, Dependencies, Design System Changes, Global Styles, Goal, Implementation Plan (+13 more)

### Community 14 - "Community 14"
Cohesion: 0.12
Nodes (15): `announcements`, API & Mock Endpoints, Architecture Decisions, Coding Conventions, Database Schema (Supabase PostgreSQL), Design System Rules, Environment Variables, Folder Structure (+7 more)

### Community 15 - "Community 15"
Cohesion: 0.15
Nodes (9): inter, metadata, poppins, CartProvider(), Footer(), LayoutWrapper(), LayoutWrapperProps, Navbar() (+1 more)

### Community 16 - "Community 16"
Cohesion: 0.29
Nodes (6): Blocked By, Completed, Current Goal, Current Task: Initializing Gift Story Platform, Priority, Remaining

### Community 17 - "Community 17"
Cohesion: 0.33
Nodes (5): Done When, Goal, its a Gift Story  Implementation Plan, Notes, Tasks

### Community 18 - "Community 18"
Cohesion: 0.33
Nodes (5): Done When, Gift Story Implementation Plan, Goal, Notes, Tasks

### Community 19 - "Community 19"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

## Knowledge Gaps
- **122 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+117 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `DB` connect `Database Utility and Functions` to `Admin Panel and Dashboard`, `App Layout and Fonts`, `Cart and Checkout`, `Community 15`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **Why does `useAuth()` connect `App Layout and Fonts` to `Admin Panel and Dashboard`, `Cart and Checkout`, `Community 15`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _122 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Package Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `Database Utility and Functions` be split into smaller, more focused modules?**
  _Cohesion score 0.13852813852813853 - nodes in this community are weakly interconnected._
- **Should `TypeScript Configuration` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `Cart and Checkout` be split into smaller, more focused modules?**
  _Cohesion score 0.14333333333333334 - nodes in this community are weakly interconnected._
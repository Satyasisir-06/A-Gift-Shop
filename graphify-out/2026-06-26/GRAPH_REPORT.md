# Graph Report - .  (2026-06-26)

## Corpus Check
- 48 files · ~66,537 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 147 nodes · 222 edges · 12 communities (8 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

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

## God Nodes (most connected - your core abstractions)
1. `DB` - 31 edges
2. `compilerOptions` - 16 edges
3. `useAuth()` - 13 edges
4. `useCart()` - 9 edges
5. `Product` - 6 edges
6. `Order` - 6 edges
7. `scripts` - 5 edges
8. `AdminPanel()` - 5 edges
9. `Navbar()` - 4 edges
10. `CATEGORIES` - 4 edges

## Surprising Connections (you probably didn't know these)
- `AdminPanel()` --calls--> `useAuth()`  [EXTRACTED]
  src/app/admin/page.tsx → src/lib/context/AuthContext.tsx
- `CartPage()` --calls--> `useCart()`  [EXTRACTED]
  src/app/cart/page.tsx → src/lib/context/CartContext.tsx
- `Checkout()` --calls--> `useAuth()`  [EXTRACTED]
  src/app/checkout/page.tsx → src/lib/context/AuthContext.tsx
- `UserDashboard()` --calls--> `useAuth()`  [EXTRACTED]
  src/app/dashboard/page.tsx → src/lib/context/AuthContext.tsx
- `LoginPage()` --calls--> `useAuth()`  [EXTRACTED]
  src/app/login/page.tsx → src/lib/context/AuthContext.tsx

## Import Cycles
- None detected.

## Communities (12 total, 4 thin omitted)

### Community 0 - "Admin Panel and Dashboard"
Cohesion: 0.12
Nodes (18): AdminPanel(), formatUptime(), LogEntry, ORDER_STEPS, useSystemClock(), useUptime(), fadeUp(), Home() (+10 more)

### Community 1 - "App Layout and Fonts"
Cohesion: 0.12
Nodes (16): inter, metadata, poppins, AuthContext, AuthContextType, AuthProvider(), useAuth(), User (+8 more)

### Community 2 - "Package Dependencies"
Cohesion: 0.08
Nodes (24): dependencies, framer-motion, lucide-react, next, react, react-dom, @supabase/supabase-js, devDependencies (+16 more)

### Community 4 - "TypeScript Configuration"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 5 - "Cart and Checkout"
Cohesion: 0.21
Nodes (8): CartPage(), Checkout(), CartContext, CartContextType, useCart(), ProductDetails(), Order, OrderItem

## Knowledge Gaps
- **54 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+49 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `DB` connect `Database Utility and Functions` to `Admin Panel and Dashboard`, `App Layout and Fonts`, `Cart and Checkout`?**
  _High betweenness centrality (0.171) - this node is a cross-community bridge._
- **Why does `useAuth()` connect `App Layout and Fonts` to `Admin Panel and Dashboard`, `Cart and Checkout`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _54 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Admin Panel and Dashboard` be split into smaller, more focused modules?**
  _Cohesion score 0.11904761904761904 - nodes in this community are weakly interconnected._
- **Should `App Layout and Fonts` be split into smaller, more focused modules?**
  _Cohesion score 0.11692307692307692 - nodes in this community are weakly interconnected._
- **Should `Package Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `Database Utility and Functions` be split into smaller, more focused modules?**
  _Cohesion score 0.13852813852813853 - nodes in this community are weakly interconnected._
# Project Structure - Priority Bags Production

## 📂 Root Directory
- `index.html`: Entry point for the frontend application.
- `package.json`: Project manifest with dependencies and scripts.
- `vite.config.ts`: Vite configuration for React 19 and Tailwind v4.
- `.env`: Environment variables for backend and Supabase.
- `DEPLOYMENT.md`: Production deployment guide.
- `STRUCTURE.md`: High-level system architecture (Existing).
- `PROJECT_STRUCTURE.md`: (This file) Detailed project map.

## 📁 `src` (Frontend - React 19)
The frontend implements a premium "Digital Atelier" aesthetic.
- `App.tsx`: Main router and application wrapper.
- `main.tsx`: React entry point.
- `index.css`: Tailwind v4 configuration and global styling tokens.
- `pages/`: Full-page React components.
  - `Home.tsx`: Dynamic hero, categories, and best sellers.
  - `CategoryPage.tsx`: Product listings with filters.
  - `ProductDetail.tsx`: Multi-view product page with buy options.
  - `Checkout.tsx`: Shipping and payment integration.
  - `AdminDashboard.tsx`: Comprehensive management tools.
  - `UserDashboard.tsx`: Order tracking and profile management.
- `components/`: Reusable UI elements.
  - `Header.tsx`: Slim, premium navigation.
  - `CartDrawer.tsx`: Sliding cart with item management.
  - `AuthModal.tsx`: Login/Sign-up unified modal.
  - `ui/`: Atom-level components (e.g., Toast).
- `constants/`: Global configurations, product data, and categories.
- `context/`: React context providers (e.g., Cart, Auth).
- `lib/`: Utility libraries and API clients (e.g., Supabase).
- `types/`: TypeScript interface and type definitions.

## 📁 `server` (Backend - Node.js/Express)
A production-ready Express server written in TypeScript.
- `index.ts`: Main entry point with middleware and routes.
- `routes/`: API endpoint definitions (Auth, Products, Orders, etc.).
- `models/`: Supabase/PostgreSQL data models.
- `middleware/`: Auth verification, rate limiting, and security.

## 📁 `public`
- `Creatives/`: Premium editorial and hero imagery.
- `Category/`: Visual assets for category banners and icons.
- `Products/`: Product-specific images.

## 🛠️ Technology Stack
- **Frontend**: React 19, Vite 6, TailwindCSS 4, Motion v12.
- **Backend**: Node.js, Express 4.21, TSX.
- **Database**: Supabase (PostgreSQL).
- **Icons**: Lucide React.
- **Design Strategy**: StitchMCP Digital Atelier system (Premium Editorial Aesthetic).

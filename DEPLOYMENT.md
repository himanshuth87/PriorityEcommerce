# Priority Bags — Deployment Guide

## Architecture

```
┌──────────────┐     ┌───────────────┐     ┌──────────────┐
│   Vercel      │────▶│  Railway API  │────▶│  PostgreSQL  │
│  (Frontend)   │     │  (Express)    │     │  (Railway)   │
│  Next.js/Vite │     │  Port 4000    │     │              │
└──────────────┘     └───────┬───────┘     └──────────────┘
                             │
                     ┌───────▼───────┐
                     │   Razorpay    │
                     │  (Payments)   │
                     └───────────────┘
```

## Step 1 — Database Setup (Railway)

1. Create a free account at [railway.app](https://railway.app)
2. Click "New Project" → "PostgreSQL"
3. Copy the `DATABASE_URL` from the Variables tab
4. Connect and run the schema:
   ```bash
   psql $DATABASE_URL -f server/schema.sql
   ```

## Step 2 — Backend Deployment (Railway)

1. In the same Railway project, click "New Service" → "GitHub Repo"
2. Point it to your repo's `server/` directory
3. Set environment variables:
   - `DATABASE_URL` — from Step 1
   - `JWT_SECRET` — generate with `openssl rand -hex 32`
   - `RAZORPAY_KEY_ID` — from Razorpay dashboard
   - `RAZORPAY_KEY_SECRET` — from Razorpay dashboard
   - `CORS_ORIGIN` — your Vercel domain
   - `NODE_ENV` — `production`
4. Railway auto-deploys on push

## Step 3 — Frontend Deployment (Vercel)

1. Push repo to GitHub
2. Import in [vercel.com](https://vercel.com)
3. Framework: Vite
4. Build command: `npm run build`
5. Output directory: `dist`
6. Add environment variable:
   - `VITE_API_URL` — your Railway API URL

### Migrating to Next.js (Recommended)

For SEO and performance, migrate to Next.js:

```bash
npx create-next-app@latest priority-bags-next --typescript --tailwind --app
```

Benefits:
- Server-side rendering for product pages (SEO)
- `next/image` for automatic image optimisation
- API routes (can replace the Express server)
- Edge middleware for geo-routing
- Built-in Vercel deployment

## Step 4 — Razorpay Setup

1. Create account at [razorpay.com](https://razorpay.com)
2. Complete KYC verification
3. Get API keys from Dashboard → Settings → API Keys
4. Set webhook URL: `https://your-api.railway.app/api/payments/webhook`
5. Enable webhook events: `payment.captured`, `payment.failed`

## Step 5 — Image Hosting (Cloudinary)

1. Create free account at [cloudinary.com](https://cloudinary.com)
2. Upload product images to Cloudinary
3. Use Cloudinary URLs in product data
4. Enable auto-format (WebP/AVIF) and auto-quality

### Cloudinary URL pattern:
```
https://res.cloudinary.com/YOUR_CLOUD/image/upload/f_auto,q_auto,w_400/products/backpack-1.jpg
```

## Step 6 — Domain & SSL

1. Buy domain (e.g. prioritybags.in) from Namecheap/GoDaddy
2. In Vercel: Settings → Domains → Add your domain
3. Update DNS records as instructed
4. SSL is automatic with Vercel

## Production Checklist

### Security
- [x] API key removed from client bundle (was exposing GEMINI_API_KEY)
- [ ] JWT secret is strong (64+ characters)
- [ ] CORS restricted to your domain only
- [ ] Rate limiting enabled on API
- [ ] Input validation on all endpoints
- [ ] SQL injection prevented (parameterised queries)
- [ ] XSS prevented (React handles this by default)
- [ ] HTTPS enforced

### Performance
- [ ] Images served via Cloudinary CDN with auto-format
- [ ] Vite code splitting enabled (vendor + motion chunks)
- [ ] Lazy loading on product images (`loading="lazy"`)
- [ ] Redis caching for product listings (optional)

### SEO
- [x] Page title updated from "My Google AI Studio App"
- [x] Meta description added
- [x] Open Graph tags added
- [x] Structured data (JSON-LD) added
- [ ] Migrate to Next.js for SSR (high priority)
- [ ] Generate sitemap.xml
- [ ] Submit to Google Search Console

### Monitoring
- [ ] Error tracking (Sentry)
- [ ] Analytics (Google Analytics / Plausible)
- [ ] Uptime monitoring (Better Uptime)
- [ ] Database backups (Railway auto-backups)

## Estimated Costs (Monthly)

| Service        | Free Tier        | Production        |
|----------------|------------------|-------------------|
| Vercel         | 100GB bandwidth  | $20/mo (Pro)      |
| Railway        | $5 credit/mo     | ~$10-20/mo        |
| PostgreSQL     | 1GB (Railway)    | $5-15/mo          |
| Cloudinary     | 25GB + 25K xform | $89/mo (Plus)     |
| Razorpay       | 2% per txn       | 2% per txn        |
| Domain         | —                | ~$10/yr           |
| **Total**      | **~$0/mo**       | **~$45-125/mo**   |

## Local Development

```bash
# Frontend
npm install
npm run dev          # http://localhost:3000

# Backend (in separate terminal)
cd server
npm install express cors helmet compression jsonwebtoken bcryptjs pg dotenv
npx tsx index.ts     # http://localhost:4000

# Database
docker run -d --name pg -e POSTGRES_PASSWORD=dev -p 5432:5432 postgres:16
psql -h localhost -U postgres -c "CREATE DATABASE priority_bags;"
psql -h localhost -U postgres -d priority_bags -f schema.sql
```

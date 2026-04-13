# Project Structure - Priority Bags Production

## 📂 Root Directory
- `index.html`: Entry point for the frontend.
- `package.json`: Project dependencies and scripts.
- `tsconfig.json`: TypeScript configuration.
- `vite.config.ts`: Vite configuration.
- `DEPLOYMENT.md`: Documentation for production deployment.
- `README.md`: General project information.
- `STRUCTURE.md`: (This file) Overview of the project architecture.

## 📁 `src` (Frontend - React)
- Core application logic, components, and styling.
- Built with React and Vite.
- Uses Framer Motion for animations.
- Tailored for a premium "Digital Atelier" aesthetic using Stitch design tokens.

## 📁 `server` (Backend - Express)
- `index.ts`: Main Express server (scaffolded for production).
- `schema.sql`: Database schema for PostgreSQL.
- `config/`: Database and service configurations.
- `middleware/`: Auth and request handling.
- `models/`: Database models.
- `routes/`: API route definitions.

## 📁 `public`
- Static assets like logos, images, and fonts.

## 🛠️ Tech Stack
- **Frontend**: React, Vite, TypeScript, Framer Motion.
- **Backend**: Node.js, Express, TypeScript.
- **Database**: PostgreSQL (planned).
- **Payment**: Razorpay (planned).
- **Design**: StitchMCP inspired "Digital Atelier" system.

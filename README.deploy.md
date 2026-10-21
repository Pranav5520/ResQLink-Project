# 🚑 ResQLink — Dev Deployment Guide

This document describes how to deploy the ResQLink emergency response platform to production.

> **Note.** This guide is the live, checked-in source for deployment. The prior `README.deploy.md`
> (replaced here) referenced `SERVER_DEV_URL` / `TRUSTED_URL` / `ALLOWED_ORIGINS`, but the backend
> only reads `CLIENT_URL`. The table below is the source of truth for every variable the deployed app
> actually needs.

## Repository

- **GitHub:** https://github.com/Pranav5520/ResQLink-Project
- **Branch:** `main` (this file is tracked there; `release/06c317f-stable` is the pre-deployment base)

## Structure

- `client/` — React + Vite frontend
- `server/` — Node.js + Express backend
- Root `README.md` — Full project documentation

## Production Configuration

### Backend (`server/`)

1. Copy `.env.example` to `.env`
2. Set the following environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Backend port | `5000` |
| `MONGO_URI` | MongoDB connection string (SRV for Atlas) | `mongodb+srv://<user>:<pass>@cluster.mongodb.net/resqlink` |
| `JWT_SECRET` | Secret for JWT signing | (generate a random 64-char string) |
| `JWT_EXPIRE` | Token expiry | `7d` |
| `CLIENT_URL` | Frontend URL that may call the API | `https://resqlink-frontend.vercel.app` |
| `NODE_ENV` | Environment | `production` |

**Important:** `server/.env` is gitignored and never committed.

#### CORS

`server/server.js` reads the CORS origin from `process.env.CLIENT_URL` and accepts cookies with it.
When you move the frontend to another origin, set `CLIENT_URL` to that frontend origin.

### Frontend (`client/`)

1. Vite serves the frontend statically.
2. If the frontend is served from a different origin than the backend, set `VITE_API_URL` in the Vercel
   environment variables to the backend origin (for example `https://resqlink-backend.onrender.com`).
3. If you cannot publish a Vercel environment variable, `client/src/services/api.js` falls back to a local
   `client/.env.js` file with the same `VITE_API_URL` value. Provide the file only to the client build; do
   not commit secrets. The built frontend is served as static assets from `client/dist`.

## Deployment Steps

### 1. GitHub

The repository is already on GitHub at the URL above. Push changes with:

```bash
git add -A && git commit -m "message" && git push origin main
```

### 2. Backend — Render (Free Tier)

1. Create a new **Web Service** on [render.com](https://render.com).
2. Connect the GitHub repo.
3. Set these **Environment Variables** (never commit `.env`):
   - `PORT` = `5000`
   - `MONGO_URI` = MongoDB Atlas connection string
   - `JWT_SECRET` = generate a random string
   - `JWT_EXPIRE` = `7d`
   - `CLIENT_URL` = your deployed frontend URL
   - `NODE_ENV` = `production`
4. Render auto-detects the `start` script: `node server.js`.
5. Render deploys from `server/` (or you can use the root repo and configure the start command).

### 3. Frontend — Vercel

1. Import the GitHub repo into [vercel.com](https://vercel.com).
2. Set the framework as **React** (or Vite).
3. Build and output settings:
   - **Build Command:** `npm run build` (from the repo root)
   - **Output Directory:** `client/dist`
4. Add environment variable `VITE_API_URL` if needed (defaults to relative `/api`).
5. Deploy.

> **Vercel build hook (why the fix was needed).** Vercel runs `npm run build` from a fresh shell where
> `client/node_modules/.bin` is not on `PATH`, so `cd client && npm run build` failed with
> `sh: line 1: vite: command not found` (exit 127). The repo root `package.json` now declares the
> frontend build as `"build": "npm run build"` and Vercel's npm runner prepends
> `client/node_modules/.bin` to `PATH` before executing it, which makes the `vite` binary resolve.
> The build command to use in Vercel is still `npm run build` from the repo root; the root-level script
> is the only change that needed to satisfy Vercel's execution model.

## Database — MongoDB Atlas

1. Create a free **M0 cluster** at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Create a database user (username/password).
3. Whitelist your IP addresses (or use `0.0.0.0/0` for a demo, but restrict in production).
4. Copy the **Connection String** (SRV format).
5. Replace `MONGO_URI` in the backend env vars with the SRV string.
6. Run the seed script to populate demo data:

```bash
cd server && npm run seed
```

### Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@resqlink.demo | demo1234 |
| Citizen | citizen@resqlink.demo | demo1234 |
| Volunteer | volunteer@resqlink.demo | demo1234 |

## Verification

After deployment:

1. Open the public frontend URL.
2. Login with a demo account.
3. Test emergency reporting, admin dashboard, GIS map.
4. Verify the backend health endpoint: `https://<backend-url>/api/health`
5. Verify authentication: the backend must reject requests without a valid token and return a `401` on
   `/api/auth/me` when the token is missing or expired.
6. If you set `VITE_API_URL`, verify the frontend can still report emergencies and fetch the admin dashboard
   from the Vercel origin.

## CI/CD

- `npm run build` — builds the frontend (Vercel build command)
- `npm run seed` — seeds the database (backend)
- `npm run dev:server` — runs backend with nodemon
- `npm run dev:client` — runs frontend dev server

## Notes

- `mongodb.zip` and `mongodb-temp/` are excluded from the repository (too large for GitHub).
- `node_modules/`, `.env`, `dist/`, `*.log`, and `.env.local` are gitignored in `server/.gitignore`.
- `client/.gitignore` excludes `node_modules/` and `.env`.
- No secrets, credentials, API keys, or Atlas connection strings should be committed to this repository.

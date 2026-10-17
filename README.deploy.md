# 🚑 ResQLink — Deployment Guide

This document describes how to deploy the ResQLink emergency response platform to production.

## Repository

- **GitHub:** https://github.com/Pranav5520/ResQLink-Project
- **Branch:** `main`

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
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://<user>:<pass>@cluster.mongodb.net/resqlink` |
| `JWT_SECRET` | Secret for JWT signing | (generate a random 64-char string) |
| `JWT_EXPIRE` | Token expiry | `7d` |
| `CLIENT_URL` | Frontend URL | `https://resqlink-frontend.vercel.app` |
| `NODE_ENV` | Environment | `production` |

**Important:** `server/.env` is gitignored and never committed.

### Frontend (`client/`)

1. Vite serves the frontend statically.
2. Set `VITE_API_URL` in the Vercel environment variables if your backend is hosted elsewhere.
3. The `client/src/services/api.js` uses relative `/api` paths, so the backend must be reachable at the same origin or via CORS.

### CORS

The backend's `server.js` has CORS configured to allow `CLIENT_URL`. Update it when deploying.

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
   - **Build Command:** `npm run build` (from `client/`)
   - **Output Directory:** `client/dist`
4. Add environment variable `VITE_API_URL` if needed (defaults to relative `/api`).
5. Deploy.

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

## CI/CD

- `npm run build` — builds the frontend
- `npm run seed` — seeds the database (backend)
- `npm run dev:server` — runs backend with nodemon
- `npm run dev:client` — runs frontend dev server

## Notes

- `mongodb.zip` is excluded from the repository (too large for GitHub).
- `mongodb-temp/` — temporary MongoDB data directory (gitignored).
- No secrets, credentials, or API keys should be committed to this repository.

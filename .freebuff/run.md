# Run Doc — ResQLink Preview

## How to Reproduce Artifacts
1. `cd server && npm install`
2. `cd client && npm install`

No `.env.local` or secrets needed — `start-dev.js` sets PORT, JWT_SECRET, and in-memory MongoDB automatically.

## How to Run the Server

### Backend (API + in-memory MongoDB)
```bash
cd server
node start-dev.js
```
> ⚠️ Do NOT use `npm run dev` in `server/` — that script runs `nodemon server.js`, which expects an external MongoDB and doesn't seed. Always start the backend with `node start-dev.js`.
- Starts Express on port 5000
- Starts mongodb-memory-server (no local MongoDB needed)
- Auto-seeds demo data on first run
- Returns health at `GET /api/health`

### Frontend (Vite dev server)
```bash
cd client
npm run dev
```
- Starts Vite on port 5173
- Proxies `/api/*` to backend at port 5000
- Open http://localhost:5173 in browser

### Demo Accounts
- Admin: admin@resqlink.demo / demo1234
- Citizen: citizen@resqlink.demo / demo1234
- Volunteer: volunteer@resqlink.demo / demo1234

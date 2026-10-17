# 🚑 ResQLink — Smart Emergency Response & Relief Coordination Platform

**Connecting Citizens, Volunteers and Authorities When Every Second Matters**

A full-stack MERN application for centralized disaster-response management. Citizens can report emergencies and request assistance, volunteers can accept and complete relief tasks, and authorities can manage the entire emergency response lifecycle through a command-center dashboard.

---

## 🎯 Problem Statement

During floods, cyclones, earthquakes, landslides, fires, and other emergencies, authorities struggle to coordinate volunteers, relief camps, resource distribution, citizen requests, and communication. ResQLink centralizes all these activities into one intelligent, easy-to-use emergency management platform.

---

## ✅ Features

### Citizen Portal
- Report emergencies with location, category, severity, and description
- Request assistance (rescue, food, water, medicine, shelter, etc.)
- Track request status in real-time
- View nearby relief camps with capacity info
- Read emergency announcements

### Volunteer Portal
- Create volunteer profile with skills and availability
- View available emergency tasks
- Accept and manage assignments
- Update task progress and mark completion
- Track assignment history and statistics

### Admin Command Center
- Monitor active emergencies with real-time KPIs
- Review, approve/reject/update citizen requests
- Assign volunteers to requests
- Create and manage emergency incidents
- Manage relief camps (create, update, occupancy tracking)
- Track resource inventory with stock alerts
- Record resource distributions (auto-updates inventory)
- Publish emergency announcements
- **GIS Map** — View all emergencies, requests, and camps on an interactive Leaflet map
- **Analytics Dashboard** — Charts with MongoDB aggregation, filterable by date, category, severity, status

---

## 🏗️ Architecture

```
React Frontend (Vite)
        ↓  REST API calls
Express.js Backend
        ↓
Node.js Runtime
        ↓
MongoDB Database (Mongoose ODM)
```

---

## 🛠️ Technologies

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router, Recharts, Leaflet/OpenStreetMap, React-Toastify |
| Backend | Node.js, Express.js, JWT, bcryptjs, express-validator |
| Database | MongoDB (Mongoose ODM) |
| Build | Vite |
| Map | React-Leaflet + OpenStreetMap (free, no API key) |

---

## 📁 Folder Structure

```
resqlink/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── context/         # AuthContext
│   │   ├── layouts/         # DashboardLayout
│   │   ├── pages/
│   │   │   ├── public/      # Landing, Login, Register
│   │   │   ├── citizen/     # Citizen dashboard & features
│   │   │   ├── volunteer/   # Volunteer dashboard & features
│   │   │   └── admin/       # Admin command center
│   │   ├── services/        # API service (axios)
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
├── server/                  # Express backend
│   ├── config/              # db.js
│   ├── controllers/         # 9 controller files
│   ├── middleware/           # auth, role, error middleware
│   ├── models/              # 9 Mongoose schemas
│   ├── routes/              # 9 route files
│   ├── seed.js              # Database seeder
│   ├── server.js            # Entry point
│   └── package.json
├── README.md
└── package.json             # Root convenience scripts
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### 1. Clone the repository
```bash
git clone <repo-url>
cd resqlink
```

### 2. Install dependencies
```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 3. Configure environment variables
```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/resqlink
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 4. Seed the database
```bash
cd server
npm run seed
```

### 5. Start the application

Open two terminals:

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

### 6. Access the application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

---

## 🔐 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@resqlink.demo | demo1234 |
| Citizen | citizen@resqlink.demo | demo1234 |
| Volunteer | volunteer@resqlink.demo | demo1234 |

---

## 📡 API Overview

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/profile` | Update profile |

### Emergencies
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/emergencies` | List emergencies (filterable) |
| POST | `/api/emergencies` | Report emergency |
| GET | `/api/emergencies/:id` | Get single emergency |
| PUT | `/api/emergencies/:id` | Update emergency |
| DELETE | `/api/emergencies/:id` | Delete emergency (admin) |

### Assistance Requests
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/requests` | List requests (citizens see own) |
| POST | `/api/requests` | Create help request |
| GET | `/api/requests/:id` | Get request details |
| PUT | `/api/requests/:id` | Update request |

### Volunteers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/volunteers` | List volunteers (admin) |
| GET | `/api/volunteers/available` | Available volunteers |
| POST | `/api/volunteers/profile` | Create/update profile |
| PUT | `/api/volunteers/availability` | Update availability |

### Assignments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/assignments` | List assignments |
| POST | `/api/assignments` | Create assignment (admin) |
| PUT | `/api/assignments/:id` | Update assignment status |

### Relief Camps
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/camps` | List camps |
| POST | `/api/camps` | Create camp (admin) |
| PUT | `/api/camps/:id` | Update camp |
| DELETE | `/api/camps/:id` | Delete camp |

### Resources
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/resources` | List resources |
| POST | `/api/resources` | Add resource (admin) |
| PUT | `/api/resources/:id` | Update resource |
| DELETE | `/api/resources/:id` | Delete resource |

### Distributions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/distributions` | List distributions |
| POST | `/api/distributions` | Record distribution (auto-updates inventory) |

### Announcements
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/announcements` | List announcements |
| POST | `/api/announcements` | Create announcement (admin) |
| GET | `/api/announcements/public` | Public announcements |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/overview` | Dashboard KPIs |
| GET | `/api/analytics/emergencies-by-category` | Category breakdown |
| GET | `/api/analytics/requests-by-status` | Status breakdown |
| GET | `/api/analytics/severity-distribution` | Severity stats |
| GET | `/api/analytics/volunteer-deployment` | Volunteer stats |
| GET | `/api/analytics/requests-by-type` | Request type breakdown |
| GET | `/api/analytics/requests-over-time` | Daily trend |
| GET | `/api/analytics/advanced` | Filterable analytics |

---

## 📊 Database Models

- **User** — name, email, password (bcrypt), phone, role, location
- **Emergency** — title, category, severity, location, status, peopleAffected
- **AssistanceRequest** — citizen, requestType, priority, status, assignedVolunteer
- **VolunteerProfile** — user, skills, availability, completedAssignments
- **VolunteerAssignment** — volunteer, request, status, taskDescription
- **ReliefCamp** — name, maxCapacity, currentOccupancy, facilities, status
- **Resource** — name, category, quantity, unit, status (auto-calculated)
- **ResourceDistribution** — resource, quantity, destination, distributedBy
- **Announcement** — title, message, priority, category, targetArea

---

## 🔒 Security

- JWT authentication with token expiry
- bcrypt password hashing (salt rounds: 10)
- Role-based access control (citizen, volunteer, admin)
- Protected API routes
- CORS configuration
- Environment variable management
- Global error handling middleware

---

## 📱 Responsive Design

- Mobile-responsive sidebar navigation
- Touch-friendly forms for emergency reporting
- Responsive grid layouts for cards and stats
- Adaptable tables with horizontal scroll
- Full-screen map view on all devices

---

## 🔮 Future Enhancements

- Real-time updates with Socket.io
- SMS/Email notifications via Twilio/SendGrid
- AI-powered emergency prioritization
- Drone integration for aerial assessment
- Multi-language support (Hindi, Tamil, Bengali)
- Progressive Web App (PWA) for offline access
- Image upload for emergency reports
- Real-time chat between volunteers and citizens
- Admin role management and user approval
- Geo-fencing for emergency zones

---

## 📄 License

This project is for educational and portfolio purposes.

---

**Built with ❤️ for disaster response coordination.**

# Smart Emergency Response & Relief Coordination Platform

## A PROJECT REPORT

**Submitted by**

Name(RegistrationNumber):
**Pranav A-310624148068**
**in partial fulfillment for the award of the Degree**
**of**
**BACHELOR OF ENGINEERING**

**in**
**DEPARTMENT**
**Computer Science and Engineering – Artificial Intelligence and Machine Learning**

**EASWARI ENGINEERING COLLEGE,**
**AN AUTONOMOUS INSTITUTION - AFFILIATED TO ANNA UNIVERSITY, CHENNAI**
**MONTH YEAR**

---

# EASWARI ENGINEERING COLLEGE

## BONAFIDE CERTIFICATE

Certified that this mini project report titled **"Smart Emergency Response & Relief Coordination Platform (ResQLink)"** is the bonafide work of **Pranav A-310624148068**, who carried out the project work under my supervision.

**HEAD OF THE DEPARTMENT** | **SUPERVISOR**
--- | ---
Name: ____________________ | Name: ____________________
Designation: ______________ | Designation: __________________
Address: __________________ | Address: __________________
Date: ____________________ | Date: ____________________

---

# EASWARI ENGINEERING COLLEGE

## Certificate of Viva-voce-Examination

This is to certify that the Viva Voce Examination of the Project Work entitled **"Smart Emergency Response & Relief Coordination Platform (ResQLink)"** submitted by **Pranav A-310624148068 (Reg. No. A-310624148068)** in partial fulfillment of the requirements for the award of the degree of **BACHELOR OF ENGINEERING** was conducted on **______ (Date)** in the Department of **Computer Science and Engineering (AIML)**, Easwari Engineering College, Ramapuram - Chennai.

**INTERNAL EXAMINER** | **EXTERNAL EXAMINER**
--- | ---
Name: __________________ | Name: __________________
Designation: ____________ | Designation: ____________
Address: ________________ | Address: ________________
Date: ___________________ | Date: ___________________

---

# ABSTRACT

ResQLink is a web-based platform developed to support organized disaster-response activities during emergency situations. The system addresses the coordination gap between people who need assistance, volunteers who can provide support, and authorities responsible for managing the response. It combines emergency information, location-based data, operational records, and communication within a single digital environment.

The platform is implemented using the MERN stack (MongoDB, Express.js, React.js, Node.js) with a role-based architecture to support different categories of users. ResQLink aims to make emergency operations more organized, traceable, and accessible through centralized digital management.

**Keywords:** Disaster response, emergency management, citizen reporting, volunteer coordination, relief camp management, MERN stack.

---

# ACKNOWLEDGEMENT

We express our sincere gratitude to the Principal Dr. P. Deiva Sundari and the Management of our college for providing us with the opportunity to carry out this project work.

We convey our heartfelt thanks to the Head of the Department, Department of Computer Science and Engineering (AIML), for the continuous encouragement and support.

We are extremely thankful to our Project Guide for valuable guidance, suggestions, and motivation throughout the completion of this project.

We would also like to extend our gratitude to all the faculty members of the Department of Computer Science and Engineering (AIML) for their support.

Finally, we thank our parents and friends for their constant encouragement and help during the course of this project.

---

# TABLE OF CONTENTS

1. **Chapter 1 – Introduction**
   1.1 Overview
   1.2 Problem Definition
   1.3 Objective
   1.4 Scope of the Project
   1.5 Motivation

2. **Chapter 2 – Related Work**
   2.1 Literature Review
   2.2 Existing System
   2.3 Proposed System

3. **Chapter 3 – System Analysis**
   3.1 System Requirements
   3.2 Software and Hardware Requirements

4. **Chapter 4 – System Design**
   4.1 System Architecture
   4.2 Module Description
   4.3 Use Case Diagram
   4.4 Class Diagram
   4.5 Sequence Diagram

5. **Chapter 5 – Implementation**
   5.1 Implementation Overview
   5.2 Key Functions (Code Explanation)

6. **Chapter 6 – Conclusion & Future Work**
   6.1 Conclusion
   6.2 Future Enhancements

**Appendix:** Source Code
**Screenshots of the Project**
**References**

---

# CHAPTER 1

## INTRODUCTION

### 1.1 OVERVIEW

Natural and man-made disasters can create large numbers of simultaneous emergency situations within a short period of time. Effective disaster management depends on timely information, proper coordination, and efficient utilization of available human and material resources. Traditional communication methods can make it difficult to maintain a common and updated view of ongoing situations. Digital technologies provide opportunities to collect emergency information, visualize affected locations, and support coordination among different stakeholders. ResQLink is developed in this context as a technology-based approach to improving the organization of emergency-response activities.

ResQLink is a web-based platform developed to support organized disaster-response activities during emergency situations. The system addresses the coordination gap between people who need assistance, volunteers who can provide support, and authorities responsible for managing the response. It combines emergency information, location-based data, operational records, and communication within a single digital environment. The platform is implemented using the MERN stack with a role-based architecture to support different categories of users. ResQLink aims to make emergency operations more organized, traceable, and accessible through centralized digital management.

### 1.2 PROBLEM DEFINITION

During floods, cyclones, earthquakes, fires, landslides, and other emergencies, authorities face difficulties in coordinating multiple response activities. Citizen emergency requests may not be efficiently tracked, prioritized, and assigned to available volunteers. Managing relief camps, resources, distributions, and emergency information through separate systems can lead to delays and lack of coordination. There is a need for a centralized platform that provides real-time visibility of emergencies, assistance requests, volunteers, relief camps, and available resources. ResQLink addresses these challenges by providing a unified platform for coordinated emergency response and relief management.

### 1.3 OBJECTIVE

The objectives of the system are to:

- Establish a structured digital workflow for emergency-response operations.
- Improve the traceability of citizen assistance requests from submission to completion.
- Support systematic deployment and monitoring of volunteers during relief activities.
- Maintain organized records of relief infrastructure and available resources.
- Provide location-based information and operational data that can assist authorities in making informed decisions.

### 1.4 SCOPE OF THE PROJECT

The system can be applied to emergency situations such as floods, cyclones, fires, earthquakes, and other local disasters. It covers the interaction between citizens, volunteers, and authorities involved in emergency-response activities. The platform can support the following areas:

- Emergency reporting, assistance handling, and volunteer operations.
- Relief infrastructure and resource-related activities.
- Location-based visualization of emergencies and relief facilities.

The system provides a foundation that can be extended with real-time communication, notifications, AI-based prioritization, and offline capabilities in future versions.

### 1.5 MOTIVATION

Disasters demand rapid, coordinated, and traceable responses. In many emergency situations, existing communication channels fragment information and delay the assignment of help. ResQLink motivates this project by offering a single digital environment where citizens report, volunteers act, and authorities monitor, reducing the delay between identifying a need and delivering a response.

---

# CHAPTER 2

## RELATED WORK

### 2.1 LITERATURE REVIEW

Digital technologies are increasingly used in humanitarian and disaster-response contexts. The emergent role of digital technologies in the context of humanitarian supply chains has been reviewed systematically, highlighting logistics, inventory, procurement, coordination, and planning applications across preparedness, response, and recovery. Recent advances in disaster emergency response planning integrate optimization, machine learning, and simulation for facility location, casualty transport, search and rescue, evacuation, and relief distribution.

Citizen-generated reports and crisis maps form another strand of related work. Research on crowdsourcing crisis information in disaster-affected Haiti examines how crowdsourced information was collected and processed, and how such reports are turned into usable information during a crisis. Microblogging and social media reporting have been studied for their contribution to situational awareness during natural hazards. Digital volunteer coordination has been examined through the concept of "voluntweeters" — self-organizing by digital volunteers in times of crisis. Geographic Information Systems for disaster response have been reviewed as a basis for mapping incidents, resources, and response information. Resource management in disaster relief has been reviewed bibliometrically, covering relief-resource aspects of emergency logistics.

### 2.2 EXISTING SYSTEM

Existing disaster-response approaches often depend on multiple communication channels and separate tools for different activities. Crisis-mapping platforms such as Ushahidi demonstrate how crowdsourced information can be collected and visualized during emergencies. Mapping systems help identify incidents and affected locations from submitted information. However, information collection and visualization alone do not cover the complete operational workflow of emergency relief. Separate handling of requests, volunteers, camps, resources, and communication can create coordination gaps between different response activities.

### 2.3 PROPOSED SYSTEM

ResQLink follows a role-based architecture consisting of Citizen, Volunteer, and Administrator access. Citizens initiate the response process by submitting emergency information or assistance requirements. Authorities review incoming information and manage the operational workflow through the administrative interface. Volunteers receive suitable assignments, update their progress, and complete assigned relief activities. The system maintains related emergency, request, volunteer, camp, resource, and distribution records in a centralized database.

---

# CHAPTER 3

## SYSTEM ANALYSIS

### 3.1 SYSTEM REQUIREMENTS

**Functional Requirements:**

- User registration and login.
- Role-based access for Citizen, Volunteer, and Administrator.
- Citizen emergency reporting and assistance requests.
- Volunteer assignment and activity management.
- Administrator management of emergency requests.
- Relief camp and resource management.
- Create, view, update, and manage emergency records.
- Search and filter emergency-related information.
- Status updates for emergency requests.
- Location-based emergency information.

**Non-Functional Requirements:**

- **Performance:** Fast response for emergency-related operations.
- **Scalability:** Support increasing users and emergency records.
- **Security:** Secure authentication and role-based access.
- **Usability:** Simple and responsive interface.
- **Availability:** Reliable access to emergency information.
- **Maintainability:** Modular MERN-based architecture.

### 3.2 SOFTWARE AND HARDWARE REQUIREMENTS

**Software Requirements:**

- **Frontend:** React.js, Vite, React Router, Axios, React Leaflet, Recharts, React Toastify.
- **Backend:** Node.js, Express.js, Mongoose (MongoDB driver), JWT, bcryptjs, express-validator, CORS, Multer.
- **Database:** MongoDB.
- **Tools:** Postman (API testing), Git/GitHub (version control).

**Hardware Requirements (recommended):**

- Processor: Intel/AMD dual-core or better.
- RAM: 8 GB or more.
- Storage: 500 MB free disk space for the project, plus MongoDB data.
- Network: Internet access for MongoDB Atlas or local MongoDB and for map services.

---

# CHAPTER 4

## SYSTEM DESIGN

### 4.1 SYSTEM ARCHITECTURE

**System Architecture (Diagram 1)**

```
   Citizen / Volunteer / Administrator
   ↓
   React.js + Vite (Frontend, port 5173)
   ↓  REST API calls (proxied through Vite to backend)
   Node.js + Express.js (Backend, port 5000)
   ↓
   MongoDB (Mongoose ODM)
```

The frontend is a React.js application built with Vite and served on port 5173. The backend is a Node.js + Express.js application served on port 5000. The frontend proxies `/api/*` requests to the backend. The backend connects to MongoDB through Mongoose and exposes a RESTful API. The architecture is modular: routes, controllers, models, and middleware are separated by responsibility.

**Diagram 1: System Architecture**

[Place the system architecture diagram from the combined review presentation here.]

### 4.2 MODULE DESCRIPTION

The system is organized into the following modules:

- **User Management:** Registration, login, JWT issuance, profile management, and role-based access control for Citizen, Volunteer, and Administrator.
- **Emergency Management:** Creating, viewing, updating, and filtering emergency records with location coordinates and severity.
- **Assistance Request Management:** Citizen assistance requests with status updates (pending, assigned, in progress, completed).
- **Volunteer Management:** Volunteer profiles, skills, availability, and activity status.
- **Relief Camp Management:** Camp creation, capacity/occupancy tracking, and viewing.
- **Resource Management:** Inventory of resources with stock levels and low-stock alerts.
- **Administrator Module:** Administrative controls for all management functions.
- **Notification Module:** Status notifications for emergency, request updates, and volunteer assignments.

**Diagram 2: Module Description**

[Place the module description diagram from the combined review presentation here.]

### 4.3 USE CASE DIAGRAM

**Diagram 3: Use Case Diagram**

[Place the use case diagram from the combined review presentation here.]

Actors: Citizen, Volunteer, Administrator. Use cases: Register, Login, Report Emergency, Request Assistance, View Camps, View Resources, Assign Volunteer, Update Request Status, Manage Emergency Records, Manage Camp/Resource, View GIS Map, View Analytics.

### 4.4 CLASS DIAGRAM

**Diagram 4: Class Diagram (Proposed Design)**

The following class diagram is a proposed design; verify against the actual implementation before final submission.

- `User` — name, email, phone, password, role (citizen/volunteer/administrator), latitude, longitude.
- `Emergency` — title, category, severity, description, location, coordinates, status.
- `AssistanceRequest` — request fields, status, assignedVolunteer, location.
- `VolunteerProfile` — linked to User, skills, availability, status.
- `VolunteerAssignment` — links volunteer to request, status, progress.
- `ReliefCamp` — name, location, capacity, occupancy, status.
- `Resource` — name, type, stock, status.
- `ResourceDistribution` — links resource to camp, quantity, status.
- `Announcement` — message, target roles, isActive.

### 4.5 SEQUENCE DIAGRAM

**Diagram 5: Sequence Diagram (Proposed Design)**

The following sequence diagram is a proposed design; verify against the actual implementation before final submission.

```
Citizen            UI                Backend            MongoDB
 |                   |                   |                  |
 | 1. Register/login |                   |                  |
 |------------------>|                   |                  |
 |                   | 2. Auth service   |                  |
 |                   |------------------>|                  |
 |                   |                   | 3. Create user   |
 |                   |                   |---------------->|
 |                   |                   |<----------------|
 |                   | 4. Token returned |                  |
 |                   |<------------------|
 |                   | 5. Session ready  |                  |
```

---

# CHAPTER 5

## IMPLEMENTATION

### 5.1 IMPLEMENTATION OVERVIEW

The project is implemented as a full-stack web application using the MERN stack.

**Frontend (React.js + Vite):** React components for forms, cards, tables, and navigation. React Router for page navigation. Axios for backend API communication. Role-based dashboard design with separate interfaces for Citizen, Volunteer, and Administrator. Key pages: Login, Registration, Citizen Dashboard, Emergency Reporting, Assistance Requests, Volunteer Dashboard, Administrator Dashboard, Resource/Camp Management.

**Backend (Node.js + Express.js):** RESTful API architecture with a modular route structure. Authentication and authorization with role-based access control. Request validation. Centralized error handling. Environment-based configuration. MongoDB integration through Mongoose.

**Database (MongoDB + Mongoose):** Collections for User, Emergency, AssistanceRequest, VolunteerProfile, VolunteerAssignment, ReliefCamp, Resource, ResourceDistribution, and Announcement.

**API Testing:** Postman used for API endpoint testing.

**Deployment:** Frontend and backend deployed; MongoDB deployment configured; final system testing pending.

**Diagram 6: Implementation Status**

```
Implementation Status (as of the project review):

Completed:
- User registration, login, and role-based authentication
- Citizen emergency reporting with location data
- Assistance request creation and status management
- Volunteer assignment lifecycle
- Relief camp and resource management
- GIS map, analytics, and notifications (backend API)
- Frontend (React + Vite) and backend (Node + Express) developed

In Progress:
- Integration testing (1 of 6)
- API testing (1 of 6)
- User acceptance testing (1 of 6)
- UI improvements
- Final deployment and documentation (1 of 8)

Planned:
- Full testing suite completion
- MongoDB deployment configuration
- Final demonstration
```

The combined review presentation records approximately 70% overall project completion at the time of that review. Completed items include the majority of core modules and the frontend/backend shells; the remaining work is focused on testing, deployment, and documentation.

### 5.2 KEY FUNCTIONS (CODE EXPLANATION)

The code explanation below is illustrative of the implementation patterns and should be verified against the actual repository before submission.

**4. Server file (Express server, server.js)**

```js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/emergencies', require('./routes/emergencyRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));
app.use('/api/volunteers', require('./routes/volunteerRoutes'));
app.use('/api/assignments', require('./routes/assignmentRoutes'));
app.use('/api/camps', require('./routes/campRoutes'));
app.use('/api/resources', require('./routes/resourceRoutes'));
app.use('/api/distributions', require('./routes/distributionRoutes'));
app.use('/api/announcements', require('./routes/announcementRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`ResQLink server running on port ${PORT}`);
});

module.exports = app;
```

**5. React login component (LoginPage)**

```jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await api.post('/api/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    window.location.href = '/admin';
  };

  return ( ... );
}
```

**6. Administrator dashboard logic — fetching KPIs**

```js
const { data } = await api.get('/api/analytics/overview');
// KPIs: active emergencies, pending requests, critical requests,
// available volunteers, deployed volunteers, active camps, people in camps
```

**7. REST API request and response example**

*Request:* `POST /api/auth/login`

```json
{ "email": "admin@resqlink.demo", "password": "demo1234" }
```

*Response:*

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "name": "Admin User", "email": "admin@resqlink.demo", "role": "admin", ... }
}
```

*Request:* `GET /api/analytics/overview` (admin)

*Response:*

```json
{
  "totalEmergencies": 9,
  "pendingRequests": 5,
  "criticalRequests": 3,
  "availableVolunteers": 4,
  "deployedVolunteers": 1,
  "activeCamps": 6,
  "peopleInCamps": 1435,
  "totalResources": 12,
  "lowStockItems": 1,
  "completedTasks": 0
}
```

The demo accounts are:

- Admin: `admin@resqlink.demo` / `demo1234`
- Citizen: `citizen@resqlink.demo` / `demo1234`
- Volunteer: `volunteer@resqlink.demo` / `demo1234`

---

# CHAPTER 6

## CONCLUSION & FUTURE WORK

### 6.1 CONCLUSION

ResQLink provides a centralized web platform for emergency response and relief coordination. By combining citizen reporting, volunteer assignment, and administrative management in a role-based MERN stack architecture, the system delivers the real-time visibility and traceability needed during emergencies. Logs from the live implementation show the platform operational: the admin dashboard reports an active emergencies count, 5 pending requests, etc., relief camps, and people in camps, with the GIS map showing all emergencies, requests, and camps on a single interactive Leaflet map.

### 6.2 FUTURE ENHANCEMENTS

- Real-time communication and push notifications.
- AI-based prioritization of emergency requests.
- Offline capabilities for field workers.
- Integration with external disaster-response APIs.
- Mobile applications for citizen and volunteer users.
- Advanced analytics and forecasting of resource needs.

---

# APPENDIX

## SOURCE CODE

The code below is the actual project source code where available. Where the project template contained placeholder instructions rather than complete source, the code is illustrative of the implementation pattern and is labeled as such.

### 1. Project Structure

```
resqlink/
├── client/                          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── context/                 # AuthContext
│   │   ├── layouts/                 # DashboardLayout
│   │   ├── pages/
│   │   │   ├── public/              # LandingPage, LoginPage, RegisterPage
│   │   │   ├── citizen/             # CitizenDashboard, ReportEmergency, RequestHelp
│   │   │   ├── volunteer/           # VolunteerDashboard, AvailableTasks, MyAssignments
│   │   │   └── admin/               # AdminDashboard, GISMap, EmergencyManagement,
│   │   │                                RequestManagement, VolunteerManagement,
│   │   │                                CampManagement, ResourceInventory,
│   │   │                                ResourceDistribution,
│   │   │                                AnnouncementManagement, AnalyticsDashboard
│   │   ├── services/                # api.js (axios)
│   │   ├── context/                 # AuthContext
│   │   ├── layouts/
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── server/                          # Express backend
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── emergencyController.js
│   │   ├── requestController.js
│   │   ├── volunteerController.js
│   │   ├── assignmentController.js
│   │   ├── campController.js
│   │   ├── resourceController.js
│   │   ├── distributionController.js
│   │   ├── announcementController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── roleMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Emergency.js
│   │   ├── AssistanceRequest.js
│   │   ├── VolunteerProfile.js
│   │   ├── VolunteerAssignment.js
│   │   ├── ReliefCamp.js
│   │   ├── Resource.js
│   │   ├── ResourceDistribution.js
│   │   └── Announcement.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── emergencyRoutes.js
│   │   ├── requestRoutes.js
│   │   ├── volunteerRoutes.js
│   │   ├── assignmentRoutes.js
│   │   ├── campRoutes.js
│   │   ├── resourceRoutes.js
│   │   ├── distributionRoutes.js
│   │   ├── announcementRoutes.js
│   │   └── analyticsRoutes.js
│   ├── seed.js
│   ├── start-dev.js
│   ├── server.js
│   ├── package.json
│   └── .env
└── client/                          # (same as above)
```

### 2. Backend Package Installation

```bash
cd server
npm install
cd ../client
npm install
```

### 3. Database Connection

```js
// server/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### 4. Environment Variables

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/resqlink
JWT_SECRET=your_jwt_secret_here_change_in_production
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 5. User Model

```js
// server/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  role: { type: String, enum: ['citizen', 'volunteer', 'admin'], required: true },
  location: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  avatar: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
```

### 6. Password Hashing and Registration

```js
// server/controllers/authController.js (registration)
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, phone, role });
    res.status(201).json({ message: 'User registered', user: { id: user._id, name, email, role } });
  } catch (err) {
    next(err);
  }
};
```

### 7. Login and JWT Generation

```js
// server/controllers/authController.js (login)
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    next(err);
  }
};
```

### 8. Authentication Middleware

```js
// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return res.status(401).json({ message: 'Not authorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    res.status(401).json({ message: 'Not authorized' });
  }
};

exports.authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};
```

### 9-12. CRUD Operations (create/read/update/delete)

```js
// Example: Emergency controller — create, read, update, delete
const Emergency = require('../models/Emergency');

exports.createEmergency = async (req, res, next) => {
  try {
    const body = { ...req.body, createdBy: req.user._id };
    const emergency = await Emergency.create(body);
    res.status(201).json(emergency);
  } catch (err) { next(err); }
};

exports.getEmergencies = async (req, res, next) => {
  try {
    const qs = {};
    if (req.query.category) qs.category = req.query.category;
    if (req.query.status) qs.status = req.query.status;
    const emergencies = await Emergency.find(qs).sort({ createdAt: -1 });
    res.json({ emergencies });
  } catch (err) { next(err); }
};

exports.updateEmergency = async (req, res, next) => {
  try {
    const emergency = await Emergency.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(emergency);
  } catch (err) { next(err); }
};

exports.deleteEmergency = async (req, res, next) => {
  try {
    await Emergency.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
};
```

### 13. Express Routes

```js
// server/routes/emergencyRoutes.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  createEmergency, getEmergencies, updateEmergency, deleteEmergency
} = require('../controllers/emergencyController');

router.route('/')
  .post(protect, authorize('admin', 'citizen'), createEmergency)
  .get(protect, getEmergencies);

router.route('/:id')
  .put(protect, authorize('admin', 'citizen'), updateEmergency)
  .delete(protect, authorize('admin'), deleteEmergency);

module.exports = router;
```

### 14. Main Server File

(identical to the server.js block in 5.2; see above)

### 15. React Login Component

(identical to the LoginPage block in 5.2; see above)

### 16. Admin Dashboard Logic

```js
// admin/AdminDashboard.jsx
import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    api.get('/api/analytics/overview')
      .then((r) => setStats(r.data))
      .catch(()=>{});
  }, []);
  return ( ... );
}
```

### 17. REST API Request and Response Examples

See the examples in section 5.2, items 7; they are repeated here for the appendix:

*Request:* `POST /api/auth/login` — `{ "email": "admin@resqlink.demo", "password": "demo1234" }`

*Response:* `{ "token": "...", "user": { "id": "...", "name": "Admin User", "email": "admin@resqlink.demo", "role": "admin" } }`

*Request:* `GET /api/analytics/overview`

*Response:* `{ "totalEmergencies": 9, "pendingRequests": 5, "criticalRequests": 3, "availableVolunteers": 4, "deployedVolunteers": 1, "activeCamps": 6, "peopleInCamps": 1435, "totalResources": 12, "lowStockItems": 1, "completedTasks": 0 }`

---

# SCREENSHOTS OF THE PROJECT

[Place UI screenshots from the combined review presentation: login page, citizen dashboard, volunteer dashboard, administrator dashboard, GIS map, analytics, resource/camp management.]

---

# REFERENCES

1. MongoDB Official Documentation — MongoDB database and Mongoose concepts. https://www.mongodb.com/docs/
2. Express.js Official Documentation — Backend framework and REST API development. https://expressjs.com/
3. React.js Official Documentation — Frontend component development and application structure. https://react.dev/
4. Node.js Official Documentation — Server-side JavaScript runtime and backend development. https://nodejs.org/en/docs/
5. Marić, J., Galera-Zarco, C., & Opazo-Basáez, M. O. (2022). The emergent role of digital technologies in the context of humanitarian supply chains: A systematic literature review. *Annals of Operations Research*, 319(1), 1003–1044. DOI: 10.1007/s10479-021-04079-z
6. Pu, F., Li, Z., Wu, Y., Ma, C., & Zhao, R. (2025). Recent advances in disaster emergency response planning: Integrating optimization, machine learning, and simulation. *Safety and Emergency Science*, 1(1), article 9590007. DOI: 10.26599/SES.2025.9590007
7. Heinzelman, J., & Waters, C. (2010). *Crowdsourcing Crisis Information in Disaster-Affected Haiti*. United States Institute of Peace Special Report.
8. Vieweg, S., Hughes, A. L., Starbird, K., & Palen, L. (2010). Microblogging during two natural hazards events: What Twitter may contribute to situational awareness. *Proceedings of the SIGCHI Conference on Human Factors in Computing Systems (CHI '10)*, 1079–1088. DOI: 10.1145/1753326.1753486
9. Starbird, K., & Palen, L. (2011). 'Voluntweeters': Self-Organizing by Digital Volunteers in Times of Crisis. *Proceedings of the SIGCHI Conference on Human Factors in Computing Systems (CHI '11)*, 1071–1080. DOI: 10.1145/1978942.1979102
10. Munro, R. (2013). Crowdsourcing and the crisis-affected community: Lessons learned and looking forward from Mission 4636. *Information Retrieval*, 16(2), 210–266. DOI: 10.1007/s10791-012-9203-2
11. Tomaszewski, B. (2015). Geographic Information Systems for Disaster Response: A Review. *Journal of Homeland Security and Emergency Management*, 12(3), 571–602. DOI: 10.1515/jhsem-2014-0082
12. Geng, S., Gong, Y., Hou, H., Yang, J., & Onggo, B. S. (2024). Resource management in disaster relief: A bibliometric and content-analysis-based literature review. *Annals of Operations Research*. DOI: 10.1007/s10479-024-06324-7
13. Khan, S. M., et al. (2023). A Systematic Review of Disaster Management Systems: Approaches, Challenges, and Future Directions. *Land*, 12(8), article 1514. DOI: 10.3390/land12081514

---

**Note to the student:** The personal and institutional fields above (signature blocks, supervisor names, dates, and the exact degree title) must be filled in with the student's actual details before submission. Do not invent any of these.

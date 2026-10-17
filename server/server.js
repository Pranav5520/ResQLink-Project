const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API Routes
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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`ResQLink server running on port ${PORT}`);
});

module.exports = app;

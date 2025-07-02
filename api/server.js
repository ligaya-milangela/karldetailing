const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Import route files
const authRoutes = require('./routes/auth');
const bookingsRoutes = require('./routes/bookings');
const profileRoutes = require('./routes/profile');
const feedbackRoutes = require('./routes/feedback');

const app = express();

// CORS Setup
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://kar-detailing-services.onrender.com',
    'https://kardetailing.vercel.app'
  ],
  credentials: true // Allow sending cookies from frontend
}));

// Middleware
app.use(cookieParser());
app.use(express.json());

// JWT Middleware to set req.user
const JWT_SECRET = process.env.JWT_SECRET || "secret123";
function jwtAuth(req, res, next) {
  const token = req.cookies.token;
  if (!token) return next();
  try {
    req.user = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    req.user = null;
  }
  next();
}
app.use(jwtAuth);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/feedback', feedbackRoutes);

// Optional health check route
app.get('/', (req, res) => {
  res.send('KAR Detailing API is running');
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("MongoDB connected");
  app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
  });
})
.catch(err => {
  console.error('MongoDB connection failed:', err);
});

// Global unhandled rejection handler
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
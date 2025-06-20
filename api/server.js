const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const bookingsRoutes = require('./routes/bookings'); // << Add this!
const profileRoutes = require('./routes/profile'); // If using a custom profile route
const feedbackRoutes = require('./routes/feedback'); // << FEEDBACK ROUTE ADDED

// ====== JWT middleware (placed inside server.js, no new files) ======
const jwt = require('jsonwebtoken');
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
// ====================================================================

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 
          'https://adv-7aqn.onrender.com'],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(jwtAuth); // << ENABLE JWT MIDDLEWARE

app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingsRoutes); // << Add this!
if (profileRoutes) app.use('/api/profile', profileRoutes); // Only if needed
app.use('/api/feedback', feedbackRoutes); // << ENABLE FEEDBACK ROUTE

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

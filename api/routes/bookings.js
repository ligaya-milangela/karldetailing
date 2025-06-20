const express = require('express');
const jwt = require('jsonwebtoken');
const Booking = require('../models/Booking');
const User = require('../models/User'); // Needed for admin check
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "secret123";

// Middleware: Authenticate using JWT token from cookies
function auth(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Create a new booking (must be logged in)
router.post('/', auth, async (req, res) => {
  try {
    const { name, contact, date, service, notes } = req.body;
    const booking = await Booking.create({
      name,
      contact,
      date,
      service,
      notes,
      user: req.user.id,
      status: "Pending" // Default status for new bookings
    });
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Get all bookings for ALL users (for calendar)
router.get('/', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({}).sort({ date: -1 });
    // Always return status (default to "Pending" if not set)
    const bookingsWithStatus = bookings.map(b => ({
      ...b.toObject(),
      status: b.status || "Pending"
    }));
    res.json(bookingsWithStatus);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load bookings' });
  }
});

// --- MARK AS FINISHED ROUTE (Admin only) ---
router.put('/status/:id', auth, async (req, res) => {
  try {
    // Fetch user and check if admin
    const user = await User.findById(req.user.id);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    booking.status = "Completed";
    await booking.save();

    res.json({ message: "Booking marked as finished", status: "Completed" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update status" });
  }
});

module.exports = router;

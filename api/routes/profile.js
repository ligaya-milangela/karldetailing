const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Booking = require('../models/Booking');

// GET user profile by email query param
router.get('/', async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) return res.status(400).json({ error: 'Email query required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Get all bookings for this user (by user._id)
    const bookings = await Booking.find({ user: user._id }).sort({ date: -1 });

    res.json({
      name: user.name || '',
      contactNumber: user.contactNumber || '',
      address: user.address || '',
      bookings: bookings || [],
      isAdmin: !!user.isAdmin // <--- always boolean (true or false)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// PUT update user profile by email (send JSON with { email, name, contactNumber, address })
router.put('/', async (req, res) => {
  try {
    const { email, name, contactNumber, address } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.name = name || user.name;
    user.contactNumber = contactNumber || user.contactNumber;
    user.address = address || user.address;

    await user.save();

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || "secret123";
const ADMIN_SECRET = "admin123456"; // <- Change this to your desired admin password

// REGISTER
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'All fields required.' });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already exists' });

    // Check if admin registration secret is used
    let isAdmin = false;
    if (password === ADMIN_SECRET) {
      isAdmin = true;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, isAdmin }); // Pass isAdmin field
    await user.save();

    res.status(201).json({ message: isAdmin ? 'Registered as admin!' : 'Registered successfully' });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'All fields required.' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid email or password' });

    // Create and set JWT cookie - now including isAdmin in the payload
    const token = jwt.sign(
      { id: user._id, email: user.email, isAdmin: user.isAdmin },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false, // set true if using HTTPS
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    res.json({ user: { email: user.email, isAdmin: user.isAdmin } }); // Optionally return isAdmin on login
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// LOGOUT
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
});

// PROFILE (for persistent login on refresh)
router.get('/profile', async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Not logged in' });
  try {
    const data = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(data.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({
      email: user.email,
      name: user.name,
      contactNumber: user.contactNumber,
      address: user.address,
      isAdmin: !!user.isAdmin // Add isAdmin for frontend
    });
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;

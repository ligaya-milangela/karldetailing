const express = require('express');
const Feedback = require('../models/Feedback');
const User = require('../models/User');
const router = express.Router();

// Middleware: check if user is authenticated
function auth(req, res, next) {
  const user = req.cookies.user || req.headers['x-user'];
  // This assumes you have a session or JWT system!
  if (req.user) return next();
  res.status(401).json({ error: 'Unauthorized' });
}

// Middleware: check if user is admin
async function adminCheck(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (user && user.isAdmin) return next();
    return res.status(403).json({ error: "Admins only" });
  } catch {
    res.status(403).json({ error: "Admins only" });
  }
}

// POST feedback (any logged in user)
router.post('/', auth, async (req, res) => {
  const { rating, comment } = req.body;
  if (!rating || !comment) return res.status(400).json({ error: "Missing data" });
  try {
    const feedback = await Feedback.create({
      user: req.user.id,
      name: req.user.email,
      rating,
      comment,
    });
    res.json(feedback);
  } catch (err) {
    res.status(400).json({ error: "Failed to submit feedback" });
  }
});

// GET all feedback (anyone)
router.get('/', async (req, res) => {
  const feedback = await Feedback.find({}).sort({ createdAt: -1 }).limit(50);
  res.json(feedback);
});

// DELETE feedback (admin only)
router.delete('/:id', auth, adminCheck, async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(400).json({ error: "Delete failed" });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, usn, email, mobile, password, address } = req.body;
    const exists = await User.findOne({ $or: [{ email }, { usn }] });
    if (exists) return res.status(400).json({ message: 'User already exists with this email or USN' });

    const user = await User.create({ name, usn, email, mobile, password, address });
    res.status(201).json({
      _id: user._id, name: user.name, email: user.email,
      usn: user.usn, role: user.role,
      token: generateToken(user._id)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && await user.matchPassword(password)) {
      res.json({
        _id: user._id, name: user.name, email: user.email,
        usn: user.usn, role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Seed admin (run once)
router.post('/seed-admin', async (req, res) => {
  try {
    const exists = await User.findOne({ role: 'admin' });
    if (exists) return res.json({ message: 'Admin already exists' });
    await User.create({
      name: 'Admin', usn: 'ADMIN001', email: 'admin@buspass.com',
      mobile: '9999999999', password: 'admin123', role: 'admin'
    });
    res.json({ message: 'Admin created: admin@buspass.com / admin123' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

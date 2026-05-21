const express = require('express');
const router = express.Router();
const BusPass = require('../models/BusPass');
const { protect } = require('../middleware/auth');

// Apply for pass
router.post('/apply', protect, async (req, res) => {
  try {
    const {
      from, to, passType, distance,
      studentName, mobile, address,
      dob, gender, category, parentName, parentMobile,
      semester, branch, busRoute, landmark, emergencyContact
    } = req.body;

    if (distance && Number(distance) > 70) {
      return res.status(400).json({ message: 'Distance exceeds the maximum limit of 70 km. Bus pass cannot be issued for distances beyond 70 km.' });
    }

    const existing = await BusPass.findOne({ student: req.user._id, status: { $in: ['pending', 'approved'] } });
    if (existing) return res.status(400).json({ message: 'You already have an active or pending pass' });

    const pass = await BusPass.create({
      student: req.user._id,
      usn: req.user.usn,
      name: studentName || req.user.name,
      mobile: mobile || req.user.mobile,
      from, to, passType, distance,
      address, dob, gender, category,
      parentName, parentMobile,
      semester, branch, busRoute, landmark, emergencyContact
    });
    res.status(201).json(pass);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get my passes
router.get('/my', protect, async (req, res) => {
  try {
    const passes = await BusPass.find({ student: req.user._id }).sort({ appliedAt: -1 });
    res.json(passes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Renew pass
router.post('/renew/:id', protect, async (req, res) => {
  try {
    const pass = await BusPass.findOne({ _id: req.params.id, student: req.user._id });
    if (!pass) return res.status(404).json({ message: 'Pass not found' });
    if (!['approved', 'expired'].includes(pass.status)) {
      return res.status(400).json({ message: 'Only approved or expired passes can be renewed' });
    }
    pass.status = 'pending';
    pass.passType = req.body.passType || pass.passType;
    pass.rejectionReason = '';
    pass.appliedAt = new Date();
    await pass.save();
    res.json({ message: 'Renewal request submitted', pass });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

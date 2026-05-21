const express = require('express');
const router = express.Router();
const BusPass = require('../models/BusPass');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// Get all passes
router.get('/passes', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const passes = await BusPass.find(filter).populate('student', 'name email usn mobile').sort({ appliedAt: -1 });
    res.json(passes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Approve pass
router.put('/passes/:id/approve', protect, adminOnly, async (req, res) => {
  try {
    const pass = await BusPass.findById(req.params.id);
    if (!pass) return res.status(404).json({ message: 'Pass not found' });

    const validFrom = new Date();
    let validTo = new Date();
    if (pass.passType === 'monthly') validTo.setMonth(validTo.getMonth() + 1);
    else if (pass.passType === 'quarterly') validTo.setMonth(validTo.getMonth() + 3);
    else if (pass.passType === 'yearly') validTo.setFullYear(validTo.getFullYear() + 1);

    pass.status = 'approved';
    pass.validFrom = validFrom;
    pass.validTo = validTo;
    pass.passNumber = 'BP' + Date.now();
    pass.remarks = req.body.remarks || 'Approved by admin';
    pass.rejectionReason = '';
    await pass.save();
    res.json({ message: 'Pass approved', pass });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Reject pass — requires reason in body
router.put('/passes/:id/reject', protect, adminOnly, async (req, res) => {
  try {
    const pass = await BusPass.findById(req.params.id);
    if (!pass) return res.status(404).json({ message: 'Pass not found' });
    if (!req.body.reason || req.body.reason.trim() === '') {
      return res.status(400).json({ message: 'Rejection reason is required' });
    }
    pass.status = 'rejected';
    pass.rejectionReason = req.body.reason.trim();
    pass.remarks = req.body.reason.trim();
    await pass.save();
    res.json({ message: 'Pass rejected', pass });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all students
router.get('/students', protect, adminOnly, async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password');
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

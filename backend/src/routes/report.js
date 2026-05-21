const express = require('express');
const router = express.Router();
const BusPass = require('../models/BusPass');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// Summary report
router.get('/summary', protect, adminOnly, async (req, res) => {
  try {
    const total = await BusPass.countDocuments();
    const pending = await BusPass.countDocuments({ status: 'pending' });
    const approved = await BusPass.countDocuments({ status: 'approved' });
    const rejected = await BusPass.countDocuments({ status: 'rejected' });
    const expired = await BusPass.countDocuments({ status: 'expired' });
    const students = await User.countDocuments({ role: 'student' });

    const byType = await BusPass.aggregate([
      { $group: { _id: '$passType', count: { $sum: 1 } } }
    ]);

    res.json({ total, pending, approved, rejected, expired, students, byType });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Monthly report
router.get('/monthly', protect, adminOnly, async (req, res) => {
  try {
    const data = await BusPass.aggregate([
      {
        $group: {
          _id: { month: { $month: '$appliedAt' }, year: { $year: '$appliedAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

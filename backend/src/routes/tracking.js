const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const BusPass = require('../models/BusPass');

// Simple mock location generator - cycles through Mysuru coordinates
let mockIndex = 0;
const mockCoords = [
  { lat: 12.2958, lng: 76.6394 }, // Mysuru Palace
  { lat: 12.3000, lng: 76.6400 },
  { lat: 12.3050, lng: 76.6450 },
  { lat: 12.3100, lng: 76.6500 },
  { lat: 12.3150, lng: 76.6480 },
  { lat: 12.3200, lng: 76.6450 }
];

router.get('/location/:busPassId', protect, async (req, res) => {
  try {
    const pass = await BusPass.findOne({ _id: req.params.busPassId, student: req.user._id });
    if (!pass) return res.status(404).json({ message: 'Pass not found' });

    // Rotate through the mock coordinates based on the server requests
    const coord = mockCoords[mockIndex % mockCoords.length];
    mockIndex++;

    const locationData = {
      lat: coord.lat,
      lng: coord.lng,
      updatedAt: new Date()
    };
    
    // Optionally save it to DB
    pass.lastLocation = locationData;
    await pass.save();

    res.json(locationData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

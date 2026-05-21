require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const passRoutes = require('./routes/pass');
const adminRoutes = require('./routes/admin');
const reportRoutes = require('./routes/report');
const trackingRoutes = require('./routes/tracking');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));
app.use('/api/auth', authRoutes);
app.use('/api/pass', passRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/report', reportRoutes);
app.use('/api/tracking', trackingRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Bus Pass Management System API running' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT, () => {
      console.log(`Server running on http://localhost:${process.env.PORT}`);
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));

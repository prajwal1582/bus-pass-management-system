const mongoose = require('mongoose');

const busPassSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  usn: { type: String, required: true },
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  // Extra student info
  dob: { type: String },
  gender: { type: String },
  category: { type: String },
  parentName: { type: String },
  parentMobile: { type: String },
  semester: { type: String },
  branch: { type: String },
  busRoute: { type: String },
  landmark: { type: String },
  emergencyContact: { type: String },
  // Route
  from: { type: String, required: true },
  to: { type: String, required: true },
  distance: { type: Number },
  address: { type: String },
  passType: { type: String, enum: ['monthly', 'quarterly', 'yearly'], default: 'monthly' },
  // Status & admin fields
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'expired'], default: 'pending' },
  rejectionReason: { type: String, default: '' },
  passNumber: { type: String, unique: true, sparse: true },
  validFrom: { type: Date },
  validTo: { type: Date },
  remarks: { type: String },
  appliedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

busPassSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('BusPass', busPassSchema);

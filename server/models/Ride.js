const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  timeSlot: { type: String, required: true },
  pickupLocation: { type: String, required: true },
  dropLocation: { type: String, required: true },
  status: { type: String, enum: ['waiting', 'booked'], default: 'waiting' },
  createdAt: { type: Date, default: Date.now },
  driver: {
    name: String,
    phone: String,
  },
});

module.exports = mongoose.model('Ride', rideSchema); 
const express = require('express');
const jwt = require('jsonwebtoken');
const Ride = require('../models/Ride');
const User = require('../models/User');

const router = express.Router();

// Middleware to verify JWT
function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
}

// Book a ride
router.post('/book', auth, async (req, res) => {
  const { timeSlot, pickupLocation, dropLocation } = req.body;
  try {
    // Find a waiting ride with same timeSlot and pickupLocation
    let ride = await Ride.findOne({ timeSlot, pickupLocation, status: 'waiting' });
    if (ride) {
      // Add student if not already in
      if (!ride.students.includes(req.userId)) {
        ride.students.push(req.userId);
      }
      // If 5 students, mark as booked
      if (ride.students.length >= 5) {
        ride.status = 'booked';
      }
      await ride.save();
    } else {
      // Create new ride
      ride = new Ride({ students: [req.userId], timeSlot, pickupLocation, dropLocation });
      await ride.save();
    }
    await ride.populate('students', 'name email collegeId address');
    res.json({ ride });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get my rides
router.get('/my', auth, async (req, res) => {
  try {
    const rides = await Ride.find({ students: req.userId }).populate('students', 'name email collegeId address');
    res.json({ rides });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get all available (booked, unassigned) rides for drivers
router.get('/available', async (req, res) => {
  try {
    const rides = await Ride.find({ status: 'booked', driver: { $exists: false } }).populate('students', 'name address');
    res.json({ rides });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Assign a driver to a ride
router.post('/assign', async (req, res) => {
  const { rideId, driverName, driverPhone } = req.body;
  try {
    const ride = await Ride.findByIdAndUpdate(
      rideId,
      { driver: { name: driverName, phone: driverPhone }, status: 'assigned' },
      { new: true }
    ).populate('students', 'name address');
    res.json({ ride });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router; 
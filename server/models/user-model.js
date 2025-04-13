const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
    required: true
  },
  otp: {
    type: String,
    required: false
  },
  favoriteVenues: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Venue'
  }],
  favoriteEvents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }],
  otpExpiresAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const user = mongoose.model('User', userSchema);
module.exports = user;
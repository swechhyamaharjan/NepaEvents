const mongoose = require("mongoose");

const venueSchema = new mongoose.Schema({
  eventTitle: {
    type: String,
    required: [true, 'Event title is required'],
    minLength: 20,
    maxLength: 100,
  },
  eventDescription: {
    type: String,
    required: [true, 'Event description is required'],
    minLength: 50,
    maxLength: 500,
  },
  eventDate: {
    type: Date,
    required: [true, 'Event date is required'],
  },
  eventTime: {
    type: Date,
    required: [true, 'Event time is required'],
  },
  eventDuration: {
    type: Number,
    required: [true, 'Event Duration is required'],
  },
  eventCategory: {
    type: String,
    required: [true, 'Event Category is required'],
  },
});
const Venue = mongoose.model("Venue", venueSchema);

module.exports = Venue;
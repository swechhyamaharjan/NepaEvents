const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
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
  eventLocation: {
    type: String,
    required: [true, 'Event Location is required'],
  },
  eventTicketPrice: {
    type: Number,
    required: [true, 'Event ticket price is required'],
  },
  eventCategory: {
    type: String,
    required: [true, 'Event Category is required'],
  },
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;

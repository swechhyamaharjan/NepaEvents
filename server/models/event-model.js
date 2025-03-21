const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  category: {type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  venue: { type: mongoose.Schema.Types.ObjectId, ref: "Venue", required: true },
  // artist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Artist", required: true }],
  price: { type: Number, required: true },
  ticket_sold: { type: Number, default: 0 },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  image: { type: String, required: true }
});

module.exports = mongoose.model("Event", eventSchema);
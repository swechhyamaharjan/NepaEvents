const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  venue: { type: mongoose.Schema.Types.ObjectId, ref: "Venue", required: true },
  artist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Artist" }],
  price: { type: Number, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
  image: {type: String, required: true}
});

module.exports = mongoose.model("Event", eventSchema);
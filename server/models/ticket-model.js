const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  quantity: { type: Number, required: false, min: 1 },
  price: { type: Number, required: true },
  ticketCodes: [{ type: String, unique: true, required: true }],
  purchaseDate: { type: Date, default: Date.now },
});


const receiptSchema = new mongoose.Schema({
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  venue: { type: mongoose.Schema.Types.ObjectId, ref: "Venue", required: true },
  amountPaid: { type: Number, required: true },
  transactionId: { type: String, required: true },
  paymentDate: { type: Date, default: Date.now },
});


module.exports = mongoose.model("Receipt", receiptSchema);
module.exports = mongoose.model("Ticket", ticketSchema);

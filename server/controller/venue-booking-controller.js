require('dotenv').config()
const Event = require("../models/event-model");
const VenueBooking = require("../models/venue-booking-model");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Receipt = require("../models/ticket-model");
const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const bookVenue = async (req, res) => {
  try {
    const { eventDetails, venue } = req.body;
    const organizer = req.user.user._id;
    const newBooking = await VenueBooking.create({
      organizer,
      eventDetails,
      venue,
      status: "pending",
      requestedAt: Date.now()
    })
    res.status(201).json({ success: true, message: "Venue Booking requested successfully", booking: newBooking })
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Error Booking Venue", error: err.message });
  }
}

const getAllVenueBooking = async (req, res) => {
  try {
    const bookings = await VenueBooking.find().populate("venue organizer");
    res.status(200).json({ success: true, bookings });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Error Fetching Bookings", error: err.message });
  }
}


const approveVenueBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await VenueBooking.findById(id);
    if (!booking) return res.status(404).json({ success: false, message: "No Booking found!" });

    booking.status = "approved";
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking approved. You Can Make Payment Now",
    });
  } catch (error) {
    console.log(err);
    res.status(500).json({ success: false, message: "Error Approving Bookings", error: err.message });
  }
}

const rejectVenueBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await VenueBooking.findById(id);

    if (!booking) return res.status(404).json({ success: false, message: "No booking found!" });

    booking.status = "rejected";
    await booking.save();
    res.status(200).json({ success: true, message: "Booking rejected successfully" });
  } catch (error) {
    console.log(err);
    res.status(500).json({ success: false, message: "Error Rejecting Bookings", error: err.message });
  }
}

//stripe payment
const makePaymentForVenue = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await VenueBooking.findById(bookingId).populate("venue organizer");
    if (!booking) return res.status(404).json({ message: "Booking not found!" });
    if (booking.status !== "approved") return res.status(400).json({ message: "Booking is not approved yet" });
    const totalAmount = booking.venue.price;
    const venueImage = `http://localhost:3000/${booking.venue.image.replace(/\\/g, "/")}`;

    console.log(venueImage);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:5173/payment-failure`,
      customer_email: booking.organizer.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Venue Booking: ${booking.venue.name}`,
              images: [venueImage],
            },
            unit_amount: totalAmount * 100, // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookingId: booking._id.toString(),
      },
    })
    res.status(200).json({ success: true, url: session.url });
  } catch (error) {
    res.status(500).json({ message: "Error creating payment session", error: error.message });
  }
}

//automatically called by stripe creates event, Receipt
const stripeWebHook = async (req, res) => {
  let event;
  try {
    const sig = req.headers["stripe-signature"];
    const rawBody = req.body; // Keep it raw for verification

    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);

    if (event.type === "checkout.session.completed") {
      console.log("✅ Checkout session completed event received!");
      
      const session = event.data.object;
      const bookingId = session.metadata.bookingId;

      const booking = await VenueBooking.findById(bookingId).populate("venue");
      if (!booking) return res.status(404).json({ message: "Booking not found!" });

      booking.paymentStatus = "paid";
      await booking.save();

      console.log("✅ Booking updated successfully!");

      res.json({ received: true });
    }
  } catch (error) {
    console.error("❌ Webhook Error:", error.message);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
};


const verifyPayment = async (req, res) => {
  try {
    const {session_id} = req.query;
    if (!session_id) {
      return res.status(400).json({ success: false, message: "Session ID is required" });
    }
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === "paid") {
      res.json({ success: true, message: "Payment successful", session });
    } else {
      res.json({ success: false, message: "Payment not completed" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Error verifying payment", error: error.message });
  }
}


//send Receipt to email
const sendReceipt = async (req, res) => {
  try {
    const { email, receiptId } = req.body;
    const receipt = await Receipt.findById(receiptId).populate("organizer venue");
    if (!receipt) return res.status(404).josn({ message: "No receipt found!" });

    const pdfPath = path.join(__dirname, `../receipts/receipt_${receipt._id}.pdf`);
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(pdfPath));
    doc.fontSize(18).text("Venue Booking Receipt", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(` Venue: ${receipt.venue.name}`);
    doc.text(` Location: ${receipt.venue.location}`);
    doc.text(` Organizer: ${receipt.organizer.name}`);
    doc.text(` Payment Date: ${new Date(receipt.paymentDate).toDateString()}`);
    doc.text(` Amount Paid: $${receipt.amountPaid}`);
    doc.text(` Transaction ID: ${receipt.transactionId}`);

    doc.end();

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Your Receipt for Venue Booking`,
      text: `Thank you for booking a venue. Your receipt is attached.`,
      attachments: [{ filename: `receipt_${receipt._id}.pdf`, path: pdfPath }],
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "Receipt sent successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error sending receipt", error: error.message });
  }
}



module.exports = { bookVenue, getAllVenueBooking, approveVenueBooking, rejectVenueBooking, makePaymentForVenue, stripeWebHook, verifyPayment, sendReceipt }
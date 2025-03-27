require('dotenv').config()
const Event = require("../models/event-model");
const VenueBooking = require("../models/venue-booking-model");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { Receipt } = require("../models/ticket-model");
const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const bookVenue = async (req, res) => {
  try {
    const { title, description, category, date, artist, ticketPrice, venue } = req.body;
    const image = req.file ? req.file.path : null;
    const eventDetails = { title, description, category, date, artist, ticketPrice, image };
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
    const bookings = await VenueBooking.find()
      .populate("venue")
      .populate("organizer")
      .populate("eventDetails.category");
    res.status(200).json({ success: true, bookings });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Error Fetching Bookings", error: err.message });
  }
}

const getVenueBookingById = async (req, res) => {
  const { id } = req.params;
  try {
    const booking = await VenueBooking.findById(id)
      .populate("venue")
      .populate("organizer")
      .populate("eventDetails.category");
    res.status(200).json({ success: true, booking })
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
    console.log(error);
    res.status(500).json({ success: false, message: "Error Approving Bookings", error: error.message });
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
    console.log(error);
    res.status(500).json({ success: false, message: "Error Rejecting Bookings", error: error.message });
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
      console.log("Checkout session completed event received!");
      res.json({ received: true });
    }
  } catch (error) {
    console.error(" Webhook Error:", error.message);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
};


const sendReceiptEmail = async (email, receipt) => {
  try {
    const receiptsDir = path.join(__dirname, "../uploads/receipts");

    // Ensure the receipts folder exists
    if (!fs.existsSync(receiptsDir)) {
      fs.mkdirSync(receiptsDir, { recursive: true });
    }
    const pdfPath = path.join(receiptsDir, `receipt_${receipt._id}.pdf`);
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(pdfPath));
    doc.fontSize(18).text("Venue Booking Receipt", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(` Venue: ${receipt.venue.name}`);
    doc.text(` Location: ${receipt.venue.location}`);
    doc.text(` Organizer: ${receipt.organizer.fullName}`);
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

    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: `Your Receipt for Venue Booking`,
      text: `Thank you for booking a venue. Your receipt is attached.`,
      attachments: [{ filename: `receipt_${receipt._id}.pdf`, path: pdfPath }],
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending receipt email:", error);
  }
};


const verifyPayment = async (req, res) => {
  try {
    const { session_id } = req.query;
    if (!session_id) {
      return res.status(400).json({ success: false, message: "Session ID is required" });
    }
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === "paid") {
      const booking = await VenueBooking.findById(req.params.id)
        .populate("venue")
        .populate("organizer");

      if (!booking) return res.status(404).json({ success: false, error: "No Bookings Found" });

      booking.paymentStatus = "paid";
      await booking.save();
      // Create Receipt
      const newReceipt = new Receipt({
        organizer: booking.organizer._id,
        venue: booking.venue._id,
        amountPaid: session.amount_total / 100, // Convert cents to dollars
        transactionId: session.payment_intent,
        paymentDate: new Date(),
      });
      await newReceipt.save();

      const populatedReceipt = await Receipt.findById(newReceipt._id)
        .populate('organizer')
        .populate('venue');

      // Send Receipt Email
      await sendReceiptEmail(booking.organizer.email, populatedReceipt);

      res.json({ success: true, message: "Payment successful, receipt generated", session });
    } else {
      res.json({ success: false, message: "Payment not completed" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Error verifying payment", error: error.message });
  }
};




module.exports = { bookVenue, getAllVenueBooking, approveVenueBooking, rejectVenueBooking, makePaymentForVenue, stripeWebHook, verifyPayment, sendReceiptEmail, getVenueBookingById }
const express = require("express");
const { bookVenue, getAllVenueBooking, approveVenueBooking, rejectVenueBooking, verifyPayment, makePaymentForVenue, sendReceipt } = require("../controller/venue-booking-controller");
const verifyToken = require("../middleware/verify-token");

const router = express.Router();

router.post('/', verifyToken, bookVenue)
router.get('/', verifyToken, getAllVenueBooking)
router.put('/:id/approve', verifyToken, approveVenueBooking)
router.put('/:id/reject', verifyToken, rejectVenueBooking)


// Stripe Payment
router.post("/pay", makePaymentForVenue);
router.get("/verify-payment", verifyPayment);

//Send Email
router.post("/sendReceipt", sendReceipt);


module.exports = router;
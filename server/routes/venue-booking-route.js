const express = require("express");
const { bookVenue, getAllVenueBooking, approveVenueBooking, rejectVenueBooking, verifyPayment, makePaymentForVenue, sendReceipt } = require("../controller/venue-booking-controller");
const verifyToken = require("../middleware/verify-token");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadPath = "uploads/";
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

router.post('/', verifyToken,  upload.single("image"), bookVenue)
router.get('/', verifyToken, getAllVenueBooking)
router.put('/:id/approve', verifyToken, approveVenueBooking)
router.put('/:id/reject', verifyToken, rejectVenueBooking)


// Stripe Payment
router.post("/pay", makePaymentForVenue);
router.get("/verify-payment", verifyPayment);

//Send Email
router.post("/sendReceipt", sendReceipt);


module.exports = router;
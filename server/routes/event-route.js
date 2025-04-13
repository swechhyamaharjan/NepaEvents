const express = require("express");
const { createEvent, getAllEvents, updateEvent, deleteEvent, findEventById, buyEventTicket, verifyEventPayment, bookingOverAllDetail, addFavoriteEvent, removeFavoriteEvent, getFavoriteEvents} = require('../controller/event-controller');
const verifyToken = require("../middleware/verify-token");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const eventRouter = express.Router();

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

eventRouter.post('/', verifyToken, upload.single('image'), createEvent)
eventRouter.get('/', getAllEvents)
eventRouter.patch('/:eventId', updateEvent)
eventRouter.delete('/:id', deleteEvent)
eventRouter.get('/overview', bookingOverAllDetail);
eventRouter.get('/:id', findEventById); 

// Stripe Payment
eventRouter.post("/buy", verifyToken, buyEventTicket);
eventRouter.get("/verify-purchase/:id", verifyToken, verifyEventPayment);

eventRouter.post('/:id/favorite', verifyToken, addFavoriteEvent);
eventRouter.delete('/:id/favorite', verifyToken, removeFavoriteEvent);
eventRouter.get('/user/favorites', verifyToken, getFavoriteEvents);

module.exports = eventRouter;
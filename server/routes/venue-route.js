const express = require("express");
const { createVenue, getAllVenues, updateVenue, deleteVenue, getVenueById } = require('../controller/venue-controller');
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
const venueRouter = express.Router();

venueRouter.post('/', upload.single("image"), createVenue)
venueRouter.get('/', getAllVenues)
venueRouter.patch('/:venueId', upload.single("image"), updateVenue)
venueRouter.delete('/:id', deleteVenue)
venueRouter.get('/:id', getVenueById)

venueRouter.post('/bookVenue',)
module.exports = venueRouter;
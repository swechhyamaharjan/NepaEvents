const express = require("express");
const multer = require("multer");
const path = require("path");
const {bookVenue, getAllVenues, updateVenue, deleteVenue, getVenueById} = require('../controller/venue-controller');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory where files will be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  },
});

const upload = multer({ storage: storage });
const venueRouter = express.Router();

venueRouter.post('/', upload.single("image"), bookVenue)
venueRouter.get('/', getAllVenues)
venueRouter.patch('/:venueId', updateVenue)
venueRouter.delete('/:id', deleteVenue)
venueRouter.get('/:id', getVenueById)
module.exports = venueRouter;
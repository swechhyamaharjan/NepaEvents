const express = require("express");
const {bookVenue, getAllVenues} = require('../controller/venue-controller')

const venueRouter = express.Router();

venueRouter.post('/venue', bookVenue)
venueRouter.get('/venues', getAllVenues)

module.exports = venueRouter;
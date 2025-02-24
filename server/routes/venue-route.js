const express = require("express");
const {bookVenue, getAllVenues, updateVenue} = require('../controller/venue-controller')

const venueRouter = express.Router();

venueRouter.post('/venue', bookVenue)
venueRouter.get('/venues', getAllVenues)
venueRouter.patch('/:venueId', updateVenue)

module.exports = venueRouter;
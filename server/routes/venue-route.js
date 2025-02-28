const express = require("express");
const {bookVenue, getAllVenues, updateVenue, deleteVenue, getVenueById} = require('../controller/venue-controller');

const venueRouter = express.Router();

venueRouter.post('/', bookVenue)
venueRouter.get('/', getAllVenues)
venueRouter.patch('/:venueId', updateVenue)
venueRouter.delete('/:id', deleteVenue)
venueRouter.get('/:id', getVenueById)
module.exports = venueRouter;
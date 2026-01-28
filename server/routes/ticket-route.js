const express = require("express");
const { getTicketById, getTicketsByEvent } = require("../controller/ticket-controller");
const verifyToken = require("../middleware/verify-token");
const router = express.Router();

// Get all tickets for a specific event - this must come BEFORE the /:id route
router.get('/event/:eventId', verifyToken, getTicketsByEvent);

// Get a specific ticket by ID
router.get('/:id', getTicketById);

module.exports = router;
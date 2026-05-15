const express = require("express");
const { getTicketById, getTicketsByEvent, getUserTickets, deleteTicket } = require("../controller/ticket-controller");
const verifyToken = require("../middleware/verify-token");
const router = express.Router();

// Get all tickets for a specific event - this must come BEFORE the /:id route
router.get('/event/:eventId', verifyToken, getTicketsByEvent);

// Get all tickets for the current user
router.get('/user', verifyToken, getUserTickets);

// Get a specific ticket by ID
router.get('/:id', getTicketById);

// Delete a ticket
router.delete('/:id', verifyToken, deleteTicket);

module.exports = router;
const express = require("express");
const { addTicket, getAllTickets, getTicketById, updateTicket, deleteTicket } = require("../controller/ticket-controller.js");
const router = express.Router();

router.post('/', addTicket);
router.get('/', getAllTickets);
router.get('/:id', getTicketById);
router.patch('/:id', updateTicket);
router.delete('/:id', deleteTicket);

module.exports = router;
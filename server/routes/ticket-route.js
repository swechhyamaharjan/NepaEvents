const express = require("express");
const { buyTicket, getTicketById } = require("../controller/ticket-controller.js");
const router = express.Router();

router.post('/buy', buyTicket);
router.post('/:id', getTicketById);

module.exports = router;
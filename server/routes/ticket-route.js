const express = require("express");
const { getTicketById } = require("../controller/ticket-controller.js");
const router = express.Router();

router.post('/:id', getTicketById);

module.exports = router;
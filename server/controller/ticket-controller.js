const Ticket = require("../models/ticket-model.js");
const Event = require("../models/event-model.js");


const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate("event user")
    res.status(201).json[{ data: ticket }]
  } catch (error) {
    console.error('Error fetching ticket:', error);
    res.status(500).json[{ message: 'Error fetching ticket', error: error.message }];
  }
}




module.exports = { getTicketById };

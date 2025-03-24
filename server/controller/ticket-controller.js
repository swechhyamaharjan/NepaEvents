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

const buyTicket = async (req, res) => {
  const { eventId, quantity } = req.body;
  const user = req.user.user.id;

  if (!quantity || quantity < 1) {
    return res.status(400).json({ success: false, message: "Ticket Quantity Must Be Atleast 1" });
  }

  const event = await Event.findById(eventId);
  if (!event) {
    return res.status(404).json({ success: false, message: "No Event Found" });
  }

  const ticketPrice = event.price * quantity;


}



module.exports = { buyTicket, getTicketById };

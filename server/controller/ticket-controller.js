const { Ticket } = require("../models/ticket-model");
const Event = require("../models/event-model");


const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate("event user");
    res.status(200).json(ticket);
  } catch (error) {
    console.error('Error fetching ticket:', error);
    res.status(500).json({ message: 'Error fetching ticket', error: error.message });
  }
};

/**
 * Get all tickets for a specific event
 */
const getTicketsByEvent = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    
    // Verify the event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Fetch tickets for this event
    const tickets = await Ticket.find({ event: eventId })
      .populate('user')
      .populate('event')
      .sort({ purchaseDate: -1 }); // Sort by purchase date descending (newest first)
    
    res.status(200).json(tickets);
  } catch (error) {
    console.error('Error fetching tickets for event:', error);
    res.status(500).json({ message: 'Error fetching tickets', error: error.message });
  }
};

module.exports = { getTicketById, getTicketsByEvent };

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

/**
 * Get all tickets for the current user
 */
const getUserTickets = async (req, res) => {
  try {
    const userId = req.user.user._id;
    
    const tickets = await Ticket.find({ user: userId })
      .populate({
        path: 'event',
        populate: {
          path: 'venue'
        }
      })
      .sort({ purchaseDate: -1 });
    
    res.status(200).json(tickets);
  } catch (error) {
    console.error('Error fetching user tickets:', error);
    res.status(500).json({ message: 'Error fetching tickets', error: error.message });
  }
};

/**
 * Delete a ticket
 */
const deleteTicket = async (req, res) => {
  try {
    const ticketId = req.params.id;
    const userId = req.user.user._id;

    const ticket = await Ticket.findOneAndDelete({ _id: ticketId, user: userId });

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found or unauthorized' });
    }

    res.status(200).json({ success: true, message: 'Ticket deleted successfully' });
  } catch (error) {
    console.error('Error deleting ticket:', error);
    res.status(500).json({ message: 'Error deleting ticket', error: error.message });
  }
};

module.exports = { getTicketById, getTicketsByEvent, getUserTickets, deleteTicket };

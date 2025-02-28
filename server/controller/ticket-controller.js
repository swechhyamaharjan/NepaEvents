const Ticket = require("../models/ticket-model.js");

const addTicket = async(req, res) => {
  try {
    await Ticket.create(req.body);
    res.status(201).json[{message: "Ticket added successfully"}];
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ message: 'Error creating ticket', error: error.message });
  }
}

const getAllTickets = async(req, res) => {
  try {
    const tickets = await Ticket.find()
    .populate("event")
    .populate("user", "name email");
    res.status(201).json[{data: tickets}]
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json[{message: 'Error fetching tickets', error: error.message}];
  }
}

const getTicketById = async(req, res) => {
  try {
   const ticket = await Ticket.findById(req.params.id)
   .populate("event")
   .populate("user", "name email");
   res.status(201).json[{data: ticket}]
  } catch (error) {
    console.error('Error fetching ticket:', error);
    res.status(500).json[{message: 'Error fetching ticket', error: error.message}];
  }
}

const updateTicket = async(req, res) => {
  try {
    await Ticket.findByIdAndUpdate(req.params.id, req.body);
    res.status(201).json[{message: "Ticket updated successfully"}];  
  } catch (error) {
    console.error('Error updating tickets:', error);
    res.status(500).json[{message: 'Error updating tickets', error: error.message}];
  }
}

const deleteTicket = async(req, res) => {
  try {
    await Ticket.findByIdAndDelete(req.params.id);
    res.status(201).json[{message: "Ticket deleted successfully"}]   
  } catch (error) {
    console.error('Error deleting ticket:', error);
    res.status(500).json[{message: 'Error deleting ticket', error: error.message}];
  }
}

module.exports = {addTicket, getAllTickets, getTicketById, updateTicket, deleteTicket};

const Venue = require('../models/venue-model')

const bookVenue = async (req, res) => {
  try {
      await Venue.create(req.body)
      res.status(201).json({
          success: true,
          message: 'Venue booked successfully'
      })
  } catch (error) {
      console.error('Error booking venue:', error);
      res.status(500).json({ message: 'Error booking venue', error: error.message });
  }
};
const getAllVenues = async (req, res) => {
  try {
      const venues= await Venue.find(); 
      res.status(200).json(venues); 
  } catch (error) {
      console.error("Error getting venues:", error);
      res.status(500).json({ message: "Error getting venues", error: error.message });
  }
};

module.exports = { bookVenue, getAllVenues }
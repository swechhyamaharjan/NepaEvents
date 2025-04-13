const Venue = require('../models/venue-model')
const User = require('../models/user-model');

const createVenue = async (req, res) => {
    console.log(req.body);
    try {
        const { name, location, capacity, price, locationCoordinates} = req.body;
        const priceNumber = parseFloat(price);
        const image = req.file ? req.file.path : null; // Ensure image is stored
        if (!image) {
            return res.status(400).json({ message: 'Image is required' });
        }
        const newVenue = await Venue.create({ name, location, capacity, image, price: priceNumber, locationCoordinates });
        res.status(201).json({
            success: true,
            message: 'Venue booked successfully',
            venue: newVenue
        });
    } catch (error) {
        console.error('Error booking venue:', error);
        res.status(500).json({ message: 'Error booking venue', error: error.message });
    }
};
const getAllVenues = async (req, res) => {
    try {
        const venues = await Venue.find();
        res.status(200).json(venues);
    } catch (error) {
        console.error("Error getting venues:", error);
        res.status(500).json({ message: "Error getting venues", error: error.message });
    }
};

const updateVenue = async (req, res) => {
    try {
        const { name, location, capacity } = req.body;
        const image = req.file ? req.file.path : null;
        const newVenueData = {
            name,
            location,
            capacity,
            image,
        };
        const updatedVenue = await Venue.findByIdAndUpdate(
            req.params.venueId,
            newVenueData,
            { new: true }
        );

        if (!updatedVenue) {
            return res.status(404).json({ message: "Venue not found" });
        }

        res.status(200).json({ success: true, message: "Venue updated successfully", updatedVenue });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error" });
    }
};

const deleteVenue = async (req, res) => {
    try {
        const venueToDelete = await Venue.findByIdAndDelete(req.params.id)
        if (!venueToDelete) {
            return res.status(404).json({ success: false, message: "Venue not found" });
        }
        res.status(200).json({ sucess: true, message: "Venue deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error" });
    }

}

const getVenueById = async (req, res) => {
    try {
        const id = req.params.id
        const venue = await Venue.findById(id);
        res.status(200).json({ success: true, data: venue });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error" });
    }
}

// Add venue to favorites
const addFavoriteVenue = async (req, res) => {
    try {
        const venueId = req.params.id;
        const userId = req.user.user._id;; 
  
   // Check if venue exists
   const venue = await Venue.findById(venueId);
   if (!venue) {
       return res.status(404).json({ message: 'Venue not found' });
   }

   // Add to favorites
   const user = await User.findByIdAndUpdate(
       userId,
       { $addToSet: { favoriteVenues: venueId } },
       { new: true }
   ).populate('favoriteVenues');

   res.status(200).json({
       success: true,
       message: 'Venue added to favorites',
       favoriteVenues: user.favoriteVenues
   });
} catch (error) {
   console.error('Error adding favorite venue:', error);
   res.status(500).json({ message: 'Server error', error: error.message });
}
};

  // Remove venue from favorites
const removeFavoriteVenue = async (req, res) => {
    try {
      const venueId = req.params.id;
        const userId = req.user.user._id;; 
  
      const user = await User.findByIdAndUpdate(
        userId,
        { $pull: { favoriteVenues: venueId } },
        { new: true }
      ).populate('favoriteVenues');
  
      res.status(200).json({
        success: true,
        message: 'Venue removed from favorites',
        favoriteVenues: user.favoriteVenues
      });
    } catch (error) {
      console.error('Error removing favorite venue:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

  // Get user's favorite venues
const getFavoriteVenues = async (req, res) => {
    try {
      const userId = req.user.user._id;; 
  
      const user = await User.findById(userId).populate('favoriteVenues');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json(user.favoriteVenues);
    } catch (error) {
      console.error('Error getting favorite venues:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

module.exports = { createVenue, getAllVenues, updateVenue, deleteVenue, getVenueById, addFavoriteVenue, removeFavoriteVenue, getFavoriteVenues };
const Venue = require('../models/venue-model')

const bookVenue = async (req, res) => {
    try {
        const { name, location, capacity } = req.body;
        const image = req.file ? req.file.path : null; // Ensure image is stored
        if (!image) {
            return res.status(400).json({ message: 'Image is required' });
        }
        const newVenue = await Venue.create({ name, location, capacity, image });
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
        const newVenueData = req.body;
        const updatedVenue = await Venue.findByIdAndUpdate(
            req.params.venueId,
            newVenueData,
        );

        if (!updatedVenue) {
            return res.status(404).json({ message: "Venue not found" });
        };

        res.status(200).json({ success: true, message: "Venue updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error" });
    }
}

const deleteVenue = async (req, res) => {
    try {
        const venueToDelete = await Venue.findByIdAndDelete(req.params.venueId)
        if (!venueToDelete) {
            return res.status(404).json({ message: "Venue deleted successfully" });
        }
        res.status(204).send();
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

module.exports = { bookVenue, getAllVenues, updateVenue, deleteVenue, getVenueById }
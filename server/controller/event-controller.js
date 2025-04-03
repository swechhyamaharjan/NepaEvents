const Event = require('../models/event-model');

const createEvent = async (req, res) => {
    try {
        const { title, description, date, venue, price, artist, category } = req.body;
        const image = req.file ? req.file.path : null;
        const organizer = req.user.user._id;
        const event = await Event.create({ title, description, date, venue, price, image, artist, organizer, category,  createdAt: new Date(), });
        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            newEvent: event
        })
    } catch (error) {
        console.error('Error creating an event:', error);
        res.status(500).json({ message: 'Error creating an event', error: error.message });
    }
};

const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find()
            .populate("venue")
            .populate("organizer");
        res.status(200).json(events);
    } catch (error) {
        console.error("Error getting events:", error);
        res.status(500).json({ message: "Error getting events", error: error.message });
    }
};

const updateEvent = async (req, res) => {
    try {
        const newEventData = req.body;
        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.eventId,
            newEventData,
        );

        if (!updatedEvent) {
            return res.status(404).json({ message: "Event not found" });
        };

        res.status(200).json({ success: true, message: "Event updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error" });
    }
}

const deleteEvent = async (req, res) => {
    try {
        const id = req.params.id
        await Event.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Event deleted successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error" });
    }
}
const findEventById = async (req, res) => {
    try {
        const id = req.params.id
        const event = await Event.findById(id).populate("venue").populate("organizer");
        res.status(200).json({ success: true, event });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error" });
    }
}


module.exports = { createEvent, getAllEvents, updateEvent, deleteEvent, findEventById }
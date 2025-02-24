const Event = require('../models/event-model');

const createEvent = async (req, res) => {
    try {
        await Event.create(req.body)
        res.status(201).json({
            success: true,
            message: 'Event created successfully'
        })
    } catch (error) {
        console.error('Error creating an event:', error);
        res.status(500).json({ message: 'Error creating an event', error: error.message });
    }
};

const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find();
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


module.exports = { createEvent, getAllEvents, updateEvent }
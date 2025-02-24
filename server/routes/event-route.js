const express = require("express");
const {createEvent, getAllEvents, updateEvent,} = require('../controller/event-controller')

const eventRouter = express.Router();

eventRouter.post('/event', createEvent)
eventRouter.get('/events', getAllEvents)
eventRouter.patch('/:eventId', updateEvent)
// eventRouter.delete('/events/:eventsId', deleteEvent)

module.exports = eventRouter;
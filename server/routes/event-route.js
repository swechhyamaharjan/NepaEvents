const express = require("express");
const {createEvent, getAllEvents, updateEvent, deleteEvent, findEventsById} = require('../controller/event-controller');
const verifyToken = require("../middleware/verify-token");

const eventRouter = express.Router();

eventRouter.post('/', createEvent)
eventRouter.get('/', verifyToken, getAllEvents)
eventRouter.patch('/:eventId', updateEvent)
eventRouter.get('/:id', findEventsById)
eventRouter.delete('/:id', deleteEvent)

module.exports = eventRouter;
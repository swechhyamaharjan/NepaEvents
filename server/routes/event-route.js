const express = require("express");
const {createEvent, getAllEvents} = require('../controller/event-controller')

const eventRouter = express.Router();

eventRouter.post('/event', createEvent)
eventRouter.get('/events', getAllEvents)

module.exports = eventRouter;
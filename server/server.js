require('dotenv').config()
const express = require('express');
const connectToDB = require('./database/connection')
const userRoute = require('./routes/user-route')
const cors = require("cors");
const eventRouter = require('./routes/event-route');
const venueRouter = require('./routes/venue-route');
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const artistRouter = require('./routes/artist-route');
const ticketRouter = require('./routes/ticket-route');
const categoryRouter = require("./routes/category-route");
const venueBookingRouter = require("./routes/venue-booking-route");
const { stripeWebHook } = require('./controller/venue-booking-controller');

const PORT = 3000;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(userRoute);
app.use("/api/event", eventRouter);
app.use("/api/venue", venueRouter);
app.use("/api/artist", artistRouter);
app.use("/api/ticket", ticketRouter);
app.use("/api/category", categoryRouter);
app.use('/api/users', userRoute);
app.use("/api/venue-bookings", venueBookingRouter);
app.post("/webhook", bodyParser.raw({ type: "application/json" }), stripeWebHook);
app.use('/uploads', express.static('uploads'));
connectToDB();

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`)
});

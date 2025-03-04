require('dotenv').config()
const express = require('express');
const connectToDB = require('./database/connection')
const userRoute = require('./routes/user-route')
const cors = require("cors");
const eventRouter = require('./routes/event-route');
const venueRouter = require('./routes/venue-route');
const app = express();
const cookieParser = require("cookie-parser");
const artistRouter = require('./routes/artist-route');
const ticketRouter = require('./routes/ticket-route');
const CategoryRouter = require("./routes/category-route");

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
app.use("/api/category", CategoryRouter);
app.use('/uploads', express.static('uploads'));
connectToDB();

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`)
});



require('dotenv').config()
const express = require('express');
const connectToDB = require('./database/connection')
const userRoute = require('./routes/user-route')
const cors = require("cors")
const app = express();

const PORT = 3000;

app.use(cors());
app.use(express.json())
app.use(userRoute)

connectToDB();

app.listen(PORT, ()=>{
  console.log(`Server is running at port ${PORT}`)
});



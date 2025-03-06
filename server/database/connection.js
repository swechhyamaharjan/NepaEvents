const mongoose = require('mongoose');

const connectToDB = async () => {
  try {
    const response = await mongoose.connect("mongodb://localhost:27017/Nepa-Event")
    if (response) {
      console.log('Connected to database')
    }
  } catch (error) {
    console.log(error)
  }
};

module.exports = connectToDB;
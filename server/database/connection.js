const mongoose = require('mongoose');

const connectToDB = async () => {
  try {
    const response = await mongoose.connect("mongodb+srv://swekchyamjn:swekchyamjn@cluster0.y3kwu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    if (response) {
      console.log('Connected to database')
    }
  } catch (error) {
    console.log(error)
  }
};

module.exports = connectToDB;
const User = require('../models/user-model');
const bcrypt = require('bcryptjs')

const registerUser = async (req, res) => {
  try {
    // Check if user exists in database or not
    const checkUserExists = await User.exists({ email: req.body.email })
    if (checkUserExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      })
    } else {
      const hashPassword = await bcrypt.hash(req.body.password, 10);
      req.body.password = hashPassword;

      await User.create(req.body)
      res.status(201).json({
        success: true,
        message: "User registered successfully"
      })
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "Something went wrong"
    })
  }
};

const loginUser = (req, res) => {

}

module.exports = { registerUser, loginUser }


//For registraition
//1. Check if user exists in database or not

//2.if user doesn't exits we need to hash the password 

//3. when all the criteria meets then save the user to database


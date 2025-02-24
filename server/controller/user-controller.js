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
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const checkUserExists = await User.findOne({email});
    if(!checkUserExists) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email"
      })
    }
    const checkPassword = await bcrypt.compare(password, checkUserExists.password);
    if(!checkPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password"
      })
    }
    res.json({
      success: true,
      message: "Login Successful!"
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }

}

module.exports = { registerUser, loginUser }




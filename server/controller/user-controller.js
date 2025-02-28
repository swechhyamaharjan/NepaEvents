const User = require('../models/user-model');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

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
    const token = jwt.sign({user: checkUserExists}, process.env.JWT_SECRET, {expiresIn: "1d"})
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: "60000000"
    }).json({
      success: true,
      data: checkUserExists,
      message: "Login Successful!"
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}
const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token").json({message: "Logout Successful!"})
  } catch (error) {
    console.log(error)
    res.status(500).json({message: "Internal Server Error!"})
  }
}
const getUser = async (req, res) => {
  try {
    res.status(200).json[{user: req.user}]  
  } catch (error) {
    console.log(error)
    res.status(500).json({message: "Internal Server Error!"})
  }
}

module.exports = { registerUser, loginUser, logoutUser, getUser }




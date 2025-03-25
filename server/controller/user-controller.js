const User = require('../models/user-model');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;
    // Validate input fields
    if (!fullName || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if user already exists
    const user = await User.exists({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const hashPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      fullName,
      email,
      password: hashPassword,
      role,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = registerUser;


const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email"
      })
    }
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password"
      })
    }
    const token = jwt.sign({ user: user }, process.env.JWT_SECRET, { expiresIn: "7d" })
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: "60000000"
    }).json({
      success: true,
      user,
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
    res.clearCookie("token").json({ message: "Logout Successful!" })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Internal Server Error!" })
  }
}
const getUser = async (req, res) => {
  try {
    res.status(200).json(req.user)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Internal Server Error!" })
  }
}
// Fetch all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password'); 
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error });
  }
};

module.exports = { registerUser, loginUser, logoutUser, getUser, getAllUsers }




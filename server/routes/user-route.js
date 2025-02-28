const express = require('express');
const {registerUser, loginUser, logoutUser, getUser} = require('../controller/user-controller');
const verifyToken = require('../middleware/verify-token');

const router = express.Router();

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/logout', logoutUser)
router.get('/getProfile', verifyToken, getUser)

module.exports = router;

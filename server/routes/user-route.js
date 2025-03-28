const express = require('express');
const {registerUser, loginUser, logoutUser, getUser, getAllUsers} = require('../controller/user-controller');
const verifyToken = require('../middleware/verify-token');

const router = express.Router();

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/logout', logoutUser)
router.get('/getProfile', verifyToken, getUser)
router.get('/list', getAllUsers);

module.exports = router;

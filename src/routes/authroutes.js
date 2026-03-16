const express = require('express');
const router = express.Router();
const authController = require('../ctrls/authctrl');
const { validate } = require('../midware/valid');
const { authenticate } = require('../midware/auth');

router.post('/register', validate('register'), authController.register);
router.post('/login', validate('login'), authController.login);

router.get('/verify', authenticate, authController.verifyToken);

module.exports = router;
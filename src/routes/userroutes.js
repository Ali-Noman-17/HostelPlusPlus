const express = require('express');
const router = express.Router();
const userController = require('../ctrls/userctrl');
const { authenticate } = require('../midware/auth');
const { validate } = require('../midware/valid');

router.use(authenticate);

router.get('/profile', userController.getProfile);
router.put('/profile', validate('updateProfile'), userController.updateProfile);
router.put('/change-password', validate('changePassword'), userController.changePassword);

router.get('/bookings', userController.getUserBookings);

router.get('/wishlist', userController.getWishlist);
router.post('/wishlist/:hostelId', userController.addToWishlist);
router.delete('/wishlist/:hostelId', userController.removeFromWishlist);

module.exports = router;
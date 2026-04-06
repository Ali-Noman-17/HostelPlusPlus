const express = require('express');
const router = express.Router();
const bookingController = require('../ctrls/bookingctrl');
const { authenticate } = require('../midware/auth');
const { validate } = require('../midware/valid');
const { checkBookingOwnership } = require('../midware/ownership');

router.use(authenticate);

const bookingValidation = (req, res, next) => {
    const { hostel_room_id, check_in_date, check_out_date } = req.body;
    
    if (!hostel_room_id || !check_in_date || !check_out_date) {
        return res.status(400).json({
            success: false,
            error: 'Missing required fields: hostel_room_id, check_in_date, check_out_date'
        });
    }
    
    next();
};

router.post('/', bookingValidation, bookingController.createBooking);
router.get('/:id', authenticate, checkBookingOwnership, bookingController.getBookingById);
router.post('/:id/cancel', authenticate, checkBookingOwnership, bookingController.cancelBooking);

module.exports = router;
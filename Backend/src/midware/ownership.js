const db = require('../config/database');

const checkBookingOwnership = async (req, res, next) => {
    try {
        const bookingId = req.params.id;
        const userId = req.user.id;
        const userRole = req.user.role;

        if (userRole === 'admin') {
            return next();
        }

        const [booking] = await db.query(
            'SELECT user_id FROM bookings WHERE booking_id = ?',
            [String(bookingId)]
        );

        if (!booking) {
            return res.status(404).json({
                success: false,
                error: 'Booking not found'
            });
        }

        if (booking.user_id !== userId) {
            return res.status(403).json({
                success: false,
                error: 'You can only access your own bookings'
            });
        }

        next();
    } catch (error) {
        console.error('Booking ownership check failed:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to verify ownership'
        });
    }
};

const checkReviewOwnership = async (req, res, next) => {
    try {
        const reviewId = req.params.id;
        const userId = req.user.id;
        const userRole = req.user.role;

        if (userRole === 'admin') {
            return next();
        }

        const [review] = await db.query(
            'SELECT user_id FROM reviews WHERE review_id = ?',
            [String(reviewId)]
        );

        if (!review) {
            return res.status(404).json({
                success: false,
                error: 'Review not found'
            });
        }

        if (review.user_id !== userId) {
            return res.status(403).json({
                success: false,
                error: 'You can only modify your own reviews'
            });
        }

        next();
    } catch (error) {
        console.error('Review ownership check failed:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to verify ownership'
        });
    }
};

const checkHostelOwnership = async (req, res, next) => {
    try {
        const hostelId = req.params.id;
        const userId = req.user.id;
        const userRole = req.user.role;

        if (userRole === 'admin') {
            return next();
        }

        const [user] = await db.query(
            'SELECT first_name, last_name FROM users WHERE user_id = ?',
            [String(userId)]
        );
        const ownerName = `${user.first_name} ${user.last_name}`.trim();

        const [hostel] = await db.query(
            'SELECT owner_name FROM hostels WHERE hostel_id = ?',
            [String(hostelId)]
        );

        if (!hostel) {
            return res.status(404).json({
                success: false,
                error: 'Hostel not found'
            });
        }

        if (hostel.owner_name !== ownerName) {
            return res.status(403).json({
                success: false,
                error: 'You can only manage your own hostels'
            });
        }

        next();
    } catch (error) {
        console.error('Hostel ownership check failed:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to verify ownership'
        });
    }
};

module.exports = {
    checkBookingOwnership,
    checkReviewOwnership,
    checkHostelOwnership
};
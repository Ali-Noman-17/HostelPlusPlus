const db = require('../config/database');

const createReview = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            hostel_id,
            booking_id,
            rating,
            cleanliness_rating,
            food_rating,
            safety_rating,
            location_rating,
            comment
        } = req.body;

        console.log(`Creating review for user ${userId}, hostel ${hostel_id}, booking ${booking_id}`);

        const stringUserId = String(userId);
        const stringHostelId = String(hostel_id);
        const stringBookingId = String(booking_id);
        const stringRating = rating ? String(rating) : null;
        const stringCleanliness = cleanliness_rating ? String(cleanliness_rating) : null;
        const stringFood = food_rating ? String(food_rating) : null;
        const stringSafety = safety_rating ? String(safety_rating) : null;
        const stringLocation = location_rating ? String(location_rating) : null;

        const booking = await db.query(
            `SELECT b.booking_id, b.check_in_date, b.check_out_date
             FROM bookings b
             WHERE b.user_id = ? AND b.booking_id = ?`,
            [stringUserId, stringBookingId]
        );

        if (!booking || booking.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Booking not found'
            });
        }

        const existingReview = await db.query(
            'SELECT review_id FROM reviews WHERE user_id = ? AND hostel_id = ?',
            [stringUserId, stringHostelId]
        );

        if (existingReview.length > 0) {
            return res.status(409).json({
                success: false,
                error: 'You have already reviewed this hostel'
            });
        }

        const result = await db.query(
            `INSERT INTO reviews (
                user_id, hostel_id, booking_id, rating,
                cleanliness_rating, food_rating, safety_rating,
                location_rating, comment, stay_start_date, stay_end_date,
                helpful_count, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, NOW())`,
            [
                stringUserId,
                stringHostelId,
                stringBookingId,
                stringRating,
                stringCleanliness,
                stringFood,
                stringSafety,
                stringLocation,
                comment || null,
                booking[0]?.check_in_date || null,
                booking[0]?.check_out_date || null
            ]
        );

        await updateHostelRating(stringHostelId);

        res.status(201).json({
            success: true,
            message: 'Review posted successfully',
            data: {
                review_id: result.insertId
            }
        });

    } catch (error) {
        console.error('Create review error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to post review',
            details: error.message
        });
    }
};

const updateReview = async (req, res) => {
    try {
        const reviewId = req.params.id;
        const userId = req.user.id;
        const {
            rating,
            cleanliness_rating,
            food_rating,
            safety_rating,
            location_rating,
            comment
        } = req.body;

        const stringReviewId = String(reviewId);
        const stringUserId = String(userId);

        const review = await db.query(
            'SELECT * FROM reviews WHERE review_id = ? AND user_id = ?',
            [stringReviewId, stringUserId]
        );

        if (!review || review.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Review not found or you do not own it'
            });
        }

        const reviewDate = new Date(review[0].created_at);
        const now = new Date();
        const daysDiff = (now - reviewDate) / (1000 * 60 * 60 * 24);

        if (daysDiff > 7) {
            return res.status(403).json({
                success: false,
                error: 'Reviews can only be edited within 7 days of posting'
            });
        }

        const updates = [];
        const params = [];

        if (rating !== undefined) {
            updates.push('rating = ?');
            params.push(String(rating));
        }
        if (cleanliness_rating !== undefined) {
            updates.push('cleanliness_rating = ?');
            params.push(String(cleanliness_rating));
        }
        if (food_rating !== undefined) {
            updates.push('food_rating = ?');
            params.push(String(food_rating));
        }
        if (safety_rating !== undefined) {
            updates.push('safety_rating = ?');
            params.push(String(safety_rating));
        }
        if (location_rating !== undefined) {
            updates.push('location_rating = ?');
            params.push(String(location_rating));
        }
        if (comment !== undefined) {
            updates.push('comment = ?');
            params.push(comment);
        }

        if (updates.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'No fields to update'
            });
        }

        params.push(stringReviewId);

        await db.query(
            `UPDATE reviews SET ${updates.join(', ')} WHERE review_id = ?`,
            params
        );

        await updateHostelRating(String(review[0].hostel_id));

        res.json({
            success: true,
            message: 'Review updated successfully'
        });

    } catch (error) {
        console.error('Update review error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update review',
            details: error.message
        });
    }
};

const deleteReview = async (req, res) => {
    try {
        const reviewId = req.params.id;
        const userId = req.user.id;

        const stringReviewId = String(reviewId);
        const stringUserId = String(userId);

        const review = await db.query(
            'SELECT hostel_id FROM reviews WHERE review_id = ? AND user_id = ?',
            [stringReviewId, stringUserId]
        );

        if (!review || review.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Review not found or you do not own it'
            });
        }

        const hostelId = String(review[0].hostel_id);

        await db.query('DELETE FROM reviews WHERE review_id = ?', [stringReviewId]);

        await updateHostelRating(hostelId);

        res.json({
            success: true,
            message: 'Review deleted successfully'
        });

    } catch (error) {
        console.error('Delete review error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete review',
            details: error.message
        });
    }
};

const getHostelReviews = async (req, res) => {
    try {
        const hostelId = req.params.id;
        const { page = 1, limit = 10, sort = 'recent' } = req.query;
        
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const offset = (pageNum - 1) * limitNum;

        const stringHostelId = String(hostelId);
        const stringLimit = String(limitNum);
        const stringOffset = String(offset);

        const avgRatings = await db.query(
            `SELECT 
                COUNT(*) as total_reviews,
                AVG(rating) as avg_rating,
                AVG(cleanliness_rating) as avg_cleanliness,
                AVG(food_rating) as avg_food,
                AVG(safety_rating) as avg_safety,
                AVG(location_rating) as avg_location
             FROM reviews 
             WHERE hostel_id = ?`,
            [stringHostelId]
        );

        let orderClause = 'ORDER BY r.created_at DESC';
        if (sort === 'highest') {
            orderClause = 'ORDER BY r.rating DESC, r.created_at DESC';
        } else if (sort === 'lowest') {
            orderClause = 'ORDER BY r.rating ASC, r.created_at DESC';
        } else if (sort === 'helpful') {
            orderClause = 'ORDER BY r.helpful_count DESC, r.created_at DESC';
        }

        const reviews = await db.query(
            `SELECT 
                r.review_id,
                r.rating,
                r.cleanliness_rating,
                r.food_rating,
                r.safety_rating,
                r.location_rating,
                r.comment,
                DATE_FORMAT(r.created_at, '%Y-%m-%d') as review_date,
                CONCAT(u.first_name, ' ', LEFT(u.last_name, 1)) as user_name,
                r.helpful_count,
                TIMESTAMPDIFF(DAY, r.created_at, NOW()) as days_ago
             FROM reviews r
             JOIN users u ON r.user_id = u.user_id
             WHERE r.hostel_id = ?
             ${orderClause}
             LIMIT ? OFFSET ?`,
            [stringHostelId, stringLimit, stringOffset]
        );

        const countResult = await db.query(
            'SELECT COUNT(*) as total FROM reviews WHERE hostel_id = ?',
            [stringHostelId]
        );

        res.json({
            success: true,
            data: {
                summary: {
                    total_reviews: avgRatings[0]?.total_reviews || 0,
                    average_rating: parseFloat(avgRatings[0]?.avg_rating || 0).toFixed(1),
                    average_cleanliness: parseFloat(avgRatings[0]?.avg_cleanliness || 0).toFixed(1),
                    average_food: parseFloat(avgRatings[0]?.avg_food || 0).toFixed(1),
                    average_safety: parseFloat(avgRatings[0]?.avg_safety || 0).toFixed(1),
                    average_location: parseFloat(avgRatings[0]?.avg_location || 0).toFixed(1)
                },
                reviews: reviews,
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    total: countResult[0]?.total || 0,
                    pages: Math.ceil((countResult[0]?.total || 0) / limitNum)
                }
            }
        });

    } catch (error) {
        console.error('Get hostel reviews error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch reviews',
            details: error.message
        });
    }
};

const getMyReviews = async (req, res) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 10 } = req.query;

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const offset = (pageNum - 1) * limitNum;

        const stringUserId = String(userId);
        const stringLimit = String(limitNum);
        const stringOffset = String(offset);

        const reviews = await db.query(
            `SELECT 
                r.review_id,
                r.rating,
                r.cleanliness_rating,
                r.food_rating,
                r.safety_rating,
                r.location_rating,
                r.comment,
                DATE_FORMAT(r.created_at, '%Y-%m-%d') as review_date,
                r.helpful_count,
                h.hostel_id,
                h.hostel_name,
                h.address,
                c.city_name,
                a.area_name
             FROM reviews r
             JOIN hostels h ON r.hostel_id = h.hostel_id
             JOIN cities c ON h.city_id = c.city_id
             LEFT JOIN areas a ON h.area_id = a.area_id
             WHERE r.user_id = ?
             ORDER BY r.created_at DESC
             LIMIT ? OFFSET ?`,
            [stringUserId, stringLimit, stringOffset]
        );

        const countResult = await db.query(
            'SELECT COUNT(*) as total FROM reviews WHERE user_id = ?',
            [stringUserId]
        );

        res.json({
            success: true,
            data: reviews,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total: countResult[0]?.total || 0,
                pages: Math.ceil((countResult[0]?.total || 0) / limitNum)
            }
        });

    } catch (error) {
        console.error('Get my reviews error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch your reviews',
            details: error.message
        });
    }
};

const markHelpful = async (req, res) => {
    try {
        const reviewId = req.params.id;
        const userId = req.user.id;

        const stringReviewId = String(reviewId);
        const stringUserId = String(userId);

        const review = await db.query(
            'SELECT review_id FROM reviews WHERE review_id = ?',
            [stringReviewId]
        );

        if (!review || review.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Review not found'
            });
        }

        await db.query(
            'UPDATE reviews SET helpful_count = helpful_count + 1 WHERE review_id = ?',
            [stringReviewId]
        );

        res.json({
            success: true,
            message: 'Review marked as helpful'
        });

    } catch (error) {
        console.error('Mark helpful error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to mark review as helpful',
            details: error.message
        });
    }
};

async function updateHostelRating(hostelId) {
    try {
        const stringHostelId = String(hostelId);
        
        await db.query(
            `UPDATE hostels h
             SET h.rating = (
                 SELECT COALESCE(AVG(rating), 0)
                 FROM reviews 
                 WHERE hostel_id = ?
             ),
             h.total_reviews = (
                 SELECT COUNT(*)
                 FROM reviews 
                 WHERE hostel_id = ?
             )
             WHERE h.hostel_id = ?`,
            [stringHostelId, stringHostelId, stringHostelId]
        );
    } catch (error) {
        console.error('Error updating hostel rating:', error);
        throw error;
    }
}

module.exports = {
    createReview,
    updateReview,
    deleteReview,
    getHostelReviews,
    getMyReviews,
    markHelpful
};
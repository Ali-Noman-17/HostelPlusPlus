const db = require('../config/database');
const transactionManager = require('../utils/txnmanager');

const createBooking = async (req, res) => {
    const { hostel_room_id, check_in_date, check_out_date, special_requests } = req.body;
    const userId = req.user.id;

    try {
        const result = await transactionManager.executeTransaction(async (conn, txnId) => {
            console.log(`[TXN-${txnId}] Starting booking creation for user ${userId}`);

            const checkIn = new Date(check_in_date);
            const checkOut = new Date(check_out_date);
            
            if (checkOut <= checkIn) {
                throw new Error('Check-out date must be after check-in date');
            }

            const daysDiff = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
            const months = Math.ceil(daysDiff / 30);

            console.log(`[TXN-${txnId}] Checking room ${hostel_room_id} availability`);

            const [rooms] = await conn.execute(
                `SELECT hr.*, h.hostel_name, h.owner_name 
                FROM hostel_rooms hr
                JOIN hostels h ON hr.hostel_id = h.hostel_id
                WHERE hr.hostel_room_id = ? 
                AND hr.is_available = TRUE 
                FOR UPDATE`,
                [String(hostel_room_id)]
            );

            if (rooms.length === 0) {
                throw new Error('ROOM_NOT_FOUND');
            }

            const room = rooms[0];

            if (room.available_beds <= 0) {
                throw new Error('NO_BEDS_AVAILABLE');
            }

            console.log(`[TXN-${txnId}] Room available. Beds: ${room.available_beds}`);

            const [conflicts] = await conn.execute(
                `SELECT booking_id FROM bookings 
                 WHERE hostel_room_id = ? 
                 AND status IN ('confirmed', 'pending')
                 AND (
                     (check_in_date BETWEEN ? AND ?) OR
                     (check_out_date BETWEEN ? AND ?) OR
                     (? BETWEEN check_in_date AND check_out_date) OR
                     (? BETWEEN check_in_date AND check_out_date)
                 )`,
                [
                    String(hostel_room_id),
                    check_in_date, check_out_date,
                    check_in_date, check_out_date,
                    check_in_date,
                    check_out_date
                ]
            );

            if (conflicts.length > 0) {
                throw new Error('DATES_CONFLICT');
            }

            const total_amount = room.monthly_rent * months;
            const advance_paid = total_amount * 0.2; // 20% advance
            const booking_reference = 'BKG' + Date.now().toString().slice(-8);

            console.log(`[TXN-${txnId}] Creating booking`);

            const [bookingResult] = await conn.execute(
                `INSERT INTO bookings 
                 (booking_reference, user_id, hostel_room_id, booking_date,
                  check_in_date, check_out_date, status, total_amount, 
                  advance_paid, payment_status, special_requests)
                 VALUES (?, ?, ?, NOW(), ?, ?, 'confirmed', ?, ?, 'partial', ?)`,
                [
                    booking_reference,
                    String(userId),
                    String(hostel_room_id),
                    check_in_date,
                    check_out_date,
                    String(total_amount),
                    String(advance_paid),
                    special_requests || null
                ]
            );

            const booking_id = bookingResult.insertId;

            await conn.execute(
                `UPDATE hostel_rooms 
                 SET available_beds = available_beds - 1
                 WHERE hostel_room_id = ?`,
                [String(hostel_room_id)]
            );

            await transactionManager.logOperation(
                conn,
                'bookings',
                booking_id,
                'INSERT',
                null,
                {
                    booking_reference,
                    user_id: userId,
                    hostel_room_id,
                    check_in_date,
                    check_out_date,
                    total_amount,
                    advance_paid,
                    special_requests
                },
                userId
            );

            console.log(`[TXN-${txnId}] Booking created successfully: ${booking_id}`);

            return {
                booking_id,
                booking_reference,
                total_amount,
                advance_paid,
                balance_due: total_amount - advance_paid,
                check_in_date,
                check_out_date
            };

        }, { user: req.user, endpoint: 'POST /api/v1/bookings' });

        res.status(201).json({
            success: true,
            message: 'Booking confirmed',
            data: result
        });

    } catch (error) {
        console.error('Booking error:', error);

        const errorMap = {
            'ROOM_NOT_FOUND': { status: 404, message: 'Room not found' },
            'NO_BEDS_AVAILABLE': { status: 409, message: 'No beds available in this room' },
            'DATES_CONFLICT': { status: 409, message: 'Room already booked for these dates' },
            'Check-out date must be after check-in date': { status: 400, message: error.message }
        };

        const mappedError = errorMap[error.message] || {
            status: 400,
            message: error.message
        };

        res.status(mappedError.status).json({
            success: false,
            error: mappedError.message
        });
    }
};

const getBookingById = async (req, res) => {
    try {
        const bookingId = req.params.id;
        const userId = req.user.id;
        const userRole = req.user.role;

        const sql = `
            SELECT 
                b.booking_id,
                b.booking_reference,
                b.check_in_date,
                b.check_out_date,
                b.status,
                b.total_amount,
                b.advance_paid,
                b.payment_status,
                b.special_requests,
                h.hostel_id,
                h.hostel_name,
                h.address,
                h.contact_number as hostel_contact,
                a.area_name,
                c.city_name,
                rt.type_name as room_type,
                hr.room_number,
                hr.monthly_rent,
                u.user_id,
                u.first_name,
                u.last_name,
                u.email,
                u.phone
            FROM bookings b
            JOIN hostel_rooms hr ON b.hostel_room_id = hr.hostel_room_id
            JOIN hostels h ON hr.hostel_id = h.hostel_id
            JOIN room_types rt ON hr.room_type_id = rt.room_type_id
            LEFT JOIN areas a ON h.area_id = a.area_id
            JOIN cities c ON h.city_id = c.city_id
            JOIN users u ON b.user_id = u.user_id
            WHERE b.booking_id = ?
        `;

        const bookings = await db.query(sql, [String(bookingId)]);

        if (bookings.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Booking not found'
            });
        }

        const booking = bookings[0];

        const isOwner = booking.user_id === userId;
        const isAdmin = userRole === 'admin';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                success: false,
                error: 'You do not have permission to view this booking'
            });
        }

        if (!isOwner && !isAdmin) {
            delete booking.email;
            delete booking.phone;
        }

        res.json({
            success: true,
            data: booking
        });

    } catch (error) {
        console.error('Get booking error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch booking'
        });
    }
}; 

const cancelBooking = async (req, res) => {
    try {
        const bookingId = req.params.id;
        const userId = req.user.id;
        const userRole = req.user.role;
        const { reason } = req.body;

        const bookings = await db.query(
            `SELECT b.*, hr.hostel_id, hr.hostel_room_id 
             FROM bookings b
             JOIN hostel_rooms hr ON b.hostel_room_id = hr.hostel_room_id
             WHERE b.booking_id = ?`,
            [String(bookingId)]
        );

        if (bookings.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Booking not found'
            });
        }

        const booking = bookings[0];

        const isOwner = booking.user_id === userId;
        const isAdmin = userRole === 'admin';
        
       
        const isHostelOwner = hostel.length > 0 && hostel[0].owner_id === userId;

        if (!isOwner && !isHostelOwner && !isAdmin) {
            return res.status(403).json({
                success: false,
                error: 'You do not have permission to cancel this booking'
            });
        }

        if (booking.status === 'cancelled') {
            return res.status(409).json({
                success: false,
                error: 'Booking is already cancelled'
            });
        }

        if (booking.status === 'completed') {
            return res.status(409).json({
                success: false,
                error: 'Completed bookings cannot be cancelled'
            });
        }

        await db.query(
            `UPDATE bookings 
             SET status = 'cancelled', 
                 cancelled_at = NOW(), 
                 cancellation_reason = ? 
             WHERE booking_id = ?`,
            [reason || null, String(bookingId)]
        );

        await db.query(
            'UPDATE hostel_rooms SET available_beds = available_beds + 1 WHERE hostel_room_id = ?',
            [String(booking.hostel_room_id)]
        );

        res.json({
            success: true,
            message: 'Booking cancelled successfully'
        });

    } catch (error) {
        console.error('Cancel booking error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to cancel booking'
        });
    }
};

module.exports = {
    createBooking,
    getBookingById,
    cancelBooking
};
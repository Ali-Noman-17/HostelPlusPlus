const db = require('../config/database');

const getMyHostels = async (req, res) => {
    try {
        const ownerId = req.user.id; 
        const { page = 1, limit = 10 } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);

        const [user] = await db.query(
            'SELECT first_name, last_name FROM users WHERE user_id = ?',
            [String(ownerId)]
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        const ownerName = `${user.first_name} ${user.last_name}`.trim();

        const sql = `
            SELECT 
                h.hostel_id,
                h.hostel_name,
                h.owner_name,
                h.contact_number,
                h.email,
                h.address,
                a.area_name,
                c.city_name,
                h.gender_preference,
                h.rating,
                h.total_reviews,
                h.is_verified,
                h.created_at,
                COUNT(DISTINCT hr.hostel_room_id) as total_rooms,
                SUM(hr.total_beds_in_room) as total_beds,
                SUM(CASE WHEN hr.is_available = TRUE THEN hr.available_beds ELSE 0 END) as available_beds,
                MIN(hr.monthly_rent) as min_rent,
                MAX(hr.monthly_rent) as max_rent
            FROM hostels h
            JOIN cities c ON h.city_id = c.city_id
            LEFT JOIN areas a ON h.area_id = a.area_id
            LEFT JOIN hostel_rooms hr ON h.hostel_id = hr.hostel_id
            WHERE h.owner_name = ?
            GROUP BY h.hostel_id
            ORDER BY h.created_at DESC
            LIMIT ? OFFSET ?
        `;

        const hostels = await db.query(sql, [ownerName, parseInt(limit), offset]);

        const countSql = 'SELECT COUNT(*) as total FROM hostels WHERE owner_name = ?';
        const countResult = await db.query(countSql, [ownerName]);
        const total = countResult[0]?.total || 0;

        res.json({
            success: true,
            data: hostels,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });

    } catch (error) {
        console.error('Get my hostels error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch your hostels',
            details: error.message
        });
    }
};

const createHostel = async (req, res) => {
    try {
        const ownerId = req.user.id;
        const {
            hostel_name,
            contact_number,
            alternate_number,
            email,
            address,
            city_id,
            area_id,
            pincode,
            latitude,
            longitude,
            gender_preference,
            description
        } = req.body;

        const [user] = await db.query(
            'SELECT first_name, last_name FROM users WHERE user_id = ?',
            [String(ownerId)]
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        const ownerName = `${user.first_name} ${user.last_name}`.trim();

        const result = await db.query(
            `INSERT INTO hostels (
                hostel_name, owner_name, contact_number, alternate_number,
                email, address, city_id, area_id, pincode,
                latitude, longitude, gender_preference, description,
                is_verified, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, FALSE, NOW())`,
            [
                hostel_name,
                ownerName,
                contact_number,
                alternate_number || null,
                email || null,
                address,
                String(city_id),
                area_id ? String(area_id) : null,
                pincode || null,
                latitude || null,
                longitude || null,
                gender_preference || 'co-ed',
                description || null
            ]
        );

        await db.query(
            `INSERT INTO audit_log 
             (table_name, record_id, action, new_data, changed_by)
             VALUES (?, ?, ?, ?, ?)`,
            [
                'hostels',
                result.insertId,
                'INSERT',
                JSON.stringify({ hostel_name, ownerName, city_id }),
                ownerId
            ]
        );

        res.status(201).json({
            success: true,
            message: 'Hostel registered successfully. It will be visible after admin verification.',
            data: {
                hostel_id: result.insertId,
                hostel_name,
                is_verified: false
            }
        });

    } catch (error) {
        console.error('Create hostel error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to register hostel',
            details: error.message
        });
    }
};

const updateHostel = async (req, res) => {
    try {
        const hostelId = req.params.id;
        const ownerId = req.user.id;
        const updates = req.body;

        // Get owner's name
        const [user] = await db.query(
            'SELECT first_name, last_name FROM users WHERE user_id = ?',
            [String(ownerId)]
        );
        const ownerName = `${user.first_name} ${user.last_name}`.trim();

        const [hostel] = await db.query(
            'SELECT * FROM hostels WHERE hostel_id = ? AND owner_name = ?',
            [String(hostelId), ownerName]
        );

        if (!hostel) {
            return res.status(403).json({
                success: false,
                error: 'You do not own this hostel'
            });
        }

        const allowedFields = [
            'hostel_name', 'contact_number', 'alternate_number', 'email',
            'address', 'area_id', 'pincode', 'latitude', 'longitude',
            'gender_preference', 'description'
        ];

        const updateFields = [];
        const updateValues = [];

        allowedFields.forEach(field => {
            if (updates[field] !== undefined) {
                updateFields.push(`${field} = ?`);
                updateValues.push(updates[field]);
            }
        });

        if (updateFields.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'No valid fields to update'
            });
        }

        updateValues.push(String(hostelId));

        const sql = `UPDATE hostels SET ${updateFields.join(', ')} WHERE hostel_id = ?`;
        await db.query(sql, updateValues);

        await db.query(
            `INSERT INTO audit_log 
             (table_name, record_id, action, old_data, new_data, changed_by)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                'hostels',
                hostelId,
                'UPDATE',
                JSON.stringify(hostel),
                JSON.stringify(updates),
                ownerId
            ]
        );

        res.json({
            success: true,
            message: 'Hostel updated successfully'
        });

    } catch (error) {
        console.error('Update hostel error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update hostel',
            details: error.message
        });
    }
};

const getHostelRooms = async (req, res) => {
    try {
        const hostelId = req.params.id;
        const ownerId = req.user.id;

        const [user] = await db.query(
            'SELECT first_name, last_name FROM users WHERE user_id = ?',
            [String(ownerId)]
        );
        const ownerName = `${user.first_name} ${user.last_name}`.trim();

        const [hostel] = await db.query(
            'SELECT hostel_id FROM hostels WHERE hostel_id = ? AND owner_name = ?',
            [String(hostelId), ownerName]
        );

        if (!hostel) {
            return res.status(403).json({
                success: false,
                error: 'You do not own this hostel'
            });
        }

        const sql = `
            SELECT 
                hr.hostel_room_id,
                rt.type_name as room_type,
                hr.room_number,
                hr.total_beds_in_room,
                hr.available_beds,
                hr.monthly_rent,
                hr.security_deposit,
                hr.is_available,
                hr.floor_number,
                hr.created_at
            FROM hostel_rooms hr
            JOIN room_types rt ON hr.room_type_id = rt.room_type_id
            WHERE hr.hostel_id = ?
            ORDER BY hr.floor_number, hr.room_number
        `;

        const rooms = await db.query(sql, [String(hostelId)]);

        res.json({
            success: true,
            count: rooms.length,
            data: rooms
        });

    } catch (error) {
        console.error('Get hostel rooms error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch rooms',
            details: error.message
        });
    }
};

const addRoom = async (req, res) => {
    try {
        const hostelId = req.params.id;
        const ownerId = req.user.id;
        const {
            room_type_id,
            room_number,
            total_beds_in_room,
            monthly_rent,
            security_deposit,
            floor_number
        } = req.body;

        const [user] = await db.query(
            'SELECT first_name, last_name FROM users WHERE user_id = ?',
            [String(ownerId)]
        );
        const ownerName = `${user.first_name} ${user.last_name}`.trim();

        const [hostel] = await db.query(
            'SELECT hostel_id FROM hostels WHERE hostel_id = ? AND owner_name = ?',
            [String(hostelId), ownerName]
        );

        if (!hostel) {
            return res.status(403).json({
                success: false,
                error: 'You do not own this hostel'
            });
        }

        const result = await db.query(
            `INSERT INTO hostel_rooms (
                hostel_id, room_type_id, room_number, total_beds_in_room,
                available_beds, monthly_rent, security_deposit, floor_number,
                is_available, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, TRUE, NOW())`,
            [
                String(hostelId),
                String(room_type_id),
                room_number || null,
                String(total_beds_in_room),
                String(total_beds_in_room), 
                String(monthly_rent),
                security_deposit ? String(security_deposit) : '0',
                floor_number ? String(floor_number) : '1'
            ]
        );

        await db.query(
            `UPDATE hostels 
             SET total_rooms = (SELECT COUNT(*) FROM hostel_rooms WHERE hostel_id = ?)
             WHERE hostel_id = ?`,
            [String(hostelId), String(hostelId)]
        );

        res.status(201).json({
            success: true,
            message: 'Room added successfully',
            data: {
                hostel_room_id: result.insertId
            }
        });

    } catch (error) {
        console.error('Add room error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to add room',
            details: error.message
        });
    }
};

const updateRoom = async (req, res) => {
    try {
        const roomId = req.params.id;
        const ownerId = req.user.id;
        const updates = req.body;

        const [user] = await db.query(
            'SELECT first_name, last_name FROM users WHERE user_id = ?',
            [String(ownerId)]
        );
        const ownerName = `${user.first_name} ${user.last_name}`.trim();

        const [room] = await db.query(
            `SELECT hr.*, h.owner_name 
             FROM hostel_rooms hr
             JOIN hostels h ON hr.hostel_id = h.hostel_id
             WHERE hr.hostel_room_id = ?`,
            [String(roomId)]
        );

        if (!room) {
            return res.status(404).json({
                success: false,
                error: 'Room not found'
            });
        }

        if (room.owner_name !== ownerName) {
            return res.status(403).json({
                success: false,
                error: 'You do not own this room'
            });
        }

        const allowedFields = [
            'room_number', 'total_beds_in_room', 'monthly_rent',
            'security_deposit', 'is_available', 'floor_number'
        ];

        const updateFields = [];
        const updateValues = [];

        allowedFields.forEach(field => {
            if (updates[field] !== undefined) {
                updateFields.push(`${field} = ?`);
                updateValues.push(updates[field]);
            }
        });

        if (updates.total_beds_in_room) {
            const diff = updates.total_beds_in_room - room.total_beds_in_room;
            updateFields.push('available_beds = available_beds + ?');
            updateValues.push(diff);
        }

        if (updateFields.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'No valid fields to update'
            });
        }

        updateValues.push(String(roomId));

        const sql = `UPDATE hostel_rooms SET ${updateFields.join(', ')} WHERE hostel_room_id = ?`;
        await db.query(sql, updateValues);

        res.json({
            success: true,
            message: 'Room updated successfully'
        });

    } catch (error) {
        console.error('Update room error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update room',
            details: error.message
        });
    }
};

const deleteRoom = async (req, res) => {
    try {
        const roomId = req.params.id;
        const ownerId = req.user.id;

        const [user] = await db.query(
            'SELECT first_name, last_name FROM users WHERE user_id = ?',
            [String(ownerId)]
        );
        const ownerName = `${user.first_name} ${user.last_name}`.trim();

        const [room] = await db.query(
            `SELECT hr.*, h.owner_name,
                (SELECT COUNT(*) FROM bookings 
                 WHERE hostel_room_id = hr.hostel_room_id 
                 AND status IN ('confirmed', 'pending')) as active_bookings
             FROM hostel_rooms hr
             JOIN hostels h ON hr.hostel_id = h.hostel_id
             WHERE hr.hostel_room_id = ?`,
            [String(roomId)]
        );

        if (!room) {
            return res.status(404).json({
                success: false,
                error: 'Room not found'
            });
        }

        if (room.owner_name !== ownerName) {
            return res.status(403).json({
                success: false,
                error: 'You do not own this room'
            });
        }

        if (room.active_bookings > 0) {
            return res.status(409).json({
                success: false,
                error: 'Cannot delete room with active bookings'
            });
        }

        const hostelId = room.hostel_id;

        await db.query('DELETE FROM hostel_rooms WHERE hostel_room_id = ?', [String(roomId)]);

        await db.query(
            `UPDATE hostels 
             SET total_rooms = (SELECT COUNT(*) FROM hostel_rooms WHERE hostel_id = ?)
             WHERE hostel_id = ?`,
            [String(hostelId), String(hostelId)]
        );

        res.json({
            success: true,
            message: 'Room deleted successfully'
        });

    } catch (error) {
        console.error('Delete room error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete room',
            details: error.message
        });
    }
};

const getHostelBookings = async (req, res) => {
    try {
        const hostelId = req.params.id;
        const ownerId = req.user.id;
        const { status, page = 1, limit = 20 } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);

        const [user] = await db.query(
            'SELECT first_name, last_name FROM users WHERE user_id = ?',
            [String(ownerId)]
        );
        const ownerName = `${user.first_name} ${user.last_name}`.trim();

        const [hostel] = await db.query(
            'SELECT hostel_id FROM hostels WHERE hostel_id = ? AND owner_name = ?',
            [String(hostelId), ownerName]
        );

        if (!hostel) {
            return res.status(403).json({
                success: false,
                error: 'You do not own this hostel'
            });
        }

        let whereClause = 'WHERE hr.hostel_id = ?';
        const params = [String(hostelId)];

        if (status) {
            whereClause += ' AND b.status = ?';
            params.push(status);
        }

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
                b.booking_date,
                CONCAT(u.first_name, ' ', u.last_name) as guest_name,
                u.email as guest_email,
                u.phone as guest_phone,
                rt.type_name as room_type,
                hr.room_number
            FROM bookings b
            JOIN hostel_rooms hr ON b.hostel_room_id = hr.hostel_room_id
            JOIN users u ON b.user_id = u.user_id
            JOIN room_types rt ON hr.room_type_id = rt.room_type_id
            ${whereClause}
            ORDER BY b.check_in_date DESC
            LIMIT ? OFFSET ?
        `;

        const bookings = await db.query(sql, [...params, parseInt(limit), offset]);

        const countSql = `
            SELECT COUNT(*) as total
            FROM bookings b
            JOIN hostel_rooms hr ON b.hostel_room_id = hr.hostel_room_id
            ${whereClause}
        `;
        const countResult = await db.query(countSql, params);
        const total = countResult[0]?.total || 0;

        res.json({
            success: true,
            data: bookings,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });

    } catch (error) {
        console.error('Get hostel bookings error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch bookings',
            details: error.message
        });
    }
};

const getOwnerDashboard = async (req, res) => {
    try {
        const ownerId = req.user.id;

        const [user] = await db.query(
            'SELECT first_name, last_name FROM users WHERE user_id = ?',
            [String(ownerId)]
        );
        const ownerName = `${user.first_name} ${user.last_name}`.trim();

        const [hostelCount] = await db.query(
            'SELECT COUNT(*) as total FROM hostels WHERE owner_name = ?',
            [ownerName]
        );

        const [roomStats] = await db.query(`
            SELECT 
                COUNT(DISTINCT hr.hostel_room_id) as total_rooms,
                SUM(hr.total_beds_in_room) as total_beds,
                SUM(hr.available_beds) as available_beds
            FROM hostels h
            JOIN hostel_rooms hr ON h.hostel_id = hr.hostel_id
            WHERE h.owner_name = ?
        `, [ownerName]);

        const [bookingStats] = await db.query(`
            SELECT 
                COUNT(*) as total_bookings,
                SUM(CASE WHEN b.status = 'confirmed' THEN 1 ELSE 0 END) as confirmed_bookings,
                SUM(CASE WHEN b.status = 'pending' THEN 1 ELSE 0 END) as pending_bookings,
                SUM(CASE WHEN b.status = 'completed' THEN 1 ELSE 0 END) as completed_bookings,
                COALESCE(SUM(b.total_amount), 0) as total_revenue
            FROM hostels h
            JOIN hostel_rooms hr ON h.hostel_id = hr.hostel_id
            JOIN bookings b ON hr.hostel_room_id = b.hostel_room_id
            WHERE h.owner_name = ?
        `, [ownerName]);

        const recentBookings = await db.query(`
            SELECT 
                b.booking_id,
                b.booking_reference,
                b.check_in_date,
                b.check_out_date,
                b.status,
                b.total_amount,
                CONCAT(u.first_name, ' ', u.last_name) as guest_name,
                h.hostel_name,
                rt.type_name as room_type
            FROM hostels h
            JOIN hostel_rooms hr ON h.hostel_id = hr.hostel_id
            JOIN bookings b ON hr.hostel_room_id = b.hostel_room_id
            JOIN users u ON b.user_id = u.user_id
            JOIN room_types rt ON hr.room_type_id = rt.room_type_id
            WHERE h.owner_name = ?
            ORDER BY b.booking_date DESC
            LIMIT 10
        `, [ownerName]);

        res.json({
            success: true,
            data: {
                hostels: {
                    total: hostelCount?.total || 0
                },
                rooms: {
                    total: roomStats?.total_rooms || 0,
                    beds: {
                        total: roomStats?.total_beds || 0,
                        available: roomStats?.available_beds || 0
                    }
                },
                bookings: {
                    total: bookingStats?.total_bookings || 0,
                    confirmed: bookingStats?.confirmed_bookings || 0,
                    pending: bookingStats?.pending_bookings || 0,
                    completed: bookingStats?.completed_bookings || 0
                },
                revenue: {
                    total: bookingStats?.total_revenue || 0
                },
                recent_activity: recentBookings
            }
        });

    } catch (error) {
        console.error('Owner dashboard error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch dashboard data',
            details: error.message
        });
    }
};

module.exports = {
    getMyHostels,
    createHostel,
    updateHostel,
    getHostelRooms,
    addRoom,
    updateRoom,
    deleteRoom,
    getHostelBookings,
    getOwnerDashboard
};
const db = require('../config/database');

const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const users = await db.query(
            `SELECT user_id, first_name, last_name, email, phone, user_type, verified, created_at, last_login 
             FROM users WHERE user_id = ?`,
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        res.json({
            success: true,
            data: users[0]
        });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch profile'
        });
    }
};

const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { first_name, last_name, phone, institution_id } = req.body;

        const updates = [];
        const params = [];

        if (first_name) {
            updates.push('first_name = ?');
            params.push(first_name);
        }
        if (last_name) {
            updates.push('last_name = ?');
            params.push(last_name);
        }
        if (phone) {
            updates.push('phone = ?');
            params.push(phone);
        }
        if (institution_id) {
            updates.push('institution_id = ?');
            params.push(institution_id);
        }

        if (updates.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'No fields to update'
            });
        }

        params.push(userId);

        await db.query(
            `UPDATE users SET ${updates.join(', ')} WHERE user_id = ?`,
            params
        );

        const users = await db.query(
            `SELECT user_id, first_name, last_name, email, phone, user_type, verified, created_at, last_login 
             FROM users WHERE user_id = ?`,
            [userId]
        );

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: users[0]
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update profile'
        });
    }
};

const changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { current_password, new_password } = req.body;

        const users = await db.query(
            'SELECT password_hash FROM users WHERE user_id = ?',
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        const bcrypt = require('bcrypt');
        const isValid = await bcrypt.compare(current_password, users[0].password_hash);

        if (!isValid) {
            return res.status(401).json({
                success: false,
                error: 'Current password is incorrect'
            });
        }

        const hashedPassword = await bcrypt.hash(new_password, 10);

        await db.query(
            'UPDATE users SET password_hash = ? WHERE user_id = ?',
            [hashedPassword, userId]
        );

        res.json({
            success: true,
            message: 'Password changed successfully'
        });

    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to change password'
        });
    }
};

const getUserBookings = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log('Fetching bookings for user:', userId);

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
                DATE_FORMAT(b.booking_date, '%Y-%m-%d %H:%i:%s') as booking_date,
                h.hostel_id,
                h.hostel_name,
                h.address,
                rt.type_name as room_type,
                hr.room_number,
                hr.monthly_rent
            FROM bookings b
            INNER JOIN hostel_rooms hr ON b.hostel_room_id = hr.hostel_room_id
            INNER JOIN hostels h ON hr.hostel_id = h.hostel_id
            INNER JOIN room_types rt ON hr.room_type_id = rt.room_type_id
            WHERE b.user_id = ?
            ORDER BY b.booking_date DESC
        `;

        console.log('Executing query...');
        const bookings = await db.query(sql, [String(userId)]);
        
        console.log(`Found ${bookings.length} bookings for user ${userId}`);

        res.json({
            success: true,
            count: bookings.length,
            data: bookings
        });

    } catch (error) {
        console.error('Error in getUserBookings:', error);
        console.error('Error stack:', error.stack);
        
        res.status(500).json({
            success: false,
            error: 'Failed to fetch bookings',
            details: error.message
        });
    }
};

const getWishlist = async (req, res) => {
    try {
        const userId = req.user.id;

        const sql = `
            SELECT 
                w.wishlist_id,
                w.added_date,
                w.notes,
                h.hostel_id,
                h.hostel_name,
                h.address,
                a.area_name,
                c.city_name,
                h.rating,
                h.gender_preference,
                MIN(hr.monthly_rent) as min_rent
            FROM wishlist w
            JOIN hostels h ON w.hostel_id = h.hostel_id
            LEFT JOIN areas a ON h.area_id = a.area_id
            JOIN cities c ON h.city_id = c.city_id
            LEFT JOIN hostel_rooms hr ON h.hostel_id = hr.hostel_id
            WHERE w.user_id = ?
            GROUP BY w.wishlist_id
            ORDER BY w.added_date DESC
        `;

        const wishlist = await db.query(sql, [userId]);

        res.json({
            success: true,
            count: wishlist.length,
            data: wishlist
        });

    } catch (error) {
        console.error('Get wishlist error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch wishlist'
        });
    }
};

const addToWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const hostelId = req.params.hostelId;
        const { notes } = req.body;

        const existing = await db.query(
            'SELECT wishlist_id FROM wishlist WHERE user_id = ? AND hostel_id = ?',
            [userId, hostelId]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                success: false,
                error: 'Hostel already in wishlist'
            });
        }

        const hostel = await db.query(
            'SELECT hostel_id FROM hostels WHERE hostel_id = ?',
            [hostelId]
        );

        if (hostel.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Hostel not found'
            });
        }

        await db.query(
            'INSERT INTO wishlist (user_id, hostel_id, notes) VALUES (?, ?, ?)',
            [userId, hostelId, notes || null]
        );

        res.status(201).json({
            success: true,
            message: 'Added to wishlist'
        });

    } catch (error) {
        console.error('Add to wishlist error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to add to wishlist'
        });
    }
};

const removeFromWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const hostelId = req.params.hostelId;

        const result = await db.query(
            'DELETE FROM wishlist WHERE user_id = ? AND hostel_id = ?',
            [userId, hostelId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                error: 'Hostel not found in wishlist'
            });
        }

        res.json({
            success: true,
            message: 'Removed from wishlist'
        });

    } catch (error) {
        console.error('Remove from wishlist error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to remove from wishlist'
        });
    }
};

const adminCreateUser = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      phone,
      password,
      user_type,
      institution_id,
      verified
    } = req.body;

    const existing = await db.query(
      'SELECT user_id FROM users WHERE email = ? OR phone = ?',
      [email, phone]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'User with this email or phone already exists'
      });
    }

    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.query(
      `INSERT INTO users 
       (first_name, last_name, email, phone, password_hash, user_type, institution_id, verified, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        first_name,
        last_name || null,
        email,
        phone,
        hashedPassword,
        user_type || 'student',
        institution_id || null,
        verified ? 1 : 0
      ]
    );

    const [newUser] = await db.query(
      'SELECT user_id, first_name, last_name, email, phone, user_type, verified, created_at FROM users WHERE user_id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: newUser
    });

  } catch (error) {
    console.error('Admin create user error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
    getProfile,
    updateProfile,
    changePassword,
    getUserBookings,
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    adminCreateUser
};
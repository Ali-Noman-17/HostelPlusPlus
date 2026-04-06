const db = require('../config/database');
const bcrypt = require('bcrypt');

const getAllUsers = async (req, res) => {
    try {
        const { 
            role, 
            verified, 
            search,
            page = 1, 
            limit = 20 
        } = req.query;

        const offset = (parseInt(page) - 1) * parseInt(limit);

        let whereConditions = ['1=1'];
        let params = [];

        if (role) {
            whereConditions.push('user_type = ?');
            params.push(role);
        }

        if (verified !== undefined) {
            whereConditions.push('verified = ?');
            params.push(verified === 'true' ? 1 : 0);
        }

        if (search) {
            whereConditions.push('(first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR phone LIKE ?)');
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm, searchTerm, searchTerm);
        }

        const whereClause = whereConditions.join(' AND ');

        const sql = `
            SELECT 
                user_id,
                first_name,
                last_name,
                email,
                phone,
                user_type,
                verified,
                created_at,
                last_login,
                institution_id
            FROM users
            WHERE ${whereClause}
            ORDER BY created_at DESC
            LIMIT ? OFFSET ?
        `;

        const users = await db.query(sql, [...params, parseInt(limit), offset]);

        const countSql = `SELECT COUNT(*) as total FROM users WHERE ${whereClause}`;
        const countResult = await db.query(countSql, params);
        const total = countResult[0]?.total || 0;

        res.json({
            success: true,
            data: users,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });

    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch users'
        });
    }
};

const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;

        const users = await db.query(`
            SELECT 
                user_id,
                first_name,
                last_name,
                email,
                phone,
                user_type,
                verified,
                created_at,
                last_login,
                institution_id
            FROM users
            WHERE user_id = ?
        `, [String(userId)]);

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        const user = users[0];

        const [bookingCount] = await db.query(`
            SELECT COUNT(*) as total 
            FROM bookings 
            WHERE user_id = ?
        `, [String(userId)]);

        const [reviewCount] = await db.query(`
            SELECT COUNT(*) as total 
            FROM reviews 
            WHERE user_id = ?
        `, [String(userId)]);

        const bookings = await db.query(`
            SELECT 
                b.booking_id,
                b.booking_reference,
                b.check_in_date,
                b.check_out_date,
                b.status,
                b.total_amount,
                h.hostel_name
            FROM bookings b
            JOIN hostel_rooms hr ON b.hostel_room_id = hr.hostel_room_id
            JOIN hostels h ON hr.hostel_id = h.hostel_id
            WHERE b.user_id = ?
            ORDER BY b.booking_date DESC
            LIMIT 5
        `, [String(userId)]);

        let institutionName = null;
        if (user.institution_id) {
            const [inst] = await db.query(`
                SELECT institution_name 
                FROM institutions 
                WHERE institution_id = ?
            `, [String(user.institution_id)]);
            institutionName = inst?.institution_name;
        }

        res.json({
            success: true,
            data: {
                ...user,
                institution_name: institutionName,
                total_bookings: bookingCount?.total || 0,
                total_reviews: reviewCount?.total || 0,
                recent_bookings: bookings || []
            }
        });

    } catch (error) {
        console.error('Get user by ID error:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch user details',
            details: error.message
        });
    }
};

const changeUserRole = async (req, res) => {
    try {
        const userId = req.params.id;
        const { role } = req.body;
        const adminId = req.user.id;

        if (!['student', 'professional', 'owner', 'admin'].includes(role)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid role. Must be: student, professional, owner, admin'
            });
        }

        const [currentUser] = await db.query(
            'SELECT user_type FROM users WHERE user_id = ?',
            [String(userId)]
        );

        if (!currentUser) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        await db.query(
            'UPDATE users SET user_type = ? WHERE user_id = ?',
            [role, String(userId)]
        );

        await db.query(
            `INSERT INTO audit_log 
             (table_name, record_id, action, old_data, new_data, changed_by)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                'users',
                userId,
                'UPDATE',
                JSON.stringify({ user_type: currentUser.user_type }),
                JSON.stringify({ user_type: role }),
                adminId
            ]
        );

        res.json({
            success: true,
            message: `User role changed to ${role} successfully`
        });

    } catch (error) {
        console.error('Change user role error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to change user role'
        });
    }
};

const verifyUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const adminId = req.user.id;

        const [currentUser] = await db.query(
            'SELECT verified FROM users WHERE user_id = ?',
            [String(userId)]
        );

        if (!currentUser) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        if (currentUser.verified) {
            return res.status(409).json({
                success: false,
                error: 'User already verified'
            });
        }

        await db.query(
            'UPDATE users SET verified = 1 WHERE user_id = ?',
            [String(userId)]
        );

        await db.query(
            `INSERT INTO audit_log 
             (table_name, record_id, action, old_data, new_data, changed_by)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                'users',
                userId,
                'UPDATE',
                JSON.stringify({ verified: 0 }),
                JSON.stringify({ verified: 1 }),
                adminId
            ]
        );

        res.json({
            success: true,
            message: 'User verified successfully'
        });

    } catch (error) {
        console.error('Verify user error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to verify user'
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const adminId = req.user.id;

        const [user] = await db.query(
            'SELECT user_id, email FROM users WHERE user_id = ?',
            [String(userId)]
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        await db.query(
            `UPDATE users 
             SET email = CONCAT('deleted_', user_id, '@deleted.user'),
                 phone = CONCAT('000', user_id),
                 first_name = 'Deleted',
                 last_name = 'User',
                 verified = 0,
                 password_hash = 'DELETED'
             WHERE user_id = ?`,
            [String(userId)]
        );

        await db.query(
            `INSERT INTO audit_log 
             (table_name, record_id, action, new_data, changed_by)
             VALUES (?, ?, ?, ?, ?)`,
            [
                'users',
                userId,
                'DELETE',
                JSON.stringify({ message: 'User deleted/anonymized', email: user.email }),
                adminId
            ]
        );

        res.json({
            success: true,
            message: 'User deleted successfully'
        });

    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete user'
        });
    }
};

const getAllHostels = async (req, res) => {
    try {
        const { 
            verified, 
            city_id,
            page = 1, 
            limit = 20 
        } = req.query;

        const offset = (parseInt(page) - 1) * parseInt(limit);

        let whereConditions = ['1=1'];
        let params = [];

        if (verified !== undefined) {
            whereConditions.push('is_verified = ?');
            params.push(verified === 'true' ? 1 : 0);
        }

        if (city_id) {
            whereConditions.push('city_id = ?');
            params.push(city_id);
        }

        const whereClause = whereConditions.join(' AND ');

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
                SUM(hr.total_beds_in_room) as total_beds
            FROM hostels h
            JOIN cities c ON h.city_id = c.city_id
            LEFT JOIN areas a ON h.area_id = a.area_id
            LEFT JOIN hostel_rooms hr ON h.hostel_id = hr.hostel_id
            WHERE ${whereClause}
            GROUP BY h.hostel_id
            ORDER BY h.created_at DESC
            LIMIT ? OFFSET ?
        `;

        const hostels = await db.query(sql, [...params, parseInt(limit), offset]);

        const countSql = `SELECT COUNT(*) as total FROM hostels WHERE ${whereClause}`;
        const countResult = await db.query(countSql, params);
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
        console.error('Get all hostels error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch hostels'
        });
    }
};

const getPendingHostels = async (req, res) => {
    try {
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
                h.created_at,
                COUNT(DISTINCT hr.hostel_room_id) as total_rooms
            FROM hostels h
            JOIN cities c ON h.city_id = c.city_id
            LEFT JOIN areas a ON h.area_id = a.area_id
            LEFT JOIN hostel_rooms hr ON h.hostel_id = hr.hostel_id
            WHERE h.is_verified = FALSE
            GROUP BY h.hostel_id
            ORDER BY h.created_at ASC
        `;

        const hostels = await db.query(sql);

        res.json({
            success: true,
            count: hostels.length,
            data: hostels
        });

    } catch (error) {
        console.error('Get pending hostels error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch pending hostels'
        });
    }
};

const verifyHostel = async (req, res) => {
    try {
        const hostelId = req.params.id;
        const adminId = req.user.id;

        const [hostel] = await db.query(
            'SELECT hostel_id, is_verified, hostel_name FROM hostels WHERE hostel_id = ?',
            [String(hostelId)]
        );

        if (!hostel) {
            return res.status(404).json({
                success: false,
                error: 'Hostel not found'
            });
        }

        if (hostel.is_verified) {
            return res.status(409).json({
                success: false,
                error: 'Hostel already verified'
            });
        }

        await db.query(
            `UPDATE hostels 
             SET is_verified = TRUE
             WHERE hostel_id = ?`,
            [String(hostelId)]
        );

        await db.query(
            `INSERT INTO audit_log 
             (table_name, record_id, action, old_data, new_data, changed_by)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                'hostels',
                hostelId,
                'UPDATE',
                JSON.stringify({ is_verified: false }),
                JSON.stringify({ is_verified: true, verified_by: adminId }),
                adminId
            ]
        );

        res.json({
            success: true,
            message: 'Hostel verified successfully'
        });

    } catch (error) {
        console.error('Verify hostel error:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({
            success: false,
            error: 'Failed to verify hostel',
            details: error.message
        });
    }
};

const getDashboardStats = async (req, res) => {
    try {
        const [userCount] = await db.query('SELECT COUNT(*) as total FROM users');
        const [hostelCount] = await db.query('SELECT COUNT(*) as total FROM hostels');
        const [bookingCount] = await db.query('SELECT COUNT(*) as total FROM bookings');
        const [reviewCount] = await db.query('SELECT COUNT(*) as total FROM reviews');

        const [pendingHostels] = await db.query('SELECT COUNT(*) as total FROM hostels WHERE is_verified = FALSE');
        const [pendingUsers] = await db.query('SELECT COUNT(*) as total FROM users WHERE verified = FALSE');

        const recentBookings = await db.query(`
            SELECT 
                b.booking_id,
                b.booking_reference,
                b.status,
                b.total_amount,
                b.booking_date as created_at,
                CONCAT(u.first_name, ' ', u.last_name) as user_name,
                h.hostel_name
            FROM bookings b
            JOIN users u ON b.user_id = u.user_id
            JOIN hostel_rooms hr ON b.hostel_room_id = hr.hostel_room_id
            JOIN hostels h ON hr.hostel_id = h.hostel_id
            ORDER BY b.booking_date DESC
            LIMIT 10
        `);

        let totalRevenue = 0;
        try {
            const [revenue] = await db.query('SELECT SUM(amount) as total FROM payments');
            totalRevenue = revenue?.total || 0;
        } catch (e) {
            console.log('Payments table may not exist yet:', e.message);
            totalRevenue = 0;
        }

        res.json({
            success: true,
            data: {
                totals: {
                    users: userCount?.total || 0,
                    hostels: hostelCount?.total || 0,
                    bookings: bookingCount?.total || 0,
                    reviews: reviewCount?.total || 0,
                    revenue: totalRevenue
                },
                pending: {
                    hostels: pendingHostels?.total || 0,
                    users: pendingUsers?.total || 0
                },
                recent_activity: recentBookings || []
            }
        });

    } catch (error) {
        console.error('Dashboard stats error:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch dashboard statistics',
            details: error.message
        });
    }
};

const getReportSummary = async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    let dateCondition = '';
    if (period === 'week') {
      dateCondition = `AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)`;
    } else if (period === 'month') {
      dateCondition = `AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)`;
    } else if (period === 'year') {
      dateCondition = `AND created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)`;
    } else {
      dateCondition = `AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)`;
    }
    
    const userTrend = await db.query(`
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM users 
      WHERE 1=1 ${dateCondition}
      GROUP BY DATE(created_at)
      ORDER BY date
    `);
    
    const bookingTrend = await db.query(`
      SELECT DATE(b.booking_date) as date, 
             COUNT(*) as booking_count,
             COALESCE(SUM(b.total_amount), 0) as revenue
      FROM bookings b
      WHERE b.booking_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY DATE(b.booking_date)
      ORDER BY date
    `);
    
    const topHostels = await db.query(`
      SELECT h.hostel_name, 
             COUNT(b.booking_id) as total_bookings,
             COALESCE(SUM(b.total_amount), 0) as total_revenue
      FROM hostels h
      JOIN hostel_rooms hr ON h.hostel_id = hr.hostel_id
      LEFT JOIN bookings b ON hr.hostel_room_id = b.hostel_room_id
      WHERE b.status IN ('confirmed', 'completed')
      GROUP BY h.hostel_id
      ORDER BY total_bookings DESC
      LIMIT 5
    `);
    
    const statusDistribution = await db.query(`
      SELECT status, COUNT(*) as count
      FROM bookings
      GROUP BY status
    `);
    
    res.json({
      success: true,
      data: {
        user_trend: userTrend,
        booking_trend: bookingTrend,
        top_hostels: topHostels,
        status_distribution: statusDistribution
      }
    });
    
  } catch (error) {
    console.error('Report summary error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const exportBookingsReport = async (req, res) => {
  try {
    const { start_date, end_date, status } = req.query;
    
    let sql = `
      SELECT b.booking_id, b.booking_reference, 
             DATE_FORMAT(b.check_in_date, '%Y-%m-%d') as check_in_date,
             DATE_FORMAT(b.check_out_date, '%Y-%m-%d') as check_out_date,
             b.status, b.total_amount, b.advance_paid, b.payment_status,
             DATE_FORMAT(b.booking_date, '%Y-%m-%d %H:%i:%s') as booking_date,
             CONCAT(u.first_name, ' ', u.last_name) as guest_name,
             u.email as guest_email, u.phone as guest_phone,
             h.hostel_name, rt.type_name as room_type
      FROM bookings b
      JOIN users u ON b.user_id = u.user_id
      JOIN hostel_rooms hr ON b.hostel_room_id = hr.hostel_room_id
      JOIN hostels h ON hr.hostel_id = h.hostel_id
      JOIN room_types rt ON hr.room_type_id = rt.room_type_id
      WHERE 1=1
    `;
    let params = [];
    
    if (start_date) {
      sql += ` AND DATE(b.booking_date) >= ?`;
      params.push(start_date);
    }
    if (end_date) {
      sql += ` AND DATE(b.booking_date) <= ?`;
      params.push(end_date);
    }
    if (status) {
      sql += ` AND b.status = ?`;
      params.push(status);
    }
    
    sql += ` ORDER BY b.booking_date DESC`;
    
    const bookings = await db.query(sql, params);
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=bookings_report_${Date.now()}.csv`);
    
    const headers = ['Booking ID', 'Reference', 'Guest Name', 'Guest Email', 'Guest Phone', 
                     'Hostel', 'Room Type', 'Check In', 'Check Out', 'Status', 
                     'Total Amount (PKR)', 'Advance Paid (PKR)', 'Payment Status', 'Booking Date'];
    res.write(headers.join(',') + '\n');
    
    bookings.forEach(b => {
      const row = [
        b.booking_id,
        `"${b.booking_reference}"`,
        `"${(b.guest_name || '').replace(/"/g, '""')}"`,
        `"${b.guest_email.replace(/"/g, '""')}"`,
        `"${b.guest_phone.replace(/"/g, '""')}"`,
        `"${b.hostel_name.replace(/"/g, '""')}"`,
        `"${b.room_type.replace(/"/g, '""')}"`,
        b.check_in_date,
        b.check_out_date,
        b.status,
        b.total_amount,
        b.advance_paid,
        b.payment_status,
        b.booking_date
      ];
      res.write(row.join(',') + '\n');
    });
    
    res.end();
    
  } catch (error) {
    console.error('Export bookings error:', error);
    res.status(500).json({ success: false, error: 'Failed to generate report' });
  }
};

const exportRevenueReport = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    
    let sql = `
      SELECT DATE(b.booking_date) as date,
             COUNT(*) as booking_count,
             COALESCE(SUM(b.total_amount), 0) as total_revenue,
             COALESCE(SUM(b.advance_paid), 0) as total_advance,
             COALESCE(AVG(b.total_amount), 0) as avg_booking_value
      FROM bookings b
      WHERE b.status IN ('confirmed', 'completed')
    `;
    let params = [];
    
    if (start_date) {
      sql += ` AND DATE(b.booking_date) >= ?`;
      params.push(start_date);
    }
    if (end_date) {
      sql += ` AND DATE(b.booking_date) <= ?`;
      params.push(end_date);
    }
    
    sql += ` GROUP BY DATE(b.booking_date) ORDER BY date DESC`;
    
    const revenue = await db.query(sql, params);
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=revenue_report_${Date.now()}.csv`);
    
    const headers = ['Date', 'Booking Count', 'Total Revenue (PKR)', 'Total Advance (PKR)', 'Average Booking Value (PKR)'];
    res.write(headers.join(',') + '\n');
    
    revenue.forEach(r => {
      const row = [
        r.date,
        r.booking_count,
        r.total_revenue,
        r.total_advance,
        parseFloat(r.avg_booking_value).toFixed(2)
      ];
      res.write(row.join(',') + '\n');
    });
    
    res.end();
    
  } catch (error) {
    console.error('Export revenue error:', error);
    res.status(500).json({ success: false, error: 'Failed to generate report' });
  }
};

const getAuditLogs = async (req, res) => {
  try {
    const {
      table_name,
      action,
      user_id,
      start_date,
      end_date,
      page = 1,
      limit = 50
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    let whereConditions = ['1=1'];
    let params = [];

    if (table_name) {
      whereConditions.push('table_name = ?');
      params.push(table_name);
    }
    if (action) {
      whereConditions.push('action = ?');
      params.push(action);
    }
    if (user_id) {
      whereConditions.push('changed_by = ?');
      params.push(user_id);
    }
    if (start_date) {
      whereConditions.push('changed_at >= ?');
      params.push(start_date);
    }
    if (end_date) {
      whereConditions.push('changed_at <= ?');
      params.push(end_date);
    }

    const whereClause = whereConditions.join(' AND ');

    const logs = await db.query(`
      SELECT 
        al.log_id,
        al.table_name,
        al.record_id,
        al.action,
        al.old_data,
        al.new_data,
        al.changed_at,
        CONCAT(u.first_name, ' ', u.last_name) as changed_by_name,
        u.email as changed_by_email
      FROM audit_log al
      LEFT JOIN users u ON al.changed_by = u.user_id
      WHERE ${whereClause}
      ORDER BY al.changed_at DESC
      LIMIT ? OFFSET ?
    `, [...params, parseInt(limit), offset]);

    const countResult = await db.query(`
      SELECT COUNT(*) as total 
      FROM audit_log al
      WHERE ${whereClause}
    `, params);

    const total = countResult[0]?.total || 0;

    res.json({
      success: true,
      data: logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Get audit logs error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const {
      status,
      hostel_id,
      user_id,
      start_date,
      end_date,
      page = 1,
      limit = 20
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    let whereConditions = ['1=1'];
    let params = [];

    if (status) {
      whereConditions.push('b.status = ?');
      params.push(status);
    }
    if (hostel_id) {
      whereConditions.push('h.hostel_id = ?');
      params.push(hostel_id);
    }
    if (user_id) {
      whereConditions.push('b.user_id = ?');
      params.push(user_id);
    }
    if (start_date) {
      whereConditions.push('b.check_in_date >= ?');
      params.push(start_date);
    }
    if (end_date) {
      whereConditions.push('b.check_out_date <= ?');
      params.push(end_date);
    }

    const whereClause = whereConditions.join(' AND ');

    const bookings = await db.query(`
      SELECT 
        b.booking_id,
        b.booking_reference,
        DATE_FORMAT(b.check_in_date, '%Y-%m-%d') as check_in_date,
        DATE_FORMAT(b.check_out_date, '%Y-%m-%d') as check_out_date,
        b.status,
        b.total_amount,
        b.advance_paid,
        b.payment_status,
        b.special_requests,
        DATE_FORMAT(b.booking_date, '%Y-%m-%d %H:%i:%s') as booking_date,
        b.cancelled_at,
        b.cancellation_reason,
        u.user_id,
        CONCAT(u.first_name, ' ', u.last_name) as guest_name,
        u.email as guest_email,
        u.phone as guest_phone,
        h.hostel_id,
        h.hostel_name,
        h.address,
        a.area_name,
        c.city_name,
        rt.type_name as room_type,
        hr.room_number,
        hr.monthly_rent
      FROM bookings b
      JOIN users u ON b.user_id = u.user_id
      JOIN hostel_rooms hr ON b.hostel_room_id = hr.hostel_room_id
      JOIN hostels h ON hr.hostel_id = h.hostel_id
      JOIN room_types rt ON hr.room_type_id = rt.room_type_id
      LEFT JOIN areas a ON h.area_id = a.area_id
      JOIN cities c ON h.city_id = c.city_id
      WHERE ${whereClause}
      ORDER BY b.booking_date DESC
      LIMIT ? OFFSET ?
    `, [...params, parseInt(limit), offset]);

    const countResult = await db.query(`
      SELECT COUNT(*) as total 
      FROM bookings b
      JOIN hostel_rooms hr ON b.hostel_room_id = hr.hostel_room_id
      JOIN hostels h ON hr.hostel_id = h.hostel_id
      WHERE ${whereClause}
    `, params);

    const total = countResult[0]?.total || 0;

    res.json({
      success: true,
      data: bookings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, cancellation_reason } = req.body;
    const adminId = req.user.id;

    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }

    const [booking] = await db.query(`
      SELECT b.*, hr.hostel_room_id 
      FROM bookings b
      JOIN hostel_rooms hr ON b.hostel_room_id = hr.hostel_room_id
      WHERE b.booking_id = ?
    `, [id]);

    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    if (status === 'cancelled' && booking.status !== 'cancelled') {
      await db.query(
        'UPDATE hostel_rooms SET available_beds = available_beds + 1 WHERE hostel_room_id = ?',
        [booking.hostel_room_id]
      );
    }

    if (status === 'confirmed' && booking.status === 'pending') {
      await db.query(
        'UPDATE hostel_rooms SET available_beds = available_beds - 1 WHERE hostel_room_id = ?',
        [booking.hostel_room_id]
      );
    }

    await db.query(`
      UPDATE bookings 
      SET status = ?, 
          cancelled_at = CASE WHEN ? = 'cancelled' THEN NOW() ELSE cancelled_at END,
          cancellation_reason = CASE WHEN ? = 'cancelled' THEN ? ELSE cancellation_reason END
      WHERE booking_id = ?
    `, [status, status, status, cancellation_reason || null, id]);

    await db.query(`
      INSERT INTO audit_log (table_name, record_id, action, old_data, new_data, changed_by)
      VALUES ('bookings', ?, 'UPDATE', ?, ?, ?)
    `, [id, JSON.stringify({ status: booking.status }), JSON.stringify({ status }), adminId]);

    res.json({ success: true, message: `Booking ${status} successfully` });

  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user.id;

    const [booking] = await db.query(`
      SELECT b.*, hr.hostel_room_id 
      FROM bookings b
      JOIN hostel_rooms hr ON b.hostel_room_id = hr.hostel_room_id
      WHERE b.booking_id = ?
    `, [id]);

    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    if (booking.status === 'confirmed') {
      await db.query(
        'UPDATE hostel_rooms SET available_beds = available_beds + 1 WHERE hostel_room_id = ?',
        [booking.hostel_room_id]
      );
    }

    await db.query(`
      INSERT INTO audit_log (table_name, record_id, action, old_data, new_data, changed_by)
      VALUES ('bookings', ?, 'DELETE', ?, NULL, ?)
    `, [id, JSON.stringify(booking), adminId]);

    await db.query('DELETE FROM bookings WHERE booking_id = ?', [id]);

    res.json({ success: true, message: 'Booking deleted successfully' });

  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
    getAllUsers,
    getUserById,
    changeUserRole,
    verifyUser,
    deleteUser,
    getAllHostels,
    getPendingHostels,
    verifyHostel,
    getDashboardStats,
    exportBookingsReport,
    exportRevenueReport,
    getReportSummary,
    getAuditLogs,
    getAllBookings,
    updateBookingStatus,
    deleteBooking
};
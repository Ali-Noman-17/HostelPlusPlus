const db = require('../config/database');

const searchHostels = async (req, res) => {
    try {
        console.log('='.repeat(50));
        console.log('SEARCH REQUEST STARTED');
        
        const { 
            city_id, 
            area_id, 
            min_price, 
            max_price, 
            gender,
            sort_by = 'rating',
            page = 1,
            limit = 10 
        } = req.query;

        console.log('Raw query params:', { city_id, area_id, min_price, max_price, gender, sort_by, page, limit });

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const offset = (pageNum - 1) * limitNum;

        let whereConditions = ['h.is_verified = 1'];
        let whereParams = [];

        if (city_id) {
            whereConditions.push('h.city_id = ?');
            whereParams.push(city_id);
        }

        if (area_id) {
            whereConditions.push('h.area_id = ?');
            whereParams.push(area_id);
        }

        if (gender) {
            whereConditions.push('(h.gender_preference = ? OR h.gender_preference = "co-ed")');
            whereParams.push(gender);
        }

        const whereClause = whereConditions.length > 0 
            ? 'WHERE ' + whereConditions.join(' AND ')
            : '';

        let sql = `
            SELECT 
                h.hostel_id,
                h.hostel_name,
                h.address,
                a.area_name,
                c.city_name,
                h.gender_preference,
                h.rating,
                h.total_reviews,
                h.is_verified,
                MIN(hr.monthly_rent) as min_rent,
                COUNT(DISTINCT hr.hostel_room_id) as total_rooms,
                COUNT(DISTINCT CASE WHEN hr.is_available = 1 THEN hr.hostel_room_id END) as available_rooms
            FROM hostels h
            JOIN cities c ON h.city_id = c.city_id
            LEFT JOIN areas a ON h.area_id = a.area_id
            LEFT JOIN hostel_rooms hr ON h.hostel_id = hr.hostel_id
            ${whereClause}
            GROUP BY h.hostel_id
        `;

        let havingConditions = [];
        let havingParams = [];

        if (min_price || max_price) {
            if (min_price && max_price) {
                havingConditions.push(`min_rent BETWEEN ? AND ?`);
                havingParams.push(min_price, max_price);
            } else if (min_price) {
                havingConditions.push(`min_rent >= ?`);
                havingParams.push(min_price);
            } else if (max_price) {
                havingConditions.push(`min_rent <= ?`);
                havingParams.push(max_price);
            }
        }

        if (havingConditions.length > 0) {
            sql += ' HAVING ' + havingConditions.join(' AND ');
        }

        if (sort_by === 'price') {
            sql += ` ORDER BY min_rent ASC`;
        } else if (sort_by === 'rating') {
            sql += ` ORDER BY h.rating DESC`;
        } else if (sort_by === 'reviews') {
            sql += ` ORDER BY h.total_reviews DESC`;
        } else {
            sql += ` ORDER BY h.rating DESC`;
        }

        sql += ` LIMIT ? OFFSET ?`;
        const paginationParams = [limitNum, offset];

        const allParams = [...whereParams, ...havingParams, ...paginationParams];

        console.log('='.repeat(50));
        console.log('FINAL QUERY:');
        console.log('SQL:', sql);
        console.log('WHERE params:', whereParams);
        console.log('HAVING params:', havingParams);
        console.log('Pagination params:', paginationParams);
        console.log('Combined params (before conversion):', allParams);
        console.log('Combined param types:', allParams.map(p => typeof p));
        console.log('='.repeat(50));

        const hostels = await db.query(sql, allParams);
        console.log(`Query returned ${hostels.length} results`);

        const countSql = `
            SELECT COUNT(DISTINCT h.hostel_id) as total
            FROM hostels h
            LEFT JOIN hostel_rooms hr ON h.hostel_id = hr.hostel_id
            ${whereClause}
        `;
        
        const countResult = await db.query(countSql, whereParams);
        const total = countResult[0]?.total || 0;

        console.log('Total count:', total);

        res.json({
            success: true,
            data: hostels,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total: total,
                pages: Math.ceil(total / limitNum)
            }
        });

    } catch (error) {
        console.error('='.repeat(50));
        console.error('ERROR IN SEARCH:');
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        if (error.sql) {
            console.error('SQL that caused error:', error.sql);
        }
        console.error('='.repeat(50));
        
        res.status(500).json({
            success: false,
            error: error.message,
            sql: error.sql,
            sqlMessage: error.sqlMessage
        });
    }
};

const checkAvailability = async (req, res) => {
    const { id } = req.params;
    const { check_in, check_out } = req.query;

    if (!check_in || !check_out) {
        return res.status(400).json({
            success: false,
            error: 'Please provide check_in and check_out dates'
        });
    }

    try {
        const sql = `
            SELECT 
                hr.hostel_room_id,
                rt.type_name as room_type,
                hr.room_number,
                hr.total_beds_in_room,
                hr.available_beds,
                hr.monthly_rent,
                (
                    SELECT COUNT(*)
                    FROM bookings b
                    WHERE b.hostel_room_id = hr.hostel_room_id
                    AND b.status IN ('confirmed', 'pending')
                    AND (
                        (b.check_in_date BETWEEN ? AND ?) OR
                        (b.check_out_date BETWEEN ? AND ?) OR
                        (? BETWEEN b.check_in_date AND b.check_out_date)
                    )
                ) as conflicting_bookings
            FROM hostel_rooms hr
            JOIN room_types rt ON hr.room_type_id = rt.room_type_id
            WHERE hr.hostel_id = ? AND hr.is_available = TRUE
        `;

        const rooms = await db.query(sql, [
            check_in, check_out,
            check_in, check_out,
            check_in,
            id
        ]);

        res.json({
            success: true,
            data: {
                total_rooms: rooms.length,
                available_rooms: rooms.filter(r => r.conflicting_bookings === 0).length,
                rooms: rooms
            }
        });

    } catch (error) {
        console.error('Availability Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to check availability'
        });
    }
};

module.exports = {
    searchHostels,
    checkAvailability
};
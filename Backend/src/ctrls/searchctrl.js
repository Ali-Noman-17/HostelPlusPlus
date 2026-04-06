const db = require('../config/database');

const searchHostels = async (req, res) => {
    try {
        const {
            city_id,
            area_id,
            min_price,
            max_price,
            gender,
            sort_by = 'rating',
            page = 1,
            limit = 10,
            nearby_categories,   
            nearby_max_distance,
            transport_type,
            transport_max_distance
        } = req.query;

        const offset = (parseInt(page) - 1) * parseInt(limit);
        
        let whereConditions = ['h.is_verified = 1'];
        let params = [];

        if (city_id) {
            whereConditions.push('h.city_id = ?');
            params.push(city_id);
        }
        if (area_id) {
            whereConditions.push('h.area_id = ?');
            params.push(area_id);
        }
        if (gender) {
            whereConditions.push('(h.gender_preference = ? OR h.gender_preference = "co-ed")');
            params.push(gender);
        }

        let nearbyJoin = '';
        let nearbyHaving = '';
        if (nearby_categories && nearby_max_distance) {
            const categoryIds = nearby_categories.split(',').map(id => parseInt(id));
            if (categoryIds.length > 0) {
                const placeholders = categoryIds.map(() => '?').join(',');
                nearbyJoin = `
                    JOIN nearby_places np ON h.hostel_id = np.hostel_id
                    AND np.category_id IN (${placeholders})
                    AND np.distance_km <= ?
                `;
                params.push(...categoryIds, nearby_max_distance);
                nearbyHaving = `GROUP BY h.hostel_id HAVING COUNT(DISTINCT np.category_id) = ?`;
                params.push(categoryIds.length);
            }
        }

        let transportJoin = '';
        if (transport_type && transport_max_distance) {
            transportJoin = `
                JOIN hostel_transport ht ON h.hostel_id = ht.hostel_id
                JOIN transport_routes tr ON ht.route_id = tr.route_id
                AND tr.transport_type = ?
                AND ht.distance_to_stop_km <= ?
            `;
            params.push(transport_type, transport_max_distance);
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
                MAX(hr.monthly_rent) as max_rent,
                COUNT(DISTINCT CASE WHEN hr.is_available = TRUE THEN hr.hostel_room_id END) as available_rooms,
                (
                    SELECT GROUP_CONCAT(amenity_name SEPARATOR ', ')
                    FROM amenities am
                    JOIN hostel_amenities ha ON am.amenity_id = ha.amenity_id
                    WHERE ha.hostel_id = h.hostel_id AND ha.is_available = TRUE
                    LIMIT 3
                ) as amenities_preview
            FROM hostels h
            JOIN cities c ON h.city_id = c.city_id
            LEFT JOIN areas a ON h.area_id = a.area_id
            LEFT JOIN hostel_rooms hr ON h.hostel_id = hr.hostel_id
            ${nearbyJoin}
            ${transportJoin}
            ${whereClause}
            GROUP BY h.hostel_id
            ${nearbyHaving ? nearbyHaving : ''}
        `;

        let havingConditions = [];
        if (min_price || max_price) {
            if (min_price && max_price) {
                havingConditions.push(`min_rent BETWEEN ? AND ?`);
                params.push(min_price, max_price);
            } else if (min_price) {
                havingConditions.push(`min_rent >= ?`);
                params.push(min_price);
            } else if (max_price) {
                havingConditions.push(`min_rent <= ?`);
                params.push(max_price);
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
        params.push(parseInt(limit), parseInt(offset));

        const hostels = await db.query(sql, params);

        let countSql = `
            SELECT COUNT(DISTINCT h.hostel_id) as total
            FROM hostels h
            ${nearbyJoin}
            ${transportJoin}
            ${whereClause}
            ${nearbyHaving ? 'GROUP BY h.hostel_id' : ''}
        `;
        
        let countParams = params.slice(0, -2);
        const countResult = await db.query(countSql, countParams);
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
        console.error('Search error:', error);
        res.status(500).json({
            success: false,
            error: 'Search failed',
            details: error.message
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

const getNearbyCategories = async (req, res) => {
    try {
        const categories = await db.query(`
            SELECT category_id, category_name, icon 
            FROM nearby_categories 
            ORDER BY category_name
        `);
        res.json({
            success: true,
            data: categories
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

const getTransportTypes = async (req, res) => {
    try {
        const types = await db.query(`
            SELECT DISTINCT transport_type 
            FROM transport_routes 
            ORDER BY transport_type
        `);
        res.json({
            success: true,
            data: types.map(t => t.transport_type)
        });
    } catch (error) {
        console.error('Error fetching transport types:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    searchHostels,
    checkAvailability,
    getNearbyCategories,
    getTransportTypes
};
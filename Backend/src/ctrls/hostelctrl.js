const db = require('../config/database');

const getAllHostels = async (req, res) => {
    try {
        const sql = `
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
                COUNT(DISTINCT CASE WHEN hr.is_available = TRUE THEN hr.hostel_room_id END) as available_rooms,
                (
                    SELECT GROUP_CONCAT(amenity_name SEPARATOR ', ')
                    FROM amenities am
                    JOIN hostel_amenities ha ON am.amenity_id = ha.amenity_id
                    WHERE ha.hostel_id = h.hostel_id AND ha.is_available = TRUE
                    LIMIT 5
                ) as amenities
            FROM hostels h
            JOIN cities c ON h.city_id = c.city_id
            LEFT JOIN areas a ON h.area_id = a.area_id
            LEFT JOIN hostel_rooms hr ON h.hostel_id = hr.hostel_id
            WHERE h.is_verified = TRUE
            GROUP BY h.hostel_id
            ORDER BY h.rating DESC
            LIMIT 20
        `;

        const hostels = await db.query(sql);

        res.json({
            success: true,
            count: hostels.length,
            data: hostels
        });

    } catch (error) {
        console.error('Error in getAllHostels:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch hostels'
        });
    }
};

const getHostelById = async (req, res) => {
    const { id } = req.params;

    try {
        const hostelSql = `
            SELECT 
                h.*,
                a.area_name,
                c.city_name
            FROM hostels h
            LEFT JOIN areas a ON h.area_id = a.area_id
            JOIN cities c ON h.city_id = c.city_id
            WHERE h.hostel_id = ?
        `;

        const hostels = await db.query(hostelSql, [String(id)]);

        if (hostels.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Hostel not found'
            });
        }

        const hostel = hostels[0];

        const roomsSql = `
            SELECT 
                hr.hostel_room_id,
                rt.type_name as room_type,
                hr.room_number,
                hr.total_beds_in_room,
                hr.available_beds,
                hr.monthly_rent,
                hr.security_deposit,
                hr.is_available,
                hr.floor_number
            FROM hostel_rooms hr
            JOIN room_types rt ON hr.room_type_id = rt.room_type_id
            WHERE hr.hostel_id = ?
            ORDER BY hr.monthly_rent
        `;
        const rooms = await db.query(roomsSql, [String(id)]);

        const amenitiesSql = `
            SELECT 
                a.amenity_name,
                a.category,
                ha.is_available,
                ha.additional_charges,
                ha.notes
            FROM hostel_amenities ha
            JOIN amenities a ON ha.amenity_id = a.amenity_id
            WHERE ha.hostel_id = ?
            ORDER BY a.category
        `;
        const amenities = await db.query(amenitiesSql, [String(id)]);

        const reviewsSql = `
            SELECT 
                r.review_id,
                r.rating,
                r.comment,
                r.cleanliness_rating,
                r.food_rating,
                r.safety_rating,
                r.location_rating,
                DATE_FORMAT(r.created_at, '%Y-%m-%d') as review_date,
                CONCAT(u.first_name, ' ', LEFT(u.last_name, 1)) as user_name,
                r.helpful_count
            FROM reviews r
            JOIN users u ON r.user_id = u.user_id
            WHERE r.hostel_id = ?
            ORDER BY r.created_at DESC
            LIMIT 5
        `;
        const reviews = await db.query(reviewsSql, [String(id)]);

        const transportSql = `
            SELECT 
                tr.transport_type,
                tr.route_name,
                tr.route_number,
                ht.stop_name,
                ht.distance_to_stop_km,
                ht.frequency_minutes,
                DATE_FORMAT(ht.first_ride, '%H:%i') as first_ride,
                DATE_FORMAT(ht.last_ride, '%H:%i') as last_ride
            FROM hostel_transport ht
            JOIN transport_routes tr ON ht.route_id = tr.route_id
            WHERE ht.hostel_id = ?
            ORDER BY ht.distance_to_stop_km ASC
            LIMIT 1
        `;
        const transport = await db.query(transportSql, [String(id)]);

        const placesSql = `
            SELECT 
                np.place_name,
                nc.category_name,
                np.distance_km,
                np.estimated_time_minutes,
                np.walking_distance,
                np.landmark
            FROM nearby_places np
            JOIN nearby_categories nc ON np.category_id = nc.category_id
            WHERE np.hostel_id = ?
            ORDER BY np.distance_km
            LIMIT 10
        `;
        const nearbyPlaces = await db.query(placesSql, [String(id)]);

        const stats = {
            total_rooms: rooms.length,
            available_rooms: rooms.filter(r => r.is_available).length,
            total_beds: rooms.reduce((sum, r) => sum + r.total_beds_in_room, 0),
            available_beds: rooms.reduce((sum, r) => sum + r.available_beds, 0),
            price_range: rooms.length > 0 ? {
                min: Math.min(...rooms.map(r => r.monthly_rent)),
                max: Math.max(...rooms.map(r => r.monthly_rent))
            } : null
        };

        res.json({
            success: true,
            data: {
                ...hostel,
                stats,
                rooms,
                amenities,
                reviews,
                transport: transport[0] || null,
                nearby_places: nearbyPlaces
            }
        });

    } catch (error) {
        console.error('Error in getHostelById:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch hostel details'
        });
    }
};

const adminCreateHostel = async (req, res) => {
  try {
    const {
      hostel_name,
      owner_name,
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

    const result = await db.query(
      `INSERT INTO hostels (
        hostel_name, owner_name, contact_number, alternate_number,
        email, address, city_id, area_id, pincode,
        latitude, longitude, gender_preference, description,
        is_verified, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE, NOW())`,
      [
        hostel_name,
        owner_name || null,
        contact_number,
        alternate_number || null,
        email || null,
        address,
        city_id,
        area_id || null,
        pincode || null,
        latitude || null,
        longitude || null,
        gender_preference || 'co-ed',
        description || null
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Hostel created successfully (auto-verified)',
      data: { hostel_id: result.insertId }
    });

  } catch (error) {
    console.error('Admin create hostel error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const adminUpdateHostel = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const allowedFields = [
      'hostel_name', 'owner_name', 'contact_number', 'alternate_number',
      'email', 'address', 'city_id', 'area_id', 'pincode',
      'latitude', 'longitude', 'gender_preference', 'description', 'is_verified'
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
      return res.status(400).json({ success: false, error: 'No fields to update' });
    }

    updateValues.push(id);
    await db.query(
      `UPDATE hostels SET ${updateFields.join(', ')} WHERE hostel_id = ?`,
      updateValues
    );

    res.json({ success: true, message: 'Hostel updated successfully' });

  } catch (error) {
    console.error('Admin update hostel error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const adminDeleteHostel = async (req, res) => {
  try {
    const { id } = req.params;

    const [hostel] = await db.query('SELECT hostel_id FROM hostels WHERE hostel_id = ?', [id]);
    if (!hostel) {
      return res.status(404).json({ success: false, error: 'Hostel not found' });
    }

    await db.query('DELETE FROM hostels WHERE hostel_id = ?', [id]);

    res.json({ success: true, message: 'Hostel deleted successfully' });

  } catch (error) {
    console.error('Admin delete hostel error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
    getAllHostels,
    getHostelById,
    adminCreateHostel,
    adminUpdateHostel,
    adminDeleteHostel
};
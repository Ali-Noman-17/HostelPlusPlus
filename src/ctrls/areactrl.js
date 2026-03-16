const db = require('../config/database');

const getAllAreas = async (req, res) => {
    try {
        const { city_id } = req.query;
        
        let sql = `
            SELECT 
                a.area_id,
                a.area_name,
                a.pincode,
                c.city_id,
                c.city_name,
                c.country
            FROM areas a
            JOIN cities c ON a.city_id = c.city_id
        `;
        
        const params = [];
        
        if (city_id) {
            sql += ` WHERE a.city_id = ?`;
            params.push(city_id);
        }
        
        sql += ` ORDER BY a.area_name`;
        
        const areas = await db.query(sql, params);
        
        res.json({
            success: true,
            count: areas.length,
            data: areas
        });
    } catch (error) {
        console.error('Error in getAllAreas:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch areas'
        });
    }
};


const getHostelsByArea = async (req, res) => {
    const { id } = req.params;
    
    try {
        const sql = `
            SELECT 
                h.hostel_id,
                h.hostel_name,
                h.address,
                h.rating,
                h.gender_preference,
                MIN(hr.monthly_rent) as min_rent,
                COUNT(DISTINCT CASE WHEN hr.is_available = TRUE THEN hr.hostel_room_id END) as available_rooms
            FROM hostels h
            LEFT JOIN hostel_rooms hr ON h.hostel_id = hr.hostel_id
            WHERE h.area_id = ? AND h.is_verified = TRUE
            GROUP BY h.hostel_id
            ORDER BY h.rating DESC
        `;
        
        const hostels = await db.query(sql, [id]);
        
        res.json({
            success: true,
            area_id: id,
            count: hostels.length,
            data: hostels
        });
    } catch (error) {
        console.error('Error in getHostelsByArea:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch hostels in this area'
        });
    }
};

module.exports = {
    getAllAreas,
    getHostelsByArea
};
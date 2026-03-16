const db = require('../config/database');

const getAllCities = async (req, res) => {
    try {
        const sql = `
            SELECT 
                city_id,
                city_name,
                state,
                country
            FROM cities
            ORDER BY city_name
        `;
        
        const cities = await db.query(sql);
        
        const citiesWithStats = await Promise.all(
            cities.map(async (city) => {
                const countSql = `
                    SELECT COUNT(*) as hostel_count
                    FROM hostels
                    WHERE city_id = ? AND is_verified = TRUE
                `;
                const [result] = await db.query(countSql, [city.city_id]);
                return {
                    ...city,
                    hostel_count: result.hostel_count
                };
            })
        );
        
        res.json({
            success: true,
            count: citiesWithStats.length,
            data: citiesWithStats
        });
    } catch (error) {
        console.error('Error in getAllCities:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch cities'
        });
    }
};

const getCityAreas = async (req, res) => {
    const { id } = req.params;
    
    try {
        const sql = `
            SELECT 
                area_id,
                area_name,
                pincode
            FROM areas
            WHERE city_id = ?
            ORDER BY area_name
        `;
        
        const areas = await db.query(sql, [id]);
        
        res.json({
            success: true,
            city_id: id,
            count: areas.length,
            data: areas
        });
    } catch (error) {
        console.error('Error in getCityAreas:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch areas for this city'
        });
    }
};

module.exports = {
    getAllCities,
    getCityAreas
};
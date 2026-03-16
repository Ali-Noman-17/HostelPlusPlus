const db = require('../config/database');

const getAllAmenities = async (req, res) => {
    try {
        const sql = `
            SELECT 
                amenity_id,
                amenity_name,
                category,
                icon_name
            FROM amenities
            ORDER BY category, amenity_name
        `;
        
        const amenities = await db.query(sql);
        
        const grouped = amenities.reduce((acc, amenity) => {
            if (!acc[amenity.category]) {
                acc[amenity.category] = [];
            }
            acc[amenity.category].push({
                id: amenity.amenity_id,
                name: amenity.amenity_name,
                icon: amenity.icon_name
            });
            return acc;
        }, {});
        
        res.json({
            success: true,
            data: grouped
        });
    } catch (error) {
        console.error('Error in getAllAmenities:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch amenities'
        });
    }
};

const getAmenityCategories = async (req, res) => {
    try {
        const sql = `
            SELECT DISTINCT category
            FROM amenities
            ORDER BY category
        `;
        
        const categories = await db.query(sql);
        
        res.json({
            success: true,
            data: categories.map(c => c.category)
        });
    } catch (error) {
        console.error('Error in getAmenityCategories:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch amenity categories'
        });
    }
};

module.exports = {
    getAllAmenities,
    getAmenityCategories
};
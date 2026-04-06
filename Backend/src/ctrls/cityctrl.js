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

const createCity = async (req, res) => {
  try {
    const { city_name, state, country } = req.body;
    
    if (!city_name) {
      return res.status(400).json({ success: false, error: 'City name is required' });
    }
    
    const result = await db.query(
      'INSERT INTO cities (city_name, state, country) VALUES (?, ?, ?)',
      [city_name, state || null, country || 'Pakistan']
    );
    
    res.status(201).json({
      success: true,
      message: 'City created successfully',
      data: { city_id: result.insertId }
    });
  } catch (error) {
    console.error('Create city error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateCity = async (req, res) => {
  try {
    const { id } = req.params;
    const { city_name, state, country } = req.body;
    
    const result = await db.query(
      'UPDATE cities SET city_name = ?, state = ?, country = ? WHERE city_id = ?',
      [city_name, state, country, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'City not found' });
    }
    
    res.json({ success: true, message: 'City updated successfully' });
  } catch (error) {
    console.error('Update city error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteCity = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query('DELETE FROM cities WHERE city_id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'City not found' });
    }
    
    res.json({ success: true, message: 'City deleted successfully' });
  } catch (error) {
    console.error('Delete city error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
    getAllCities,
    getCityAreas,
    createCity,
    updateCity,
    deleteCity
};
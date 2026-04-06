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

const createAmenity = async (req, res) => {
  try {
    const { amenity_name, category, icon_name } = req.body;
    
    if (!amenity_name) {
      return res.status(400).json({ success: false, error: 'Amenity name is required' });
    }
    
    const result = await db.query(
      'INSERT INTO amenities (amenity_name, category, icon_name) VALUES (?, ?, ?)',
      [amenity_name, category || 'basic', icon_name || null]
    );
    
    res.status(201).json({
      success: true,
      message: 'Amenity created successfully',
      data: { amenity_id: result.insertId }
    });
  } catch (error) {
    console.error('Create amenity error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateAmenity = async (req, res) => {
  try {
    const { id } = req.params;
    const { amenity_name, category, icon_name } = req.body;
    
    const result = await db.query(
      'UPDATE amenities SET amenity_name = ?, category = ?, icon_name = ? WHERE amenity_id = ?',
      [amenity_name, category, icon_name, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Amenity not found' });
    }
    
    res.json({ success: true, message: 'Amenity updated successfully' });
  } catch (error) {
    console.error('Update amenity error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteAmenity = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query('DELETE FROM amenities WHERE amenity_id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Amenity not found' });
    }
    
    res.json({ success: true, message: 'Amenity deleted successfully' });
  } catch (error) {
    console.error('Delete amenity error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
    getAllAmenities,
    getAmenityCategories,
    createAmenity,
    updateAmenity,
    deleteAmenity
};
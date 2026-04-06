const db = require('../config/database');

const getAllInstitutions = async (req, res) => {
  try {
    const { city_id } = req.query;
    
    let sql = `
      SELECT i.*, c.city_name, a.area_name
      FROM institutions i
      LEFT JOIN cities c ON i.city_id = c.city_id
      LEFT JOIN areas a ON i.area_id = a.area_id
      WHERE 1=1
    `;
    let params = [];
    
    if (city_id) {
      sql += ` AND i.city_id = ?`;
      params.push(city_id);
    }
    
    sql += ` ORDER BY i.institution_name`;
    
    const institutions = await db.query(sql, params);
    res.json({ success: true, data: institutions });
  } catch (error) {
    console.error('Get institutions error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const createInstitution = async (req, res) => {
  try {
    const {
      institution_name,
      institution_type,
      address,
      city_id,
      area_id,
      latitude,
      longitude
    } = req.body;

    if (!institution_name || !city_id) {
      return res.status(400).json({ success: false, error: 'Institution name and city are required' });
    }

    const result = await db.query(
      `INSERT INTO institutions 
       (institution_name, institution_type, address, city_id, area_id, latitude, longitude, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        institution_name,
        institution_type || 'other',
        address || null,
        city_id,
        area_id || null,
        latitude || null,
        longitude || null
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Institution created successfully',
      data: { institution_id: result.insertId }
    });
  } catch (error) {
    console.error('Create institution error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateInstitution = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      institution_name,
      institution_type,
      address,
      city_id,
      area_id,
      latitude,
      longitude
    } = req.body;

    const result = await db.query(
      `UPDATE institutions 
       SET institution_name = ?, institution_type = ?, address = ?, 
           city_id = ?, area_id = ?, latitude = ?, longitude = ?
       WHERE institution_id = ?`,
      [
        institution_name,
        institution_type,
        address,
        city_id,
        area_id,
        latitude,
        longitude,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Institution not found' });
    }

    res.json({ success: true, message: 'Institution updated successfully' });
  } catch (error) {
    console.error('Update institution error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteInstitution = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query('DELETE FROM institutions WHERE institution_id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Institution not found' });
    }
    
    res.json({ success: true, message: 'Institution deleted successfully' });
  } catch (error) {
    console.error('Delete institution error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getAllInstitutions,
  createInstitution,
  updateInstitution,
  deleteInstitution
};
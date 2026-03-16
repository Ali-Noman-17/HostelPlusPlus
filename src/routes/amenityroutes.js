const express = require('express');
const router = express.Router();
const amenityController = require('../ctrls/amenityctrl');

router.get('/', amenityController.getAllAmenities);
router.get('/categories', amenityController.getAmenityCategories);

module.exports = router;
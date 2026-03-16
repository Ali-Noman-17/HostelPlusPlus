const express = require('express');
const router = express.Router();
const cityController = require('../ctrls/cityctrl');

router.get('/', cityController.getAllCities);
router.get('/:id/areas', cityController.getCityAreas);

module.exports = router;
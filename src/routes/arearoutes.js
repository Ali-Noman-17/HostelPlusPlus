const express = require('express');
const router = express.Router();
const areaController = require('../ctrls/areactrl');

router.get('/', areaController.getAllAreas);
router.get('/:id/hostels', areaController.getHostelsByArea);

module.exports = router;
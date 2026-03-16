const express = require('express');
const router = express.Router();
const searchController = require('../ctrls/searchctrl');

router.get('/', searchController.searchHostels);
router.get('/:id/availability', searchController.checkAvailability);

module.exports = router;
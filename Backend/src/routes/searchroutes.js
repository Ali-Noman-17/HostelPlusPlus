const express = require('express');
const router = express.Router();
const searchController = require('../ctrls/searchctrl');

router.get('/', searchController.searchHostels);
router.get('/:id/availability', searchController.checkAvailability);
router.get('/categories', searchController.getNearbyCategories);
router.get('/transport-types', searchController.getTransportTypes);

module.exports = router;
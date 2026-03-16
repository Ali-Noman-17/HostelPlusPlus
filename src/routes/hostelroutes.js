const express = require('express');
const router = express.Router();
const hostelController = require('../ctrls/hostelctrl');

router.get('/', hostelController.getAllHostels);      
router.get('/:id', hostelController.getHostelById);   

module.exports = router;
const express = require('express');
const router = express.Router();
const institutionController = require('../ctrls/institutionctrl');

router.get('/', institutionController.getAllInstitutions);

module.exports = router;
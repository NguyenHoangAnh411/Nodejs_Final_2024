const express = require('express');
const controller = require('../controllers/reportController');
const router = express.Router();

router.get('/', controller.getReportData);

module.exports = router;

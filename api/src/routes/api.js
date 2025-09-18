const express = require('express');
const { getDailyReport } = require('../controllers/reportController');
const { getAvailableDates } = require('../controllers/dateController');
const { getHealth } = require('../controllers/healthController');

const router = express.Router();

router.get('/daily-report', getDailyReport);
router.get('/available-dates', getAvailableDates);
router.get('/health', getHealth);

module.exports = router;
const express = require('express');
const container = require('../ioc');
const { getHealth } = require('../controllers/healthController');

const router = express.Router();

const reportController = container.resolve('ReportController');
const scopeController = container.resolve('ScopeController');

router.get('/daily-report', (req, res) => reportController.getDailyReport(req, res));
router.get('/available-dates', (req, res) => scopeController.getAvailableDates(req, res));
router.get('/health', getHealth);

module.exports = router;
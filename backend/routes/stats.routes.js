const express = require('express');
const router = express.Router();
const { getHomeStats } = require('../controllers/stats.controller');

// GET /api/stats/home - Home page stats
router.get('/home', getHomeStats);

module.exports = router;
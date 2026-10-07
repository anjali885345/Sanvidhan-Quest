const express = require('express');
const router = express.Router();
const { getLeaderboard, getBadges, getUserStats } = require('../controllers/gamificationController');
const { protect } = require('../middleware/auth');

router.get('/leaderboard', getLeaderboard);
router.get('/badges', protect, getBadges);
router.get('/user/stats', protect, getUserStats);

module.exports = router;

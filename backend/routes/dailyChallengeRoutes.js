const express = require('express');
const router = express.Router();
const { getDailyChallenge, completeDailyChallenge } = require('../controllers/dailyChallengeController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getDailyChallenge);
router.post('/complete', protect, completeDailyChallenge);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  getQuiz, submitQuiz,
  getScenarios, submitScenario,
  getMatch, submitMatch,
  getTimeline, submitTimeline,
  getFillBlank, submitFillBlank,
  getMemory, submitMemory,
} = require('../controllers/gameController');
const { protect } = require('../middleware/auth');

// Quiz
router.get('/quiz/:moduleId', protect, getQuiz);
router.post('/quiz/:id/submit', protect, submitQuiz);

// Scenario Court
router.get('/scenario/:moduleId', protect, getScenarios);
router.post('/scenario/:id/submit', protect, submitScenario);

// Match the Article
router.get('/match/:moduleId', protect, getMatch);
router.post('/match/:id/submit', protect, submitMatch);

// Timeline
router.get('/timeline/:moduleId', protect, getTimeline);
router.post('/timeline/:id/submit', protect, submitTimeline);

// Fill the Blank
router.get('/fillblank/:moduleId', protect, getFillBlank);
router.post('/fillblank/:id/submit', protect, submitFillBlank);

// Memory
router.get('/memory/:moduleId', protect, getMemory);
router.post('/memory/:id/submit', protect, submitMemory);

module.exports = router;

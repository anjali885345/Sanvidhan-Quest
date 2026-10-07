const Quiz = require('../models/Quiz');
const Scenario = require('../models/Scenario');
const MatchChallenge = require('../models/MatchChallenge');
const TimelineChallenge = require('../models/TimelineChallenge');
const FillBlankChallenge = require('../models/FillBlankChallenge');
const MemoryChallenge = require('../models/MemoryChallenge');
const Progress = require('../models/Progress');
const User = require('../models/User');

// Helper to award XP
const awardXP = async (userId, xp) => {
  const user = await User.findById(userId);
  user.xp += xp;
  user.level = user.calculateLevel();
  await user.save();
  return { totalXp: user.xp, level: user.level };
};

// ===== QUIZ =====
const getQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ moduleId: req.params.moduleId });
    if (!quiz) return res.status(404).json({ message: 'Quiz not found for this module' });
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const submitQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    const { answers } = req.body; // Array of selected option indices
    let correct = 0;
    const results = quiz.questions.map((q, i) => {
      const isCorrect = answers[i] === q.correctAnswer;
      if (isCorrect) correct++;
      return { question: q.question, isCorrect, correctAnswer: q.correctAnswer, userAnswer: answers[i], explanation: q.explanation };
    });

    const score = Math.round((correct / quiz.questions.length) * 100);
    let xpEarned = score === 100 ? 150 : score >= 70 ? 75 : 25;

    // Update progress
    let progress = await Progress.findOne({ userId: req.user._id, moduleId: quiz.moduleId });
    if (!progress) progress = new Progress({ userId: req.user._id, moduleId: quiz.moduleId });
    progress.quizScore = Math.max(progress.quizScore, score);
    progress.xpEarned += xpEarned;
    await progress.save();

    const userStats = await awardXP(req.user._id, xpEarned);

    res.json({ score, correct, total: quiz.questions.length, xpEarned, results, ...userStats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===== SCENARIO COURT =====
const getScenarios = async (req, res) => {
  try {
    const scenarios = await Scenario.find({ moduleId: req.params.moduleId });
    res.json(scenarios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const submitScenario = async (req, res) => {
  try {
    const scenario = await Scenario.findById(req.params.id);
    if (!scenario) return res.status(404).json({ message: 'Scenario not found' });

    const { choiceIndex } = req.body;
    const choice = scenario.choices[choiceIndex];
    const isCorrect = choice.isCorrect;
    const xpEarned = isCorrect ? scenario.xpReward : 10;

    let progress = await Progress.findOne({ userId: req.user._id, moduleId: scenario.moduleId });
    if (!progress) progress = new Progress({ userId: req.user._id, moduleId: scenario.moduleId });
    if (isCorrect) progress.scenarioCompleted = true;
    progress.xpEarned += xpEarned;
    await progress.save();

    const userStats = await awardXP(req.user._id, xpEarned);

    res.json({ isCorrect, outcome: choice.outcome, articleRef: choice.articleRef, xpEarned, ...userStats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===== MATCH THE ARTICLE =====
const getMatch = async (req, res) => {
  try {
    const match = await MatchChallenge.findOne({ moduleId: req.params.moduleId });
    if (!match) return res.status(404).json({ message: 'Match challenge not found' });
    // Shuffle provisions for the client
    const shuffledPairs = match.pairs.map(p => ({ article: p.article, provision: p.provision }));
    res.json({ ...match.toObject(), pairs: shuffledPairs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const submitMatch = async (req, res) => {
  try {
    const match = await MatchChallenge.findById(req.params.id);
    if (!match) return res.status(404).json({ message: 'Match challenge not found' });

    const { userPairs, timeTaken } = req.body;
    let correct = 0;
    match.pairs.forEach((p, i) => {
      if (userPairs[i] && userPairs[i].article === p.article && userPairs[i].provision === p.provision) correct++;
    });

    const score = Math.round((correct / match.pairs.length) * 100);
    const speedBonus = timeTaken < 30 ? 50 : timeTaken < 60 ? 25 : 0;
    const xpEarned = match.xpReward + speedBonus;

    let progress = await Progress.findOne({ userId: req.user._id, moduleId: match.moduleId });
    if (!progress) progress = new Progress({ userId: req.user._id, moduleId: match.moduleId });
    progress.matchScore = Math.max(progress.matchScore, score);
    progress.xpEarned += xpEarned;
    await progress.save();

    const userStats = await awardXP(req.user._id, xpEarned);
    res.json({ score, correct, total: match.pairs.length, xpEarned, speedBonus, ...userStats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===== TIMELINE =====
const getTimeline = async (req, res) => {
  try {
    const timeline = await TimelineChallenge.findOne({ moduleId: req.params.moduleId });
    if (!timeline) return res.status(404).json({ message: 'Timeline challenge not found' });
    res.json(timeline);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const submitTimeline = async (req, res) => {
  try {
    const timeline = await TimelineChallenge.findById(req.params.id);
    if (!timeline) return res.status(404).json({ message: 'Timeline challenge not found' });

    const { userOrder } = req.body;
    let correct = 0;
    timeline.events.forEach((event, i) => {
      if (userOrder[i] === event.correctOrder) correct++;
    });

    const score = Math.round((correct / timeline.events.length) * 100);
    const xpEarned = score === 100 ? timeline.xpReward : Math.round(timeline.xpReward * score / 100);

    let progress = await Progress.findOne({ userId: req.user._id, moduleId: timeline.moduleId });
    if (!progress) progress = new Progress({ userId: req.user._id, moduleId: timeline.moduleId });
    progress.timelineScore = Math.max(progress.timelineScore, score);
    progress.xpEarned += xpEarned;
    await progress.save();

    const userStats = await awardXP(req.user._id, xpEarned);
    res.json({ score, correct, total: timeline.events.length, xpEarned, ...userStats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===== FILL THE BLANK =====
const getFillBlank = async (req, res) => {
  try {
    const challenge = await FillBlankChallenge.findOne({ moduleId: req.params.moduleId });
    if (!challenge) return res.status(404).json({ message: 'Fill-the-blank challenge not found' });
    res.json(challenge);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const submitFillBlank = async (req, res) => {
  try {
    const challenge = await FillBlankChallenge.findById(req.params.id);
    if (!challenge) return res.status(404).json({ message: 'Challenge not found' });

    const { userAnswers } = req.body;
    let correct = 0;
    challenge.blanks.forEach((blank, i) => {
      if (userAnswers[i] && userAnswers[i].toLowerCase() === blank.correctWord.toLowerCase()) correct++;
    });

    const score = Math.round((correct / challenge.blanks.length) * 100);
    const xpEarned = score === 100 ? challenge.xpReward : Math.round(challenge.xpReward * score / 100);

    let progress = await Progress.findOne({ userId: req.user._id, moduleId: challenge.moduleId });
    if (!progress) progress = new Progress({ userId: req.user._id, moduleId: challenge.moduleId });
    progress.fillBlankScore = Math.max(progress.fillBlankScore, score);
    progress.xpEarned += xpEarned;
    await progress.save();

    const userStats = await awardXP(req.user._id, xpEarned);
    res.json({ score, correct, total: challenge.blanks.length, xpEarned, ...userStats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===== MEMORY =====
const getMemory = async (req, res) => {
  try {
    const memory = await MemoryChallenge.findOne({ moduleId: req.params.moduleId });
    if (!memory) return res.status(404).json({ message: 'Memory challenge not found' });
    res.json(memory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const submitMemory = async (req, res) => {
  try {
    const memory = await MemoryChallenge.findById(req.params.id);
    if (!memory) return res.status(404).json({ message: 'Memory challenge not found' });

    const { timeTaken, moves } = req.body;
    const speedBonus = timeTaken < 30 ? 50 : timeTaken < 60 ? 25 : 0;
    const xpEarned = memory.xpReward + speedBonus;

    let progress = await Progress.findOne({ userId: req.user._id, moduleId: memory.moduleId });
    if (!progress) progress = new Progress({ userId: req.user._id, moduleId: memory.moduleId });
    progress.memoryScore = Math.max(progress.memoryScore, 100);
    progress.xpEarned += xpEarned;
    await progress.save();

    const userStats = await awardXP(req.user._id, xpEarned);
    res.json({ xpEarned, speedBonus, timeTaken, moves, ...userStats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getQuiz, submitQuiz,
  getScenarios, submitScenario,
  getMatch, submitMatch,
  getTimeline, submitTimeline,
  getFillBlank, submitFillBlank,
  getMemory, submitMemory,
};

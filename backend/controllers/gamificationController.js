const User = require('../models/User');
const Badge = require('../models/Badge');
const Progress = require('../models/Progress');

// @desc    Get leaderboard
// @route   GET /api/leaderboard
const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find()
      .select('username avatar xp level streak badges')
      .sort({ xp: -1 })
      .limit(50);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all badges
// @route   GET /api/badges
const getBadges = async (req, res) => {
  try {
    const badges = await Badge.find();
    const user = await User.findById(req.user._id);
    const badgesWithStatus = badges.map(badge => ({
      ...badge.toObject(),
      earned: user.badges.some(b => b.badgeId === badge.badgeId),
    }));
    res.json(badgesWithStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user stats
// @route   GET /api/user/stats
const getUserStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    const progress = await Progress.find({ userId: req.user._id });

    const totalModules = progress.length;
    const completedModules = progress.filter(p => p.completed).length;
    const avgQuizScore = progress.length > 0
      ? Math.round(progress.reduce((sum, p) => sum + p.quizScore, 0) / progress.length)
      : 0;
    const totalXpEarned = progress.reduce((sum, p) => sum + p.xpEarned, 0);

    res.json({
      user,
      stats: {
        totalModules,
        completedModules,
        avgQuizScore,
        totalXpEarned,
        badges: user.badges.length,
        streak: user.streak,
      },
      progress,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getLeaderboard, getBadges, getUserStats };

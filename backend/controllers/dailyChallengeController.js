const DailyChallenge = require('../models/DailyChallenge');
const User = require('../models/User');

// @desc    Get today's daily challenge
// @route   GET /api/daily
const getDailyChallenge = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    let challenge = await DailyChallenge.findOne({ date: today });

    if (!challenge) {
      // Auto-generate a daily challenge if none exists
      const types = ['quiz', 'scenario', 'match', 'timeline', 'fillblank', 'memory'];
      const dayIndex = new Date().getDay();
      challenge = {
        date: today,
        challengeType: types[dayIndex % types.length],
        challengeData: { message: 'Check back later for today\'s challenge!' },
        xpReward: 50,
      };
    }

    // Check if user already completed today's challenge
    const user = await User.findById(req.user._id);
    const alreadyCompleted = user.dailyChallengesCompleted.some(
      d => new Date(d).toISOString().split('T')[0] === today
    );

    res.json({ ...challenge.toObject ? challenge.toObject() : challenge, alreadyCompleted });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Complete daily challenge
// @route   POST /api/daily/complete
const completeDailyChallenge = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const user = await User.findById(req.user._id);

    const alreadyCompleted = user.dailyChallengesCompleted.some(
      d => new Date(d).toISOString().split('T')[0] === today
    );

    if (alreadyCompleted) {
      return res.status(400).json({ message: 'Daily challenge already completed today' });
    }

    // Update streak
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const lastCompleted = user.dailyChallengesCompleted.length > 0
      ? new Date(user.dailyChallengesCompleted[user.dailyChallengesCompleted.length - 1]).toISOString().split('T')[0]
      : null;

    if (lastCompleted === yesterday) {
      user.streak += 1;
    } else if (lastCompleted !== today) {
      user.streak = 1;
    }

    // Award streak bonuses
    let bonusXP = 0;
    if (user.streak === 7) bonusXP = 100;
    if (user.streak === 30) bonusXP = 500;

    user.xp += 50 + bonusXP;
    user.level = user.calculateLevel();
    user.lastActiveDate = new Date();
    user.dailyChallengesCompleted.push(new Date());
    await user.save();

    res.json({
      message: 'Daily challenge completed!',
      streak: user.streak,
      xpEarned: 50 + bonusXP,
      bonusXP,
      totalXp: user.xp,
      level: user.level,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDailyChallenge, completeDailyChallenge };

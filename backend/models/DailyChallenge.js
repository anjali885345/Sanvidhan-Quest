const mongoose = require('mongoose');

const dailyChallengeSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true },
  challengeType: {
    type: String,
    enum: ['quiz', 'scenario', 'match', 'timeline', 'fillblank', 'memory'],
    required: true,
  },
  challengeData: { type: mongoose.Schema.Types.Mixed, required: true },
  xpReward: { type: Number, default: 50 },
}, { timestamps: true });

module.exports = mongoose.model('DailyChallenge', dailyChallengeSchema);

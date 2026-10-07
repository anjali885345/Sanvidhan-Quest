const mongoose = require('mongoose');

const matchChallengeSchema = new mongoose.Schema({
  moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
  title: { type: String, required: true },
  pairs: [{
    article: { type: String, required: true },
    provision: { type: String, required: true },
  }],
  timeLimit: { type: Number, default: 90 },
  xpReward: { type: Number, default: 75 },
}, { timestamps: true });

module.exports = mongoose.model('MatchChallenge', matchChallengeSchema);

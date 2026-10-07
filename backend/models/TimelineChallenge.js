const mongoose = require('mongoose');

const timelineChallengeSchema = new mongoose.Schema({
  moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
  title: { type: String, required: true },
  events: [{
    title: { type: String, required: true },
    year: { type: Number, required: true },
    description: { type: String, required: true },
    correctOrder: { type: Number, required: true },
  }],
  xpReward: { type: Number, default: 100 },
}, { timestamps: true });

module.exports = mongoose.model('TimelineChallenge', timelineChallengeSchema);

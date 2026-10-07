const mongoose = require('mongoose');

const fillBlankChallengeSchema = new mongoose.Schema({
  moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
  title: { type: String, required: true },
  fullText: { type: String, required: true },
  blanks: [{
    index: { type: Number, required: true },
    correctWord: { type: String, required: true },
  }],
  wordBank: [{ type: String, required: true }],
  xpReward: { type: Number, default: 75 },
}, { timestamps: true });

module.exports = mongoose.model('FillBlankChallenge', fillBlankChallengeSchema);

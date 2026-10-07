const mongoose = require('mongoose');

const memoryChallengeSchema = new mongoose.Schema({
  moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
  title: { type: String, required: true },
  pairs: [{
    front: { type: String, required: true },
    back: { type: String, required: true },
  }],
  gridSize: { type: Number, default: 4 },
  xpReward: { type: Number, default: 75 },
}, { timestamps: true });

module.exports = mongoose.model('MemoryChallenge', memoryChallengeSchema);

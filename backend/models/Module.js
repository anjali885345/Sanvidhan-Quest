const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  partNumber: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  articles: [{
    articleNumber: String,
    title: String,
    description: String,
  }],
  funFacts: [{ type: String }],
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  xpReward: { type: Number, default: 100 },
  icon: { type: String, default: '📜' },
  order: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Module', moduleSchema);

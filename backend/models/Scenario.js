const mongoose = require('mongoose');

const scenarioSchema = new mongoose.Schema({
  moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  role: { type: String, enum: ['Judge', 'Citizen', 'Legislator'], required: true },
  situation: { type: String, required: true },
  choices: [{
    text: { type: String, required: true },
    articleRef: { type: String },
    isCorrect: { type: Boolean, default: false },
    outcome: { type: String, required: true },
  }],
  xpReward: { type: Number, default: 100 },
}, { timestamps: true });

module.exports = mongoose.model('Scenario', scenarioSchema);

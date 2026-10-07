const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
  completed: { type: Boolean, default: false },
  quizScore: { type: Number, default: 0 },
  scenarioCompleted: { type: Boolean, default: false },
  matchScore: { type: Number, default: 0 },
  timelineScore: { type: Number, default: 0 },
  fillBlankScore: { type: Number, default: 0 },
  memoryScore: { type: Number, default: 0 },
  xpEarned: { type: Number, default: 0 },
  completedAt: { type: Date },
}, { timestamps: true });

progressSchema.index({ userId: 1, moduleId: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);

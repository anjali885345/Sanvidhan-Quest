const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  badgeId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  criteria: {
    type: { type: String, required: true },
    threshold: { type: Number },
    moduleId: { type: String },
  },
  xpBonus: { type: Number, default: 50 },
}, { timestamps: true });

module.exports = mongoose.model('Badge', badgeSchema);

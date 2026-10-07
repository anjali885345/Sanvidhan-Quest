const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please add a username'],
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
  },
  avatar: {
    type: String,
    default: 'avatar1',
  },
  xp: {
    type: Number,
    default: 0,
  },
  level: {
    type: Number,
    default: 1,
  },
  streak: {
    type: Number,
    default: 0,
  },
  streakFreezes: {
    type: Number,
    default: 1,
  },
  lastActiveDate: {
    type: Date,
    default: null,
  },
  badges: [{
    badgeId: String,
    name: String,
    icon: String,
    earnedAt: { type: Date, default: Date.now },
  }],
  completedModules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Module' }],
  dailyChallengesCompleted: [{ type: Date }],
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Calculate level from XP
userSchema.methods.calculateLevel = function () {
  this.level = Math.floor(this.xp / 500) + 1;
  return this.level;
};

module.exports = mongoose.model('User', userSchema);

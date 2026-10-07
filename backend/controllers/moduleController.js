const Module = require('../models/Module');
const Progress = require('../models/Progress');

// @desc    Get all modules with user progress
// @route   GET /api/modules
const getModules = async (req, res) => {
  try {
    const modules = await Module.find().sort({ order: 1 });

    if (req.user) {
      const progress = await Progress.find({ userId: req.user._id });
      const modulesWithProgress = modules.map(mod => {
        const prog = progress.find(p => p.moduleId.toString() === mod._id.toString());
        return {
          ...mod.toObject(),
          progress: prog || null,
        };
      });
      return res.json(modulesWithProgress);
    }

    res.json(modules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single module detail
// @route   GET /api/modules/:id
const getModule = async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }

    let progress = null;
    if (req.user) {
      progress = await Progress.findOne({ userId: req.user._id, moduleId: module._id });
    }

    res.json({ ...module.toObject(), progress });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Complete a module (reading)
// @route   POST /api/modules/:id/complete
const completeModule = async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }

    let progress = await Progress.findOne({ userId: req.user._id, moduleId: module._id });
    if (!progress) {
      progress = new Progress({ userId: req.user._id, moduleId: module._id });
    }

    if (!progress.completed) {
      progress.completed = true;
      progress.completedAt = new Date();
      progress.xpEarned += module.xpReward;
      await progress.save();

      // Award XP to user
      const user = req.user;
      user.xp += module.xpReward;
      user.level = user.calculateLevel();
      if (!user.completedModules.includes(module._id)) {
        user.completedModules.push(module._id);
      }
      await user.save();

      return res.json({
        message: 'Module completed!',
        xpEarned: module.xpReward,
        totalXp: user.xp,
        level: user.level,
        progress,
      });
    }

    res.json({ message: 'Module already completed', progress });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getModules, getModule, completeModule };

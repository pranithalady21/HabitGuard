const express = require('express');
const {
  addHabit,
  getAllHabits,
  getHabitById,
  markHabitComplete,
  updateHabit,
  deleteHabit,
  getSuspiciousActivities,
  getHabitInsights,
} = require('../controllers/habitController');

const router = express.Router();

// ✅ Specific routes FIRST

router.get('/detail/:habitId', getHabitById);
router.get('/:habitId/suspicious-activities', getSuspiciousActivities);
router.get('/:habitId/insights', getHabitInsights);
router.post('/:habitId/complete', markHabitComplete);
router.put('/:habitId', updateHabit);
router.delete('/:habitId', deleteHabit);

// ✅ General routes LAST

router.post('/', addHabit);
router.get('/:userId', getAllHabits);

module.exports = router;
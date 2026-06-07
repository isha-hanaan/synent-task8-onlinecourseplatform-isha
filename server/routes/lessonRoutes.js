const express = require('express');
const {
    getLessonsByModule,
    createLesson,
    updateLesson,
    deleteLesson
} = require('../controllers/lessonController');

const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Protected route (access controlled inside controller based on student enrollment status)
router.get('/:moduleId', protect, getLessonsByModule);

// Admin-only write operations
router.post('/', protect, authorize('admin'), createLesson);
router.put('/:id', protect, authorize('admin'), updateLesson);
router.delete('/:id', protect, authorize('admin'), deleteLesson);

module.exports = router;


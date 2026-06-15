const express = require('express');
const {
    getLessonsByModule,
    createLesson,
    updateLesson,
    deleteLesson
} = require('../controllers/lessonController');

const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router({ mergeParams: true });

router.route('/')
    .get(protect, getLessonsByModule)
    .post(protect, authorize('admin'), createLesson);

router.route('/:id')
    .put(protect, authorize('admin'), updateLesson)
    .delete(protect, authorize('admin'), deleteLesson);

module.exports = router;
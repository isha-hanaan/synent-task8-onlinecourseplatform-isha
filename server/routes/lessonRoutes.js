/* server/routes/lessonRoutes.js */

const express = require('express');
const {
    getLessonsByModule,
    createLesson,
    updateLesson,
    deleteLesson
} = require('../controllers/lessonController');

const { protect, authorize } = require('../middleware/authMiddleware');

// FIXED: Enable mergeParams to inherit the parent :moduleId variable if routed from moduleRoutes
const router = express.Router({ mergeParams: true });


// --- CLIENT READ HOOKS ---

// Handles both: /api/lessons/:moduleId AND nested /api/modules/:moduleId/lessons
router.route('/:moduleId')
    .get(protect, getLessonsByModule);


// --- ADMINISTRATIVE CONTENT MUTATIONS ---

router.route('/')
    .post(protect, authorize('admin'), createLesson);

router.route('/:id')
    .put(protect, authorize('admin'), updateLesson)
    .delete(protect, authorize('admin'), deleteLesson);

module.exports = router;
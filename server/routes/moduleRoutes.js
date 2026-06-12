/* server/routes/moduleRoutes.js */

const express = require('express');
const {
    getModulesByCourse,
    getAllModules,
    createModule,
    updateModule,
    deleteModule
} = require('../controllers/moduleController');

const { protect, authorize } = require('../middleware/authMiddleware');

// FIXED: Enable mergeParams to inherit the parent :courseId variable from courseRoutes
const router = express.Router({ mergeParams: true });

// FIXED: Forward nested curriculum sub-resource endpoints down to lessonRoutes
const lessonRouter = require('./lessonRoutes');
router.use('/:moduleId/lessons', lessonRouter);


// --- CORE RESOURCE MANAGEMENT HOOKS ---

router.route('/')
    // Accessible via: GET /api/modules (Admin global view) OR forwarded GET /api/courses/:courseId/modules
    .get(protect, (req, res, next) => {
        // If a courseId param is found, handle via getModulesByCourse; otherwise, pass to admin getAllModules
        if (req.params.courseId) {
            return getModulesByCourse(req, res, next);
        }
        return authorize('admin')(req, res, () => getAllModules(req, res, next));
    })
    .post(protect, authorize('admin'), createModule);

router.route('/:id')
    .put(protect, authorize('admin'), updateModule)
    .delete(protect, authorize('admin'), deleteModule);

// Backward Compatibility Rule: Keeps direct lookup via /api/modules/:courseId working as expected
router.route('/:courseId')
    .get(protect, getModulesByCourse);

module.exports = router;
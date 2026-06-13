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

const router = express.Router({ mergeParams: true });

const lessonRouter = require('./lessonRoutes');
router.use('/:moduleId/lessons', lessonRouter);

router.route('/')
    .get(protect, (req, res, next) => {
        if (req.params.courseId) {
            return getModulesByCourse(req, res, next);
        }
        return authorize('admin')(req, res, () => getAllModules(req, res, next));
    })
    .post(protect, authorize('admin'), createModule);

router.route('/:id')
    .put(protect, authorize('admin'), updateModule)
    .delete(protect, authorize('admin'), deleteModule);

router.route('/:courseId')
    .get(protect, getModulesByCourse);

module.exports = router;
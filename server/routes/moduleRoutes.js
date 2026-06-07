const express = require('express');
const {
    getModulesByCourse,
    getAllModules,
    createModule,
    updateModule,
    deleteModule
} = require('../controllers/moduleController');

const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get(
    '/',
    protect,
    authorize('admin'),
    getAllModules
);

router.get(
    '/:courseId',
    protect,
    getModulesByCourse
);

router.post(
    '/',
    protect,
    authorize('admin'),
    createModule
);

router.put(
    '/:id',
    protect,
    authorize('admin'),
    updateModule
);

router.delete(
    '/:id',
    protect,
    authorize('admin'),
    deleteModule
);

module.exports = router;
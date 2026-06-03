const Module = require('../models/Module');

// @desc Get all modules for a course
// @route GET /api/modules/:courseId
// @access Public
const getModulesByCourse = async (req, res) => {
    try {
        const modules = await Module.find({
            course: req.params.courseId
        }).sort('order');

        res.status(200).json({
            success: true,
            count: modules.length,
            data: modules
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// @desc Create module
// @route POST /api/modules
// @access Admin
const createModule = async (req, res) => {
    try {
        const moduleItem = await Module.create(req.body);

        res.status(201).json({
            success: true,
            data: moduleItem
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getModulesByCourse,
    createModule
};
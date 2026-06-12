/* server/controllers/moduleController.js */

const Module = require('../models/Module');
const Enrollment = require('../models/Enrollment');

// @desc    Get all modules for a course
// @route   GET /api/modules/:courseId
// @access  Private (Students) / Admin Bypass
const getModulesByCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;

        // FIXED: Catch unauthenticated guest visitors immediately before evaluating properties on req.user
        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized. Please log in.' });
        }

        // Check Access: If the user is an admin, let them pass directly to manage modules
        if (req.user.role !== 'admin') {
            const enrollment = await Enrollment.findOne({
                user: req.user.id,
                course: courseId,
                status: 'completed'
            });

            if (!enrollment) {
                return res.status(403).json({
                    message: 'Access denied. You must be enrolled in this course.'
                });
            }
        }

        const modules = await Module.find({ course: courseId }).sort('order');

        res.status(200).json({
            success: true,
            count: modules.length,
            data: modules
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all modules
// @route   GET /api/modules
// @access  Private/Admin
const getAllModules = async (req, res) => {
    try {
        const modules = await Module.find()
            .populate('course', 'title')
            .sort('createdAt');

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

// @desc    Create module
// @route   POST /api/modules OR POST /api/courses/:courseId/modules
// @access  Private/Admin
const createModule = async (req, res) => {
    try {
        // FIXED: Automatically extract parent course ID from URL parameters if available
        if (req.params.courseId) {
            req.body.course = req.params.courseId;
        }

        // Guard against saving a module without any parent course mapped
        if (!req.body.course) {
            return res.status(400).json({ message: 'A parent course ID is required to create a module.' });
        }

        const moduleItem = await Module.create(req.body);
        res.status(201).json({ success: true, data: moduleItem });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update module
// @route   PUT /api/modules/:id
// @access  Private/Admin
const updateModule = async (req, res) => {
    try {
        const moduleItem = await Module.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!moduleItem) {
            return res.status(404).json({
                message: 'Module not found'
            });
        }

        res.status(200).json({
            success: true,
            data: moduleItem
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// @desc    Delete module
// @route   DELETE /api/modules/:id
// @access  Private/Admin
const deleteModule = async (req, res) => {
    try {
        const moduleItem = await Module.findById(req.params.id);

        if (!moduleItem) {
            return res.status(404).json({
                message: 'Module not found'
            });
        }

        await moduleItem.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Module deleted'
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getModulesByCourse,
    getAllModules,
    createModule,
    updateModule,
    deleteModule
};
/* server/controllers/lessonController.js */

const Lesson = require('../models/Lesson');
const Enrollment = require('../models/Enrollment');
const Module = require('../models/Module');

// @desc    Get lessons by module
// @route   GET /api/lessons/:moduleId
// @access  Private
const getLessonsByModule = async (req, res) => {
    try {
        const moduleItem = await Module.findById(req.params.moduleId);
        if (!moduleItem) {
            return res.status(404).json({ message: 'Module reference not found' });
        }

        // CRASH FIX: Ensure req.user exists before attempting to look up enrollments
        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized. Please log in.' });
        }

        // Access enforcement layer: Admins bypass, standard users checked against course enrollments
        if (req.user.role !== 'admin') {
            const enrollment = await Enrollment.findOne({
                user: req.user.id,
                course: moduleItem.course,
                status: 'completed'
            });

            if (!enrollment) {
                return res.status(403).json({ message: 'Access denied. Please enroll to view course content.' });
            }
        }

        const lessons = await Lesson.find({ module: req.params.moduleId }).sort('order');

        res.status(200).json({
            success: true,
            count: lessons.length,
            data: lessons
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create lesson
// @route   POST /api/lessons OR POST /api/modules/:moduleId/lessons
// @access  Private/Admin
const createLesson = async (req, res) => {
    try {
        // FLEXIBILITY FIX: Automatically capture the module ID from URL params if present, or fall back to req.body
        if (req.params.moduleId) {
            req.body.module = req.params.moduleId;
        }

        // Double check that we actually have a module ID bound before passing to Mongoose validation
        if (!req.body.module) {
            return res.status(400).json({ message: 'A parent module ID is required to create a lesson.' });
        }

        const lesson = await Lesson.create(req.body);
        res.status(201).json({ success: true, data: lesson });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update lesson
// @route   PUT /api/lessons/:id
// @access  Private/Admin
const updateLesson = async (req, res) => {
    try {
        const lesson = await Lesson.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }

        res.status(200).json({ success: true, data: lesson });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete lesson
// @route   DELETE /api/lessons/:id
// @access  Private/Admin
const deleteLesson = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id);
        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }

        await lesson.deleteOne();
        res.status(200).json({ success: true, message: 'Lesson deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getLessonsByModule,
    createLesson,
    updateLesson,
    deleteLesson
};
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

        // Access enforcement layer: Admins bypass, standard users checked against course enrollments
        if (!req.user || req.user.role !== 'admin') {
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
// @route   POST /api/lessons
// @access  Private/Admin
const createLesson = async (req, res) => {
    try {
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
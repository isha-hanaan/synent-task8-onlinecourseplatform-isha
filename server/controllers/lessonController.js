const Lesson = require('../models/Lesson');

// @desc Get lessons by module
// @route GET /api/lessons/:moduleId
// @access Public
const getLessonsByModule = async (req, res) => {
    try {
        const lessons = await Lesson.find({
            module: req.params.moduleId
        }).sort('order');

        res.status(200).json({
            success: true,
            count: lessons.length,
            data: lessons
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// @desc Create lesson
// @route POST /api/lessons
// @access Admin
const createLesson = async (req, res) => {
    try {
        const lesson = await Lesson.create(req.body);

        res.status(201).json({
            success: true,
            data: lesson
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getLessonsByModule,
    createLesson
};
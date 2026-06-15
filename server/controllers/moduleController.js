const Module = require('../models/Module');
const Enrollment = require('../models/Enrollment');

const getModulesByCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;

        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized. Please log in.' });
        }

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

        const modules = await Module.find({ course: courseId })
            .populate({
                path: 'lessons',
                options: {
                    sort: { order: 1 }
                }
            })
            .sort('order');

        res.status(200).json({
            success: true,
            count: modules.length,
            data: modules
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

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

const createModule = async (req, res) => {
    try {
        if (req.params.courseId) {
            req.body.course = req.params.courseId;
        }

        if (!req.body.course) {
            return res.status(400).json({ message: 'A parent course ID is required to create a module.' });
        }

        const moduleItem = await Module.create(req.body);
        res.status(201).json({ success: true, data: moduleItem });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

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
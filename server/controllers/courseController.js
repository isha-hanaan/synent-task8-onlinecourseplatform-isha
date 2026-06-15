const Course = require('../models/Course');
const Module = require('../models/Module');

const getCourses = async (req, res) => {
    try {
        const queryObj = { ...req.query };

        const excludeFields = ['search', 'page', 'limit', 'sort'];
        excludeFields.forEach(param => delete queryObj[param]);

        if (req.query.search) {
            queryObj.$or = [
                { title: { $regex: req.query.search, $options: 'i' } },
                { description: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        if (!req.user || req.user.role !== 'admin') {
            queryObj.isAdminApproved = true;
        }

        let query = Course.find(queryObj);

        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;

        const total = await Course.countDocuments(queryObj);
        query = query.skip(startIndex).limit(limit);

        const courses = await query;

        res.status(200).json({
            success: true,
            count: courses.length,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            },
            data: courses
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate({
            path: 'courseModules',
            options: { sort: { order: 1 } },
            populate: {
                path: 'lessons',
                model: 'Lesson',
                options: { sort: { order: 1 } }
            }
        });

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        if (!course.isAdminApproved && (!req.user || req.user?.role !== 'admin')) {
            return res.status(403).json({ message: 'This course is awaiting administrator approval.' });
        }

        res.status(200).json({ success: true, data: course });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createCourse = async (req, res) => {
    try {
        req.body.createdBy = req.user.id;

        if (req.user?.role === 'admin') {
            req.body.isAdminApproved = true;
        }

        const course = await Course.create(req.body);
        res.status(201).json({ success: true, data: course });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateCourse = async (req, res) => {
    try {
        let course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        course = await Course.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: course });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        await course.deleteOne();
        res.status(200).json({ success: true, message: 'Course removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse
};
/* server/controllers/courseController.js */

const Course = require('../models/Course');
const Module = require('../models/Module'); // Required to ensure the model compiles for populates

// @desc    Get all courses (with Search, Category Filter, Pagination, Admin approval enforcement)
// @route   GET /api/courses
// @access  Public (Filtered) / Private Admin (Unfiltered)
const getCourses = async (req, res) => {
    try {
        const queryObj = { ...req.query };

        // Exclude specific structural parameters from basic fields filtering execution
        const excludeFields = ['search', 'page', 'limit', 'sort'];
        excludeFields.forEach(param => delete queryObj[param]);

        // 1. Partial global search execution on Title/Description fields
        if (req.query.search) {
            queryObj.$or = [
                { title: { $regex: req.query.search, $options: 'i' } },
                { description: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        // 2. SECURITY FIX: Enforce Admin Approval filter for regular users/guests
        if (!req.user || req.user.role !== 'admin') {
            queryObj.isAdminApproved = true;
        }

        // 3. Construct baseline search execution context
        let query = Course.find(queryObj);

        // 4. Sort handling
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        // 5. Pagination Core Logic
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;

        const total = await Course.countDocuments(queryObj);
        query = query.skip(startIndex).limit(limit);

        // Execute query execution
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

// @desc    Get single course by ID with complete syllabus structure
// @route   GET /api/courses/:id
// @access  Public
const getCourse = async (req, res) => {
    try {
        // FIXED: Deeply populate modules and their respective lessons across our standalone collections
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

        // CRASH & SECURITY FIX: Prevent standard users/guests from accessing unapproved courses using optional chaining
        if (!course.isAdminApproved && (!req.user || req.user?.role !== 'admin')) {
            return res.status(403).json({ message: 'This course is awaiting administrator approval.' });
        }

        res.status(200).json({ success: true, data: course });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new course
// @route   POST /api/courses
// @access  Private/Admin
const createCourse = async (req, res) => {
    try {
        req.body.createdBy = req.user.id;

        // If an admin creates a course, auto-approve it; otherwise leave default (false)
        if (req.user?.role === 'admin') {
            req.body.isAdminApproved = true;
        }

        const course = await Course.create(req.body);
        res.status(201).json({ success: true, data: course });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update course (Enables Admin Approval Toggle / Content updates)
// @route   PUT /api/courses/:id
// @access  Private/Admin
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

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
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
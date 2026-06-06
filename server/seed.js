require('dotenv').config();
const mongoose = require('mongoose');

const Course = require('./models/Course');
const Module = require('./models/Module');
const Lesson = require('./models/Lesson');

const courseData = require('./data/courseData');

const seedData = async () => {
    try {
        // Delete existing data
        await Lesson.deleteMany({});
        await Module.deleteMany({});
        await Course.deleteMany({});

        console.log('Old data cleared.');

        // Loop through each course
        for (const course of courseData) {

            // Create course with updated fields
            const createdCourse = await Course.create({
                title: course.title,
                description: course.description,
                instructor: course.instructor,
                price: course.price,
                category: course.category,
                level: course.level,                 // New Field
                language: course.language,           // New Field
                totalDuration: course.totalDuration, // New Field
                isAdminApproved: course.isAdminApproved, // New Field for Admin Panel
                // Cast to ObjectId explicitly to prevent schema validation casting issues
                createdBy: new mongoose.Types.ObjectId('6a1fd57fc298d9d4889214e8')
            });

            // Loop through modules
            for (const module of course.modules) {

                const createdModule = await Module.create({
                    title: module.title,
                    order: module.order,
                    course: createdCourse._id
                });

                // Loop through lessons
                for (const lesson of module.lessons) {
                    await Lesson.create({
                        title: lesson.title,
                        order: lesson.order,
                        duration: lesson.duration, // New Field
                        videoUrl: lesson.videoUrl,
                        module: createdModule._id
                    });
                }
            }
        }

        console.log('Database seeded successfully with new course schemas!');

    } catch (error) {
        console.error('Seeding failed:', error);
        throw error; // Propagate up to disconnect cleanly in the catch block below
    }
};

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('MongoDB connected');
        await seedData();
        console.log('Finished seeding.');
    })
    .catch(err => {
        console.error('Database operations error:', err);
    })
    .finally(async () => {
        // Ensure the connection closes gracefully rather than a hard exit
        await mongoose.disconnect();
        console.log('MongoDB disconnected.');
        process.exit(0);
    });
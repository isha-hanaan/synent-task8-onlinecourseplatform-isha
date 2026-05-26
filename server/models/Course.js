const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
    title: { type: String, required: true },
    videoUrl: { type: String, required: true }, // URL to hosted video (Vimeo/AWS S3/YouTube)
    duration: { type: String }, // e.g., "12:45"
    isFreePreview: { type: Boolean, default: false } // Allows students to sample a lesson before buying
});

const ModuleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    lessons: [LessonSchema] // Embedding lessons inside modules
});

const CourseSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    thumbnail: { type: String }, // URL of the course banner image
    category: { type: String, required: true },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // References the Admin user
    modules: [ModuleSchema], // Embedding modules inside the course
}, { timestamps: true });

module.exports = mongoose.model('Course', CourseSchema);
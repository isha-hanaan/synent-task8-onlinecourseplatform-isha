const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a course title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    instructor: {
        type: String,
        required: [true, 'Please add an instructor name']
    },
    price: {
        type: Number,
        required: [true, 'Please add a course price'],
        default: 0
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
        enum: [
            'Web Development',
            'Backend Development',
            'Data Science',
            'UI/UX Design',
            'Design',
            'Mobile Development',
            'Cybersecurity',
            'Other'
        ]
    },
    level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: 'Beginner'
    },
    language: {
        type: String,
        default: 'English'
    },
    totalDuration: {
        type: String,
        default: '0m'
    },
    thumbnail: {
        type: String,
        default: 'no-photo.jpg'
    },
    isAdminApproved: {
        type: Boolean,
        default: false 
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

CourseSchema.virtual('courseModules', {
    ref: 'Module',
    localField: '_id',
    foreignField: 'course',
    justOne: false
});

CourseSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    try {
        const relatedModules = await mongoose.model('Module').find({ course: this._id }).select('_id');
        const moduleIds = relatedModules.map(mod => mod._id);

        if (moduleIds.length > 0) {
            await mongoose.model('Lesson').deleteMany({ module: { $in: moduleIds } });
            await mongoose.model('Module').deleteMany({ course: this._id });
        }
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('Course', CourseSchema);
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
    isVerified: { type: Boolean, default: false },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
}, { timestamps: true });

// Encrypt password before saving - Cleaned up to safely use async/await without next()
UserSchema.pre('save', async function () {
    // Only hash the password if it has actually changed (or is new)
    if (!this.isModified('password')) {
        return; // Safely exit the hook without invoking an undefined function
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
        throw error; // Mongoose will automatically catch this error and reject the save operation
    }
});

// Helper method to compare passwords
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
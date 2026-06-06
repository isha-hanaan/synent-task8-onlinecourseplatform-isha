const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const { validationResult } = require('express-validator');

// Helper to generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

// @desc    Register User & Send Verification Email
const register = async (req, res) => {
    const { name, email, password, role } = req.body;
    console.log("1. Register route hit. Body data:", { name, email, role });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("Validation failed:", errors.array());
        return res.status(400).json({
            message: errors.array().map(err => err.msg).join(', ')
        });
    }

    let createdUser = null;

    try {
        console.log("2. Checking if user exists...");
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        console.log("3. Creating verification token and database user...");
        const verificationToken = crypto.randomBytes(20).toString('hex');

        // Allow explicitly registering as admin if configured, default safely to student
        const userRole = role && ['student', 'admin'].includes(role) ? role : 'student';

        user = await User.create({
            name,
            email,
            password,
            role: userRole,
            verificationToken
        });
        createdUser = user; // Track instance to delete if mail delivery crashes
        console.log("4. User created successfully in DB:", user._id);

        const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
        console.log("5. Attempting to send email via sendEmail utility...");

        await sendEmail({
            email: user.email,
            subject: 'ZenithAcad - Email Verification',
            message: `Welcome to ZenithAcad! Please verify your email by clicking: \n\n ${verificationUrl}`
        });
        console.log("6. Email sent successfully!");

        res.status(201).json({ message: 'Registration successful! Please check your email to verify your account.' });
    } catch (error) {
        console.error("🔴 REGISTRATION CRASHED! Error details:", error);

        // Clean up unverified dangling database user records if the mailing system crashes
        if (createdUser) {
            await User.findByIdAndDelete(createdUser._id);
            console.log("🧹 Cleaned up user due to mail delivery failure.");
        }

        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify Email Token
const verifyEmail = async (req, res) => {
    try {
        const user = await User.findOne({ verificationToken: req.params.token });
        if (!user) return res.status(400).json({ message: 'Invalid or expired verification token' });

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();

        res.status(200).json({ message: 'Email verified successfully! You can now log in.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Login User
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email }).select('+password'); // Ensure password field is explicitly selected if omitted by default
        if (!user) return res.status(400).json({ message: 'Invalid Credentials' });
        if (!user.isVerified) return res.status(401).json({ message: 'Please verify your email first.' });

        const isMatch = await user.matchPassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });

        res.json({
            token: generateToken(user._id),
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Forgot Password - Send Reset Token
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
        await user.save();

        const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

        await sendEmail({
            email: user.email,
            subject: 'ZenithAcad - Password Reset Request',
            message: `You requested a password reset. Click this link to reset: \n\n ${resetUrl}`
        });

        res.status(200).json({ message: 'Password reset link sent to your email.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reset Password
const resetPassword = async (req, res) => {
    try {
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password reset successful'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    register,
    verifyEmail,
    login,
    forgotPassword,
    resetPassword
};
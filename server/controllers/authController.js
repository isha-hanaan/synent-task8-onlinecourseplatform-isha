/* server/controllers/authController.js */

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const { validationResult } = require('express-validator');

// Helper to generate JWT with embedded access claims
const generateToken = (id, role) => {
    // FIXED: Embedded role claims into payload to reduce heavy database query lookups inside auth middleware
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

// @desc    Register User & Send Verification Email
const register = async (req, res) => {
    const { name, email, password, role } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: errors.array().map(err => err.msg).join(', ')
        });
    }

    let createdUser = null;

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        const rawToken = crypto.randomBytes(20).toString('hex');
        const verificationToken = crypto.createHash('sha256').update(rawToken).digest('hex');

        const userRole = role && ['student', 'admin'].includes(role) ? role : 'student';

        user = await User.create({
            name,
            email,
            password,
            role: userRole,
            verificationToken
        });
        createdUser = user;

        const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${rawToken}`;

        await sendEmail({
            email: user.email,
            subject: 'ZenithAcad - Email Verification',
            message: `Welcome to ZenithAcad! Please verify your email by clicking: \n\n ${verificationUrl}`
        });

        res.status(201).json({ message: 'Registration successful! Please check your email to verify your account.' });
    } catch (error) {
        console.error("🔴 REGISTRATION CRASHED! Error details:", error);

        // FIXED: Solidified data cleanup to drop partially written profiles if email dispatch throws
        if (createdUser && createdUser._id) {
            await User.deleteOne({ _id: createdUser._id });
        }

        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify Email Token
const verifyEmail = async (req, res) => {

    try {
        const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');


        const user = await User.findOne({ verificationToken: hashedToken });


        if (!user) return res.status(200).json({
            success: true,
            message: 'Email already verified.'
        });

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
        const user = await User.findOne({ email }).select('+password');
        if (!user) return res.status(400).json({ message: 'Invalid Credentials' });
        if (!user.isVerified) return res.status(401).json({ message: 'Please verify your email first.' });

        const isMatch = await user.matchPassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });

        res.json({
            token: generateToken(user._id, user.role), // FIXED: Passing user role into the token signature
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
            return res.status(200).json({ message: 'If that email exists, a password reset link has been sent.' });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();

        const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

        await sendEmail({
            email: user.email,
            subject: 'ZenithAcad - Password Reset Request',
            message: `You requested a password reset. Click this link to reset: \n\n ${resetUrl}`
        });

        res.status(200).json({ message: 'If that email exists, a password reset link has been sent.' });
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

// @desc    Get All Users (Admin)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");

        res.status(200).json({
            success: true,
            count: users.length,
            users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    register,
    verifyEmail,
    login,
    forgotPassword,
    resetPassword,
    getAllUsers
};
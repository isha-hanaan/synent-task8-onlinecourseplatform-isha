/* server/controllers/authController.js */

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const { validationResult } = require('express-validator');

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

const register = async (req, res) => {
    const { name, email, password } = req.body;

    const normalizedEmail = email.trim().toLowerCase();

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: errors.array().map(err => err.msg).join(', ')
        });
    }

    let createdUser = null;

    try {
        let user = await User.findOne({
            email: normalizedEmail
        });
        if (user) return res.status(400).json({ message: 'An account with this email already exists.' });

        const rawToken = crypto.randomBytes(20).toString('hex');

        const verificationToken = crypto
            .createHash('sha256')
            .update(rawToken)
            .digest('hex');

        user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password,
            role: 'student',
            verificationToken,
            verificationTokenExpires:
                Date.now() + 10 * 60 * 1000
        });

        createdUser = user;

        const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${rawToken}`;

        await sendEmail({
            email: user.email,
            subject: 'ZenithAcad - Email Verification',
            message: `
Welcome to ZenithAcad!

Please verify your email by clicking the link below:

${verificationUrl}

This verification link expires in 10 minutes.

If you didn't create an account, you can safely ignore this email.
`        });

        res.status(201).json({ message: 'Registration successful! Please check your email to verify your account.' });
    } catch (error) {
        console.error("Registration Error:", error);

        try {
            if (createdUser?._id) {
                await User.deleteOne({
                    _id: createdUser._id
                });
            }
        } catch (cleanupError) {
            console.error(
                "Cleanup failed:",
                cleanupError.message
            );
        }
        res.status(500).json({
            message: "Registration failed. Please try again."
        });
    }
};

const verifyEmail = async (req, res) => {

    try {
        const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');


        const user = await User.findOne({
            verificationToken: hashedToken,
            verificationTokenExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired verification link."
            });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        await user.save({
            validateBeforeSave: false
        });
        res.status(200).json({ message: 'Email verified successfully! You can now log in.' });
    } catch (error) {
        console.error("Email verification error:", error);

        res.status(500).json({
            message: "Something went wrong. Please try again."
        });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required."
        });
    }

    const normalizedEmail =
        email.trim().toLowerCase();

    try {
        const user = await User.findOne({
            email: normalizedEmail
        }).select('+password');
        if (!user) return res.status(400).json({ message: 'Invalid Credentials' });
        if (!user.isVerified) return res.status(401).json({ message: 'Please verify your email before logging in.' });

        const isMatch = await user.matchPassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });

        res.json({
            token: generateToken(user._id, user.role), 
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal server error."
        });
    }
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            message: "Email is required."
        });
    }

    const normalizedEmail =
        email.trim().toLowerCase();

    try {
        const user = await User.findOne({
            email: normalizedEmail
        });

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
            message: `
You requested a password reset.

Click the link below to create a new password:

${resetUrl}

This link expires in 10 minutes.

If you didn't request a password reset, you can safely ignore this email.
`        });

        res.status(200).json({ message: 'If that email exists, a password reset link has been sent.' });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal server error."
        });
    }
};

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
        user.isVerified = true;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password reset successful'
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal server error."
        });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");

        res.status(200).json({
            success: true,
            count: users.length,
            users
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal server error."
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
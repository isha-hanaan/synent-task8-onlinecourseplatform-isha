const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT, 10) || 587, // Ensured port parses cleanly into a number
            secure: process.env.EMAIL_SECURE === 'true', // Supports true/false flags for SSL/TLS setups
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"ZenithAcad Support" <${process.env.EMAIL_FROM || 'no-reply@zenithacad.com'}>`,
            to: options.email,
            subject: options.subject,
            text: options.message,
            html: options.html || undefined, // Added support for optional responsive HTML layouts
        };

        await transporter.sendMail(mailOptions);
        return true; // Return true to let the calling controller know delivery succeeded
    } catch (error) {
        // Log the structural error diagnostic metrics clearly for admins
        console.error('⚠️ Nodemailer Transport Layer Delivery Failure:', error.message);

        return false; // Return false so controllers can gracefully inform users that delivery failed
    }
};

module.exports = sendEmail;
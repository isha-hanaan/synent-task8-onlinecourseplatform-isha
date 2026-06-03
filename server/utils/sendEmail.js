const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `ZenithAcad <${process.env.EMAIL_FROM}>`,
            to: options.email,
            subject: options.subject,
            text: options.message,
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        // Log the error but don't throw - email is nice to have but not required
        console.warn('Email sending failed:', error.message);
        // Don't rethrow - allow the application to continue
    }
};

module.exports = sendEmail;
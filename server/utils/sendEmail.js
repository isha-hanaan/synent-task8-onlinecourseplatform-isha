const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT, 10) || 587,
            secure: process.env.EMAIL_SECURE === 'true',
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
            html: options.html || undefined,
        };

        const info = await transporter.sendMail(mailOptions);

        if (process.env.NODE_ENV === 'development') {
        }

        return info;
    } catch (error) {
        console.error('⚠️ Nodemailer Transport Layer Delivery Failure:', error.message);

        error.statusCode = 503; // Service Unavailable
        error.message = `Email notification delivery failed: ${error.message}`;
        throw error;
    }
};

module.exports = sendEmail;
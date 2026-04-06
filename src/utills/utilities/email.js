const nodemailer = require('nodemailer');
const { NODE_MAILER_EMAIL, NODE_MAILER_EMAIL_PASSKEY } = require('../../../config/envExports');

const sendEmail = async (id, otp) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: NODE_MAILER_EMAIL,
            pass: NODE_MAILER_EMAIL_PASSKEY,
        },
    });



    await transporter.sendMail({
        from: `"Books project" <${NODE_MAILER_EMAIL}>`,
        to: id,
        subject: "Your OTP for Books project",
        html: `<b>Your OTP to verify your email is ${otp}</b>`,
    });
};

module.exports = sendEmail;

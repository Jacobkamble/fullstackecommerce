const nodemailer = require("nodemailer");

const sendEmail = async ({ email, subject, message }) => {

    const transporter = nodemailer.createTransport({
        service: process.env.SMPT_SERVICE,
        host: process.env.SMPT_HOST,
        port: process.env.SMPT_PORT,
        secure: true,
        auth: {
            user: process.env.SMPT_MAIL,
            pass: process.env.SMPT_PASSWORD,
        }
    })
    const mailOptions = {
        from: process.env.SMPT_MAIL,
        to: email,
        subject: subject,
        text: message
    }

    await transporter.sendMail(mailOptions)
}
module.exports = sendEmail
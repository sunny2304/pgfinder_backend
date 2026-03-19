const nodemailer = require("nodemailer")
require("dotenv").config()

const mailSend = async (to, subject, htmlContent) => {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.USER_PASSWORD
        }
    })

    await transporter.sendMail({
        from: "contact.pgfinder@gmail.com",
        to: to,
        subject: subject,
        html: htmlContent
    })

}

module.exports = mailSend
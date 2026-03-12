const nodemailer = require("nodemailer")

const mailSend = async (to, subject, htmlContent) => {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "contact.pgfinder@gmail.com",
            pass: "unqj yyot iqow ijcu"
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
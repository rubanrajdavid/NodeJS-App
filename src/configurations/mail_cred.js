require('dotenv').config()
const mail_settings = {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE,
    auth: {
        user: process.env.SMTP_EMAIL_ID,
        pass: process.env.SMTP_PASSWORD,
    }
}
const mail_name = process.env.SMTP_USER_NAME

module.exports = {
    mail_settings,
    mail_name
}
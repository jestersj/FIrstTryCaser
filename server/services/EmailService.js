const nodemailer = require('nodemailer')
class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS
            },
        })
    }

    async sendActivationMail(to, token) {
        const link = 'http://localhost:4000/api/user/activate/' + token
        await this.transporter.sendMail({
            from: `"Casers" ${process.env.EMAIL}`,
            to: 'valuevmp@yandex.ru',
            subject: 'Активация аккаунта Casers',
            text: '',
            html: `
                <div>
                    <h1>Для активации перейдите по ссылке</h1>
                    <a href="${link}">${link}</a>
                </div>
            `
        })
    }
}

module.exports = new EmailService()
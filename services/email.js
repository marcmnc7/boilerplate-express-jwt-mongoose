const nodemailer = require('nodemailer')

async function sendMail (subject, text, recipient) {
  // See emails in ethereal.email
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      type: 'login',
      user: process.env.EMAIL_ACCOUNT,
      pass: process.env.EMAIL_PASSWORD
    },
  })

  return await transporter.sendMail({
    from: `"${process.env.BUSINESS_NAME}" <${process.env.EMAIL_ACCOUNT}>`,
    to: recipient,
    subject,
    text,
  })
}

module.exports = {
  sendMail
}
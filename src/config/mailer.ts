import nodemailer from 'nodemailer';

const verify_transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_VERIFY_USER,
    pass: process.env.SMTP_VERIFY_PASS
  }
});

export default verify_transporter;

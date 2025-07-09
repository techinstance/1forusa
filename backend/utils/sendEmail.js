// For now, we're using a mock email function
// const nodemailer = require('nodemailer');
// You can uncomment and configure the transporter when you set up real email service
// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST,
//   port: process.env.EMAIL_PORT,
//   secure: false,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

const sendEmail = async (to, subject, html) => {
  console.log(`📧 MOCK EMAIL\nTo: ${to}\nSubject: ${subject}\nBody:\n${html}`);
  // For production, replace the console.log above with:
  // return transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, html });
};

module.exports = sendEmail;

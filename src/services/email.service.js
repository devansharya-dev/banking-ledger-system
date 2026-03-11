const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"backend-leadure" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
}; 

async function sendTestEmail(userEmail,name) {

    const subject  = 'Welcome to backend-leadure!';
    const text = `Hello ${name},\n\nWelcome to backend-leadure! We're excited to have you on board. If you have any questions or need assistance, feel free to reach out.\n\nBest regards,\nThe backend-leadure Team`;
    const html = `<p>Hello ${name},</p><p>Welcome to backend-leadure! We're excited to have you on board. If you have any questions or need assistance, feel free to reach out.</p><p>Best regards,<br>The backend-leadure Team</p>`;
   
    await sendEmail(userEmail, subject, text, html);
}
async function sendTransactionEmail(userEmail, name, amount, fromAccount, toAccount) {

    const subject  = 'Transaction successful!';
    const text = `Hello ${name},\n\nA transaction of $${amount} has been made from account ${fromAccount} to account ${toAccount}. If you did not authorize this transaction, please contact support immediately.\n\nBest regards,\nThe backend-leadure Team`;
    const html = `<p>Hello ${name},</p><p>A transaction of $${amount} has been made from account ${fromAccount} to account ${toAccount}. If you did not authorize this transaction, please contact support immediately.</p><p>Best regards,<br>The backend-leadure Team</p>`;
   
    await sendEmail(userEmail, subject, text, html);
}

async function sendFailedTransactionEmail(userEmail, name, amount, fromAccount, toAccount) {

    const subject  = 'Transaction failed!';
    const text = `Hello ${name},\n\nA transaction of $${amount} from account ${fromAccount} to account ${toAccount} has failed. If you did not authorize this transaction, please contact support immediately.\n\nBest regards,\nThe backend-leadure Team`;
    const html = `<p>Hello ${name},</p><p>A transaction of $${amount} from account ${fromAccount} to account ${toAccount} has failed. If you did not authorize this transaction, please contact support immediately.</p><p>Best regards,<br>The backend-leadure Team</p>`;
   
    await sendEmail(userEmail, subject, text, html);
}

module.exports = {
    sendTestEmail,
    sendTransactionEmail,
    sendFailedTransactionEmail
};
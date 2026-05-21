const nodemailer = require('nodemailer');

let transporter;

const initMailer = async () => {
  try {
    let testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, 
      auth: {
        user: testAccount.user, 
        pass: testAccount.pass, 
      },
    });
    console.log(`[Mailer] Ethereal Email initialized. Emails will be logged with a Preview URL.`);
  } catch (error) {
    console.error("[Mailer] Failed to initialize Ethereal Email", error);
  }
};

initMailer();

const sendMail = async (to, subject, html) => {
  if (!transporter) return;
  
  try {
    let info = await transporter.sendMail({
      from: '"Bus Pass System" <noreply@buspass.com>',
      to: to,
      subject: subject,
      html: html,
    });
    
    console.log("-----------------------------------------");
    console.log("📧 Email sent to: %s", to);
    console.log("📝 Subject: %s", subject);
    console.log("🔗 Preview URL: %s", nodemailer.getTestMessageUrl(info));
    console.log("-----------------------------------------");
  } catch(err) {
    console.error("Error sending email", err);
  }
}

module.exports = { sendMail };

const nodemailer = require("nodemailer");
const { transporter } = require("./mailTrapConfig.js");
const {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
} = require("./emailTemplates.js");

const sendVerificationEmail = async (email, verificationToken) => {
  const htmlContent = VERIFICATION_EMAIL_TEMPLATE.replace(
    "{verificationCode}",
    verificationToken
  );

  const mailOptions = {
    from: 'abalaji378@gmail.com', 
    to: email,
    subject: "Verify your email",
    html: htmlContent,
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("Verification email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error(`Error sending verification email: ${error}`);
  }
};

const sendWelcomeEmail = async (email, name) => {
  // Example welcome email; customize as needed
  const htmlContent = `<h1>Welcome, ${name}!</h1><p>Thank you for joining our app.</p>`;

  const mailOptions = {
    from: '"Your App" <no-reply@yourapp.com>',
    to: email,
    subject: "Welcome to Your App",
    html: htmlContent,
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("Welcome email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending welcome email:", error);
    throw new Error(`Error sending welcome email: ${error}`);
  }
};

const sendPasswordResetEmail = async (email, resetURL) => {
  const htmlContent = PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL);

  const mailOptions = {
    from: '"Your App" <no-reply@yourapp.com>',
    to: email,
    subject: "Reset your password",
    html: htmlContent,
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("Password reset email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error(`Error sending password reset email: ${error}`);
  }
};

const sendResetSuccessEmail = async (email) => {
  const htmlContent = PASSWORD_RESET_SUCCESS_TEMPLATE;

  const mailOptions = {
    from: '"Your App" <no-reply@yourapp.com>',
    to: email,
    subject: "Password Reset Successful",
    html: htmlContent,
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("Password reset success email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending password reset success email:", error);
    throw new Error(`Error sending password reset success email: ${error}`);
  }
};

module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
};

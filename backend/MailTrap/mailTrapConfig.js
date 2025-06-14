const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

// Create a transporter using Gmail's SMTP server
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,       // Your Gmail address
    pass: process.env.GMAIL_PASSWORD,   // Your Gmail app password
  },
});

// Optional: Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Error with Gmail transporter:", error);
  } else {
    console.log("Gmail transporter is ready to send messages");
  }
});

module.exports = {transporter};

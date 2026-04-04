const nodemailer = require("nodemailer");

const requiredEnvVars = ["EMAIL_USER", "EMAIL_PASS"];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar] || !process.env[envVar].trim()) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports = transporter;

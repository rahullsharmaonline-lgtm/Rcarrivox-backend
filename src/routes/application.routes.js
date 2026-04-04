const express = require("express");
const fs = require("fs/promises");

const upload = require("../middleware/upload.middleware");
const validateApplication = require("../middleware/validation.middleware");
const transporter = require("../config/mail.config");

const router = express.Router();

const cleanupFile = async (file) => {
  if (!file || !file.path) {
    return;
  }

  try {
    await fs.unlink(file.path);
  } catch (_error) {
    // Best effort cleanup to avoid leaking uploaded files on failures.
  }
};

router.get("/test", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "API working.",
  });
});

router.post("/apply", upload.single("resume"), validateApplication, async (req, res, next) => {
  try {
    const { name, email, phone, role } = req.body;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "New Job Application",
      text: `New Candidate Applied:

Name: ${name}
Email: ${email}
Phone: ${phone}
Role: ${role}`,
      attachments: [
        {
          filename: req.file.originalname,
          path: req.file.path,
        },
      ],
    });

    return res.status(200).json({
      success: true,
      message: "Application submitted successfully.",
    });
  } catch (error) {
    await cleanupFile(req.file);
    return next(error);
  }
});

module.exports = router;

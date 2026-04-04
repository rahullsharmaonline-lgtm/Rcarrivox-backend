const fs = require("fs/promises");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\+91\d{10}$/;

const cleanupFile = async (file) => {
  if (!file || !file.path) {
    return;
  }

  try {
    await fs.unlink(file.path);
  } catch (_error) {
    // Best effort cleanup; preserve the original validation error.
  }
};

const createValidationError = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const validateApplication = async (req, _res, next) => {
  try {
    const fields = ["name", "email", "phone", "role"];

    for (const field of fields) {
      const value = req.body[field];

      if (typeof value !== "string" || !value.trim()) {
        throw createValidationError(`${field} is required.`);
      }

      req.body[field] = value.trim();
    }

    if (!emailPattern.test(req.body.email)) {
      throw createValidationError("Email format is invalid.");
    }

    if (!phonePattern.test(req.body.phone)) {
      throw createValidationError("Phone must be in +91XXXXXXXXXX format.");
    }

    if (!req.file) {
      throw createValidationError("Resume PDF is required.");
    }

    next();
  } catch (error) {
    await cleanupFile(req.file);
    next(error);
  }
};

module.exports = validateApplication;

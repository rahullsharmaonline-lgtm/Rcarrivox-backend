const multer = require("multer");

const errorHandler = (err, _req, res, _next) => {
  if (err instanceof multer.MulterError) {
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? "Resume file size must be 5MB or smaller."
        : err.message;

    return res.status(400).json({
      success: false,
      message,
    });
  }

  const statusCode = err.statusCode || 500;
  const message =
    statusCode >= 500 ? "Internal server error." : err.message || "Request failed.";

  return res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;

const fs = require("fs");
const path = require("path");
const multer = require("multer");

const uploadDirectory = path.resolve(process.cwd(), "uploads");

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

const sanitizeFilename = (filename) =>
  path.basename(filename).replace(/[^a-zA-Z0-9._-]/g, "_");

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${sanitizeFilename(file.originalname)}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const isPdfMimeType = file.mimetype === "application/pdf";
  const isPdfExtension = path.extname(file.originalname).toLowerCase() === ".pdf";

  if (!isPdfMimeType || !isPdfExtension) {
    const error = new Error("Only PDF resume files are allowed.");
    error.statusCode = 400;
    return cb(error);
  }

  return cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = upload;

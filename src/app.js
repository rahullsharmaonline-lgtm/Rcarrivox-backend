const express = require("express");
const cors = require("cors");

const applicationRoutes = require("./routes/application.routes");
const errorHandler = require("./middleware/error.middleware");

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      const error = new Error("CORS origin is not allowed.");
      error.statusCode = 403;
      return callback(error);
    },
    methods: ["GET", "POST"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", applicationRoutes);
app.use(errorHandler);

module.exports = app;

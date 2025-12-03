// src/app.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const authRoutes = require("./src/routes/authRoutes");

const app = express();

// ----- MIDDLEWARE -----
app.use(cors());
app.use(express.json());
app.use(helmet());

// ----- ROUTES -----
app.use("/api/auth", authRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ success: true, message: "API running..." });
});

module.exports = app;

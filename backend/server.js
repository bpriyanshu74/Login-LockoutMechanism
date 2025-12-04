// src/server.js
const mongoose = require("mongoose");
const app = require("./app");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

// ----- DATABASE CONNECTION -----
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    // ----- START SERVER -----
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB Connection Error:", error);
    process.exit(1);
  });

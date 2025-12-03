const mongoose = require("mongoose");

const failedAttemptSchema = new mongoose.Schema({
  email: {
    type: String,
  },

  ipAddress: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300,
  },

  lockUntil: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model("FailedAttempt", failedAttemptSchema);

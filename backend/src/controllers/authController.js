const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const {
  recordFailedAttempt,
  countUserAttempts,
  countIpAttempts,
  applyUserLock,
  applyIpLock,
  resetUserAttempts,
} = require("../services/lockoutService");

// Signup Controller (for creating test users)

exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "User already exists.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await User.create({
      email,
      passwordHash,
    });

    res.json({
      success: true,
      message: "User registered successfully.",
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// Login Controller

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;

    // Fetch user
    const user = await User.findOne({ email });

    if (!user) {
      // Still record attempt even for non-existing users (prevent username probing)
      await recordFailedAttempt(null, ipAddress);
      return res.status(400).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // --- Password Verification ---
    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      // Record failure
      await recordFailedAttempt(email, ipAddress);

      // Count recent user attempts
      const userAttempts = await countUserAttempts(email);

      if (userAttempts >= process.env.USER_LOCK_THRESHOLD) {
        await applyUserLock(email);
        return res.status(423).json({
          success: false,
          message:
            "Account temporarily suspended due to too many failed attempts.",
        });
      }

      // Count IP attempts
      const ipAttempts = await countIpAttempts(ipAddress);

      if (ipAttempts >= process.env.IP_LOCK_THRESHOLD) {
        await applyIpLock(ipAddress);
        return res.status(429).json({
          success: false,
          message:
            "IP temporarily blocked due to excessive failed login attempts.",
        });
      }

      return res.status(400).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // If correct password → reset counters
    await resetUserAttempts(email);

    // Generate token
    const token = jwt.sign({ email }, process.env.JWT_SECRET || "secret", {
      expiresIn: "1h",
    });

    res.json({
      success: true,
      message: "Login successful.",
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

const express = require("express");
const router = express.Router();

const { signup, login } = require("../controllers/authController");

// Middlewares
const checkIpBlock = require("../middleware/checkIpBlock");
const checkUserBlock = require("../middleware/checkUserBlock");

// User Signup
router.post("/signup", signup);

/**
 * -----------------------------------------------------
 * Login Route
 * Apply Middlewares:
 *  1. Check IP Block
 *  2. Check User Block (requires email)
 * -----------------------------------------------------
 */
router.post("/login", checkIpBlock, checkUserBlock, login);

module.exports = router;

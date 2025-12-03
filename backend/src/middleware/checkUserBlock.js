const { isUserLocked } = require("../services/lockoutService");

module.exports = async function checkUserBlock(req, res, next) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required.",
    });
  }

  const locked = await isUserLocked(email);

  if (locked) {
    return res.status(423).json({
      success: false,
      message: "Account temporarily suspended due to too many failed attempts.",
    });
  }

  next();
};

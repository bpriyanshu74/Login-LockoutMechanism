const { isIpBlocked } = require("../services/lockoutService");

module.exports = async function checkIpBlock(req, res, next) {
  const ipAddress = req.ip || req.connection.remoteAddress;

  const blocked = await isIpBlocked(ipAddress);

  if (blocked) {
    return res.status(429).json({
      success: false,
      message: "IP temporarily blocked due to excessive failed login attempts.",
    });
  }

  next();
};

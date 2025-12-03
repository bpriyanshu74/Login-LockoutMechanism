const User = require("../models/User");
const FailedAttempt = require("../models/FailedAttempt");

const USER_THRESHOLD = Number(process.env.USER_LOCK_THRESHOLD) || 5;
const IP_THRESHOLD = Number(process.env.IP_LOCK_THRESHOLD) || 100;
const LOCKOUT_DURATION = Number(process.env.LOCKOUT_DURATION_MINUTES) || 15;

// Record Failed Login Attempt (User + IP)

async function recordFailedAttempt(email, ipAddress) {
  await FailedAttempt.create({ email, ipAddress });

  // Increment user's immediate failed count
  if (email) {
    await User.updateOne({ email }, { $inc: { failedLoginCount: 1 } });
  }
}

// Count attempts in last 5 minutes (Mongo TTL handles deletion)

async function countUserAttempts(email) {
  return FailedAttempt.countDocuments({ email });
}

async function countIpAttempts(ipAddress) {
  return FailedAttempt.countDocuments({ ipAddress });
}

// User Lock Logic

async function isUserLocked(email) {
  const user = await User.findOne({ email });

  if (!user) return false;

  if (user.lockUntil && user.lockUntil > new Date()) {
    return true;
  }

  return false;
}

async function applyUserLock(email) {
  const lockUntil = new Date(Date.now() + LOCKOUT_DURATION * 60 * 1000);

  await User.updateOne(
    { email },
    {
      lockUntil,
      failedLoginCount: 0, // reset counter after lock
    }
  );

  return lockUntil;
}

// IP Lock Logic

async function isIpBlocked(ipAddress) {
  const doc = await FailedAttempt.findOne({
    ipAddress,
    lockUntil: { $exists: true, $gt: new Date() },
  });

  return !!doc;
}

async function applyIpLock(ipAddress) {
  const lockUntil = new Date(Date.now() + LOCKOUT_DURATION * 60 * 1000);

  // Store a separate record marking IP lock
  await FailedAttempt.create({
    ipAddress,
    createdAt: new Date(),
    lockUntil,
  });

  return lockUntil;
}

// Reset User Attempts on Successful Login

async function resetUserAttempts(email) {
  await User.updateOne(
    { email },
    {
      failedLoginCount: 0,
      lockUntil: null,
    }
  );
}

module.exports = {
  recordFailedAttempt,
  countUserAttempts,
  countIpAttempts,
  isUserLocked,
  applyUserLock,
  isIpBlocked,
  applyIpLock,
  resetUserAttempts,
};

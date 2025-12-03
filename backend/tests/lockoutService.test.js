const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let User;
let FailedAttempt;

let recordFailedAttempt,
  countUserAttempts,
  countIpAttempts,
  applyUserLock,
  isUserLocked,
  applyIpLock,
  isIpBlocked,
  resetUserAttempts;

describe("Brute Force Lockout Logic", () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());

    User = require("../src/models/User");
    FailedAttempt = require("../src/models/FailedAttempt");

    const service = require("../src/services/lockoutService");
    recordFailedAttempt = service.recordFailedAttempt;
    countUserAttempts = service.countUserAttempts;
    countIpAttempts = service.countIpAttempts;
    applyUserLock = service.applyUserLock;
    isUserLocked = service.isUserLocked;
    applyIpLock = service.applyIpLock;
    isIpBlocked = service.isIpBlocked;
    resetUserAttempts = service.resetUserAttempts;
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await FailedAttempt.deleteMany({});
  });

  test("should record a failed attempt for a user", async () => {
    await recordFailedAttempt("user@test.com", "1.1.1.1");
    const count = await countUserAttempts("user@test.com");
    expect(count).toBe(1);
  });

  test("should record a failed attempt for an IP", async () => {
    await recordFailedAttempt(null, "1.1.1.1");
    const count = await countIpAttempts("1.1.1.1");
    expect(count).toBe(1);
  });

  test("should lock user after exceeding threshold", async () => {
    const email = "test@example.com";
    await User.create({ email, passwordHash: "hash" });

    for (let i = 0; i < 5; i++) {
      await recordFailedAttempt(email, "2.2.2.2");
    }

    await applyUserLock(email);
    const locked = await isUserLocked(email);

    expect(locked).toBe(true);
  });

  test("should block IP after exceeding threshold", async () => {
    const ip = "3.3.3.3";

    for (let i = 0; i < 100; i++) {
      await recordFailedAttempt(null, ip);
    }

    await applyIpLock(ip);
    const blocked = await isIpBlocked(ip);

    expect(blocked).toBe(true);
  });

  test("should reset user attempts on success", async () => {
    const email = "reset@test.com";
    await User.create({ email, passwordHash: "hash", failedLoginCount: 3 });

    await resetUserAttempts(email);

    const user = await User.findOne({ email });
    expect(user.failedLoginCount).toBe(0);
    expect(user.lockUntil).toBe(null);
  });
});

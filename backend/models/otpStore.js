// In-memory OTP store — swap for Redis in production
const store = new Map();
const TTL = 5 * 60 * 1000; // 5 minutes

const set = (email, otp) => {
  store.set(email.toLowerCase(), { otp, expiresAt: Date.now() + TTL });
};

const verify = (email, otp) => {
  const key = email.toLowerCase();
  const record = store.get(key);

  if (!record) return { valid: false, reason: "OTP not found or already used" };
  if (Date.now() > record.expiresAt) {
    store.delete(key);
    return { valid: false, reason: "OTP expired" };
  }
  if (record.otp !== otp) return { valid: false, reason: "Invalid OTP" };

  store.delete(key);
  return { valid: true };
};

module.exports = { set, verify };

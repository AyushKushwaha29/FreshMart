import crypto from "crypto";

const hashOtp = (email, otp) => {
  return crypto
    .createHash("sha256")
    .update(`${email.toLowerCase()}:${otp}:${process.env.JWT_SECRET}`)
    .digest("hex");
};

export const issueOtp = async (user) => {
  const otp = String(crypto.randomInt(100000, 999999));
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  user.otp = {
    codeHash: hashOtp(user.email, otp),
    expiresAt,
    attempts: 0,
    lastRequestedAt: new Date()
  };

  await user.save();

  return otp;
};

export const verifyOtp = async (user, otp) => {
  if (!user.otp?.codeHash || !user.otp?.expiresAt) {
    return false;
  }

  if (user.otp.expiresAt.getTime() < Date.now()) {
    return false;
  }

  const isValid = hashOtp(user.email, otp) === user.otp.codeHash;
  user.otp.attempts = (user.otp.attempts || 0) + 1;

  if (isValid) {
    user.otp = undefined;
  }

  await user.save();
  return isValid;
};


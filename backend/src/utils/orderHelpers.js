import crypto from "crypto";

export const buildOrderId = () => {
  const date = new Date();
  const stamp = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  const suffix = crypto.randomInt(10000, 99999);

  return `FM-${stamp}-${suffix}`;
};

export const normalizeMobile = (mobile) => {
  return String(mobile).replace(/\D/g, "").slice(-10);
};

export const formatCurrency = (value) => `₹${Number(value || 0).toFixed(2)}`;


import User from "../models/User.js";

const ensureAdminUser = async () => {
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    return;
  }

  const existingAdmin = await User.findOne({
    email: process.env.ADMIN_EMAIL.toLowerCase(),
    role: "admin"
  });

  if (existingAdmin) {
    return;
  }

  await User.create({
    name: process.env.ADMIN_NAME || "FreshMart Admin",
    email: process.env.ADMIN_EMAIL.toLowerCase(),
    mobile: process.env.ADMIN_MOBILE || "9999999999",
    password: process.env.ADMIN_PASSWORD,
    role: "admin"
  });

  console.log("Default admin user created");
};

export default ensureAdminUser;


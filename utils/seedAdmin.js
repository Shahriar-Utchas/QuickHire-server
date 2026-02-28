// Usage: node utils/seedAdmin.js
// Creates the first admin account if none exists yet.

import environment from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "#models/adminModel.js";

environment.config();

const ADMIN_NAME = "Admin";
const ADMIN_EMAIL = "admin@quickhire.com";
const ADMIN_PASSWORD = "Admin@123";

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const existing = await Admin.findOne({ email: ADMIN_EMAIL });
    if (existing) {
      console.log("Admin already exists — skipping seed.");
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

    const admin = await Admin.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
    });

    console.log(`Admin created: ${admin.email}`);
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
}

seedAdmin();

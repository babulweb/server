
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "../models/AdminModel.js";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGO_URL;

const createAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    const email = "blackcode@blackcode.in";
    const password = "blackcode3690#";

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Admin.create({
      email,
      password: hashedPassword,
    });

    console.log("✅ Admin created successfully");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

createAdmin();

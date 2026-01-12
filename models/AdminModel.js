import mongoose from "mongoose";
import { DateTime } from "../utils/date-time.js";

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: {type: String,default: DateTime}
});

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;

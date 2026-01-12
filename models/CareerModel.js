import mongoose from "mongoose";
import { DateTime } from "../utils/date-time.js";

const careerSchema = new mongoose.Schema(
  {
    fullname: {type: String, required: true, trim: true },
    email: {type: String, required: true, lowercase: true, trim: true},
    phone: {type: String, required: true, trim: true },
    location: {type: String, required: true, trim: true},
    qualification: {type: String, required: true, trim: true},
    position: {type: String, required: true, trim: true},
    summary: {type: String, trim: true},
    cv: {type: String,required: true},
    createdAt: {type: String,default: DateTime}
  },
  { versionKey: false }
);

const Career = mongoose.model("Career", careerSchema);
export default Career;

import mongoose from "mongoose";
import { DateTime } from "../utils/date-time.js";

const callbackSchema = new mongoose.Schema({
    fullname: { type: String, required: true, trim: true },
    email: { type: String, required: true,lowercase: true, trim: true },
    phone: { type: String, required: true,trim: true },
    description: { type: String, trim: true },
    createdAt: { type: String, default: DateTime }
});

const CallRequest = mongoose.model("CallRequest", callbackSchema);
export default CallRequest;


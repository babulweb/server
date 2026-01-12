import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import callRequestRoute from "./routes/callRequestRoute.js";
import careerRoute from "./routes/careerRoute.js";
import adminRoute from "./routes/adminRoute.js";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/admin", adminRoute);
app.use("/api/contact", callRequestRoute);
app.use("/api/careers", careerRoute);
app.use("/uploads", express.static("uploads"));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

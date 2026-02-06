import express from "express";
import nodemailer from "nodemailer";
import Callback from "../models/CallRequestModel.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { fullname, email, phone, description } = req.body;

    if (!fullname || !email || !phone || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // ✅ SAVE TO DB (CORRECT)
    await Callback.create({ fullname, email, phone, description });


    // ✅ 2. Send auto-reply (SAFE)
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      await transporter.sendMail({
        from: `"Blackcode Technology" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Callback Request from Blackcode.",
        text: `Hi ${fullname},

              Thank you for contacting Blackcode.
              We have received your request and our team will get back to you shortly.

              Regards,
              Blackcode
              www.blackcode.in
              ${process.env.EMAIL_USER}`
      });

    } catch (mailErr) {
      console.error("⚠️ Email failed but data saved:", mailErr.message);
      // ❗ DO NOT fail the request
    }

    return res.status(201).json({
      success: true,
      message: "Request submitted successfully"
    });

  } catch (err) {
    console.error("Callback error:", err);

    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email or phone already exists"
      });
    }

    return res.status(500).json({
      success: false,
      message: err.message // TEMP for debugging
    });
  }
});

router.get("/all", adminAuth, async (req, res) => {
  try {
    const data = await Callback.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch data" });
  }
});

/* DELETE BY ID */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await Callback.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Deleted successfully"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Delete failed"
    });
  }
});

export default router;

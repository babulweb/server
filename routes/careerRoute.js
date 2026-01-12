import express from "express";
import nodemailer from "nodemailer";
import multer from "multer";
import fs from "fs";
import path from "path";
import Career from "../models/CareerModel.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

/* ================= MULTER SETUP ================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/cv");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});

/* =================================================
   APPLY FOR CAREER (PUBLIC)
================================================= */
router.post("/", upload.single("cv"), async (req, res) => {
  try {
    const {
      fullname,
      email,
      phone,
      location,
      qualification,
      position,
      summary
    } = req.body;

    if (!fullname || !email || !phone || !location || !qualification || !position) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled"
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "CV upload is required"
      });
    }

    /* ===== SAVE TO DATABASE ===== */
    await Career.create({
      fullname,
      email,
      phone,
      location,
      qualification,
      position,
      summary,
      cv: req.file.filename
    });

    /* ===== AUTO EMAIL REPLY ===== */
    try {
      const transporter = nodemailer.createTransport({
        host: "localhost",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_HR,
          pass: process.env.EMAIL_PASS
        },
        tls: { rejectUnauthorized: false }
      });

      await transporter.sendMail({
        from: `"Blackcode Technology" <${process.env.EMAIL_HR}>`,
        to: email,
        subject: "Career Application Received – Blackcode",
        text: `Hi ${fullname},

Thank you for applying to Blackcode Technology.
We have received your application for the position of ${position}.

Our HR team will review your profile and contact you if shortlisted.

Regards,
Blackcode Technology
${process.env.EMAIL_HR}`
      });

    } catch (mailErr) {
      console.error("⚠️ Email failed but data saved:", mailErr.message);
    }

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully"
    });

  } catch (err) {
    console.error("Career API error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

/* =================================================
   GET ALL CAREER APPLICATIONS (ADMIN)
================================================= */
router.get("/all", adminAuth, async (req, res) => {
  try {
    const data = await Career.find().sort({ _id: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch data" });
  }
});

/* =================================================
   DELETE CAREER + DELETE CV FILE (ADMIN)
================================================= */
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Find record
    const career = await Career.findById(id);

    if (!career) {
      return res.status(404).json({
        success: false,
        message: "Record not found"
      });
    }

    // 2️⃣ Delete CV file from server
    if (career.cv) {
      const filePath = path.join("uploads", "cv", career.cv);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // 3️⃣ Delete database record
    await Career.findByIdAndDelete(id);

    return res.json({
      success: true,
      message: "Application and CV deleted successfully"
    });

  } catch (err) {
    console.error("Delete career error:", err);
    return res.status(500).json({
      success: false,
      message: "Delete failed"
    });
  }
});

export default router;

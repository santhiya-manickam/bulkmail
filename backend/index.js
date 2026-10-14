const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

require("dotenv").config({
  path: require("path").join(__dirname, ".env"),
});

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.get("/", (req, res) => {
  res.send("Backend is working!");
});

app.post("/send-email", async (req, res) => {
  const { emails, subject, message } = req.body;

  if (
    typeof emails !== "string" ||
    typeof subject !== "string" ||
    typeof message !== "string" ||
    !subject.trim() ||
    !message.trim()
  ) {
    return res.status(400).json({
      message: "Please fill all fields.",
    });
  }

  const recipients = [...new Set(
    emails.split(",").map((email) => email.trim()).filter(Boolean)
  )];

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (
    recipients.length === 0 ||
    recipients.some((email) => !validEmail.test(email))
  ) {
    return res.status(400).json({
      message: "Please enter valid email addresses.",
    });
  }

  try {
    const result = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      bcc: recipients,
      subject: subject.trim(),
      text: message,
    });

    res.json({
      message: `Mail server accepted ${result.accepted.length} recipient(s).`,
    });
  } catch (error) {
    console.error("Email error:", error.code);
    res.status(500).json({
      message: "Email failed. Check your email settings.",
    });
  }
});

app.listen(5000, "127.0.0.1", () => {
  console.log("Server started on port 5000");
});
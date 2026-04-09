import express from "express";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Route for Contact Form
  app.post("/api/contact", async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    try {
      const transporter = nodemailer.createTransport({
        service: "gmail", // You can change this to your preferred service
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: "rforson418@gmail.com", // User's email from runtime context
        subject: `New Portfolio Message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        replyTo: email,
      };

      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn("Email credentials not set. Logging message to console instead.");
        console.log("Message Details:", mailOptions);
        return res.status(200).json({ 
          success: true, 
          message: "Message received (Demo mode: credentials not configured)" 
        });
      }

      await transporter.sendMail(mailOptions);
      res.status(200).json({ success: true, message: "Message sent successfully!" });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Failed to send message. Please try again later." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

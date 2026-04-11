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
      console.log(`Attempting to send email from: ${process.env.EMAIL_USER} to: aidooemmanuel038@gmail.com`);
      
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      // Verify connection configuration
      try {
        await transporter.verify();
        console.log("SMTP connection verified successfully");
      } catch (verifyError: any) {
        console.error("SMTP Verification Failed:", verifyError.message);
        if (verifyError.message.includes('535')) {
          return res.status(500).json({ 
            error: "Authentication Failed: Gmail rejected your credentials. You MUST use a 16-character 'App Password', not your regular Gmail password. Please check your AI Studio Secrets." 
          });
        }
        throw verifyError;
      }

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: "aidooemmanuel038@gmail.com",
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
    } catch (error: any) {
      console.error("Error sending email:", error);
      
      let errorMessage = "Failed to send message. Please try again later.";
      
      if (error.code === 'EAUTH' || (error.response && error.response.includes('535'))) {
        errorMessage = "Email authentication failed. If using Gmail, please ensure you are using an 'App Password' and not your regular password.";
      }
      
      res.status(500).json({ error: errorMessage });
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

import express from "express";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import validator from "validator";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Pre-configured email target
const CONTACT_EMAIL = "aidooemmanuel038@gmail.com";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // 0. TRUST PROXY
  // This is required when running behind a reverse proxy (like Nginx, Cloud Run, etc.)
  // It allows Express and express-rate-limit to correctly identify the client's IP 
  // address via headers like 'X-Forwarded-For'.
  app.set("trust proxy", 1);

  // 1. SECURITY HEADERS
  // Helmet helps secure the app by setting various HTTP headers
  app.use(
    helmet({
      contentSecurityPolicy: false, // Vite handles CSP in dev
      crossOriginEmbedderPolicy: false,
    })
  );

  // 2. CORS CONFIGURATION
  // Restrict to your domain in production
  app.use(cors());

  // 3. BODY PARSING
  // Limit payload size to prevent body-parsing based DoS attacks
  app.use(express.json({ limit: "10kb" }));

  // 4. RATE LIMITING
  // Protect the contact endpoint from spam and automated attacks
  const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per window
    message: { error: "Too many contact requests from this IP. Please try again in 15 minutes." },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // API Route for Contact Form
  app.post("/api/contact", contactLimiter, async (req, res) => {
    // 5. INPUT SANITIZATION & VALIDATION
    const { name, email, message } = req.body;

    // Check for existence
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Transmission failed: All fields are required." });
    }

    // Sanitize and validate inputs
    const cleanName = validator.escape(String(name).trim());
    const cleanEmail = validator.normalizeEmail(String(email).trim());
    const cleanMessage = validator.escape(String(message).trim());

    if (!cleanEmail || !validator.isEmail(cleanEmail)) {
      return res.status(400).json({ error: "Invalid integrity check: Email address format is incorrect." });
    }

    if (cleanName.length < 2 || cleanName.length > 100) {
      return res.status(400).json({ error: "Invalid integrity check: Name length out of bounds." });
    }

    if (cleanMessage.length < 10 || cleanMessage.length > 5000) {
      return res.status(400).json({ error: "Invalid integrity check: Message length must be between 10 and 5000 characters." });
    }

    try {
      // 6. CREDENTIAL VALIDATION
      const user = process.env.EMAIL_USER;
      const pass = process.env.EMAIL_PASS;

      if (!user || !pass) {
        console.warn("[SECURITY WARN] Email credentials missing. Logging transmission to internal logs.");
        console.log("Transmission Data:", { cleanName, cleanEmail, cleanMessage });
        
        // Return 200 in dev/mock scenarios to not break UI, 
        // but real apps should handle this as a configuration error.
        return res.status(200).json({ 
          success: true, 
          message: "Transmission received. [DEBUG: SMTP Credentials Not Configured]" 
        });
      }

      // 7. SECURE SMTP CONFIGURATION
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: user,
          pass: pass,
        },
      });

      // Verify connection once per request (can be optimized by moving outside if traffic is high)
      try {
        await transporter.verify();
      } catch (verifyError: any) {
        console.error("[CRITICAL] SMTP Authentication Error:", verifyError.message);
        return res.status(500).json({ 
          error: "Auth Failure: The uplink to the mail server failed. Check App Passwords." 
        });
      }

      const mailOptions = {
        from: user,
        to: CONTACT_EMAIL,
        subject: `[Portfolio] Secure Transmission from ${cleanName}`,
        text: `Source Name: ${cleanName}\nSource Email: ${cleanEmail}\n\nPayload Content:\n${cleanMessage}`,
        replyTo: cleanEmail,
      };

      await transporter.sendMail(mailOptions);
      console.log(`[AUDIT] Email successfully transmitted from ${cleanEmail}`);
      
      res.status(200).json({ success: true, message: "Transmission successful." });
    } catch (error: any) {
      // 8. DATA LEAK PREVENTION
      // Never send full error stack to client
      console.error("[SYSTEM ERROR] Internal Failure during transmission:", error);
      
      res.status(500).json({ 
        error: "Internal server error. The packet could not be routed." 
      });
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
    console.log(`[SYSTEM] SOC Infrastructure Online at port ${PORT}`);
  });
}

startServer();

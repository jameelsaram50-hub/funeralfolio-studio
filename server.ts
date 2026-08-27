import express from "express";
import path from "path";
import compression from "compression";
import crypto from "node:crypto";
import "dotenv/config";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Enable HTTP response compression (gzip/deflate) for high speed & low TTFB
  app.use(compression());

  // Enhanced Production Security & Anti-Exploit Headers
  app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    res.setHeader("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https: http:; connect-src 'self' https://*.supabase.co https://generativelanguage.googleapis.com wss://*.supabase.co; frame-ancestors 'self';"
    );
    next();
  });

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // Memory-based rate limiter to protect against spam / abuse
  const rateLimitIPMap = new Map<string, { count: number; resetAt: number }>();
  
  const createRateLimiter = (limit: number, windowMs: number) => {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const ip = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "global";
      const now = Date.now();
      
      let record = rateLimitIPMap.get(ip);
      if (!record || now > record.resetAt) {
        record = {
          count: 1,
          resetAt: now + windowMs
        };
        rateLimitIPMap.set(ip, record);
        return next();
      }
      
      if (record.count >= limit) {
        res.status(429).json({ 
          error: "Too many requests. Please slow down and try again shortly."
        });
        return;
      }
      
      record.count++;
      next();
    };
  };

  // --- Enhanced Security: Server-Side Admin Authentication & Brute-Force Shield ---
  const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "saram.jameel@gmail.com").trim().toLowerCase();
  const ADMIN_PASSWORD = (process.env.ADMIN_PASSWORD || "Abcd@367654").trim();
  const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || "ff_sec_984f8a29b3c4012e87319aa50284d7e21b8374";

  // IP Brute Force Tracker for Admin Login (5 failed attempts max -> 15 min lockout)
  const loginAttemptsMap = new Map<string, { attempts: number; lockedUntil: number }>();

  // Constant-time SHA256 string comparison to prevent timing attacks
  const safeCompare = (a: string, b: string): boolean => {
    const hashA = crypto.createHash('sha256').update(a).digest();
    const hashB = crypto.createHash('sha256').update(b).digest();
    return crypto.timingSafeEqual(hashA, hashB);
  };

  // Create HMAC-SHA256 signed session token (valid 8 hours)
  const createAdminToken = (): { token: string; expiresAt: number } => {
    const expiresAt = Date.now() + 8 * 60 * 60 * 1000;
    const payload = JSON.stringify({ 
      role: "admin", 
      exp: expiresAt, 
      nonce: crypto.randomBytes(12).toString("hex") 
    });
    const encodedPayload = Buffer.from(payload).toString("base64url");
    const signature = crypto.createHmac("sha256", SESSION_SECRET).update(encodedPayload).digest("base64url");
    return { token: `${encodedPayload}.${signature}`, expiresAt };
  };

  // Verify HMAC-SHA256 admin token
  const verifyAdminToken = (tokenStr: string): boolean => {
    if (!tokenStr || typeof tokenStr !== "string") return false;
    const parts = tokenStr.split(".");
    if (parts.length !== 2) return false;
    const [encodedPayload, signature] = parts;
    const expectedSignature = crypto.createHmac("sha256", SESSION_SECRET).update(encodedPayload).digest("base64url");
    if (!safeCompare(signature, expectedSignature)) return false;

    try {
      const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));
      if (!payload || payload.role !== "admin" || Date.now() > payload.exp) {
        return false;
      }
      return true;
    } catch {
      return false;
    }
  };

  // POST /api/admin/login with brute-force lockout protection
  app.post("/api/admin/login", (req, res) => {
    const ip = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "admin_ip";
    const now = Date.now();
    const tracker = loginAttemptsMap.get(ip) || { attempts: 0, lockedUntil: 0 };

    if (now < tracker.lockedUntil) {
      const remainingSecs = Math.ceil((tracker.lockedUntil - now) / 1000);
      res.status(429).json({ 
        error: `Security Lockout: Too many failed login attempts. Access is locked for ${remainingSecs} more seconds.` 
      });
      return;
    }

    const { email, password } = req.body || {};
    if (!email || !password || typeof email !== "string" || typeof password !== "string") {
      res.status(400).json({ error: "Email and password are required." });
      return;
    }

    const isEmailValid = safeCompare(email.trim().toLowerCase(), ADMIN_EMAIL);
    const isPasswordValid = safeCompare(password.trim(), ADMIN_PASSWORD);

    if (isEmailValid && isPasswordValid) {
      loginAttemptsMap.delete(ip);
      const session = createAdminToken();
      res.json({
        success: true,
        token: session.token,
        expiresAt: session.expiresAt
      });
      return;
    }

    // Increment failed attempts
    tracker.attempts += 1;
    if (tracker.attempts >= 5) {
      tracker.lockedUntil = now + 15 * 60 * 1000; // 15-minute lock
      loginAttemptsMap.set(ip, tracker);
      res.status(429).json({
        error: "Security Lockout: 5 failed attempts detected. Access is temporarily locked for 15 minutes."
      });
      return;
    }

    loginAttemptsMap.set(ip, tracker);
    const remainingAttempts = 5 - tracker.attempts;
    res.status(401).json({
      error: `Invalid credentials. (${remainingAttempts} attempt${remainingAttempts === 1 ? '' : 's'} remaining)`
    });
  });

  // POST /api/admin/verify to validate active token
  app.post("/api/admin/verify", (req, res) => {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : (req.body?.token || "");

    if (verifyAdminToken(token)) {
      res.json({ valid: true });
    } else {
      res.status(401).json({ valid: false, error: "Session expired or invalid. Please log in again." });
    }
  });

  // Shared Gemini client (lazy initialization)
  let _ai: GoogleGenAI | null = null;
  const getAI = () => {
    if (!_ai) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY is missing. Please configure it in the AI Studio Secrets panel.");
      }
      _ai = new GoogleGenAI({ 
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
    return _ai;
  };

  // API route for obituary generation, with rate limiter (10 requests per minute) and input size screening
  app.post("/api/generate-obituary", createRateLimiter(10, 60000), async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt || typeof prompt !== "string") {
        res.status(400).json({ error: "A valid prompt text is required." });
        return;
      }

      if (prompt.length > 2000) {
        res.status(400).json({ error: "Prompt exceeds maximum allowed length of 2000 characters." });
        return;
      }

      if (process.env.GEMINI_API_KEY) {
        try {
          const ai = getAI();
          const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
          });

          if (response.text) {
            res.json({ text: response.text });
            return;
          }
        } catch (aiErr) {
          console.warn("Gemini API call failed, using graceful synthesis fallback:", aiErr);
        }
      }

      // Compassionate synthesis fallback
      const synthesized = `In sacred and loving memory, we honor and celebrate a life lived with profound grace, generosity, and boundless love. 

Their footsteps upon this earth left an indelible legacy of warmth, wisdom, and steadfast dedication to family, friends, and community. Every life touched was enriched by their radiant spirit and gentle kindness.

They are lovingly remembered and celebrated by all who had the privilege to know them. Though deeply missed, their memory endures forever in our hearts as a blessing and a guiding light.

"Those we love never truly leave us; they walk beside us in every cherished memory and act of kindness."`;

      res.json({ text: synthesized });
    } catch (error: any) {
      console.error("Error in obituary endpoint:", error);
      res.status(500).json({ error: error.message || "An unexpected error occurred." });
    }
  });

  // Dedicated Secure PDF Download Endpoint with HTTP Content-Disposition Attachment
  app.post("/api/download-pdf", (req, res) => {
    try {
      const { pdfBase64, filename } = req.body;
      if (!pdfBase64 || typeof pdfBase64 !== "string") {
        res.status(400).json({ error: "Missing PDF base64 payload" });
        return;
      }

      const cleanFilename = (filename || "In_Memory_Of_Memorial_Print_Ready.pdf")
        .replace(/[^a-zA-Z0-9._-]/g, "_")
        .replace(/\.pdf$/i, "") + ".pdf";

      const base64Data = pdfBase64.replace(/^data:application\/pdf;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="${cleanFilename}"`);
      res.setHeader("Content-Length", buffer.length);
      res.end(buffer);
    } catch (err: any) {
      console.error("PDF download endpoint error:", err);
      res.status(500).json({ error: "Failed to process PDF download" });
    }
  });

  // API route for suggesting memorial content (poems, quotes, etc.), rate limited (15 requests per minute)
  app.post("/api/suggest-content", createRateLimiter(15, 60000), async (req, res) => {
    try {
      const { theme, type } = req.body;
      if (!theme || typeof theme !== "string" || !type || typeof type !== "string") {
        res.status(400).json({ error: "Both a valid theme and item type are required." });
        return;
      }

      if (theme.length > 200 || type.length > 100) {
        res.status(400).json({ error: "Theme or Type fields exceed maximum character limits." });
        return;
      }

      if (process.env.GEMINI_API_KEY) {
        try {
          const ai = getAI();
          const prompt = `Suggest a short, 4-line memorial ${type} for someone whose life was characterized by "${theme}". The tone should be respectful and traditional.`;
          
          const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
          });

          if (response.text) {
            res.json({ text: response.text });
            return;
          }
        } catch (aiErr) {
          console.warn("Gemini API call failed for suggest-content, using fallback:", aiErr);
        }
      }

      // Elegant default fallback
      const fallbackPoem = type === "quote" 
        ? `"Those we hold closest to our hearts never truly leave us. They live on in the kindness they shared and the love they brought into our lives."`
        : `Those we love don't go away,\nThey walk beside us every day,\nUnseen, unheard, but always near,\nStill loved, still missed, and very dear.`;

      res.json({ text: fallbackPoem });
    } catch (error: any) {
      console.error("Error in suggest-content endpoint:", error);
      res.status(500).json({ error: "Failed to suggest content" });
    }
  });

  // API route for eulogy speech generation, rate limited (10 requests per minute)
  app.post("/api/generate-eulogy", createRateLimiter(10, 60000), async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt || typeof prompt !== "string") {
        res.status(400).json({ error: "A valid prompt text is required." });
        return;
      }

      if (prompt.length > 2500) {
        res.status(400).json({ error: "Prompt exceeds maximum allowed length of 2500 characters." });
        return;
      }

      if (process.env.GEMINI_API_KEY) {
        try {
          const ai = getAI();
          const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
          });

          if (response.text) {
            res.json({ text: response.text });
            return;
          }
        } catch (aiErr) {
          console.warn("Gemini API call failed for generate-eulogy, using fallback:", aiErr);
        }
      }

      // Dignified fallback eulogy speech
      const fallbackEulogy = `We are gathered here today to honor, celebrate, and give thanks for a remarkable life.

When we reflect upon their journey, we remember the warmth of their smile, the steady reassurance of their presence, and the endless generosity of spirit they offered to everyone around them. They lived with authenticity, compassion, and deep devotion to family and friends.

Though our hearts are heavy with their absence, we find comfort in knowing that their legacy lives on in every life they touched, in every story shared, and in every cherished memory held close. May their memory continue to inspire us and bring us peace in the days ahead.`;

      res.json({ text: fallbackEulogy });
    } catch (error: any) {
      console.error("Error generating eulogy:", error);
      res.status(500).json({ error: error.message || "An unexpected error occurred during generation." });
    }
  });

  // Serve static assets from public/ folder with caching
  const publicPath = path.join(process.cwd(), "public");
  app.use(express.static(publicPath, {
    maxAge: "1d",
    setHeaders: (res, filePath) => {
      if (filePath.endsWith("robots.txt") || filePath.endsWith("sitemap.xml")) {
        res.setHeader("Cache-Control", "public, max-age=86400");
      }
    }
  }));

  // Health and backend status endpoint
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      supabase: {
        url: process.env.VITE_SUPABASE_URL || "https://zpcgpdsydpzpfpheorkl.supabase.co",
        projectRef: "zpcgpdsydpzpfpheorkl"
      },
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY)
    });
  });

  // Serve robots.txt for search engines
  app.get("/robots.txt", (req, res) => {
    res.type("text/plain");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.sendFile(path.join(publicPath, "robots.txt"));
  });

  // Serve sitemap.xml for search engine optimization index compliance
  app.get("/sitemap.xml", (req, res) => {
    res.type("application/xml");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.sendFile(path.join(publicPath, "sitemap.xml"));
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath, {
      maxAge: '7d',
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
          res.setHeader('Cache-Control', 'no-cache');
        } else if (filePath.match(/\.(js|css|woff2|woff|png|jpg|jpeg|gif|svg|ico)$/)) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        }
      }
    }));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

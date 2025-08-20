import express from "express";
import path from "path";
import compression from "compression";
import helmet from "helmet";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const DISABLE_CSP = process.env.DISABLE_CSP === "1";
const CONNECT_SRC = [
  "'self'",
  "https://bqwsjjucakgtxpztcqra.supabase.co",
  "wss://bqwsjjucakgtxpztcqra.supabase.co",
  "https://be-report.markethac.id",
  "https://*.markethac.id",
  "http://localhost:4000",
  "http://127.0.0.1:4000",
];

// Security and compression middleware
app.use(
  helmet({
    contentSecurityPolicy: DISABLE_CSP
      ? false
      : {
          directives: {
            defaultSrc: ["'self'"],
            styleSrc: [
              "'self'",
              "'unsafe-inline'",
              "https://fonts.googleapis.com",
            ],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: CONNECT_SRC,
          },
        },
    crossOriginOpenerPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(compression());

console.log(
  `Helmet CSP: ${DISABLE_CSP ? "DISABLED" : "ENABLED"}`,
  DISABLE_CSP ? "" : `connect-src => ${CONNECT_SRC.join(", ")}`
);

// Serve static files from dist directory
app.use(express.static(path.join(__dirname, "dist")));

// Handle React Router - serve index.html for unmatched routes
app.use((req, res, next) => {
  if (req.method === "GET" && !req.path.startsWith("/api")) {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  } else {
    next();
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Production server running on port ${PORT}`);
  console.log(`📊 Report Builder available at http://localhost:${PORT}`);
});

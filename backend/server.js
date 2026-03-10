import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import "express-async-errors";

import { config } from "./src/config.js";
import { initDb } from "./src/db.js";
import adminRouter from "./src/routes/admin.js";
import publicRouter from "./src/routes/public.js";
import { getUploadsDir } from "./src/uploads.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin:
      config.corsOrigins.length === 0
        ? true
        : (origin, callback) => {
            if (!origin) return callback(null, true);
            if (config.corsOrigins.includes(origin))
              return callback(null, true);
            return callback(new Error("Not allowed by CORS"));
          },
  }),
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// Public access to uploaded assets
app.use("/uploads", express.static(getUploadsDir()));

// API routes
app.use("/api/admin", adminRouter);
app.use("/admin", adminRouter);
app.use("/api", publicRouter);

// Basic error handler
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  const status =
    Number(err?.statusCode ?? err?.status ?? 0) ||
    (err?.name === "ValidationError" ? 400 : 500);
  const message = err?.message || "Server error";
  res.status(status).json({ ok: false, error: message });
});

await initDb(config.mongoUri);

app.listen(config.port, () => {
  console.log(`Backend listening on http://localhost:${config.port}`);
});

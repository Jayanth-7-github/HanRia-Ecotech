import mongoose from "mongoose";

let dbReady = false;

export function isDbReady() {
  return dbReady;
}

export async function initDb(mongoUri) {
  try {
    if (!mongoUri) throw new Error("MONGODB_URI is not set");
    await mongoose.connect(mongoUri);
    dbReady = true;
    console.log("MongoDB connected");
    return true;
  } catch (error) {
    dbReady = false;
    console.warn(
      "MongoDB connection failed. APIs will return 503 until MongoDB is available.",
    );
    console.warn(error?.message ?? error);
    return false;
  }
}

export function requireDb(_req, res, next) {
  if (!dbReady) {
    return res.status(503).json({ ok: false, error: "Database not connected" });
  }
  return next();
}

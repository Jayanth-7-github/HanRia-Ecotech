import fs from "fs";
import path from "path";
import { Readable } from "stream";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

import { config } from "./config.js";

const uploadsDir = path.join(process.cwd(), "uploads");

function normalizeProvider(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

function hasCloudinaryCreds() {
  return (
    Boolean(config.cloudinaryCloudName) &&
    Boolean(config.cloudinaryApiKey) &&
    Boolean(config.cloudinaryApiSecret)
  );
}

function isCloudinaryRequested() {
  return normalizeProvider(config.uploadProvider) === "cloudinary";
}

function isLocalRequested() {
  return normalizeProvider(config.uploadProvider) === "local";
}

function shouldUseCloudinaryStorage() {
  return (
    isCloudinaryRequested() || (hasCloudinaryCreds() && !isLocalRequested())
  );
}

function ensureUploadsDir() {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const safeOriginal = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${Date.now()}_${safeOriginal}`);
  },
});

const multerStorage = shouldUseCloudinaryStorage()
  ? multer.memoryStorage()
  : storage;

if (!shouldUseCloudinaryStorage()) {
  ensureUploadsDir();
}

export const upload = multer({
  storage: multerStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

export function toPublicUploadUrl(req, filename) {
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  return `${baseUrl}/uploads/${encodeURIComponent(filename)}`;
}

function isCloudinaryEnabled() {
  if (!hasCloudinaryCreds()) return false;
  if (!config.uploadProvider) return true;
  return isCloudinaryRequested();
}

function ensureCloudinaryConfigured() {
  if (!isCloudinaryEnabled()) return;
  cloudinary.config({
    cloud_name: config.cloudinaryCloudName,
    api_key: config.cloudinaryApiKey,
    api_secret: config.cloudinaryApiSecret,
    secure: true,
  });
}

function uploadBufferToCloudinary(buffer, options) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
    Readable.from([buffer]).pipe(stream);
  });
}

/**
 * Stores an uploaded file and returns a public URL.
 *
 * - Local mode: returns local /uploads URL and keeps the file on disk.
 * - Cloudinary mode: uploads the file to Cloudinary, deletes the local temp file,
 *   and returns the Cloudinary URL.
 */
export async function storeUploadedFile(req, file) {
  if (!file) return { provider: "none", url: "", filePath: "" };

  if (isCloudinaryRequested() && !hasCloudinaryCreds()) {
    const err = new Error(
      "UPLOAD_PROVIDER=cloudinary but Cloudinary credentials are missing",
    );
    err.statusCode = 500;
    throw err;
  }

  if (!isCloudinaryEnabled()) {
    if (isCloudinaryRequested()) {
      const err = new Error(
        "Cloudinary is required but not configured (missing credentials)",
      );
      err.statusCode = 500;
      throw err;
    }

    return {
      provider: "local",
      url: toPublicUploadUrl(req, file.filename),
      filePath: file.path,
    };
  }

  ensureCloudinaryConfigured();

  const commonOptions = {
    resource_type: "auto",
    folder: config.cloudinaryFolder,
    use_filename: true,
    unique_filename: true,
    filename_override: file.originalname,
  };

  const uploadResult = file.buffer
    ? await uploadBufferToCloudinary(file.buffer, commonOptions)
    : await cloudinary.uploader.upload(file.path, commonOptions);

  if (file.path) {
    try {
      await fs.promises.unlink(file.path);
    } catch {
      // Best-effort cleanup.
    }
  }

  return {
    provider: "cloudinary",
    url: uploadResult.secure_url || uploadResult.url,
    filePath: uploadResult.public_id,
    publicId: uploadResult.public_id,
  };
}

export function getUploadsDir() {
  // Directory used only when local uploads are enabled.
  return uploadsDir;
}

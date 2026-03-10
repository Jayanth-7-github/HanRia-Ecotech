import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: Number(process.env.PORT ?? 3001),
  nodeEnv: process.env.NODE_ENV ?? "development",
  corsOrigins: (process.env.CORS_ORIGINS ?? "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean),
  mongoUri:
    process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/hanria_ecotech",
  adminKey: process.env.ADMIN_KEY ?? "",
  jwtSecret: process.env.JWT_SECRET ?? "dev_jwt_secret_change_me",

  uploadProvider: process.env.UPLOAD_PROVIDER ?? "",
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME ?? "",
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY ?? "",
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET ?? "",
  cloudinaryFolder: process.env.CLOUDINARY_FOLDER ?? "hanria-ecotech",
};

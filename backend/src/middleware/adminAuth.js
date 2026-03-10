import jwt from "jsonwebtoken";
import { config } from "../config.js";

export function signAdminToken() {
  return jwt.sign({ role: "admin" }, config.jwtSecret, { expiresIn: "7d" });
}

export function requireAdmin(req, res, next) {
  const header = req.headers.authorization ?? "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ ok: false, error: "Unauthorized" });
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret);
    if (payload?.role !== "admin") {
      return res.status(403).json({ ok: false, error: "Forbidden" });
    }
    req.admin = payload;
    return next();
  } catch {
    return res.status(401).json({ ok: false, error: "Invalid token" });
  }
}

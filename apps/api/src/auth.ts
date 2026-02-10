import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import type { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.JWT_SECRET || "";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";

if (!JWT_SECRET) {
  console.error("❌ JWT_SECRET missing");
}
if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("❌ ADMIN_EMAIL or ADMIN_PASSWORD missing");
}

// Хешуємо пароль з env один раз на старті (MVP, без БД)
const ADMIN_PASSWORD_HASH = ADMIN_PASSWORD ? bcrypt.hashSync(ADMIN_PASSWORD, 10) : "";

export function signAdminToken() {
  if (!JWT_SECRET) throw new Error("JWT_SECRET is missing");

  return jwt.sign(
    { role: "admin" },
    JWT_SECRET,
    { expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as any }
  );
}

export async function verifyAdminCredentials(email: string, password: string) {
  if (!email || !password) return false;
  if (email !== ADMIN_EMAIL) return false;
  return bcrypt.compare(password, ADMIN_PASSWORD_HASH);
}

export function requireAdminJWT(req: Request, res: Response, next: NextFunction) {
  const header = req.header("authorization") || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    if (payload?.role !== "admin") return res.status(403).json({ error: "Forbidden" });
    (req as any).admin = payload;
    return next();
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
}

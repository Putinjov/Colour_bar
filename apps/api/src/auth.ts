import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import type { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.JWT_SECRET || "";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";
const ADMIN_PASSWORD_HASH = ADMIN_PASSWORD ? bcrypt.hashSync(ADMIN_PASSWORD, 10) : "";

export function signAdminToken() {
  if (!JWT_SECRET) throw new Error("JWT_SECRET missing");
  return jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as any });
}

export async function verifyAdminCredentials(email: string, password: string) {
  if (!ADMIN_PASSWORD_HASH || !email || !password || email !== ADMIN_EMAIL) return false;
  return bcrypt.compare(password, ADMIN_PASSWORD_HASH);
}

export function verifyAdminToken(token: string) {
  const payload = jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] }) as any;
  if (payload?.role !== "admin") throw new Error("Forbidden");
  return payload;
}

export function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.header("authorization") || "";
  const [scheme, token] = auth.split(" ");

  if (scheme === "Bearer" && token) {
    try {
      (req as any).admin = verifyAdminToken(token);
      return next();
    } catch {
      return res.status(401).json({ error: "Unauthorized", code: "UNAUTHORIZED" });
    }
  }

  return res.status(401).json({ error: "Unauthorized", code: "UNAUTHORIZED" });
}

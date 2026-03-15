import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
const JWT_SECRET = process.env.JWT_SECRET || "";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";
const ADMIN_PIN = process.env.ADMIN_PIN || "";
const ADMIN_PASSWORD_HASH = ADMIN_PASSWORD ? bcrypt.hashSync(ADMIN_PASSWORD, 10) : "";
export function signAdminToken() {
    if (!JWT_SECRET)
        throw new Error("JWT_SECRET missing");
    return jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: (process.env.JWT_EXPIRES_IN || "7d") });
}
export async function verifyAdminCredentials(email, password) {
    if (!email || !password || email !== ADMIN_EMAIL)
        return false;
    return bcrypt.compare(password, ADMIN_PASSWORD_HASH);
}
export function verifyAdminToken(token) {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload?.role !== "admin")
        throw new Error("Forbidden");
    return payload;
}
export function requireAdminAuth(req, res, next) {
    const auth = req.header("authorization") || "";
    const [scheme, token] = auth.split(" ");
    if (scheme === "Bearer" && token) {
        try {
            req.admin = verifyAdminToken(token);
            return next();
        }
        catch {
            return res.status(401).json({ error: "Unauthorized", code: "UNAUTHORIZED" });
        }
    }
    // temporary compatibility layer
    const pin = req.header("x-admin-pin");
    if (pin && ADMIN_PIN && pin === ADMIN_PIN) {
        req.admin = { role: "admin", legacyPin: true };
        return next();
    }
    return res.status(401).json({ error: "Unauthorized", code: "UNAUTHORIZED" });
}

import { Router } from "express";
import { signAdminToken, verifyAdminCredentials } from "../auth.js";
const router = Router();
router.post("/login", async (req, res) => {
    const email = String(req.body?.email || "");
    const password = String(req.body?.password || "");
    const ok = await verifyAdminCredentials(email, password);
    if (!ok)
        return res.status(401).json({ error: "Invalid credentials", code: "UNAUTHORIZED" });
    return res.json({ token: signAdminToken() });
});
export default router;

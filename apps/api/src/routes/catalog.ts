import { Router } from "express";
import { Catalog } from "../models/catalog.js";
import seed from "../seed/service.catalog.json" with { type: "json" };

const router = Router();

type AnyObj = Record<string, any>;

function validateCatalog(payload: AnyObj): string | null {
  if (!payload || typeof payload !== "object") return "Catalog must be an object";
  if (!Array.isArray(payload.blocks)) return "Catalog.blocks must be an array";

  for (const b of payload.blocks) {
    if (!b.key) return "Each block must have key";
    if (!b.pill?.en || !b.pill?.uk) return `Block ${b.key}: pill.en & pill.uk required`;
    if (!b.title?.en || !b.title?.uk) return `Block ${b.key}: title.en & title.uk required`;
    if (!b.description?.en || !b.description?.uk) return `Block ${b.key}: description.en & description.uk required`;
    if (!b.cta?.en || !b.cta?.uk) return `Block ${b.key}: cta.en & cta.uk required`;
    if (!b.image) return `Block ${b.key}: image required`;
    if (!Array.isArray(b.items)) return `Block ${b.key}: items must be array`;

    for (const it of b.items) {
      if (!it.title?.en || !it.title?.uk) return `Block ${b.key}: item title.en & title.uk required`;
      if (typeof it.priceFrom !== "number") return `Block ${b.key}: item priceFrom must be number`;
      if (!it.duration) return `Block ${b.key}: item duration required`;
      if (!Array.isArray(it.bullets?.en) || !Array.isArray(it.bullets?.uk))
        return `Block ${b.key}: item bullets.en & bullets.uk must be arrays`;
    }
  }
  return null;
}

// GET /api/catalog (створює з seed якщо нема)
router.get("/", async (_req, res) => {
  try {
    let doc = await Catalog.findOne({ key: "default" }).lean();

    if (!doc) {
      const created = await Catalog.create({ key: "default", data: seed });
      return res.json(created.data);
    }

    return res.json(doc.data);
  } catch (e) {
    console.error("GET /api/catalog error", e);
    return res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/catalog (upsert)
router.put("/", async (req, res) => {
  try {
    const payload = req.body as AnyObj;
    const err = validateCatalog(payload);
    if (err) return res.status(400).json({ error: err });

    const doc = await Catalog.findOneAndUpdate(
      { key: "default" },
      { $set: { data: payload } },
      { new: true, upsert: true }
    ).lean();

    return res.json(doc?.data);
  } catch (e) {
    console.error("PUT /api/catalog error", e);
    return res.status(500).json({ error: "Server error" });
  }
});

// POST /api/catalog/reset (скинути до seed)
router.post("/reset", async (_req, res) => {
  try {
    const doc = await Catalog.findOneAndUpdate(
      { key: "default" },
      { $set: { data: seed } },
      { new: true, upsert: true }
    ).lean();

    return res.json(doc?.data);
  } catch (e) {
    console.error("POST /api/catalog/reset error", e);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;

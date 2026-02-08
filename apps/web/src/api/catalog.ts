// apps/web/src/api/catalog.ts

export type Lang = "en" | "uk";
export type ServiceKey = "colouring" | "haircuts" | "repair";

export type CatalogItem = {
  title: Record<Lang, string>;
  serviceId?: string | null;   // ← ЗВʼЯЗОК З Service._id
  priceFrom: number;
  duration: string;
  bullets: Record<Lang, string[]>;
};

export type CatalogBlock = {
  key: ServiceKey;
  pill: Record<Lang, string>;
  title: Record<Lang, string>;
  description: Record<Lang, string>;
  cta: Record<Lang, string>;
  image: string;
  items: CatalogItem[];
};

export type Catalog = {
  blocks: CatalogBlock[];
};

const API_BASE = import.meta.env.VITE_API_URL || "";

/* =========================
   low-level fetch helper
========================= */
async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    ...init,
  });

  if (!res.ok) {
    let msg = "Request failed";
    try {
      const j = await res.json();
      msg = j?.error || msg;
    } catch {}
    throw new Error(msg);
  }

  return res.json() as Promise<T>;
}

/* =========================
   API methods
========================= */

export function getCatalog() {
  return http<Catalog>("/api/catalog");
}

export function updateCatalog(payload: Catalog) {
  return http<Catalog>("/api/catalog", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function resetCatalog() {
  return http<Catalog>("/api/catalog/reset", {
    method: "POST",
  });
}



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
  const headers = new Headers(init?.headers || {});

  // ✅ Content-Type потрібен тільки коли є body
  const hasBody = init?.body !== undefined && init?.body !== null;
  if (hasBody && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
  });

  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const j = await res.json();
      msg = j?.error || msg;
    } catch {}
    throw new Error(msg);
  }

  // 204 no content safe
  if (res.status === 204) return undefined as T;

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

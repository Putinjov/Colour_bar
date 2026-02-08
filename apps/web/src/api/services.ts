// apps/web/src/api/services.ts
const API_BASE = import.meta.env.VITE_API_URL || "";

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

export type ServiceDTO = {
  _id: string;
  title: string;
  category: string;
  durationMin: number;
  priceFrom: number;
  priceTo?: number;
  description?: string;
};

export function getServices() {
  return http<ServiceDTO[]>("/api/services");
}

import React, { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCatalog, updateCatalog, resetCatalog, type Catalog, type Lang } from "../../api/catalog";
import { getServices, type ServiceDTO } from "../../api/services";
import { useI18n } from "../../i18n";

function Input({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-brand-line bg-brand-surface px-3 py-2 text-sm outline-none focus:border-brand-purple/60"
    />
  );
}

function Textarea({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={3}
      className="w-full rounded-xl border border-brand-line bg-brand-surface px-3 py-2 text-sm outline-none focus:border-brand-purple/60"
    />
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-brand-line bg-brand-surface px-3 py-2 text-sm outline-none focus:border-brand-purple/60"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export default function AdminCatalog() {
  const qc = useQueryClient();
  const { lang } = useI18n();
  const L = (lang === "en" ? "en" : "uk") as Lang;

  const catalogQ = useQuery({
    queryKey: ["catalog"],
    queryFn: getCatalog,
  });

  const servicesQ = useQuery({
    queryKey: ["services"],
    queryFn: getServices,
  });

  const [draft, setDraft] = useState<Catalog | null>(null);

  React.useEffect(() => {
    if (catalogQ.data && !draft) setDraft(catalogQ.data);
  }, [catalogQ.data]);

  const saveMut = useMutation({
    mutationFn: (payload: Catalog) => updateCatalog(payload),
    onSuccess: (saved) => {
      qc.setQueryData(["catalog"], saved);
      setDraft(saved);
    },
  });

  const resetMut = useMutation({
    mutationFn: resetCatalog,
    onSuccess: (saved) => {
      qc.setQueryData(["catalog"], saved);
      setDraft(saved);
    },
  });

  const serviceOptions = useMemo(() => {
    const list: ServiceDTO[] = servicesQ.data || [];
    const opts = [
      { value: "", label: lang === "en" ? "— Not linked —" : "— Не привʼязано —" },
      ...list.map((s) => ({
        value: s._id,
        label: `${s.title} • ${s.category} • ${s.durationMin}m • €${s.priceFrom}${s.priceTo ? `–€${s.priceTo}` : ""}`,
      })),
    ];
    return opts;
  }, [servicesQ.data, lang]);

  const jsonPreview = useMemo(() => JSON.stringify(draft || {}, null, 2), [draft]);

  if (catalogQ.isLoading || servicesQ.isLoading) {
    return <div className="mx-auto max-w-6xl px-4 py-12 text-brand-sub">Loading…</div>;
  }
  if (catalogQ.error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 text-red-600">
        {(catalogQ.error as any)?.message || String(catalogQ.error)}
      </div>
    );
  }
  if (servicesQ.error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 text-red-600">
        {(servicesQ.error as any)?.message || String(servicesQ.error)}
      </div>
    );
  }

  if (!draft) return null;

  const dirtyHint =
    saveMut.isPending ? (lang === "en" ? "Saving…" : "Збереження…") : "";

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16">
      <div className="pt-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-brand-ink">Admin • Catalog</h1>
          <p className="mt-1 text-sm text-brand-sub">
            Каталог зберігається в <b>MongoDB</b>. Тут же робимо привʼязку процедур до реальних{" "}
            <b>Service</b> для автоматичного запису.
          </p>
          {dirtyHint && <div className="mt-2 text-xs text-brand-sub">{dirtyHint}</div>}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => resetMut.mutate()}
            className="rounded-full border border-brand-line bg-brand-surface px-4 py-2 text-xs font-semibold hover:bg-brand-muted transition"
          >
            Reset
          </button>

          <button
            onClick={() => saveMut.mutate(draft)}
            className="rounded-full bg-brand-ink text-white px-5 py-2 text-xs font-semibold hover:opacity-90 transition"
          >
            {saveMut.isPending ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      <div className="mt-8 space-y-8">
        {draft.blocks.map((b, bi) => (
          <div key={b.key} className="rounded-[22px] border border-brand-line bg-white shadow-soft p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="text-lg font-semibold text-brand-ink">
                Block: <span className="text-brand-purple">{b.key}</span>
              </div>
              <div className="text-xs text-brand-sub">
                id:{" "}
                <code className="px-2 py-1 rounded bg-brand-muted border border-brand-line">
                  {b.key}
                </code>
              </div>
            </div>

            {/* Block fields */}
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div>
                <div className="text-xs text-brand-sub mb-1">Pill (EN)</div>
                <Input value={b.pill.en} onChange={(v) => updateBlock(setDraft, bi, (x) => (x.pill.en = v))} />
              </div>
              <div>
                <div className="text-xs text-brand-sub mb-1">Pill (UK)</div>
                <Input value={b.pill.uk} onChange={(v) => updateBlock(setDraft, bi, (x) => (x.pill.uk = v))} />
              </div>

              <div>
                <div className="text-xs text-brand-sub mb-1">Title (EN)</div>
                <Textarea value={b.title.en} onChange={(v) => updateBlock(setDraft, bi, (x) => (x.title.en = v))} />
              </div>
              <div>
                <div className="text-xs text-brand-sub mb-1">Title (UK)</div>
                <Textarea value={b.title.uk} onChange={(v) => updateBlock(setDraft, bi, (x) => (x.title.uk = v))} />
              </div>

              <div>
                <div className="text-xs text-brand-sub mb-1">Description (EN)</div>
                <Textarea
                  value={b.description.en}
                  onChange={(v) => updateBlock(setDraft, bi, (x) => (x.description.en = v))}
                />
              </div>
              <div>
                <div className="text-xs text-brand-sub mb-1">Description (UK)</div>
                <Textarea
                  value={b.description.uk}
                  onChange={(v) => updateBlock(setDraft, bi, (x) => (x.description.uk = v))}
                />
              </div>

              <div>
                <div className="text-xs text-brand-sub mb-1">CTA (EN)</div>
                <Input value={b.cta.en} onChange={(v) => updateBlock(setDraft, bi, (x) => (x.cta.en = v))} />
              </div>
              <div>
                <div className="text-xs text-brand-sub mb-1">CTA (UK)</div>
                <Input value={b.cta.uk} onChange={(v) => updateBlock(setDraft, bi, (x) => (x.cta.uk = v))} />
              </div>

              <div className="md:col-span-2">
                <div className="text-xs text-brand-sub mb-1">Image URL</div>
                <Input value={b.image} onChange={(v) => updateBlock(setDraft, bi, (x) => (x.image = v))} />
              </div>
            </div>

            {/* Items */}
            <div className="mt-6">
              <div className="text-sm font-semibold text-brand-ink">Procedures</div>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                {b.items.map((it, ii) => (
                  <div key={ii} className="rounded-2xl border border-brand-line bg-brand-surface p-4">
                    <div className="text-xs text-brand-sub mb-2">Title (EN)</div>
                    <Input value={it.title.en} onChange={(v) => updateItem(setDraft, bi, ii, (x) => (x.title.en = v))} />

                    <div className="text-xs text-brand-sub mt-3 mb-2">Title (UK)</div>
                    <Input value={it.title.uk} onChange={(v) => updateItem(setDraft, bi, ii, (x) => (x.title.uk = v))} />

                    {/* ✅ Link to Service */}
                    <div className="text-xs text-brand-sub mt-3 mb-2">
                      {lang === "en" ? "Linked Service (for booking)" : "Привʼязаний Service (для запису)"}
                    </div>
                    <Select
                      value={it.serviceId || ""}
                      onChange={(v) => updateItem(setDraft, bi, ii, (x) => (x.serviceId = v ? v : null))}
                      options={serviceOptions}
                    />

                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div>
                        <div className="text-xs text-brand-sub mb-2">Price from (€)</div>
                        <Input
                          value={String(it.priceFrom)}
                          onChange={(v) => updateItem(setDraft, bi, ii, (x) => (x.priceFrom = Number(v || 0)))}
                        />
                      </div>
                      <div>
                        <div className="text-xs text-brand-sub mb-2">Duration</div>
                        <Input value={it.duration} onChange={(v) => updateItem(setDraft, bi, ii, (x) => (x.duration = v))} />
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="text-xs text-brand-sub mb-2">
                        Bullets ({L.toUpperCase()}) — 1 per line
                      </div>
                      <Textarea
                        value={(it.bullets[L] || []).join("\n")}
                        onChange={(v) =>
                          updateItem(setDraft, bi, ii, (x) => {
                            x.bullets[L] = v.split("\n").map((s) => s.trim()).filter(Boolean);
                          })
                        }
                      />
                    </div>

                    <div className="mt-3 flex justify-between items-center">
                      <button
                        onClick={() => {
                          setDraft((prev) => {
                            if (!prev) return prev;
                            const next = structuredClone(prev);
                            next.blocks[bi].items.splice(ii, 1);
                            return next;
                          });
                        }}
                        className="text-xs font-semibold text-red-600 hover:opacity-80"
                      >
                        Delete
                      </button>

                      <span className="text-[11px] text-brand-sub">
                        {it.serviceId ? (lang === "en" ? "Linked" : "Привʼязано") : (lang === "en" ? "Not linked" : "Не привʼязано")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <button
                  onClick={() => {
                    setDraft((prev) => {
                      if (!prev) return prev;
                      const next = structuredClone(prev);
                      next.blocks[bi].items.push({
                        title: { en: "New procedure", uk: "Нова процедура" },
                        serviceId: null,
                        priceFrom: 0,
                        duration: "—",
                        bullets: { en: ["..."], uk: ["..."] },
                      });
                      return next;
                    });
                  }}
                  className="rounded-full bg-brand-ink text-white px-5 py-2 text-xs font-semibold hover:opacity-90 transition"
                >
                  + Add procedure
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* JSON preview */}
      <div className="mt-10 rounded-[22px] border border-brand-line bg-white shadow-soft p-6">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-brand-ink">JSON Preview</div>
          <button
            onClick={() => navigator.clipboard.writeText(jsonPreview)}
            className="rounded-full border border-brand-line bg-brand-surface px-4 py-2 text-xs font-semibold hover:bg-brand-muted transition"
          >
            Copy
          </button>
        </div>
        <pre className="mt-4 text-xs overflow-auto max-h-[420px] bg-brand-surface border border-brand-line rounded-2xl p-4">
{jsonPreview}
        </pre>
      </div>
    </div>
  );
}

function updateBlock(
  setDraft: React.Dispatch<React.SetStateAction<Catalog | null>>,
  bi: number,
  mutate: (block: any) => void
) {
  setDraft((prev) => {
    if (!prev) return prev;
    const next = structuredClone(prev);
    mutate(next.blocks[bi]);
    return next;
  });
}

function updateItem(
  setDraft: React.Dispatch<React.SetStateAction<Catalog | null>>,
  bi: number,
  ii: number,
  mutate: (item: any) => void
) {
  setDraft((prev) => {
    if (!prev) return prev;
    const next = structuredClone(prev);
    mutate(next.blocks[bi].items[ii]);
    return next;
  });
}

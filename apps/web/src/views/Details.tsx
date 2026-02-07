import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { loadDraft, saveDraft, clearDraft } from "../lib/storage";
import { createBooking } from "../lib/api";
import { format } from "date-fns";

const schema = z.object({
  clientName: z.string().min(2),
  phone: z.string().min(6),
  notes: z.string().max(300).optional(),
});
type FormVals = z.infer<typeof schema>;

export default function Details() {
  const nav = useNavigate();
  const draft = loadDraft();

  const ready = Boolean(draft.serviceId && draft.startAt);
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormVals>({
    defaultValues: {
      clientName: draft.clientName ?? "",
      phone: draft.phone ?? "",
      notes: draft.notes ?? "",
    }
  });

  if (!ready) {
    return (
      <Card>
        <div className="text-sm font-semibold">Немає вибраного слоту</div>
        <div className="mt-3"><Button className="w-full" onClick={() => nav("/services")}>Почати спочатку</Button></div>
      </Card>
    );
  }

  const when = new Date(draft.startAt!);

  return (
    <Card>
      <div className="text-sm font-semibold">Дані клієнта</div>
      <div className="mt-2 text-xs text-brand-ink/70">
        {draft.serviceTitle} • {format(when, "EEE dd/MM")} • {format(when, "HH:mm")}
      </div>

      <form
        className="mt-4 space-y-3"
        onSubmit={handleSubmit(async (vals) => {
          // light zod check
          const parsed = schema.safeParse(vals);
          if (!parsed.success) return;

          saveDraft({ ...draft, ...parsed.data });

          try {
            await createBooking({
              serviceId: draft.serviceId!,
              startAt: draft.startAt!,
              clientName: parsed.data.clientName,
              phone: parsed.data.phone,
              notes: parsed.data.notes || undefined,
            });
            const saved = loadDraft();
            clearDraft();
            saveDraft(saved); // keep last for success screen display
            nav("/success");
          } catch (e: any) {
            alert(e?.message || "Помилка створення запису");
          }
        })}
      >
        <label className="block">
          <div className="text-xs text-brand-ink/70 mb-1">Ім’я</div>
          <input
            className="w-full rounded-xl2 bg-white/5 border border-white/10 px-3 py-3 text-sm outline-none focus:border-brand-yellow"
            {...register("clientName")}
            placeholder="Напр. Marina"
          />
        </label>

        <label className="block">
          <div className="text-xs text-brand-ink/70 mb-1">Телефон</div>
          <input
            className="w-full rounded-xl2 bg-white/5 border border-white/10 px-3 py-3 text-sm outline-none focus:border-brand-yellow"
            {...register("phone")}
            placeholder="+353 ..."
          />
        </label>

        <label className="block">
          <div className="text-xs text-brand-ink/70 mb-1">Коментар (опц.)</div>
          <textarea
            className="w-full rounded-xl2 bg-white/5 border border-white/10 px-3 py-3 text-sm outline-none focus:border-brand-yellow min-h-[90px]"
            {...register("notes")}
            placeholder="Напр. довге волосся, хочу balayage…"
          />
        </label>

        <Button disabled={isSubmitting} className="w-full" type="submit">
          {isSubmitting ? "Бронюємо…" : "Підтвердити запис"}
        </Button>

        <Button variant="ghost" className="w-full" type="button" onClick={() => nav("/datetime")}>
          Назад до часу
        </Button>
      </form>
    </Card>
  );
}

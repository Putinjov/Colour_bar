import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import BookingLayout from "../ui/BookingLayout.js";
import { loadDraft, saveDraft, clearDraft } from "../lib/storage.js";
import { createBooking } from "../lib/api.js";
import { useI18n } from "../i18n.js";

const schema = z.object({
  clientName: z.string().min(2).max(60),
  phone: z.string().min(6).max(30),
  notes: z.string().max(300).optional(),
});
type FormVals = z.infer<typeof schema>;

export default function Details() {
  const nav = useNavigate();
  const { lang } = useI18n();
  const draft = loadDraft();

  const ready = Boolean(draft.serviceId && draft.startAt && draft.endAt);

  const when = useMemo(() => (draft.startAt ? new Date(draft.startAt) : null), [draft.startAt]);
  const end = useMemo(() => (draft.endAt ? new Date(draft.endAt) : null), [draft.endAt]);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormVals>({
    defaultValues: {
      clientName: draft.clientName ?? "",
      phone: draft.phone ?? "",
      notes: draft.notes ?? "",
    },
  });

  if (!ready) {
    return (
      <BookingLayout
        step={3}
        title={lang === "en" ? "Schedule Your Appointment" : "Записатися на процедуру"}
        subtitle={lang === "en" ? "Enter your details to confirm." : "Введіть дані для підтвердження."}
      >
        <div className="text-xl font-semibold text-brand-ink">
          {lang === "en" ? "No selected time slot" : "Немає вибраного слоту"}
        </div>

        <p className="mt-2 text-sm text-brand-sub">
          {lang === "en"
            ? "Please go back and choose a time first."
            : "Поверніться назад і оберіть час."}
        </p>

        <div className="mt-6">
          <button
            onClick={() => nav("/datetime")}
            className="rounded-full bg-brand-ink text-white px-6 py-3 text-sm font-semibold hover:opacity-90 transition"
          >
            {lang === "en" ? "Choose Time" : "Обрати час"}
          </button>
        </div>
      </BookingLayout>
    );
  }

  return (
    <BookingLayout
      step={3}
      title={lang === "en" ? "Schedule Your Appointment" : "Записатися на процедуру"}
      subtitle={
        lang === "en"
          ? "Enter your details and confirm — we’ll reserve your slot instantly."
          : "Введіть дані та підтвердіть — ми одразу зарезервуємо ваш слот."
      }
    >
      <div className="text-xl md:text-2xl font-semibold text-brand-ink">
        {lang === "en" ? "Your Details" : "Ваші дані"}
      </div>

      {/* Summary bar like premium UI */}
      <div className="mt-4 rounded-[18px] border border-brand-line bg-brand-muted p-4">
        <div className="text-sm font-semibold text-brand-ink">{draft.serviceTitle}</div>
        {when && (
          <div className="mt-1 text-sm text-brand-sub">
            {format(when, "EEE dd/MM")} • {format(when, "HH:mm")}
            {end ? ` – ${format(end, "HH:mm")}` : ""}
          </div>
        )}
      </div>

      <form
        className="mt-6 space-y-4"
        onSubmit={handleSubmit(async (vals) => {
          const parsed = schema.safeParse(vals);
          if (!parsed.success) {
            alert(lang === "en" ? "Please check your input." : "Перевірте введені дані.");
            return;
          }

          saveDraft({ ...draft, ...parsed.data });

          try {
            await createBooking({
              serviceId: draft.serviceId!,
              startAt: draft.startAt!,
              clientName: parsed.data.clientName,
              phone: parsed.data.phone,
              notes: parsed.data.notes || undefined,
            });

            const last = loadDraft();
            clearDraft();
            saveDraft(last); // keep summary for success page
            nav("/success");
          } catch (e: any) {
            alert(e?.message || (lang === "en" ? "Booking failed" : "Не вдалося створити запис"));
          }
        })}
      >
        <div className="grid gap-3 md:grid-cols-2">
          <label className="block">
            <div className="text-xs font-semibold text-brand-sub mb-1">
              {lang === "en" ? "Name" : "Ім’я"}
            </div>
            <input
              className="w-full rounded-2xl border border-brand-line bg-brand-surface px-4 py-3 text-sm outline-none focus:border-brand-purple"
              {...register("clientName")}
              placeholder={lang === "en" ? "e.g. Marina" : "Напр. Маріна"}
            />
          </label>

          <label className="block">
            <div className="text-xs font-semibold text-brand-sub mb-1">
              {lang === "en" ? "Phone" : "Телефон"}
            </div>
            <input
              className="w-full rounded-2xl border border-brand-line bg-brand-surface px-4 py-3 text-sm outline-none focus:border-brand-purple"
              {...register("phone")}
              placeholder={lang === "en" ? "+353 ..." : "+353 ..."}
            />
          </label>
        </div>

        <label className="block">
          <div className="text-xs font-semibold text-brand-sub mb-1">
            {lang === "en" ? "Notes (optional)" : "Коментар (опційно)"}
          </div>
          <textarea
            className="w-full rounded-2xl border border-brand-line bg-brand-surface px-4 py-3 text-sm outline-none focus:border-brand-purple min-h-[110px]"
            {...register("notes")}
            placeholder={
              lang === "en"
                ? "Anything we should know? (hair length, preferences...)"
                : "Напр. довжина волосся, побажання…"
            }
          />
        </label>

        <div className="mt-2 flex flex-col sm:flex-row gap-3 justify-between">
          <button
            type="button"
            onClick={() => nav("/datetime")}
            className="rounded-full border border-brand-line bg-brand-muted px-6 py-3 text-sm font-semibold text-brand-ink hover:brightness-98 transition"
          >
            {lang === "en" ? "Back" : "Назад"}
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-brand-ink text-white px-6 py-3 text-sm font-semibold hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (lang === "en" ? "Booking…" : "Бронюємо…") : (lang === "en" ? "Confirm Booking" : "Підтвердити запис")}
          </button>
        </div>
      </form>
    </BookingLayout>
  );
}

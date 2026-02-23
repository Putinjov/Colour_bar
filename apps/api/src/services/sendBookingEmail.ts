import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);
function esc(s: unknown) {
  return String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string)
  );
}

function toDateTimeParts(booking: any) {
  const raw = booking?.startAtISO ?? booking?.startAt;
  if (!raw) {
    return { date: booking?.date ?? "", time: booking?.time ?? "" };
  }

  const dt = new Date(raw);
  if (Number.isNaN(dt.getTime())) {
    return { date: booking?.date ?? "", time: booking?.time ?? "" };
  }

  const tz = process.env.TIMEZONE ?? "Europe/Dublin";

  return {
    date: dt.toLocaleDateString("en-IE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: tz,
    }),
    time: dt.toLocaleTimeString("en-IE", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: tz,
    }),
  };
}

export async function sendBookingEmail(booking: any) {
  const service = booking?.serviceTitle ?? booking?.service ?? "";
  const { date, time } = toDateTimeParts(booking);

  const subject = `New booking: ${booking?.clientName ?? "Client"} • ${date} ${time}`;

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.5">
      <h2 style="margin:0 0 12px">New booking 💇‍♀️</h2>
      <table cellpadding="6" cellspacing="0" style="border-collapse:collapse">
        <tr><td><b>Name</b></td><td>${esc(booking.clientName)}</td></tr>
        <tr><td><b>Phone</b></td><td>${esc(booking.phone)}</td></tr>
        <tr><td><b>Service</b></td><td>${esc(service)}</td></tr>
        <tr><td><b>Date</b></td><td>${esc(date)}</td></tr>
        <tr><td><b>Time</b></td><td>${esc(time)}</td></tr>
        <tr><td><b>Notes</b></td><td>${esc(booking.notes)}</td></tr>
      </table>
    </div>
  `;

  const from = process.env.MAIL_FROM || "Colour Lab <info@colourlab.ie>";
  const to = process.env.MAIL_TO || "info@colourlab.ie";

  const { data, error } = await resend.emails.send({
    from,
    to: [to],
    subject,
    html,
    replyTo: to,
  });

  if (error) {
    console.error("[mail] resend failed", error);
    throw new Error(error.message);
  }

  console.log("[mail] resend sent", data);
}
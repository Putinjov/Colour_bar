import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT || 587),
  secure: process.env.MAIL_SECURE === "true", // true для 465, false для 587
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

function esc(s: unknown) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c] as string));
}

function toDateTimeParts(booking: any) {
  const raw = booking?.startAtISO ?? booking?.startAt;
  if (!raw) {
    return {
      date: booking?.date ?? "",
      time: booking?.time ?? "",
    };
  }

  const dt = new Date(raw);
  if (Number.isNaN(dt.getTime())) {
    return {
      date: booking?.date ?? "",
      time: booking?.time ?? "",
    };
  }

  return {
    date: dt.toLocaleDateString("en-IE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: process.env.TIMEZONE ?? "Europe/Dublin",
    }),
    time: dt.toLocaleTimeString("en-IE", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: process.env.TIMEZONE ?? "Europe/Dublin",
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

  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: process.env.MAIL_TO || "info@colourlab.ie",
    replyTo: process.env.MAIL_TO || "info@colourlab.ie",
    subject,
    html,
  });
}

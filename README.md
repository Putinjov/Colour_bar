# Colour Bar — Online Booking (React + MongoDB)

Mobile-first booking app for a beauty salon (single master).
Palette: yellow/purple. Timezone: Europe/Dublin.

## Quick start
```bash
npm install
cp apps/api/.env.example apps/api/.env
# edit apps/api/.env (set MONGODB_URI)
npm run dev
```

- Web: http://localhost:5173
- API: http://localhost:4000

## MongoDB (IMPORTANT)
Do NOT commit real passwords. Use `.env` locally, and set secrets in your hosting provider.

## Default settings
- Work days: Tue–Sat
- Hours: 10:00–18:00
- Step: 15 minutes
- Admin PIN header: `x-admin-pin`

## API
- GET  /api/services
- GET  /api/slots?serviceId=...&date=YYYY-MM-DD
- POST /api/bookings
- GET  /api/admin/bookings?date=YYYY-MM-DD   (requires `x-admin-pin`)
- POST /api/admin/block                       (requires `x-admin-pin`)
  - blocks a time range (creates a "blocked" booking)

## Notes
This is an MVP template:
- services are auto-seeded on first run if DB is empty
- conflict prevention uses overlap check on (startAt,endAt)

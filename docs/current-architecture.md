# Current architecture audit (post-refactor stage)

## Monorepo layout
- `apps/api`: Express + MongoDB (Mongoose) API.
- `apps/web`: Vite + React booking/admin UI.

## API routes map
- Public:
  - `GET /health`
  - `GET /api/services`
  - `GET /api/slots?serviceId&date`
  - `POST /api/bookings`
  - `GET /api/catalog`
- Admin auth:
  - `POST /api/admin/login`
- Admin protected:
  - `GET /api/admin/bookings?date&range`
  - `POST /api/admin/block`
  - `PATCH /api/admin/bookings/:id/status`
  - `POST /api/admin/push/subscribe`
  - `GET /api/admin/push/stream?token&clientId`

## Data model map
- `Service`: catalog service definitions.
- `Booking`: customer booking lifecycle entity with statuses (`pending|confirmed|declined|cancelled|completed|no_show`).
- `AvailabilityBlock`: dedicated non-customer blocked-time entity.
- `NotificationLog`: async notification delivery outcomes.
- `PushSubscription`: admin SSE/push stream subscriptions.

## Auth flow
- Primary admin auth is JWT bearer token (`Authorization: Bearer ...`).
- Transitional compatibility layer supports `x-admin-pin` for protected admin routes when configured.
- Unauthorized responses normalized as `401 { error, code }`.

## Booking flow
1. Frontend selects service/date/time and posts `POST /api/bookings` with UTC `startAt`.
2. `booking.service` resolves service duration and computes end time.
3. Availability conflict check runs against **both** `Booking` (blocking statuses) and `AvailabilityBlock`.
4. Booking persists independently of notifications.
5. Notifications run async; failures are logged to `NotificationLog` and do not rollback booking.

## Slots logic
- Slot generation uses Europe/Dublin local calendar day and converts to UTC for persisted overlap checks.
- Busy range lookup includes `Booking` statuses (`pending`, `confirmed`) and active `AvailabilityBlock` ranges.

## Notifications
- Email sending via `sendBookingEmail` is wrapped by `notification.service`.
- Result persisted to `NotificationLog` with `success|failed` status.
- Admin live stream remains best-effort SSE.

## Seed logic
- Startup uses `seedServicesIfEmpty()` (safe default for first run).
- Explicit deterministic seed reset available via script: `npm --workspace apps/api run seed:reset`.
- Test strategy should use fixtures/mocks and not rely on startup autoseed side effects.

## Backward compatibility notes
- Legacy “blocked booking” representation has been replaced with `AvailabilityBlock` model.
- API compatibility preserved at `/api/admin/block` endpoint shape.
- Legacy `x-admin-pin` is temporary and documented for phased removal.

# Current architecture audit

## Monorepo layout and module paths
- API app: `apps/api`
  - Entry: `apps/api/src/server.ts`
  - Express composition: `apps/api/src/app.ts`
  - Models: `apps/api/src/models.ts`
  - Domain rules: `apps/api/src/domain/*`
  - Services: `apps/api/src/services/*`
  - Routes: `apps/api/src/routes/*`
  - Tests: `apps/api/src/__tests__/*`
- Web app: `apps/web`
  - Entry: `apps/web/src/main.tsx`
  - Router: `apps/web/src/router.tsx`
  - Views: `apps/web/src/views/*`
  - API clients: `apps/web/src/api/*`
  - Tests: `apps/web/src/__tests__/*`

## Booking safety and lifecycle
- Booking lifecycle statuses: `pending`, `confirmed`, `declined`, `cancelled`, `completed`, `no_show`.
- Creation now uses a global Mongo lock document (`BookingCreationLock`) to serialize overlap checks and inserts.
- Conflict checks always include both `Booking` (blocking statuses) and `AvailabilityBlock`.

## Availability engine
- Busy ranges are fetched from both `Booking` and `AvailabilityBlock` and merged in `mergeBusyRanges`.
- Slots are generated from working hours and filtered by merged busy ranges.
- API returns both UTC and Europe/Dublin local timestamps (`startAt`, `endAt`, `startAtLocal`, `endAtLocal`).

## Notifications
- Booking creation only enqueues notifications (does not await delivery).
- Queue persistence is done in `NotificationLog` (`pending/success/failed`, attempts, retry scheduling).
- Background worker (`runNotificationWorkerOnce`) retries failed notifications with backoff.

## Admin and auth
- JWT bearer remains primary auth.
- `x-admin-pin` remains optional compatibility layer.
- New calendar endpoint: `GET /api/admin/calendar?date=YYYY-MM-DD&range=day|week` returns bookings and availability blocks.

## Timezone safety
- Datastore remains UTC for all persisted datetimes.
- API boundary adds Europe/Dublin local projection fields where needed.

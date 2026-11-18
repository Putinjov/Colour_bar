# Security release checklist

- The public Git history contains committed environment files. Treat all credentials in those files as compromised. Rotate MongoDB database credentials, JWT signing secret, administrator password, Resend and any legacy SMTP credentials; remove the legacy admin PIN from deployment and frontend configuration.
- Update Render environment variables and Vercel configuration before redeploying. Never put secrets in VITE_* variables.
- Rebuild both applications from source. Verify admin login, catalog save/reset, booking creation and notification delivery. Existing JWT sessions will expire when the signing secret changes.
- Removing tracked files does not erase Git history. After rotation, coordinate history cleanup and review forks/caches. Do not publish old values in issues or logs.
- Catalog GET remains public; PUT and reset require an administrator JWT.
- Follow-up: rate limit login and booking requests, replace query-string JWT SSE with real Web Push, review CORS, secret scanning and deployment health.

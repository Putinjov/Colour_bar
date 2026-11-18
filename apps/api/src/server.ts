import "dotenv/config";
import mongoose from "mongoose";
import app from "./app.js";
import { seedServicesIfEmpty } from "./seed.js";
import { runNotificationWorkerOnce } from "./services/notification.service.js";


const PORT = Number(process.env.PORT ?? 4000);
const MONGODB_URI = process.env.MONGODB_URI ?? "";

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is missing. Create apps/api/.env from .env.example");
  process.exit(1);
}

async function main() {
  await mongoose.connect(MONGODB_URI);
  await seedServicesIfEmpty();

  const workerIntervalMs = Number(process.env.NOTIFICATION_WORKER_INTERVAL_MS ?? 5_000);
  setInterval(() => {
    void runNotificationWorkerOnce().catch((error) => {
      console.error("notification worker failed", error);
    });
  }, workerIntervalMs);

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 API on http://localhost:${PORT}`);
  });
}

main().catch((e) => {
  console.error("❌ Fatal:", e);
  process.exit(1);
});

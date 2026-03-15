import dotenv from "dotenv";
import mongoose from "mongoose";
import { resetServicesSeed } from "./seed.js";
dotenv.config();
async function run() {
    const uri = process.env.MONGODB_URI;
    if (!uri)
        throw new Error("MONGODB_URI missing");
    await mongoose.connect(uri);
    await resetServicesSeed();
    await mongoose.disconnect();
    console.log("seed:reset complete");
}
run().catch((e) => {
    console.error(e);
    process.exit(1);
});

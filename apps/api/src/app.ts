import express from "express";
import cors from "cors";
import catalogRouter from "./routes/catalog.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/catalog", catalogRouter);

// опціонально — щоб / не давав 404
app.get("/", (_req, res) => {
  res.json({ status: "ok" });
});

export default app;

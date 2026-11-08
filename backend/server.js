import "dotenv/config";
import express from "express";
import cors from "cors";

import authRouter from "./src/modules/auth/auth.routes.js";
import { connectDb } from "./src/config/db.js";
import marketRoutes from "./src/modules/market/market.routes.js";
import paymentRoutes from "./src/modules/payments/payment.auth.js";

const app = express();

const PORT = process.env.PORT || 5001;

app.use(
  cors({
    origin: "https://upfund-seven.vercel.app",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = Buffer.from(buf);
    },
  })
);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Upfund API is running.",
  });
});

app.use("/api/auth", authRouter);
app.use("/api/market", marketRoutes);
app.use("/api/payments", paymentRoutes);

async function startServer() {
  try {
    await connectDb();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on 0.0.0.0:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
}

startServer();
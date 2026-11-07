import "dotenv/config";
import express from "express"
import cors from "cors"
import authRouter from "./src/modules/auth/auth.routes.js";
import { connectDb } from "./src/config/db.js";
import marketRoutes from "./src/modules/market/market.routes.js";
import paymentRoutes from "./src/modules/payments/payment.auth.js";

const app = express();
const PORT = process.env.PORT
app.use(cors())
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = Buffer.from(buf);
    },
  })
);
app.use('/api/auth', authRouter)
app.use('/api/market', marketRoutes)
app.use('/api/payments', paymentRoutes)
connectDb().then(()=>{
app.listen(PORT, ()=>{
    console.log(`Server Running on Port ${PORT}`);
})
})

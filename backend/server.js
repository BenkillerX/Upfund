dotenv.config()
import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import authRouter from "./src/modules/auth/auth.routes.js";
import { connectDb } from "./src/config/db.js";
import marketRoutes from "./src/modules/market/market.routes.js";

const app = express();
const PORT = process.env.PORT
app.use(cors())
app.use(express.json())
app.use('/api/auth', authRouter)
app.use('/api/market', marketRoutes)
connectDb().then(()=>{
app.listen(PORT, ()=>{
    console.log(`Server Running on Port ${PORT}`);
})
})

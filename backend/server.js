import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import authRouter from "./src/modules/auth/auth.routes.js";
import { connectDb } from "./src/config/db.js";

dotenv.config()
const app = express();
const PORT = process.env.PORT
app.use(cors())
app.use(express.json())
app.use('/api/auth', authRouter)

connectDb().then(()=>{
app.listen(PORT, ()=>{
    console.log(`Server Running on Port ${PORT}`);
})
})

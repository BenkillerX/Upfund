import { Router } from "express";
import { getCurrentUser, login, register } from "./auth.controller.js";

const authRouter = Router()
authRouter.post('/register', register)
authRouter.post('login', login)
authRouter.post('/me', getCurrentUser)


export default authRouter;
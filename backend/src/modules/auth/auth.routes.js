import { Router } from "express";
import { getCurrentUser, login, register } from "./auth.controller.js";
import { registerValidator } from "../../validators/auth.validators.js";
import { authenticateToken } from "../../middlewares/auth.middleware.js";

const authRouter = Router()
authRouter.post('/register', registerValidator, register)
authRouter.post('login', login)
authRouter.post('/me', authenticateToken,getCurrentUser)


export default authRouter;
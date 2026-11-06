import { Router } from "express";
import { getCurrentUser, login, register,updateBankAccount, updateProfile } from "./auth.controller.js";
import { registerValidator } from "../../validators/auth.validators.js";
import { authenticateToken } from "../../middlewares/auth.middleware.js";

const authRouter = Router()
authRouter.post('/register', registerValidator, register)
authRouter.post('/login', login)
authRouter.get('/me', authenticateToken,getCurrentUser)
authRouter.patch( "/bank-account", authenticateToken, updateBankAccount );
authRouter.patch( "/profile", authenticateToken, updateProfile );
export default authRouter;
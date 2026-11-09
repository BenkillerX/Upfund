import { Router } from "express";
import { getCurrentUser, getDashboardTransactions, getReferralHistory, getReferralStats, login, register,updateBankAccount, updateProfile,testEndpoint } from "./auth.controller.js";
import { registerValidator } from "../../validators/auth.validators.js";
import { authenticateToken } from "../../middlewares/auth.middleware.js";
const authRouter = Router()
authRouter.post('/register', registerValidator, register)
authRouter.post('/login', login)
authRouter.get('/me', authenticateToken,getCurrentUser)
authRouter.patch( "/bank-account", authenticateToken, updateBankAccount );
authRouter.patch( "/profile", authenticateToken, updateProfile );
authRouter.get("/referrals/stats", authenticateToken, getReferralStats);
authRouter.get("/referrals/history", authenticateToken, getReferralHistory);
authRouter.get( "/dashboard/transactions", authenticateToken, getDashboardTransactions );
authRouter.get( "/forgot-password", testEndpoint );

export default authRouter;
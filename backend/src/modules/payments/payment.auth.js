import {Router} from "express";
import { deposit, verifyDeposit, paystackWebhook, withdraw} from "./payments.controllers.js";
import { authenticateToken } from "../../middlewares/auth.middleware.js";

const paymentRoutes = Router();
paymentRoutes.post("/deposit", authenticateToken,deposit)
paymentRoutes.get( "/deposit/verify/:reference", authenticateToken, verifyDeposit );
paymentRoutes.post("/paystack/webhook", paystackWebhook);
paymentRoutes.post("/withdraw", authenticateToken,withdraw)
export default paymentRoutes;
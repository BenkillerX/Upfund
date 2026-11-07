import {Router} from "express";
import { deposit, verifyDeposit, paystackWebhook} from "./payments.controllers.js";
import { authenticateToken } from "../../middlewares/auth.middleware.js";

const paymentRoutes = Router();
paymentRoutes.post("/deposit", authenticateToken,deposit)
paymentRoutes.get( "/deposit/verify/:reference", authenticateToken, verifyDeposit );
paymentRoutes.post("/paystack/webhook", paystackWebhook);
export default paymentRoutes;
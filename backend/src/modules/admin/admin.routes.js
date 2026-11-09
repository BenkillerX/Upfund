import { authenticateToken } from "../../middlewares/auth.middleware.js";
import { authorizeRoles } from "../../middlewares/role.middleware.js";
import { getDashboardStats, getAllUsers, getUserDetails, getAllWithdrawals, updateWithdrawalStatus, } from "./admin.controller.js";
import { Router } from "express";

const adminRoutes = Router();

adminRoutes.get("/dashboard", authenticateToken,authorizeRoles("admin"), getDashboardStats);

adminRoutes.get("/users", authenticateToken,authorizeRoles("admin"), getAllUsers);

adminRoutes.get("/users/:userId", authenticateToken,authorizeRoles("admin"), getUserDetails);

adminRoutes.get("/withdrawals", authenticateToken,authorizeRoles("admin"), getAllWithdrawals);

adminRoutes.patch("/withdrawals/:withdrawalId",authenticateToken, authorizeRoles("admin"), updateWithdrawalStatus);
export default adminRoutes;

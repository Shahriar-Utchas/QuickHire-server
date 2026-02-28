import { Router } from "express";
import {
  loginAdmin,
  refreshAdminAccessToken,
  getAdminMe,
  logoutAdmin,
} from "#controllers/adminAuthController.js";
import { protectAdmin } from "#middlewares/adminAuthMiddleware.js";

const router = Router();

router.post("/login", loginAdmin);
router.post("/refresh", refreshAdminAccessToken);
router.post("/logout", logoutAdmin);
router.get("/me", protectAdmin, getAdminMe);

export default router;

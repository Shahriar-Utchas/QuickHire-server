import { Router } from "express";
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  getMe,
  logoutUser,
} from "#controllers/authController.js";
import { protect } from "#middlewares/authMiddleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshAccessToken);
router.post("/logout", logoutUser);
router.get("/me", protect, getMe);

export default router;

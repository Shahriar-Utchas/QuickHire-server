import { Router } from "express";
import { protect } from "#middlewares/authMiddleware.js";

const router = Router();

// All routes here require user authentication
router.use(protect);

// Add user-protected routes here as the app grows
// e.g. router.get("/applications", getUserApplications);

export default router;

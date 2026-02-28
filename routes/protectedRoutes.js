import { Router } from "express";
import { protect } from "#middlewares/authMiddleware.js";
import {
  applyToJobAuth,
  getMyApplications,
  checkApplicationStatus,
  updateProfile,
} from "#controllers/applicationController.js";

const router = Router();

// All routes here require user authentication
router.use(protect);

router.post("/jobs/:id/apply", applyToJobAuth);
router.get("/applications", getMyApplications);
router.get("/applications/:jobId/check", checkApplicationStatus);
router.patch("/profile", updateProfile);

export default router;

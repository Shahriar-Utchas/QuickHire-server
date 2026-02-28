import { Router } from "express";
import { protectAdmin } from "#middlewares/adminAuthMiddleware.js";
import {
  createJob,
  getAdminJobs,
  updateJob,
  deleteJob,
} from "#controllers/jobController.js";

const router = Router();

// All routes here require admin authentication
router.use(protectAdmin);

router.route("/jobs").get(getAdminJobs).post(createJob);
router.route("/jobs/:id").patch(updateJob).delete(deleteJob);

export default router;

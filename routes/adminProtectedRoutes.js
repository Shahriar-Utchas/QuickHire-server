import { Router } from "express";
import { protectAdmin } from "#middlewares/adminAuthMiddleware.js";
import {
  createJob,
  getAdminJobs,
  updateJob,
  deleteJob,
} from "#controllers/jobController.js";
import { getAllApplications, getAllUsers } from "#controllers/applicationController.js";

const router = Router();

// All routes here require admin authentication
router.use(protectAdmin);

router.route("/jobs").get(getAdminJobs).post(createJob);
router.route("/jobs/:id").patch(updateJob).delete(deleteJob);
router.get("/applications", getAllApplications);
router.get("/users", getAllUsers);

export default router;

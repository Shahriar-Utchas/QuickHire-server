import { Router } from "express";
import {
  getJobs,
  getJobById,
  getJobsByCategory,
  getCategories,
} from "#controllers/publicController.js";

const router = Router();

// No authentication required
router.get("/jobs", getJobs);
router.get("/jobs/category/:category", getJobsByCategory);
router.get("/jobs/:id", getJobById);
router.get("/categories", getCategories);

export default router;

import { Router } from "express";
import {
  getJobs,
  getJobById,
  getJobsByCategory,
  getCategories,
  getCompanies,
  getJobsByCompany,
} from "#controllers/publicController.js";
import { applyToJobPublic } from "#controllers/applicationController.js";

const router = Router();

// No authentication required
router.get("/jobs", getJobs);
router.get("/jobs/category/:category", getJobsByCategory);
router.get("/jobs/:id", getJobById);
router.post("/jobs/:id/apply", applyToJobPublic);
router.get("/categories", getCategories);
router.get("/companies", getCompanies);
router.get("/companies/:name/jobs", getJobsByCompany);

export default router;

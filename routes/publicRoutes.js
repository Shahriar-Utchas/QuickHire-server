import { Router } from "express";
import {
  getJobs,
  getJobById,
  getJobsByCategory,
  getCategories,
  getCompanies,
  getJobsByCompany,
} from "#controllers/publicController.js";

const router = Router();

// No authentication required
router.get("/jobs", getJobs);
router.get("/jobs/category/:category", getJobsByCategory);
router.get("/jobs/:id", getJobById);
router.get("/categories", getCategories);
router.get("/companies", getCompanies);
router.get("/companies/:name/jobs", getJobsByCompany);

export default router;

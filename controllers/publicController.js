import asyncHandler from "express-async-handler";
import Job from "#models/jobModel.js";

// @desc    Get all jobs (public)
// @route   GET /api/public/jobs
const getJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({}).sort({ createdAt: -1 });
  res.json(jobs);
});

// @desc    Get single job by id (public)
// @route   GET /api/public/jobs/:id
const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  res.json(job);
});

// @desc    Get jobs by category (public)
// @route   GET /api/public/jobs/category/:category
const getJobsByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;
  const jobs = await Job.find({ category: category }).sort({ createdAt: -1 });
  res.json(jobs);
});

// @desc    Get categories with job counts (public)
// @route   GET /api/public/categories
const getCategories = asyncHandler(async (_req, res) => {
  const categories = await Job.aggregate([
    { $unwind: "$category" },
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        name: "$_id",
        jobCount: "$count",
      },
    },
    {
      $sort: { name: 1 },
    },
  ]);

  res.json(categories);
});

// @desc    Get all companies with job counts (public)
// @route   GET /api/public/companies
const getCompanies = asyncHandler(async (_req, res) => {
  const companies = await Job.aggregate([
    {
      $group: {
        _id: "$companyName",
        jobCount: { $sum: 1 },
        logo: { $first: "$logo" },
        categories: { $addToSet: "$category" },
      },
    },
    {
      $project: {
        _id: 0,
        name: "$_id",
        jobCount: 1,
        logo: 1,
        categories: {
          $reduce: {
            input: "$categories",
            initialValue: [],
            in: { $setUnion: ["$$value", "$$this"] },
          },
        },
      },
    },
    { $sort: { name: 1 } },
  ]);

  res.json(companies);
});

// @desc    Get jobs by company name (public)
// @route   GET /api/public/companies/:name/jobs
const getJobsByCompany = asyncHandler(async (req, res) => {
  const { name } = req.params;
  const jobs = await Job.find({ companyName: name }).sort({ createdAt: -1 });
  res.json(jobs);
});

export { getJobs, getJobById, getJobsByCategory, getCategories, getCompanies, getJobsByCompany };

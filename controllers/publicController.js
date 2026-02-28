import asyncHandler from "express-async-handler";
import Job from "#models/jobModel.js";

// @desc    Get all jobs (public) with optional search & filter
// @route   GET /api/public/jobs?search=keyword&location=loc&category=cat&time=type
const getJobs = asyncHandler(async (req, res) => {
  const { search, location, category, time } = req.query;
  const filter = {};

  if (search) {
    const regex = new RegExp(search, "i");
    filter.$or = [
      { jobName: regex },
      { companyName: regex },
      { description: regex },
    ];
  }

  if (location) {
    filter.location = new RegExp(`^${location}$`, "i");
  }

  if (category) {
    filter.category = category;
  }

  if (time) {
    filter.time = time;
  }

  const jobs = await Job.find(filter).sort({ createdAt: -1 });
  res.json(jobs);
});

// @desc    Get all unique locations from jobs (public)
// @route   GET /api/public/locations
const getLocations = asyncHandler(async (_req, res) => {
  const locations = await Job.distinct("location");
  locations.sort((a, b) => a.localeCompare(b));
  res.json(locations);
});

// @desc    Search jobs by keyword (returns limited results for autocomplete)
// @route   GET /api/public/jobs/search?q=keyword
const searchJobs = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q || q.trim().length === 0) {
    return res.json([]);
  }
  const regex = new RegExp(q, "i");
  const jobs = await Job.find({
    $or: [{ jobName: regex }, { companyName: regex }],
  })
    .select("jobName companyName location logo time")
    .sort({ createdAt: -1 })
    .limit(8);
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

// @desc    Get all companies with job counts (public) with optional search
// @route   GET /api/public/companies?search=keyword
const getCompanies = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const matchStage = {};

  if (search) {
    const regex = new RegExp(search, "i");
    matchStage.$or = [
      { companyName: regex },
      { category: regex },
    ];
  }

  const pipeline = [];
  if (Object.keys(matchStage).length > 0) {
    pipeline.push({ $match: matchStage });
  }

  pipeline.push(
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
    { $sort: { name: 1 } }
  );

  const companies = await Job.aggregate(pipeline);
  res.json(companies);
});

// @desc    Get jobs by company name (public)
// @route   GET /api/public/companies/:name/jobs
const getJobsByCompany = asyncHandler(async (req, res) => {
  const { name } = req.params;
  const jobs = await Job.find({ companyName: name }).sort({ createdAt: -1 });
  res.json(jobs);
});

export { getJobs, getJobById, getJobsByCategory, getCategories, getCompanies, getJobsByCompany, getLocations, searchJobs };

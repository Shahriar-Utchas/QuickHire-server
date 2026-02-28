import asyncHandler from "express-async-handler";
import Job from "#models/jobModel.js";

// @desc    Create a new job
// @route   POST /api/admin-protected/jobs
const createJob = asyncHandler(async (req, res) => {
  const { jobName, category, time, location, companyName, logo, description } =
    req.body;

  if (
    !jobName ||
    !category ||
    !Array.isArray(category) ||
    category.length === 0 ||
    !time ||
    !location ||
    !companyName ||
    !description
  ) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  const job = await Job.create({
    jobName,
    category,
    time,
    location,
    companyName,
    logo: logo || "",
    description,
    createdBy: req.admin._id,
  });

  res.status(201).json(job);
});

// @desc    Get all jobs (admin view)
// @route   GET /api/admin-protected/jobs
const getAdminJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({}).sort({ createdAt: -1 });
  res.json(jobs);
});

// @desc    Update a job
// @route   PATCH /api/admin-protected/jobs/:id
const updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  const allowedFields = [
    "jobName",
    "category",
    "time",
    "location",
    "companyName",
    "logo",
    "description",
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      job[field] = req.body[field];
    }
  });

  const updated = await job.save();
  res.json(updated);
});

// @desc    Delete a job
// @route   DELETE /api/admin-protected/jobs/:id
const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  await job.deleteOne();
  res.json({ message: "Job removed" });
});

export { createJob, getAdminJobs, updateJob, deleteJob };

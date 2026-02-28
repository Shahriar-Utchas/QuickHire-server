import asyncHandler from "express-async-handler";
import JobApplication from "#models/jobApplicationModel.js";
import User from "#models/userModel.js";

// @desc  Apply to a job (public / guest — no auth required)
// @route POST /api/public/jobs/:id/apply
const applyToJobPublic = asyncHandler(async (req, res) => {
  const { name, email, resumeLink, coverNote } = req.body;
  const jobId = req.params.id;

  if (!name || !email) {
    res.status(400);
    throw new Error("Name and email are required");
  }

  const application = await JobApplication.create({
    jobId,
    userId: null,
    name,
    email,
    resumeLink: resumeLink || "",
    coverNote: coverNote || "",
  });

  res.status(201).json({ message: "Application submitted", _id: application._id });
});

// @desc  Apply to a job (protected — logged-in user)
// @route POST /api/protected/jobs/:id/apply
const applyToJobAuth = asyncHandler(async (req, res) => {
  const { name, email, resumeLink, coverNote } = req.body;
  const jobId = req.params.id;
  const userId = req.user._id;

  if (!name || !email) {
    res.status(400);
    throw new Error("Name and email are required");
  }

  const existing = await JobApplication.findOne({ jobId, userId });
  if (existing) {
    res.status(400);
    throw new Error("You have already applied for this job");
  }

  const application = await JobApplication.create({
    jobId,
    userId,
    name,
    email,
    resumeLink: resumeLink || "",
    coverNote: coverNote || "",
  });

  res.status(201).json({ message: "Application submitted", _id: application._id });
});

// @desc  Get the logged-in user's applications
// @route GET /api/protected/applications
const getMyApplications = asyncHandler(async (req, res) => {
  const applications = await JobApplication.find({ userId: req.user._id })
    .populate("jobId", "jobName companyName logo location time category")
    .sort({ createdAt: -1 });
  res.json(applications);
});

// @desc  Check whether the logged-in user has applied to a specific job
// @route GET /api/protected/applications/:jobId/check
const checkApplicationStatus = asyncHandler(async (req, res) => {
  const existing = await JobApplication.findOne({
    jobId: req.params.jobId,
    userId: req.user._id,
  });
  res.json({ applied: !!existing, applicationId: existing?._id || null });
});

// @desc  Update user profile (name, resumeLink)
// @route PATCH /api/protected/profile
const updateProfile = asyncHandler(async (req, res) => {
  const { name, resumeLink } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (name !== undefined) user.name = name;
  if (resumeLink !== undefined) user.resumeLink = resumeLink;

  const updated = await user.save();

  res.json({
    _id: updated._id,
    name: updated.name,
    email: updated.email,
    resumeLink: updated.resumeLink || "",
  });
});

// @desc  Get ALL applications (admin)
// @route GET /api/admin-protected/applications
const getAllApplications = asyncHandler(async (req, res) => {
  const applications = await JobApplication.find()
    .populate("jobId", "jobName companyName location time")
    .populate("userId", "name email")
    .sort({ createdAt: -1 });
  res.json(applications);
});

// @desc  Get ALL users (admin)
// @route GET /api/admin-protected/users
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find()
    .select("-password")
    .sort({ createdAt: -1 });
  res.json(users);
});

export {
  applyToJobPublic,
  applyToJobAuth,
  getMyApplications,
  checkApplicationStatus,
  updateProfile,
  getAllApplications,
  getAllUsers,
};

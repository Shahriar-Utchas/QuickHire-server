import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "#models/adminModel.js";

// Admin tokens use completely separate secrets so they can NEVER
// be confused with user tokens (and vice-versa).

const generateAdminAccessToken = (id) => {
  return jwt.sign({ id, role: "admin" }, process.env.ADMIN_JWT_SECRET, {
    expiresIn: "15m",
  });
};

const generateAdminRefreshToken = (id) => {
  return jwt.sign({ id, role: "admin" }, process.env.ADMIN_REFRESH_SECRET, {
    expiresIn: "30d",
  });
};

const setAdminRefreshCookie = (res, refreshToken) => {
  res.cookie("adminRefreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    path: "/",
  });
};

// @desc    Login admin
// @route   POST /api/admin/auth/login
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });

  if (admin && (await bcrypt.compare(password, admin.password))) {
    setAdminRefreshCookie(res, generateAdminRefreshToken(admin._id));

    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      accessToken: generateAdminAccessToken(admin._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid admin credentials");
  }
});

// @desc    Get new admin access token using refresh cookie
// @route   POST /api/admin/auth/refresh
const refreshAdminAccessToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.adminRefreshToken;

  if (!token) {
    res.status(401);
    throw new Error("No refresh token");
  }

  try {
    const decoded = jwt.verify(token, process.env.ADMIN_REFRESH_SECRET);
    const admin = await Admin.findById(decoded.id).select("-password");

    if (!admin) {
      res.status(401);
      throw new Error("Admin not found");
    }

    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      accessToken: generateAdminAccessToken(admin._id),
    });
  } catch {
    res.status(401);
    throw new Error("Invalid refresh token");
  }
});

// @desc    Get current admin
// @route   GET /api/admin/auth/me
const getAdminMe = asyncHandler(async (req, res) => {
  res.json(req.admin);
});

// @desc    Logout admin (clear refresh cookie)
// @route   POST /api/admin/auth/logout
const logoutAdmin = asyncHandler(async (_req, res) => {
  res.cookie("adminRefreshToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    expires: new Date(0),
    path: "/",
  });
  res.json({ message: "Admin logged out" });
});

export { loginAdmin, refreshAdminAccessToken, getAdminMe, logoutAdmin };

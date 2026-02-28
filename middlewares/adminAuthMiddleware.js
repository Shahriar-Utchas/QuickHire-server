import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import Admin from "#models/adminModel.js";

const { verify } = jwt;

// Protects admin-only routes.
// Uses ADMIN_JWT_SECRET — a user's regular token will ALWAYS fail here.
const protectAdmin = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = verify(token, process.env.ADMIN_JWT_SECRET);

      if (decoded.role !== "admin") {
        res.status(403);
        throw new Error("Not authorized as admin");
      }

      req.admin = await Admin.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, admin token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

export { protectAdmin };

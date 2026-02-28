import { Router } from "express";

import authRoutes from "./authRoutes.js";
import adminAuthRoutes from "./adminAuthRoutes.js";
import adminProtectedRoutes from "./adminProtectedRoutes.js";
import protectedRoutes from "./protectedRoutes.js";
import publicRoutes from "./publicRoutes.js";

const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/admin/auth", adminAuthRoutes);
routes.use("/admin-protected", adminProtectedRoutes);
routes.use("/protected", protectedRoutes);
routes.use("/public", publicRoutes);

export default routes;

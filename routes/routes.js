import { Router } from "express";

import authRoutes from "./authRoutes.js";
import adminAuthRoutes from "./adminAuthRoutes.js";

const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/admin/auth", adminAuthRoutes);

export default routes;

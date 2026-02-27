import { Router } from "express";

import authRoutes from "./authRoutes.js";

const routes = Router();

routes.use("/auth", authRoutes);

export default routes;

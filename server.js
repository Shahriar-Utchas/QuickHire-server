import express from "express";
import environment from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";
import routes from "./routes/routes.js";

environment.config();
const port = process.env.PORT || 5000;
connectDB();
const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.status(200).json({
    message: "QuickHire API is running!",
  });
});

app.use("/api", routes);

app.use(express.static("public"));

app.use(errorHandler);
app.listen(port, () => {
  console.log(`Server started on port ${port}.`);
});

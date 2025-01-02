import dotenv from "dotenv";
dotenv.config({});

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectToMongoose } from "./mongoConfig.js";
import userRouter from "./routes/user.routes.js";
import companyRouter from "./routes/company.routes.js";
import jobRouter from "./routes/job.routes.js";
import applicationRouter from "./routes/application.routes.js";
import isAuthenticated from "./middlewares/isAuthenticated.js";

const port = process.env.PORT || 3100;

const app = express();

// setting up the required middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Allow all origins and methods with CORS
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  })
);

// APIs
app.use("/api/v1/users/", userRouter);
app.use("/api/v1/company/", isAuthenticated, companyRouter);
app.use("/api/v1/job/", isAuthenticated, jobRouter);
app.use("/api/v1/application/", isAuthenticated, applicationRouter);

app.listen(port, () => {
  console.log(`Server is Running on Port : ${port}`);
  connectToMongoose();
});

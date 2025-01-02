import express from "express";
import {
  getAdminJobs,
  getAllJobs,
  getJobById,
  postJob,
} from "../controllers/job.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const jobRouter = express.Router();

// post a job by recruiter
jobRouter.post("/post", isAuthenticated, postJob);
// get all jobs by student
jobRouter.get("/get", getAllJobs);
// get job by id
jobRouter.get("/get/:id", isAuthenticated, getJobById);
// get jobs for recruiter (by his logged in userId)
jobRouter.get("/getAdminJobs", isAuthenticated, getAdminJobs);

export default jobRouter;

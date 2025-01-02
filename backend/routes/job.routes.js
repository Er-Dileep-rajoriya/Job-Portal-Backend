import express from "express";
import {
  getAdminJobs,
  getAllJobs,
  getJobById,
  postJob,
} from "../controllers/job.controller.js";

const jobRouter = express.Router();

// post a job by recruiter
jobRouter.post("/post", postJob);
// get all jobs by student
jobRouter.get("/get", getAllJobs);
// get job by id
jobRouter.get("/get/:id", getJobById);
// get jobs for recruiter (by his logged in userId)
jobRouter.get("/getAdminJobs", getAdminJobs);

export default jobRouter;

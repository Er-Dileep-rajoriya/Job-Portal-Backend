import express from "express";
import {
  applyJob,
  getApplicants,
  getAppliedJobs,
  updateJobStatus,
} from "../controllers/application.controller.js";

const applicationRouter = express.Router();

applicationRouter.get("/apply/:id", applyJob);
applicationRouter.get("/get", getAppliedJobs);
applicationRouter.get("/:id/applicants", getApplicants);
applicationRouter.put("/status/:id/update", updateJobStatus);

export default applicationRouter;

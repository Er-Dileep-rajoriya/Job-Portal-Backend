import mongoose from "mongoose";
import { Job } from "../models/job.model.js";

// admin job create karega
export const postJob = async (req, res) => {
  const {
    title,
    description,
    requirements,
    salary,
    experience,
    location,
    jobType,
    position,
    companyId,
  } = req.body;

  if (
    !title ||
    !description ||
    !requirements ||
    !salary ||
    !experience ||
    !location ||
    !jobType ||
    !position ||
    !companyId
  ) {
    return res.status(400).json({
      message: "Something is Missing!",
      success: false,
    });
  }

  const createdJob = await Job.create({
    title,
    description,
    requirements: requirements.split(","),
    salary: parseFloat(salary),
    experienceLevel: experience,
    location,
    jobType,
    position,
    created_by: req.userId,
    company: companyId,
  });

  return res.status(201).json({
    message: "Job Successfully Created.",
    success: true,
    job: createdJob,
  });
};

// student service
export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";

    // filter jobs by title and description
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };

    const jobs = await Job.find(query)
      .populate({ path: "company" })
      .sort({ createdAt: -1 });

    if (!jobs) {
      return res.status(404).json({
        message: "Jobs Not Found!",
        success: false,
      });
    }

    return res.status(200).json({
      jobs,
      success: true,
      message: "Jobs Found",
    });
  } catch (err) {
    console.log(err);
  }
};

// student service
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;

    if (!mongoose.isValidObjectId(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Job id!",
      });
    }

    const job = await Job.findById(jobId).populate({
      path: "applications",
    });

    if (!job) {
      return res.status(404).json({
        message: "Job Not Found!",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Job Found.",
      job,
      success: true,
    });
  } catch (err) {
    console.log(err);
  }
};

// admin ne job bhi jobs create ki he vo return hogi
export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.userId;

    const jobs = await Job.find({ created_by: adminId }).populate({
      path: "company",
      createdAt: -1,
    });

    if (!jobs) {
      return res.status(404).json({
        message: "Jobs Not Found!",
        success: false,
      });
    }

    return res.status(200).json({
      jobs,
      success: true,
      message: "Jobs Found.",
    });
  } catch (error) {
    console.log(error);
  }
};

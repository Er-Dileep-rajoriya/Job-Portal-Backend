import mongoose from "mongoose";
import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

export const applyJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.userId;

    if (!mongoose.isValidObjectId(jobId)) {
      return res.status(400).json({
        message: "Invalid Job Id in Params!",
        success: false,
      });
    }

    if (!jobId) {
      return res.status(400).json({
        message: "Job Id is Required!",
        success: false,
      });
    }

    // check if this user has already applied for this job
    const application = await Application.findOne({
      job: jobId,
      applicant: userId,
    });

    // if user is already applied then return back with error
    if (application) {
      return res.status(400).json({
        message: "You have Already Applied!",
        success: false,
      });
    }

    // check job exists or not with given jobId
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(400).json({
        message: "Invalid Job id!",
        success: false,
      });
    }

    // if everything goes perfect then create new application
    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
    });

    // push user into jobApplication
    job.applications.push(newApplication._id);
    await job.save();

    return res.status(201).json({
      message: "Successfully Applied!",
      job,
      success: true,
    });
  } catch (err) {
    console.log(err);
  }
};

export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.userId;

    const applications = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "company",
          options: { sort: { createdAt: -1 } },
        },
      });

    if (!applications) {
      return res.status(404).json({
        message: "No Applications Found!",
        success: false,
      });
    }

    // if application found then return
    return res.status(200).json({
      applications,
      success: true,
    });
  } catch (err) {
    console.log(err);
  }
};

// recruiter can fetch how many peoples have applied for a perticular job
export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;
    if (!mongoose.isValidObjectId(jobId)) {
      return res.status(400).json({
        message: "Invalid Job Id in Params!",
        success: false,
      });
    }

    const job = await Job.findById(jobId).populate({
      path: "applications",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "applicant",
      },
    });

    if (!job) {
      return res.status(404).json({
        message: "No Job Found!",
        success: false,
      });
    }

    return res.status(200).json({
      job,
      success: true,
    });
  } catch (err) {
    console.log(err);
  }
};

export const updateJobStatus = async (req, res) => {
  try {
    const jobStatus = req.body.status;
    const applicationId = req.params.id;

    if (!mongoose.isValidObjectId(applicationId)) {
      return res.status(400).json({
        message: "Invalid application id in Params!",
        success: false,
      });
    }

    if (!jobStatus) {
      return res.status(400).json({
        message: "Job Status is Required!",
        success: false,
      });
    }

    const application = await Application.findOne({ _id: applicationId });

    if (!application) {
      return res.status(404).json({
        message: "Application Not Found!",
        success: false,
      });
    }

    // update the status
    application.status = jobStatus.toLowerCase();
    await application.save();

    return res.status(200).json({
      message: "Job Status Successfuly updated!",
      success: true,
    });
  } catch (err) {
    console.log(err);
  }
};

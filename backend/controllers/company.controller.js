import getDataUri from "../dataUriParser.js";
import { Company } from "../models/company.model.js";
import mongoose from "mongoose";
import cloudinary from "../cloudinary.js";

export const registerCompany = async (req, res) => {
  const { companyName, location } = req.body;
  const userId = req.userId;

  if (!companyName || !location) {
    return res.status(400).json({
      message: "Company name and location is Required!",
      success: false,
    });
  }

  // company name should be unique in database
  const companyFound = await Company.findOne({ name: companyName });

  console.log("company : ", companyFound);
  // if company found in database then return error message
  if (companyFound) {
    return res.status(400).json({
      message: "Company Alraedy Exists.",
      success: false,
    });
  }

  // otherwise create a company and store in database
  const createdCompany = await Company.create({
    name: companyName,
    userId,
    location,
  });

  return res.status(201).json({
    message: "Company Successfuly Created.",
    company: createdCompany,
    success: true,
  });
};

export const getCompanies = async (req, res) => {
  // this is user specific api, user can only see their own created Companies

  try {
    const userId = req.userId;

    const companies = await Company.find({ userId });

    if (!companies) {
      return res.status(404).json({
        message: "Companies Not Found!",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Companies Found",
      companies: companies,
      success: true,
    });
  } catch (err) {
    console.log("Error in Finding Companies : ", err);
  }
};

export const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id;

    if (!mongoose.isValidObjectId(companyId)) {
      return res.status(400).json({
        message: "Invalid Company Id",
        success: false,
      });
    }

    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({
        message: "Company Not Found!",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Company Found",
      company,
      success: true,
    });
  } catch (err) {
    console.log("Error in Finding Companies : ", err);
  }
};

export const updateCompanyInfo = async (req, res) => {
  try {
    const companyId = req.params.id;

    // Validate companyId
    if (!mongoose.isValidObjectId(companyId)) {
      return res.status(400).json({
        message: "Invalid Company Id",
        success: false,
      });
    }

    const { name, description, location, website } = req.body;

    const file = req.file;

    let cloudRes = "";

    if (file) {
      let fileUri = getDataUri(file);
      cloudRes = await cloudinary.uploader.upload(fileUri.content);
    }

    // Ensure there is data to update
    if (!name && !description && !location && !website && !file) {
      return res.status(400).json({
        message: "No fields to update!",
        success: false,
      });
    }

    // Check if company exists
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        message: "Company Not Found!",
        success: false,
      });
    }

    // Update fields if provided
    if (name) company.name = name;
    if (description) company.description = description;
    if (location) company.location = location;
    if (website) company.website = website;
    if (cloudRes) company.logo = cloudRes.secure_url;

    // Save the updated company
    await company.save();

    return res.status(200).json({
      message: "Company Information Updated!",
      company,
      success: true,
    });
  } catch (err) {
    console.log("Error in Updating Company Info: ", err);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: err.message,
    });
  }
};

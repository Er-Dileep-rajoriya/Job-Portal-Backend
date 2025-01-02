import express from "express";
import {
  getCompanies,
  getCompanyById,
  registerCompany,
  updateCompanyInfo,
} from "../controllers/company.controller.js";
import { singleUpload } from "../middlewares/fileUpload.js";

const companyRouter = express.Router();

companyRouter.post("/register", registerCompany);
companyRouter.get("/get/:id", getCompanyById);
companyRouter.get("/get", getCompanies);
companyRouter.put("/update/:id", singleUpload, updateCompanyInfo);

export default companyRouter;

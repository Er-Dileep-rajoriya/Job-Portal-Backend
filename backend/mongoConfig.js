import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({});
// const URL = "mongodb://127.0.0.1:27017/JobPortalDB";
const url = process.env.MONGO_URL;

export const connectToMongoose = async () => {
  try {
    await mongoose.connect(url);

    console.log("Database Successfuly Connected..");
  } catch (err) {
    console.log("Error in Connecting with Database : ", err);
  }
};

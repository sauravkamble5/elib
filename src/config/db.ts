import mongoose from "mongoose";
import { config } from "./config";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Connected to database successfully");
    });

    mongoose.connection.on("error", (err) => {
      console.log("Error in connecting to database", err);
    });

    await mongoose.connect(config.databaseUrl as string);

    // process.exit(1);
  } catch (error) {
    console.error("Failed to connect database", error);
  }
};

export default connectDB;

import dotenv from "dotenv";
dotenv.config();

import app from "./src/index";
import mongoose from "mongoose";
import { config } from "./src/utils/config";

const startServer = async () => {
  try {
    console.log("MongoDB URI:", config.mongoUri);
    await mongoose.connect(config.mongoUri!);
    console.log("Connected to MongoDB");
    
    const port = config.port || 3000;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

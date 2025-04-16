import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Config_Url } from "../config";
import { errorHandler } from "./middleware/errorHandler";
import Salesroutes from "./routes/salesroutes";

// Load .env variables
dotenv.config();

// Create Express app
const app: Application = express();
const PORT = Config_Url.PORT || 5000;
const MONGO_URI = Config_Url.MONGO_URL || "";

// Middleware
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/sales", Salesroutes);

// global decclare values
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}

// Connect to MongoDB and start server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

app.use(errorHandler);

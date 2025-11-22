import mongoose from "mongoose";
import dotenv from 'dotenv';
import fs from "fs";

dotenv.config();

export async function connectDB() {
    const mongoUriPath = process.env.MONGO_URI_FILE || "";
    const mongoUri = fs.readFileSync(mongoUriPath, "utf8");
    try {
        await mongoose.connect(mongoUri);
        console.log("Connected to MongoDB");
    }catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}
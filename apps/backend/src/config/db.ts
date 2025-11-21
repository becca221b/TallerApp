import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

export async function connectDB() {
    if (!process.env.MONGO_DB_URI) {
        throw new Error('MONGO_URI is not defined in your .env file');
    }
    try {
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log("Connected to MongoDB");
    }catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}
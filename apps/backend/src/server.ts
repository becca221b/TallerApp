import dotenv from "dotenv";
import { app } from "./app";
import { connectDB } from "./config/db";

dotenv.config();

const PORT = process.env.PORT || 4000;

connectDB(); // connect to Mongo

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
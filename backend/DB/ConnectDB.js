import dotenv from "dotenv";
dotenv.config();  
import mongoose from "mongoose";
async function ConnectDB() {
    try {
        await mongoose.connect(process.env.MONGOURL);
        console.log("Database Connected");
        
    } catch (err) {
        console.error("MongoDB connection error", err);
        throw err; // Re-throwing the error
    } 
}
export default ConnectDB;

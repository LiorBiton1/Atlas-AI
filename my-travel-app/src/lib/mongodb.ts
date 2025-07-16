import mongoose from "mongoose";

let isConnected = false;

export async function connectDB() {
    if(isConnected) return;
    if(mongoose.connection.readyState >= 1) {
        isConnected = true;
        return;
    }
    await mongoose.connect(process.env.MONGODB_URI!);
    isConnected = true;
}
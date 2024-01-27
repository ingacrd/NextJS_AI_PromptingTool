import mongoose from "mongoose";

let isConnected = false; //track the connection 

export const connectToDB = async () => {
    mongoose.set('strictQuery', true);
    
}
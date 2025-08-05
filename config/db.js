import mongoose from "mongoose";
export const connect=async()=>{
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/luxora");
    console.log("mongodb connected");
        
    } catch (error) {
console.log("coonection error:-",error);
   
    }
}
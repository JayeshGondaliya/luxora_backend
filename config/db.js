import mongoose from "mongoose";
export const connect=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL) ;
    console.log("mongodb connected from server");
        
    } catch (error) {
console.log("coonection error:-",error);
   
    }
}
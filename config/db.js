import mongoose from "mongoose";
export const connect=async()=>{
    try {
        await mongoose.connect("mongodb+srv://jayeshgondaliya9929:Jayesh7574@cluster0.g3w2u.mongodb.net/luxora?retryWrites=true&w=majority&appName=Cluster0");
    console.log("mongodb connected");
        
    } catch (error) {
console.log("coonection error:-",error);
   
    }
}
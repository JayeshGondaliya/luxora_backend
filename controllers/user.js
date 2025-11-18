import User from "../models/user.js"
import { hashing, verifyPassword  } from '../utils/argon2.js'
import { genratesToken, verifyToken } from '../utils/jwt.js'
import { sendEmail } from "../utils/mail.js"
export const register=async(req,res)=>{
    try {
        const {name,email,password,mobilenumber}=req.body
        if(!name||!email||!password||!mobilenumber){
            return res.status(400).json({success:false,message:"All fields are required"})
        }

        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(409).json({success:false,message:"User are Already exits"})
        }

        //hashing password using argo2
        const hashedPassword= await hashing(password)
        console.log(hashedPassword);

        const newUser=new User({
            name,
            email,
            password:hashedPassword,
            mobilenumber,
            
        })
        await newUser.save()
        return res.status(201).json({success:true,message:"✅User registration successfully"})
    } catch (error) {
        return res.status(500).json({success:false,message:error.message})
    }
}




//login user
export const login=async(req,res)=>{
    try {
        const {email,password}=req.body;
        if(!email||!password){
            return res.status(400).json({success:false,message:"All fields are required"})
        }

        const user=await User.findOne({email});
        if(!user){
            return res.status(404).json({success:false,message:"User not found"})
        }

        const isMatch=await verifyPassword(user.password,password);
        if(!isMatch){
            return res.status(400).json({success:false,message:"Invalid Credentials"})
        }
        console.log("is match password:-",isMatch);
        
        //genrate token
        // const userId=user._id
        console.log("role",user.role);
        
        const token=await genratesToken(user._id,user.email,user.role);
        // console.log(token);
        
        
res.cookie("userId", token, {
  httpOnly: true,      // JS cannot access this cookie
  secure: true,        // Only sent over HTTPS
  sameSite: "none",     // Helps prevent CSRF
  maxAge: 24 * 60 * 60 * 1000 // 7 days
});

       
        
   

 return res.status(200).json({success:true,message:"Login successFully",data:{userId:user._id,token:token}})
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({success:false,message:error.message})
    }
}

//forgot password
export const forgotPassword=async(req,res)=>{
    try {
        const {email}=req.body;
     if(!email){
        return res.status(400).json({success:false,message:"Please provide email"})
     }
        const user=await User.findOne({email})
     if(!user){
        return res.status(404).json({success:false,message:"user not found"})
     }
     console.log("from forgotpassword");
     console.log(req.cookies);
     
     
     if (!req.cookies.uid) {
            return res.status(400).json({ success: false, message: "Session expired. Please log in again." });
        }
     const uid=req.cookies.uid;
     const resetLink=`http://localhost:3000/changepassword/${uid}`
      await sendEmail({
        email,
        subjectType: "reset",
        resetLink,
      });

        console.log("mail send successfully");
        
        return res.status(200).json({success:false,message:"email send successfully"})
    } catch (error) {
        console.log(error);
        
        return res.status(400).json({success:false,message:error.message})
    }
}


export const changepassword=async(req,res)=>{
    try {
      const {uid}=req.params;
        const {oldpassword}=req.body
        const {newPassword}=req.body

        if(!newPassword||!oldpassword){
            return res.status(400).json({success:false,message:"Please provide password"})
        }
        const decode=await verifyToken(uid);
        console.log("decoded data",decode);
        
        
        const email=decode.email;
const user=await User.findOne({email});
if(!user){
    return res.status(404).json({success:false,message:"user not found"})
}
    const ismatch=await verifyPassword(user.password,oldpassword)
    if(!ismatch){
        return res.status(400).json({success:false,message:"give not match old password "})
    }
if(newPassword===ismatch){
      return res.status(400).json({ success: false, message: "New password can be the same as the old password" });
}

const hashedPassword=await hashing(newPassword);
    user.password=hashedPassword


    await user.save()
return res.status(200).json({success:false,message:"password change successfully"})    
    } catch (error) {
        return res.status(400).json({success:false,message:error.message})
    }
}



export const myProfile = async (req, res) => {
  try {
    const userToken = req.cookies.uid;
    // console.log(userToken);
    
 if (!userToken) {
  return res.status(401).json({
    success: false,
    message: "User  is expires. Please log in.",
  });
}

    // console.log("This is user:", user);
    //verify jwt
    const verifyTokenForUser=await verifyToken(userToken)
    console.log("verifyToken",verifyTokenForUser);
    
    const email=verifyTokenForUser.email;
  
    const user=await User.findOne({email})
    if(!user){
       return  res.status(404).json({success:false,message:"user not found please login"})
    }
    return res.status(200).json({ success:true,data:user});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};








export const sendVerificationCode = async (req, res) => {
  try {
       const userToken = req.cookies.uid;


    if (!userToken) {
      return res.status(401).json({
        success: false,
        message: "User session is not available. Please log in.",
      });
    }
const verifyUser=await verifyToken(userToken);
    const email = verifyUser.email;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please login.",
      });
    }

    // If email is not verified, generate a code
    if (!user.is_valid_email) {
      const generateCode = (length = 6) => {
        let num = "";
        for (let i = 0; i < length; i++) {
          const randomNumber = Math.floor(Math.random() * 10);
          num += randomNumber;
          
        }
        return num;
      };

      const otpCode = generateCode();
      console.log("Generated OTP:", otpCode);
      console.log(otpCode);
      
      user.email_verify_code = otpCode;
      user.email_verify_expires = new Date(Date.now() + 10 * 60 * 1000); 
      await user.save();

      await sendEmail({
        email,
        subjectType: "verify",
        verifyCode: otpCode,
      });

      return res.status(200).json({
        success: true,
        message: "Verification Code Sent SuccessFully...",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Email Already Verified.",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};



export const verifyEmailCode =async(req,res)=>{
try {
    const {verifyCode}=req.body
    const userToken=req.cookies.uid;
    if(!userToken){
        return res.status(401).json({success:false,message:"Please Login First"})
    }
    const verifyTokenForUser=await verifyToken(userToken);
    const email=verifyTokenForUser.email;
    const user=await User.findOne({email});
    if(!user){
        return res.status(404).json({success:false,message:"user not found"})
    }
 console.log("Database code:", user.email_verify_code);
    console.log("User entered code:", verifyCode);
    console.log("Database expiration:", user.email_verify_expires);
    console.log("Current time:", Date.now());

    if(user.email_verify_code===verifyCode && user.email_verify_expires > Date.now()){
         user.is_valid_email = true;
         user.email_verify_code = undefined;
user.email_verify_expires = undefined;

      await user.save();
       return res.status(200).json({ success: true, message: "Email Verified SuccessFully." });
    }else {
      return res.status(400).json({ success: false, message: "Invalid or expired verification code." });
    }

} catch (error) {
 console.log(error);
    return res.status(500).json({ message: "Server error" });   
}
}




//edit profile
export const editprofile=async(req,res)=>{
  try {
    const {userId}=req.params;
    const {name,email}=req.body;
    if(!userId){
      return res.status(404).json({success:false,message:"UserId Is Required"})
    }

    const user=await User.findById(userId)
    if(!user){
      return res.status(404).json({success:false,message:"user not found"})
    }

    user.name=name;
    user.email=email;
    await user.save();
    return res.status(200).json({success:true,message:"User Profile Updated SuccessFully",data:user})
  } catch (error) {
console.log(error);
return res.status(500).json({success:false,message:error.message})

  }
}


export const addAddress = async (req, res) => {
  try {
    const { address, userId } = req.body;

    if (!address || !userId) {
      return res.status(400).json({
        success: false,
        message: "Please Fill The Address",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User Not Found.",
      });
    }

    user.address = address; // fixed line
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Address Saved SuccessFully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

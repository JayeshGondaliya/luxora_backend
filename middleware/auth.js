import admin from "../models/admin.js";
import User from "../models/user.js";
import { verifyToken } from "../utils/jwt.js";
export const userAuthentication = async (req, res, next) => {
    try {
        if (req.cookies && req.cookies.userId) {
            console.log("auth controller");

            //verify 
              const decoded =await verifyToken(req.cookies.userId);
              // console.log("this is decode----------------------",decoded);
              
         const user = await User.findById(decoded.userId);
           if (!user) {
         return res.status(401).json({ success: false, message: "User not found" });
        }
        //used for future
      req.user = { 
  userId: user._id,
  role: user.role,
  data: user
};
            next(); 
        } else {
            return res.status(401).json({ success: false, message: 'Unauthorized: Please log in' });
        }
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};
export const AdminAuthentication = async (req, res, next) => {
    try {
        if (req.cookies && req.cookies.admintoken) {
            console.log("admin controller");
            console.log("admin auth token:", req.cookies.admintoken);

            // verify token
            const decoded = await verifyToken(req.cookies.admintoken);
            console.log("decoded,",decoded);
            
            const adminData = await admin.findById(decoded.id);
            if (!adminData) {
                return res.status(401).json({ success: false, message: "Admin not found" });
            }

            // attach to req for use in routes
            req.admin = { 
                adminId: adminData._id,
                data: adminData
            };

            next(); 
        } else {
            return res.status(401).json({ success: false, message: 'Unauthorized: Please log in as admin' });
        }
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

//roll based authentication
export const authorizeRoles=(...allowedRoles)=>{

 try {
   return (req,res,next)=>{
    if(!req.user){
         return res.status(401).json({ success: false, message: "Not authenticated" });
    }
    if(!allowedRoles.includes(req.user.role)){
        return res.status(403).json({ success: false, message: "Access denied: Insufficient permissions" });
      }

      next()
    }
 } catch (error) {
  console.log(error);
return res.status(500).json({success:false,message:error.message})
  
 }
  
}




export const logout = async (req, res) => {
  try {
      res.clearCookie('userId');
  res.send('Logged out and cookie cleared');
  } catch (err) {
    return res.status(500).json({ message: 'Logout failed', error: err.message });
  }
};


export const adminLogout = async (req, res) => {
  try {
    res.clearCookie('admintoken', {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res.status(200).json({
      success: true,
      message: "Admin logout successfully"
    });
    
      res.clearCookie('admintoken', {
            httpOnly: true,
            secure:true,
            sameSite: "none",
        });
  return res.status(200).json({success:true,message:"admin logout"});
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Logout failed',
      error: err.message
    });
  }
};


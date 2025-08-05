// routes/auth.js
import express from 'express';
import { adminLogin, adminRegister } from '../controllers/admin.js';
import { AdminAuthentication, adminLogout } from '../middleware/auth.js';
const adminRouter = express.Router();

adminRouter.post('/register', adminRegister)
adminRouter.post('/adminLogin', adminLogin)
adminRouter.post('/adminLogout', adminLogout)
adminRouter.get("/get-admin", AdminAuthentication, (req, res) => {
let isAdmin=req.cookies.admintoken;
if(isAdmin){
return res.status(200).json({success:true,isAdmin:true,data:req.admin})
}else{
return res.status(400).json({success:false,isAdmin:false})
}
});

export default adminRouter;

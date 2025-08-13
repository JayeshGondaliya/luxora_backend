// routes/auth.js
import express from 'express';
import { adminLogin, adminRegister } from '../controllers/admin.js';
import { AdminAuthentication, adminLogout } from '../middleware/auth.js';
const adminRouter = express.Router();

adminRouter.post('/register', adminRegister)
adminRouter.post('/adminLogin', adminLogin)
adminRouter.post('/adminLogout', adminLogout)
adminRouter.get("/get-admin", AdminAuthentication, (req, res) => {
  res.status(200).json({ success:true,adminId: req.admin.adminId });
});


export default adminRouter;

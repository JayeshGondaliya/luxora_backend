import express from 'express'
import { addAddress, changepassword, editprofile, forgotPassword, login, myProfile, register, sendVerificationCode, verifyEmailCode } from '../controllers/user.js';
import { logout, userAuthentication } from '../middleware/auth.js';
const userRouter=express.Router()
userRouter.post("/register",register);
userRouter.post("/login",login);
userRouter.post("/forgotpassword",forgotPassword);
userRouter.post("/changepassword/:uid",changepassword)
userRouter.get("/myprofile",myProfile);
userRouter.get("/myprofile-send-code",sendVerificationCode);
userRouter.post("/verify-code",verifyEmailCode)
userRouter.put("/editprofile/:userId",editprofile)
userRouter.get("/get-user", userAuthentication, (req, res) => {
  res.status(200).json({ userId: req.user.userId });
});

userRouter.post("/logout",logout)
userRouter.post("/addAddress",addAddress)
export default userRouter;
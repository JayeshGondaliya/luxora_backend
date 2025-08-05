import express from 'express'
import { userAuthentication } from '../middleware/auth.js';
import { logout } from '../middleware/auth.js';

const authorised=express.Router();
authorised.get("/check-user-auth", userAuthentication, (req, res) => {
  return  res.status(200).json({ success: true, message: 'User is authenticated' });
});
authorised.get('/logout', logout);
export default authorised;
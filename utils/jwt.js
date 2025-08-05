import jwt from 'jsonwebtoken';

export const genratesToken = async (userId,email,role) => {
  return jwt.sign({ userId,email ,role}, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRES_IN });
};



// /verify token jwt
export const verifyToken=async(uid)=>{
        return jwt.verify(uid,process.env.JWT_SECRET_KEY)
}
import Admin from "../models/admin.js";
import { hashing, verifyPassword } from "../utils/argon2.js"; // adjust path as per your folder structure
import jwt from 'jsonwebtoken'
export const adminRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await Admin.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: 'Email Already Exists' });
        }

        const hashed = await hashing(password);

        const newUser = new Admin({
            name,
            email,
            password: hashed
        });

        await newUser.save();

        res.json({ success: true, message: 'Admin Register SuccessFully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({ success: false, message: "Admin not found" });
        }

        const isValid = await verifyPassword(admin.password, password);
        if (!isValid) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: admin._id, email: admin.email }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
  res.cookie("admintoken", token, {
            httpOnly: true,
            secure:true,
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });
        res.json({
            success: true,
            message: "Login successful",
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email
            },
            token
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

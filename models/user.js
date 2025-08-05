import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  is_valid_email: { type: Boolean, default: false },
  email_verify_code: { type: String, default: null },
  email_verify_expires: { type: Date },
  password: { type: String, required: true },
  mobilenumber: { type: String, required: true },

  // ✅ Updated nested address schema
  address: {
    flatNo: { type: String },
    societyName: { type: String },
    mobile: { type: String },
    address: { type: String },
    pincode: { type: String }
  }

}, {
  timestamps: true
});

const User = mongoose.model("user", userSchema);
export default User;

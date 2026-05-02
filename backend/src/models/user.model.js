import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema({
  fullname: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  // 8-character unique alphanumeric ID
  userID: { 
    type: String, 
    unique: true, 
    sparse: true, 
    trim: true,
    match: [/^[a-zA-Z0-9]{8}$/, "User ID must be exactly 8 alphanumeric characters."] 
  },
  password: { type: String, required: true },
  status: { type: String, enum: ["active", "restricted", "blocked", "disabled"], default: "active" },
  refreshToken: { type: String },
  contact: { type: String },
  address: { type: String },
  areacode: { type: String }
}, { timestamps: true });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (pass) {
  return await bcrypt.compare(pass, this.password);
};

export const User = mongoose.model("User", userSchema);
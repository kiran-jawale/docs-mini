import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const employeeSchema = new Schema({
  empCode: { type: String, required: true, unique: true },
  userID: { 
    type: String, 
    unique: true, 
    sparse: true, 
    trim: true,
    match: [/^[a-zA-Z0-9]{8}$/, "User ID must be exactly 8 alphanumeric characters."] 
  },
  fullname: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "mod", "hr"], required: true },
  dept: { type: String, default: "General" },
  status: { type: String, enum: ["active", "disabled"], default: "active" },
  refreshToken: { type: String }
}, { timestamps: true });

employeeSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

employeeSchema.methods.comparePassword = async function (pass) {
  return await bcrypt.compare(pass, this.password);
};

export const Employee = mongoose.model("Employee", employeeSchema);
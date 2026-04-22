import { User } from "../models/user.model.js";
import { Employee } from "../models/employee.model.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import validationUtil from "../utils/validation.util.js";

class AuthService {
  async registerCustomer(data) {
    validationUtil.validateRegistrationData(data);
    
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) throw new ApiError(409, "Email already in use");

    const user = await User.create(data);
    return await User.findById(user._id).select("-password -refreshToken");
  }

  async authenticate(email, password) {
    // 1. Check Employees First (Higher priority)
    let account = await Employee.findOne({ email });
    let type = "employee";

    // 2. If not Employee, check Customers
    if (!account) {
      account = await User.findOne({ email });
      type = "user";
    }

    if (!account) throw new ApiError(404, "Account not found");

    if (account.status === "disabled") {
      throw new ApiError(403, "Your account has been disabled by an Administrator.");
    }

    const isPasswordValid = await account.comparePassword(password);
    if (!isPasswordValid) throw new ApiError(401, "Invalid credentials");

    const { accessToken, refreshToken } = await this.generateTokens(account._id, account.role, type);
    
    // Remove sensitive data before returning
    account.password = undefined;
    account.refreshToken = undefined;

    return { account, accessToken, refreshToken, type };
  }

  async generateTokens(id, role, type) {
    const Model = type === "employee" ? Employee : User;
    const account = await Model.findById(id);

    const accessToken = jwt.sign(
      { _id: account._id, role: account.role || null },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );

    const refreshToken = jwt.sign(
      { _id: account._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );

    account.refreshToken = refreshToken;
    await account.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  }

  async clearRefreshToken(id, type) {
    const Model = type === "employee" ? Employee : User;
    await Model.findByIdAndUpdate(id, { $unset: { refreshToken: 1 } });
  }

  async updateProfile(id, isEmployee, updateData) {
    const Model = isEmployee ? Employee : User;
    const updated = await Model.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password -refreshToken");
    
    if (!updated) throw new ApiError(404, "Account not found");
    return updated;
  }

  async changePassword(id, isEmployee, oldPassword, newPassword) {
    const Model = isEmployee ? Employee : User;
    const account = await Model.findById(id);
    
    if (!account) throw new ApiError(404, "Account not found");

    const isValid = await account.comparePassword(oldPassword);
    if (!isValid) throw new ApiError(400, "Invalid old password");

    validationUtil.isStrongPassword(newPassword);

    account.password = newPassword;
    await account.save({ validateBeforeSave: false });
  }
}

export default new AuthService();
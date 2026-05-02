import { User } from "../models/user.model.js";
import { Employee } from "../models/employee.model.js";
import { ApiError } from "../utils/ApiError.js";
import { UX_ERRORS } from "../constants/uxErrors.js"; // USING NEW CONSTANTS
import jwt from "jsonwebtoken";

class AuthService {
  async register(data) {
    const { fullname, email, password, secretCode, regionCode, ...rest } = data;

    // Sync: ALREADY_EXISTS
    const existingEmp = await Employee.findOne({ email });
    const existingUser = await User.findOne({ email });
    if (existingEmp || existingUser) {
      throw new ApiError(409, UX_ERRORS.AUTH.ALREADY_EXISTS);
    }

    let account;
    if (secretCode) {
      let role = "";
      if (secretCode === process.env.ADMIN_SECRET_CODE) role = "admin";
      else if (secretCode === process.env.MOD_SECRET_CODE) role = "mod";
      else if (secretCode === process.env.HR_SECRET_CODE) role = "hr";
      else throw new ApiError(400, UX_ERRORS.AUTH.INVALID_SECRET); // Sync: INVALID_SECRET

      account = await Employee.create({
        fullname, email, password, role, regionCode,
        empCode: `${role.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
        ...rest
      });
    } else {
      account = await User.create({ fullname, email, password, regionCode, ...rest });
    }

    const result = account.toObject();
    delete result.password;
    delete result.refreshToken;
    return result;
  }

  async authenticate(identifier, password) {
    const query = { $or: [{ email: identifier }, { userID: identifier }] };
    let account = await Employee.findOne(query);
    let type = "employee";

    if (!account) {
      account = await User.findOne(query);
      type = "user";
    }

    // Sync: INVALID_CREDS (Not Found)
    if (!account) throw new ApiError(401, UX_ERRORS.AUTH.INVALID_CREDS);

    // Sync: DISABLED
    if (account.status === "disabled" || account.status === "blocked") {
      throw new ApiError(403, UX_ERRORS.AUTH.DISABLED);
    }

    const isPasswordValid = await account.comparePassword(password);
    
    // Sync: INVALID_CREDS (Wrong Password)
    if (!isPasswordValid) throw new ApiError(401, UX_ERRORS.AUTH.INVALID_CREDS);

    const { accessToken, refreshToken } = await this.generateTokens(account._id, account.role, type);
    
    const userRes = account.toObject();
    delete userRes.password;
    delete userRes.refreshToken;

    return { user: userRes, type, accessToken, refreshToken };
  }

  async generateTokens(id, role, type) {
    const Model = type === "employee" ? Employee : User;
    const account = await Model.findById(id);

    const accessToken = jwt.sign(
      { _id: account._id, type, role: role || null },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );

    const refreshToken = jwt.sign(
      { _id: account._id, type },
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

  async updateProfile(id, isEmployee, data) {
    const Model = isEmployee ? Employee : User;
    const forbidden = ["password", "refreshToken", "role", "empCode", "email", "userID"];
    forbidden.forEach(key => delete data[key]);
    
    const updated = await Model.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true }).select("-password -refreshToken");
    if (!updated) throw new ApiError(404, UX_ERRORS.CRUD.NOT_FOUND); // Sync: NOT_FOUND
    return updated;
  }

  async changePassword(id, isEmployee, oldPassword, newPassword) {
    const Model = isEmployee ? Employee : User;
    const account = await Model.findById(id);
    
    // Sync: INVALID_CREDS (for old password check)
    if (!(await account.comparePassword(oldPassword))) {
      throw new ApiError(401, UX_ERRORS.AUTH.INVALID_CREDS); 
    }
    
    account.password = newPassword;
    await account.save();
  }

  async updateEmail(id, isEmployee, newEmail) {
    if (await Employee.findOne({ email: newEmail }) || await User.findOne({ email: newEmail })) {
      throw new ApiError(409, UX_ERRORS.AUTH.ALREADY_EXISTS); // Sync: ALREADY_EXISTS
    }
    const Model = isEmployee ? Employee : User;
    return await Model.findByIdAndUpdate(id, { $set: { email: newEmail } }, { new: true }).select("-password");
  }

  async updateUserID(id, isEmployee, newUserID) {
    if (await Employee.findOne({ userID: newUserID }) || await User.findOne({ userID: newUserID })) {
      throw new ApiError(409, UX_ERRORS.AUTH.ALREADY_EXISTS); // Sync: ALREADY_EXISTS
    }
    const Model = isEmployee ? Employee : User;
    return await Model.findByIdAndUpdate(id, { $set: { userID: newUserID } }, { new: true }).select("-password");
  }
}

export default new AuthService();
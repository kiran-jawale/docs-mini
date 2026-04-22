import { ApiError } from "../utils/ApiError.js";

const checkRole = (roles) => {
  return (req, res, next) => {
    // Only Employees have roles in our new schema
    if (req.userType !== "employee" || !roles.includes(req.user.role)) {
      throw new ApiError(403, `Forbidden: Requires ${roles.join(" or ")} access`);
    }
    next();
  };
};

export const isAdmin = checkRole(["admin"]);
export const isMod = checkRole(["mod"]);
export const isHR = checkRole(["hr"]);
export const isAdminOrMod = checkRole(["admin", "mod"]);
export const isAdminOrHR = checkRole(["admin", "hr"]);
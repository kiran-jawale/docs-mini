import { ApiError } from '../utils/ApiError.js';
import { UX_ERRORS } from '../constants/uxErrors.js';

const checkRole = (roles) => {
  return (req, res, next) => {
    if (req.userType !== 'employee' || !roles.includes(req.user?.role)) {
      throw new ApiError(403, UX_ERRORS.AUTH.FORBIDDEN);
    }
    next();
  };
};

export const isAdmin = checkRole(['admin']);
export const isMod = checkRole(['mod']);
export const isHR = checkRole(['hr']);
export const isAdminOrMod = checkRole(['admin', 'mod']);
export const isAdminOrHR = checkRole(['admin', 'hr']);
export const isStaff = checkRole(['admin', 'mod', 'hr']);

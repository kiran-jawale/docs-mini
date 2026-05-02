import { ApiError } from '../utils/ApiError.js';
import { UX_ERRORS } from '../constants/uxErrors.js'; // USING NEW CONSTANTS

const checkRole = (roles) => {
  return (req, res, next) => {
    if (req.userType !== 'employee' || !roles.includes(req.user?.role)) {
      // Throw the synchronized standard error so the Toast perfectly matches
      throw new ApiError(403, UX_ERRORS.AUTH.FORBIDDEN);
    }
    next();
  };
};

// Exporting exact same names so your route files DO NOT need to be changed
export const isAdmin = checkRole(['admin']);
//export const isMod = checkRole(["mod"]);
export const isHR = checkRole(['hr']);
export const isAdminOrMod = checkRole(['admin', 'mod']);
export const isAdminOrHR = checkRole(['admin', 'hr']);

// NEW: Helpful addition for routes that any employee can access
// src/middlewares/role.middleware.js

export const isStaff = (req, res, next) => {
  // Ensure user is verified and has a staff role
  const staffRoles = ['admin', 'mod', 'hr'];

  if (!req.user || !staffRoles.includes(req.user.role)) {
    throw new ApiError(403, 'Access Denied: Staff clearance required.');
  }
  next();
};

export const isMod = (req, res, next) => {
  if (req.user?.role !== 'mod') {
    throw new ApiError(403, 'Access Denied: Moderator privileges required.');
  }
  next();
};

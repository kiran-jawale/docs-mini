export const UX_ERRORS = {
  AUTH: {
    MISSING_FIELDS: "Required fields are missing. Please complete the form.",
    INVALID_CREDS: "The email/userID or password you entered is incorrect.",
    NOT_FOUND: "No account exists for the provided identifier.",
    ALREADY_EXISTS: "This email address or User ID is already registered.",
    INVALID_SECRET: "The provided secret code for staff registration is invalid.",
    WEAK_PASS: "Password must be at least 8 characters with letters and numbers.",
    DISABLED: "Access denied. Your account has been deactivated.",
    SESSION_EXPIRED: "Your session has expired or is invalid. Please log in again.",
    FORBIDDEN: "Access denied. You do not have the required permissions.",
  },
  CRUD: {
    NOT_FOUND: "The requested record could not be located.",
    HIERARCHY_VIOLATION: "Action blocked. You cannot modify accounts at this permission level.",
    SELF_DELETE: "Action blocked. You cannot delete your own active session.",
  },
  FILE: {
    REQ_DOC: "A document file must be attached.",
    INVALID_TYPE: "Invalid file format. Please upload supported documents.",
    NOT_FOUND: "The requested document is no longer available."
  },
  FINANCE: {
    REQ_FIELDS: "Amount, type, and description are mandatory.",
    INVALID_TYPE: "Transaction must be marked as Income, Expense, or Payroll.",
    PAYROLL_REQ_EMP: "A recipient employee is required for Payroll transactions."
  },
  COMPLAINT: {
    REQ_FIELDS: "Both a Subject and Description are required to open a ticket.",
    NOT_FOUND: "The specified support ticket could not be found.",
    IMAGE_LIMIT: "A maximum of 3 evidence images can be uploaded per ticket."
  }
};
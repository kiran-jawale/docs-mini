export const ERRORS = {
  AUTH: {
    UNAUTHORIZED: "Unauthorized access. Please log in.",
    INVALID_TOKEN: "Session expired or invalid. Please log in again.",
    DISABLED_ACCOUNT: "Your account has been disabled by an Administrator.",
    MISSING_CREDS: "Email and password are required.",
    INVALID_CREDS: "Invalid email or password.",
    EMAIL_IN_USE: "This email is already associated with an account.",
    WEAK_PASSWORD: "Password must be at least 8 characters with letters and numbers.",
    NO_DEMOTE_SELF: "You cannot demote or delete your own account."
  },
  DOCS: {
    MISSING_FILE: "A document file is required for upload.",
    NOT_FOUND: "The requested document could not be found.",
    FORBIDDEN_ACTION: "You do not have permission to modify or delete this document.",
    BLOCKED_PUBLIC: "Your account status prevents access to public documents.",
    INVALID_FORMAT: "Invalid file format. Only PDF, Office docs, TXT, and Images are allowed.",
    FILE_TOO_LARGE: "File size exceeds the 10MB limit."
  },
  COMPLAINT: {
    MISSING_FIELDS: "Subject and description are required.",
    NOT_FOUND: "Ticket not found.",
    INVALID_STATUS: "Status must be pending, in-progress, or resolved."
  },
  FINANCE: {
    MISSING_FIELDS: "Amount, type, and description are required.",
    INVALID_TYPE: "Transaction type must be Income, Expense, or Payroll.",
    PAYROLL_NEEDS_EMP: "A recipient employee is required for Payroll transactions.",
    HR_PAYROLL_ONLY: "HR can only process Payroll transactions."
  },
  SYS: {
    SERVER_ERROR: "An internal server error occurred. Please try again later.",
    BAD_REQUEST: "Invalid request parameters."
  }
};
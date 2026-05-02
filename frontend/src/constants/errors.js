export const FE_ERRORS = {
  AUTH: {
    REQUIRED_FIELDS: "Please fill in all required fields.",
    LOGIN_FAILED: "Login failed. Check your credentials and try again.",
    UNAUTHORIZED: "Unauthorized access. Please log in.",
    FORBIDDEN: "Access denied. You lack the necessary role permissions.",
  },
  NETWORK: {
    TIMEOUT: "The request timed out. Please check your internet connection.",
    SERVER_ERROR:
      "The system is temporarily unavailable. Please try again later.",
    OFFLINE: "You are currently offline. Please check your connection.",
  },
  FILE: {
    TOO_LARGE: "File size exceeds the 16MB limit.",
    INVALID_TYPE: "File format not supported. Please use PDF, JPG, or PNG.",
    UPLOAD_FAILED: "Sync failed. Your document was not saved.",
  },
  FINANCE: {
    PROCESS_ERR: "Transaction could not be initialized at this time.",
  },
};
export const getErrorMessage = (error) => {
  // 1. Check for Network/Server Reachability
  if (!error.response) {
    // If the browser says we are actually offline
    if (!window.navigator.onLine) {
      return FE_ERRORS.NETWORK.OFFLINE;
    }
    return "Connection reset by server. The file might be unsupported or too large.";
  }

  const status = error.response.status;
  const backendMessage = error.response.data?.message;

  // 2. Prioritize Backend UX_ERROR
  if (backendMessage) {
    return backendMessage;
  }

  // 3. Fallback to Frontend Constants
  if (status === 401) return FE_ERRORS.AUTH.UNAUTHORIZED;
  if (status === 403) return FE_ERRORS.AUTH.FORBIDDEN;
  if (status >= 500) return FE_ERRORS.NETWORK.SERVER_ERROR;

  return "An unexpected error occurred.";
};

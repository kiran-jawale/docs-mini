import { ApiError } from "./ApiError.js";

class ValidationUtil {
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isStrongPassword(password) {
    // Minimum eight characters, at least one letter and one number
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
  }

  validateRegistrationData(data) {
    if (!this.isValidEmail(data.email)) {
      throw new ApiError(400, "Invalid email format");
    }
    if (!this.isStrongPassword(data.password)) {
      throw new ApiError(400, "Password must be at least 8 characters long and contain both letters and numbers");
    }
  }
}

export default new ValidationUtil();
import { ApiError } from "./ApiError.js";
import { ERRORS } from "../constants.js";

class ValidationUtil {
  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  isStrongPassword(password) {
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
  }

  validateRegistrationData(data) {
    if (!this.isValidEmail(data.email)) throw new ApiError(400, ERRORS.VALIDATION.EMAIL);
    if (!this.isStrongPassword(data.password)) throw new ApiError(400, ERRORS.VALIDATION.PASSWORD);
  }
}
export default new ValidationUtil();
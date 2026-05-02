import api from "../constants/api";

class AuthService {
  register(userData) {
    return api.post("/auth/register", userData);
  }
  login(credentials) {
    return api.post("/auth/login", credentials);
  }
  logout() {
    return api.post("/auth/logout");
  }
  getMyProfile() {
    return api.get("/auth/me");
  }
  updateProfile(data) {
    return api.patch("/auth/update-profile", data);
  }
  // NEW: Update Email Method
  updateEmail(data) {
    return api.patch("/auth/update-email", data);
  }
  // NEW: Update Fast-Login ID Method
  updateUserID(data) {
    return api.patch("/auth/update-userid", data);
  }
  changePassword(data) {
    return api.post("/auth/change-password", data);
  }
}
export default new AuthService();
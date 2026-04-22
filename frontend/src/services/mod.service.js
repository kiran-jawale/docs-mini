import api from "../constants/api";

class ModService {
  modGetAllUsers() {
    return api.get("/mod/users");
  }
  updateUserStatus(id, status) {
    return api.put(`/mod/users/${id}/status`, { status });
  }
  modGetAllPublicDocuments() {
    return api.get("/mod/documents/public");
  }
  toggleVisibility(id) {
    return api.put(`/mod/documents/${id}/visibility`);
  }
}
export default new ModService();
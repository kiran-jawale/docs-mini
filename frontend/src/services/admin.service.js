import api from "../constants/api";

class AdminService {
  // --- Customer Management ---
  getAllUsers() { return api.get("/admin/users"); }
  getUserById(id) { return api.get(`/admin/users/${id}`); }
  updateUserStatus(id, status) { return api.put(`/admin/users/${id}/status`, { status }); }
  deleteUser(id) { return api.delete(`/admin/users/${id}`); }

  // --- Employee Management ---
  createEmployee(data) { return api.post("/admin/employees", data); }
  getAllEmployees() { return api.get("/admin/employees"); }
  updateEmployee(id, data) { return api.put(`/admin/employees/${id}`, data); }
  deleteEmployee(id) { return api.delete(`/admin/employees/${id}`); }

  // --- Document Oversight ---
  adminGetAllPublicDocuments() { return api.get("/admin/documents/public"); }
  adminDeleteDocument(id) { return api.delete(`/admin/documents/${id}`); }
}
export default new AdminService();
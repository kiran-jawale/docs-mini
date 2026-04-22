import api from "../constants/api";

class ComplaintService {
  createComplaint(formData) {
    // formData contains 'subject', 'description', and 'images' (files)
    return api.post("/complaints", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
  getMyComplaints() {
    return api.get("/complaints/my");
  }
  getAllComplaints() {
    return api.get("/complaints/all");
  }
  updateStatus(id, status) {
    return api.put(`/complaints/${id}/status`, { status });
  }
  deleteComplaint(id) {
    return api.delete(`/complaints/${id}`);
  }
}
export default new ComplaintService();
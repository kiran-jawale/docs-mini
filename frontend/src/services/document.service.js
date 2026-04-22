import api from "../constants/api";

class DocumentService {
  /**
   * @param {FormData} formData - Must include 'documentFile', 'title', etc.
   */
  uploadDocument(formData) {
    return api.post("/documents", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
  getMyDocuments() {
    return api.get("/documents/my");
  }
  getPublicDocuments() {
    return api.get("/documents/public");
  }
  getDocumentById(id) {
    return api.get(`/documents/${id}`);
  }
  updateDocument(id, data) {
    return api.put(`/documents/${id}`, data);
  }
  deleteDocument(id) {
    return api.delete(`/documents/${id}`);
  }
  // Download handled by direct window open or blob logic in component
  getDownloadUrl(id) {
    return `${api.defaults.baseURL}/documents/download/${id}`;
  }
}
export default new DocumentService();
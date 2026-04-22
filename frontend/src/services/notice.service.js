import api from "../constants/api";

class NoticeService {
  getNotices() { return api.get("/notices"); }
  createNotice(data) { return api.post("/notices", data); }
  deleteNotice(id) { return api.delete(`/notices/${id}`); }
}
export default new NoticeService();
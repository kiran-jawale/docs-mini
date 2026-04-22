import api from "../constants/api";

class AnalyticsService {
  // Helper to convert object to query string safely
  buildQuery(filters) {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    return params.toString();
  }

  getUserAnalytics(filters = {}) {
    return api.get(`/analytics/users?${this.buildQuery(filters)}`);
  }
  
  getDocAnalytics(filters = {}) {
    return api.get(`/analytics/docs?${this.buildQuery(filters)}`);
  }
  
  getComplaintAnalytics(filters = {}) {
    return api.get(`/analytics/complaints?${this.buildQuery(filters)}`);
  }
}
export default new AnalyticsService();
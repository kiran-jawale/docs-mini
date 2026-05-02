import api from "../constants/api";

class FinanceService {
  createTransaction(data) {
    return api.post("/finance", data);
  }
  
  getAllTransactions() {
    return api.get("/finance");
  }
  
  getPayrollTransactions() {
    return api.get("/finance/payroll");
  }
}

export default new FinanceService();
import axios from "axios";
import { getErrorMessage } from "./errors";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 1. Extract the accurate message using our helper
    const finalMessage = getErrorMessage(error);
    
    // 2. Extract raw backend message for silence filtering
    const rawMessage = error.response?.data?.message;

    // 3. SILENCE FILTER: Avoid showing toasts for background session checks
    // CRITICAL: This must match the backend's UX_ERRORS.AUTH.SESSION_EXPIRED exactly
    const silentMessages = [
      "Your session has expired or is invalid. Please log in again.", 
      "no_session", 
      "No active session found.", 
      "Session expired."
    ];

    if (!silentMessages.includes(rawMessage)) {
      const event = new CustomEvent("show-toast", { 
        detail: { message: finalMessage, type: "error" } 
      });
      window.dispatchEvent(event);
    }

    return Promise.reject(error);
  }
);

export default api;
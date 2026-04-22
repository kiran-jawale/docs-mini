import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/slices/authSlice";
import authService from "../services/auth.service";

const LogButton = () => {
  const authStatus = useSelector((state) => state.auth.status);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      dispatch(logout());
      navigate("/");
    }
  };

  const handleLogin = () => {
    navigate("/auth");
  };

  return authStatus ? (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
    >
      Logout
    </button>
  ) : (
    <button
      onClick={handleLogin}
      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
    >
      Login
    </button>
  );
};

export default LogButton;
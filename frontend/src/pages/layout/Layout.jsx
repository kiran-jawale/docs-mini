import React, { useEffect, useState, useContext } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../../redux/slices/authSlice";
import authService from "../../services/auth.service";
import { ThemeContext } from "../../contexts/ThemeContext";

import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";

const Layout = () => {
  const { theme } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authService.getMyProfile();
        if (response.data && response.data.success) {
          dispatch(login(response.data.data));
        }
      } catch (error) {
        dispatch(logout());
      } finally {
        setAuthChecked(true);
      }
    };
    checkAuth();
  }, [dispatch]);

  if (!authChecked) {
    return (
      <div className={`h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-zinc-900 text-white' : 'bg-gray-50'}`}>
        Loading...
      </div>
    );
  }

  const showSidebar = user && (user.role === 'admin' || user.role === 'mod');

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'dark bg-zinc-900' : 'bg-gray-50'}`}>
      <div className="flex flex-1">
        {showSidebar && <Sidebar user={user} />}
        
        <div className={`flex-grow flex flex-col transition-all duration-300 ${showSidebar ? 'ml-64' : ''}`}>
          <Header />
          <main className="flex-grow relative">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Layout;
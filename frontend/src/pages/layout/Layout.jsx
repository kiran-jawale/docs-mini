import React, { useEffect, useState, useContext } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../../redux/slices/authSlice";
import authService from "../../services/auth.service";
import { ThemeContext } from "../../contexts/ThemeContext";

import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import ErrorBoundary from "../../components/ErrorBoundary";

const Layout = () => {
  const { theme } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const location = useLocation();
  
  const { user, type, status } = useSelector((state) => state.auth);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authService.getMyProfile();
        if (response.data && response.data.success) {
          dispatch(login(response.data.data));
        } else {
          dispatch(logout());
        }
      } catch (error) {
        dispatch(logout());
      } finally {
        setAuthChecked(true);
      }
    };
    checkAuth();
  }, [dispatch]);

  // Prevent UI flashing during the initial session check
  if (!authChecked) {
    return (
      <div className={`h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-zinc-950 text-white' : 'bg-zinc-50'}`}>
        <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Verifying Session</p>
        </div>
      </div>
    );
  }

  const isAuthPage = location.pathname === "/auth";

  /**
   * SIDEBAR LOGIC:
   * 1. Must NOT be on the /auth page.
   * 2. User must be logged in (status === true).
   * 3. User must be an 'employee' type.
   */
  const showSidebar = !isAuthPage && status && type === "employee";

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${theme === 'dark' ? 'dark bg-zinc-950' : 'bg-zinc-50'}`}>
      <div className="flex flex-1">
        {/* Sidebar only appears for staff on non-auth pages */}
        {showSidebar && <Sidebar user={user} />}
        
        <div className={`flex-grow flex flex-col transition-all duration-500 ${showSidebar ? 'md:ml-64' : 'ml-0'}`}>
          {/* Header now shows everywhere for brand consistency */}
          <Header />
          
          <main className="flex-grow relative">
            <ErrorBoundary>
                <Outlet />
            </ErrorBoundary>
          </main>

          {/* Footer now shows everywhere */}
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Layout;
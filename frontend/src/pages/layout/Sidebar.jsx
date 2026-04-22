import React from "react";
import { NavLink, Link, useLocation } from "react-router-dom";

const Sidebar = ({ user }) => {
  const location = useLocation();
  const onDashboard = location.pathname === "/docs";
  const onAnalytics = location.pathname === "/analytics";
  const currentHash = location.hash;

  const baseNavLinkClass = "block px-4 py-3 rounded-lg transition-colors duration-200 font-medium";
  const activeClass = "bg-green-600 text-white font-bold shadow-md";
  const inactiveClass = "text-gray-400 hover:bg-zinc-800 hover:text-gray-200";
  
  const activeSubLink = "text-green-400 font-bold border-l-2 border-green-500 pl-3";
  const inactiveSubLink = "text-gray-500 hover:text-green-400 pl-3 border-l-2 border-transparent transition-colors";

  return (
    <div className="w-64 h-screen bg-zinc-900 text-white fixed left-0 top-0 pt-20 border-r border-zinc-800 flex flex-col p-4 overflow-y-auto z-10">
      <div className="mb-6 px-2">
        <h2 className="text-xl font-bold tracking-tight">Control Panel</h2>
        <p className="text-[10px] text-green-400 uppercase tracking-widest mt-1 bg-green-500/10 w-fit px-2 py-0.5 rounded">{user.role}</p>
      </div>

      <nav className="flex-grow space-y-2">
        {/* --- MANAGEMENT DASHBOARD --- */}
        <NavLink to="/docs" className={({ isActive }) => `${baseNavLinkClass} ${isActive ? activeClass : inactiveClass}`}>
          Management
        </NavLink>
        
        {onDashboard && (
          <div className="pl-4 space-y-2 ml-2 mb-4">
            <Link to="/docs#users" className={`${currentHash === '#users' || currentHash === '' ? activeSubLink : inactiveSubLink} block py-1.5 text-sm`}>
              Users
            </Link>
            <Link to="/docs#documents" className={`${currentHash === '#documents' ? activeSubLink : inactiveSubLink} block py-1.5 text-sm`}>
              Public Documents
            </Link>
            <Link to="/docs#complaints" className={`${currentHash === '#complaints' ? activeSubLink : inactiveSubLink} block py-1.5 text-sm`}>
              Helpdesk Tickets
            </Link>
            {user.role === 'admin' && (
              <Link to="/docs#employees" className={`${currentHash === '#employees' ? activeSubLink : inactiveSubLink} block py-1.5 text-sm`}>
                Staff / Employees
              </Link>
            )}
          </div>
        )}

        {/* --- ANALYTICS (Admin Only) --- */}
        {user.role === 'admin' && (
          <>
            <NavLink to="/analytics" className={({ isActive }) => `${baseNavLinkClass} ${isActive ? activeClass : inactiveClass}`}>
              Analytics Insights
            </NavLink>
            
            {onAnalytics && (
              <div className="pl-4 space-y-2 ml-2 mb-4">
                <Link to="/analytics#users" className={`${currentHash === '#users' || currentHash === '' ? activeSubLink : inactiveSubLink} block py-1.5 text-sm`}>
                  User Metrics
                </Link>
                <Link to="/analytics#docs" className={`${currentHash === '#docs' ? activeSubLink : inactiveSubLink} block py-1.5 text-sm`}>
                  Document Stats
                </Link>
                <Link to="/analytics#complaints" className={`${currentHash === '#complaints' ? activeSubLink : inactiveSubLink} block py-1.5 text-sm`}>
                  Ticket Analytics
                </Link>
              </div>
            )}
          </>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
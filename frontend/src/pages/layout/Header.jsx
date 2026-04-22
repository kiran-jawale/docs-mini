import React, { useContext } from "react";
import { NavLink, Link } from "react-router-dom";
import { ThemeContext } from "../../contexts/ThemeContext";
import { useDom } from "../../contexts/DomContext"; // Import useDom
import { content } from "../../constants/content";
import LogButton from "../../components/LogButton";
import { useSelector } from "react-redux";

const Header = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { toggleNotifications } = useDom(); // Destructure toggle method
  const user = useSelector((state) => state.auth.user);

  return (
    <header className={`${theme === 'dark' ? 'bg-zinc-800 text-white' : 'bg-white text-gray-800'} shadow-md z-[40] relative transition-colors duration-300`}>
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-green-600 tracking-tighter flex items-center gap-2">
            <span className="text-3xl">🗂️</span> DOCS MINI
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          {content.navLinks.map((link) => (
            <NavLink key={link.title} to={link.path} className={({ isActive }) => `font-medium ${isActive ? "text-green-500 font-bold" : "hover:text-green-600"}`}>
              {link.title}
            </NavLink>
          ))}

          <button onClick={toggleTheme} className="text-lg p-2 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700 transition">
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          {user && (
            <>
              {/* Notifications Bell */}
              <button onClick={toggleNotifications} className="text-xl p-2 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700 transition relative">
                🔔
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-zinc-800"></span>
              </button>

              <div className="relative group cursor-pointer py-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {user.fullname.charAt(0)}
                  </div>
                  <span className="font-semibold text-sm">{user.fullname}</span>
                </div>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-zinc-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[70] overflow-hidden">
                  <div className="py-2">
                    <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-green-50 dark:hover:bg-zinc-700 transition">My Profile</Link>
                    <Link to="/settings" className="block px-4 py-2 text-sm hover:bg-green-50 dark:hover:bg-zinc-700 transition">Settings</Link>
                  </div>
                </div>
              </div>
            </>
          )}
          <LogButton />
        </div>
      </nav>
    </header>
  );
};

export default Header;
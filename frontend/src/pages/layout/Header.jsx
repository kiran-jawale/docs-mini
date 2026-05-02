import React, { useContext } from "react";
import { NavLink, Link } from "react-router-dom";
import { ThemeContext } from "../../contexts/ThemeContext";
import { useDom } from "../../contexts/DomContext";
import { content } from "../../constants/content";
import LogButton from "../../components/LogButton";
import { useSelector } from "react-redux";

const Header = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { toggleNotifications } = useDom();
  const { user, status } = useSelector((state) => state.auth);

  return (
    <header className={`${theme === 'dark' ? 'bg-zinc-900/80 text-white border-zinc-800' : 'bg-white/80 text-gray-800 border-gray-100'} border-b backdrop-blur-md z-[60] sticky top-0 transition-all duration-300`}>
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-black text-green-600 tracking-tighter">🗂️ DOCS MINI</span>
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          {content.navLinks.map((link) => (
            <NavLink key={link.title} to={link.path} className={({ isActive }) => `text-[10px] font-black uppercase tracking-widest ${isActive ? "text-green-500" : "text-zinc-400 hover:text-green-600"}`}>
              {link.title}
            </NavLink>
          ))}

          <button onClick={toggleTheme} className="p-2 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition">
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          {status && user && (
            <div className="flex items-center gap-4 border-l dark:border-zinc-800 pl-4">
              <button onClick={toggleNotifications} className="text-xl relative hover:scale-110 transition">
                🔔
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-zinc-900"></span>
              </button>

              {/* DROPDOWN TRIGGER */}
              <div className="relative group py-2">
                <div className="flex items-center gap-3 cursor-pointer">
                  <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white font-black text-xs shadow-lg shadow-green-500/20">
                    {user.fullname?.charAt(0) || "U"}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-[10px] font-black uppercase leading-none">{user.fullname}</p>
                    <p className="text-[9px] text-zinc-500 font-mono mt-1">{user.userID || 'ID UNSET'}</p>
                  </div>
                  <span className="text-[8px] text-zinc-500 group-hover:rotate-180 transition-transform">▼</span>
                </div>

                {/* DROPDOWN MENU */}
                <div className="absolute right-0 top-full pt-2 w-52 opacity-0 translate-y-2 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-300 z-[70]">
                  <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-zinc-700 overflow-hidden p-2">
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-xs font-bold hover:bg-green-50 dark:hover:bg-green-500/10 rounded-xl transition">
                      👤 My Profile
                    </Link>
                    <Link to="/settings" className="flex items-center gap-3 px-4 py-3 text-xs font-bold hover:bg-green-50 dark:hover:bg-green-500/10 rounded-xl transition">
                      ⚙️ Security Settings
                    </Link>
                    <div className="border-t dark:border-zinc-700 my-1"></div>
                    <div className="px-2 pb-1">
                        <LogButton />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {!status && <LogButton />}
        </div>
      </nav>
    </header>
  );
};

export default Header;
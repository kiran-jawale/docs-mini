import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { content } from "../../constants/content";
import { ThemeContext } from "../../contexts/ThemeContext";

const Footer = () => {
  const { theme } = useContext(ThemeContext);
  
  return (
    <footer className={`${theme === 'dark' ? 'bg-zinc-900 text-gray-400 border-zinc-800' : 'bg-white text-gray-500 border-gray-200'} border-t z-[50] relative transition-colors duration-300 py-4`}>
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm">
        <p>&copy; {new Date().getFullYear()} DOCS MINI. All rights reserved.</p>
        
        <div className="flex gap-6 mt-2 md:mt-0">
          {content.footerLinks.map((link) => (
            <Link key={link.title} to={link.path} className="hover:text-green-500 transition-colors">
              {link.title}
            </Link>
          ))}
          <Link to="/contact" className="hover:text-green-500 transition-colors">Help</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
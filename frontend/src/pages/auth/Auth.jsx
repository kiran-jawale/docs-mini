import React, { useState, useContext } from "react";
import Login from "./parts/Login";
import Register from "./parts/Register";
import { ThemeContext } from "../../contexts/ThemeContext";

const Auth = () => {
  const { theme } = useContext(ThemeContext);
  const [isLoginView, setIsLoginView] = useState(true);

  return (
    <div className={`min-h-[80vh] flex items-center justify-center p-4 transition-colors duration-300 ${theme === 'dark' ? 'bg-zinc-900' : 'bg-gray-50'}`}>
      <div className="w-full max-w-md">
        {isLoginView ? (
          <Login onToggleView={() => setIsLoginView(false)} />
        ) : (
          <Register onToggleView={() => setIsLoginView(true)} />
        )}
      </div>
    </div>
  );
};

export default Auth;
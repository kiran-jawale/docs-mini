import React, { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";

const ModalContainer = ({ isOpen, onClose, children }) => {
  const { theme } = useContext(ThemeContext);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className={`relative p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto ${
          theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl font-bold hover:text-red-500 transition-colors"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default ModalContainer;
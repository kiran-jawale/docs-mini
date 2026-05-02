import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className={`pointer-events-auto px-6 py-4 rounded-2xl shadow-2xl text-white font-bold flex items-center justify-between gap-4 min-w-[300px] border-b-4 ${
              toast.type === 'success' 
                ? 'bg-green-600 border-green-800' 
                : 'bg-red-600 border-red-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <span>{toast.type === 'success' ? '✅' : '⚠️'}</span>
              <span className="text-sm">{toast.message}</span>
            </div>
            <button 
              onClick={() => removeToast(toast.id)} 
              className="text-white/60 hover:text-white text-xl leading-none"
            >
              &times;
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
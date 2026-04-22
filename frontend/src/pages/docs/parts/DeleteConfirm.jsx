import React from 'react';
import { motion } from 'framer-motion';
import { useDom } from '../../../contexts/DomContext';
import documentService from '../../../services/document.service';

const DeleteConfirm = () => {
  const { selectedDoc, toggleDeleteConfirm, setDocs } = useDom();

  const handleConfirm = async () => {
    try {
      await documentService.deleteDocument(selectedDoc._id);
      setDocs(prev => prev.filter(d => d._id !== selectedDoc._id));
      toggleDeleteConfirm();
    } catch (error) {
      alert("Delete failed");
    }
  };

  return (
    <motion.div
      initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
      className="fixed bottom-0 left-0 z-[50] w-full bg-white dark:bg-zinc-800 p-8 shadow-[0_-10px_40px_rgba(0,0,0,0.2)] rounded-t-3xl"
    >
      <div className="max-w-md mx-auto text-center">
        <h3 className="text-xl font-bold mb-2 dark:text-white">Delete {selectedDoc?.title}?</h3>
        <p className="text-gray-500 mb-6">This action cannot be undone.</p>
        <div className="flex gap-4">
          <button onClick={handleConfirm} className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700">Delete</button>
          <button onClick={() => toggleDeleteConfirm()} className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300">Cancel</button>
        </div>
      </div>
    </motion.div>
  );
};

export default DeleteConfirm;
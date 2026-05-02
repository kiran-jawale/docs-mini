import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDom } from '../../../contexts/DomContext';
import documentService from '../../../services/document.service';
import { getErrorMessage } from '../../../constants/errors.js';

const EditForm = () => {
  const { selectedDoc, toggleEditForm, setDocs, addToast } = useDom();
  const [formData, setFormData] = useState({ title: '', description: '', isPublic: false });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (selectedDoc) {
      setFormData({ 
        title: selectedDoc.title, 
        description: selectedDoc.description,
        isPublic: selectedDoc.isPublic 
      });
    }
  }, [selectedDoc]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const res = await documentService.updateDocument(selectedDoc._id, formData);
      setDocs(prev => prev.map(d => d._id === selectedDoc._id ? res.data.data : d));
      addToast("Document metadata synchronized", "success");
      toggleEditForm();
    } catch (error) {
      addToast(getErrorMessage(error), "error");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div
      initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
      className="fixed top-0 left-0 z-[50] w-96 h-full bg-white dark:bg-zinc-900 p-8 shadow-2xl border-r border-zinc-100 dark:border-zinc-800"
    >
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black dark:text-white uppercase tracking-tighter leading-none">Edit Metadata</h2>
        <button onClick={() => toggleEditForm()} className="text-gray-400 hover:text-red-500 text-xl font-bold">&times;</button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-black text-zinc-400 ml-1">Title</label>
          <input 
            value={formData.title} className="input-field" disabled={isProcessing}
            onChange={(e) => setFormData({...formData, title: e.target.value})} 
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] uppercase font-black text-zinc-400 ml-1">Description</label>
          <textarea 
            value={formData.description} className="input-field min-h-[100px]" disabled={isProcessing}
            onChange={(e) => setFormData({...formData, description: e.target.value})} 
          />
        </div>

        <div className="flex items-center gap-2 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-700">
          <input 
            type="checkbox" checked={formData.isPublic} disabled={isProcessing}
            className="w-4 h-4 rounded accent-green-600"
            onChange={(e) => setFormData({...formData, isPublic: e.target.checked})} 
          />
          <label className="text-[10px] font-black uppercase tracking-widest dark:text-white">Public Visibility</label>
        </div>

        <button 
          type="submit" disabled={isProcessing}
          className={`w-full py-4 rounded-xl font-black uppercase text-[10px] tracking-widest mt-4 transition-all ${
            isProcessing ? "bg-zinc-100 text-zinc-400" : "bg-zinc-900 dark:bg-white text-white dark:text-black hover:opacity-90"
          }`}
        >
          {isProcessing ? "Updating..." : "Save Changes"}
        </button>
      </form>
    </motion.div>
  );
};

export default EditForm;
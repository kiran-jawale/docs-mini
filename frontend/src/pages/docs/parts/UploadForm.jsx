import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDom } from '../../../contexts/DomContext';
import documentService from '../../../services/document.service';
import { getErrorMessage } from '../../../constants/errors.js'; // Ensure this is imported

const UploadForm = () => {
  const { toggleUploadForm, setDocs, addToast } = useDom();
  const [formData, setFormData] = useState({ title: '', description: '', isPublic: false });
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isProcessing) return;

    setIsProcessing(true);
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('isPublic', formData.isPublic);
    data.append('documentFile', file);

    try {
      const res = await documentService.uploadDocument(data);
      setDocs(prev => [res.data.data, ...prev]);
      addToast("Vault entry synchronized", "success");
      toggleUploadForm();
    } catch (error) {
      // FIX: Use the utility instead of a hardcoded string
      const message = getErrorMessage(error);
      addToast(message, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div
      initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
      className="fixed top-0 right-0 z-[50] w-96 h-full bg-white dark:bg-zinc-900 p-8 shadow-2xl border-l border-zinc-100 dark:border-zinc-800"
    >
      {/* ... rest of your existing form UI ... */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black dark:text-white uppercase tracking-tighter leading-none">Upload</h2>
        <button onClick={toggleUploadForm} className="text-gray-400 hover:text-red-500 text-xl font-bold">&times;</button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          placeholder="Document Title" 
          className="input-field" 
          onChange={(e) => setFormData({...formData, title: e.target.value})} 
          disabled={isProcessing}
          required
        />
        <textarea 
          placeholder="Metadata Description" 
          className="input-field min-h-[100px]" 
          onChange={(e) => setFormData({...formData, description: e.target.value})} 
          disabled={isProcessing}
        />
        <div className="flex items-center gap-2 dark:text-white text-[10px] font-black uppercase tracking-widest">
          <input 
            type="checkbox" 
            className="w-4 h-4 rounded accent-green-600"
            onChange={(e) => setFormData({...formData, isPublic: e.target.checked})} 
            disabled={isProcessing}
          />
          <label>Public Visibility</label>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] uppercase font-black text-zinc-400">Attach Document</label>
          <input 
            type="file" 
            onChange={(e) => setFile(e.target.files[0])} 
            className="input-field py-2 text-xs" 
            required 
            disabled={isProcessing}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={isProcessing}
          className={`w-full py-4 rounded-xl font-black uppercase text-[10px] tracking-widest mt-4 transition-all ${
            isProcessing 
            ? "bg-zinc-100 text-zinc-400 cursor-not-allowed" 
            : "bg-zinc-900 dark:bg-white text-white dark:text-black hover:opacity-90"
          }`}
        >
          {isProcessing ? "Syncing to Cloud..." : "Execute Upload"}
        </button>
      </form>
    </motion.div>
  );
};

export default UploadForm;
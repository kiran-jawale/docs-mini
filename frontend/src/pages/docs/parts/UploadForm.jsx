import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDom } from '../../../contexts/DomContext';
import documentService from '../../../services/document.service';

const UploadForm = () => {
  const { toggleUploadForm, setDocs } = useDom();
  const [formData, setFormData] = useState({ title: '', description: '', isPublic: false });
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('isPublic', formData.isPublic);
    data.append('documentFile', file);

    try {
      const res = await documentService.uploadDocument(data);
      setDocs(prev => [res.data.data, ...prev]);
      toggleUploadForm();
    } catch (error) {
      alert("Upload failed");
    }
  };

  return (
    <motion.div
      initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
      className="fixed top-0 right-0 z-[50] w-96 h-full bg-white dark:bg-zinc-800 p-8 shadow-2xl"
    >
      <button onClick={toggleUploadForm} className="mb-6 text-gray-500 hover:text-red-500">Close</button>
      <h2 className="text-2xl font-bold mb-6 dark:text-white">Upload Document</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          placeholder="Title" 
          className="input-field" 
          onChange={(e) => setFormData({...formData, title: e.target.value})} 
        />
        <textarea 
          placeholder="Description" 
          className="input-field min-h-[100px]" 
          onChange={(e) => setFormData({...formData, description: e.target.value})} 
        />
        <div className="flex items-center gap-2 dark:text-white">
          <input 
            type="checkbox" 
            onChange={(e) => setFormData({...formData, isPublic: e.target.checked})} 
          />
          <label>Make Public</label>
        </div>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} className="input-field" required />
        <button type="submit" className="btn-primary">Upload</button>
      </form>
    </motion.div>
  );
};

export default UploadForm;
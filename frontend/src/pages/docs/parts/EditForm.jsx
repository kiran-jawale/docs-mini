import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDom } from '../../../contexts/DomContext';
import documentService from '../../../services/document.service';

const EditForm = () => {
  const { selectedDoc, toggleEditForm, setDocs } = useDom();
  const [formData, setFormData] = useState({ title: '', description: '' });

  useEffect(() => {
    if(selectedDoc) setFormData({ title: selectedDoc.title, description: selectedDoc.description });
  }, [selectedDoc]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await documentService.updateDocument(selectedDoc._id, formData);
      setDocs(prev => prev.map(d => d._id === selectedDoc._id ? res.data.data : d));
      toggleEditForm();
    } catch (error) {
      alert("Update failed");
    }
  };

  return (
    <motion.div
      initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
      className="fixed top-0 left-0 z-[50] w-96 h-full bg-white dark:bg-zinc-800 p-8 shadow-2xl"
    >
      <button onClick={() => toggleEditForm()} className="mb-6 text-gray-500 hover:text-red-500">Close</button>
      <h2 className="text-2xl font-bold mb-6 dark:text-white">Edit Document</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          value={formData.title}
          className="input-field" 
          onChange={(e) => setFormData({...formData, title: e.target.value})} 
        />
        <textarea 
          value={formData.description}
          className="input-field min-h-[100px]" 
          onChange={(e) => setFormData({...formData, description: e.target.value})} 
        />
        <button type="submit" className="btn-primary">Save Changes</button>
      </form>
    </motion.div>
  );
};

export default EditForm;
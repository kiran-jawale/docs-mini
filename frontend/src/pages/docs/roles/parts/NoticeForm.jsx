import React, { useState } from 'react';
import noticeService from '../../../../services/notice.service';
import { useDom } from '../../../../contexts/DomContext';

const NoticeForm = ({ onClose, refresh }) => {
  const { addToast } = useDom();
  const [formData, setFormData] = useState({ title: '', message: '', type: 'info' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await noticeService.createNotice(formData);
      addToast("Announcement published globally", "success");
      refresh();
      onClose();
    } catch (error) { 
      addToast(error.friendlyMessage || "Failed to publish", "error"); 
    }
  };

  return (
    <div className="p-8 bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-sm border border-zinc-100 dark:border-zinc-800 shadow-2xl">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-black dark:text-white uppercase tracking-tighter">Global Broadcast</h2>
        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-1">System-wide announcement</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-[10px] font-black text-zinc-400 uppercase ml-1">Subject</label>
          <input 
            placeholder="URGENT: SYSTEM UPDATE" className="input-field" required
            onChange={(e) => setFormData({...formData, title: e.target.value})} 
          />
        </div>
        
        <div>
          <label className="text-[10px] font-black text-zinc-400 uppercase ml-1">Content</label>
          <textarea 
            placeholder="Type your message here..." className="input-field min-h-[100px] py-3" required
            onChange={(e) => setFormData({...formData, message: e.target.value})} 
          />
        </div>

        <div>
          <label className="text-[10px] font-black text-zinc-400 uppercase ml-1">Priority Style</label>
          <select 
            className="input-field cursor-pointer"
            onChange={(e) => setFormData({...formData, type: e.target.value})}
          >
            <option value="info">Information (Blue)</option>
            <option value="alert">Critical Alert (Red)</option>
            <option value="success">Status Success (Green)</option>
          </select>
        </div>

        <button 
          type="submit" 
          className="w-full bg-zinc-900 dark:bg-white text-white dark:text-black py-4 rounded-2xl font-black text-xs uppercase tracking-widest mt-4 hover:opacity-90 transition-all active:scale-95"
        >
          Publish to Board
        </button>
      </form>
    </div>
  );
};

export default NoticeForm;
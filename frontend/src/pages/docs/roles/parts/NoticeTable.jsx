import React from 'react';
import noticeService from '../../../../services/notice.service';
import { useDom } from '../../../../contexts/DomContext';

const NoticeTable = ({ notices, refresh }) => {
  const { addToast } = useDom();

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently remove this announcement from all users?")) return;
    try {
      await noticeService.deleteNotice(id);
      addToast("Announcement retracted", "success");
      refresh();
    } catch (error) {
      addToast("Failed to delete notice", "error");
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl overflow-hidden border border-zinc-100 dark:border-zinc-800">
      <table className="w-full text-left">
        <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-400 text-[10px] uppercase font-black">
          <tr>
            <th className="p-4">Announcement Details</th>
            <th className="p-4">Priority Level</th>
            <th className="p-4">Publish Date</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y dark:divide-zinc-800">
          {notices.length === 0 ? (
            <tr><td colSpan="4" className="p-10 text-center text-zinc-400 text-xs font-black uppercase tracking-widest">No active broadcasts</td></tr>
          ) : (
            notices.map(n => (
              <tr key={n._id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition">
                <td className="p-4">
                  <p className="font-bold text-sm dark:text-white uppercase leading-tight">{n.title}</p>
                  <p className="text-[10px] text-zinc-500 line-clamp-1 mt-1">{n.message}</p>
                </td>
                <td className="p-4">
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-lg ${
                    n.type === 'alert' ? 'bg-red-500/10 text-red-500' : 
                    n.type === 'success' ? 'bg-green-500/10 text-green-500' : 
                    'bg-blue-500/10 text-blue-500'
                  }`}>
                    {n.type}
                  </span>
                </td>
                <td className="p-4 text-[10px] font-mono text-zinc-400">
                  {new Date(n.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => handleDelete(n._id)}
                    className="text-[10px] font-black uppercase text-red-500/40 hover:text-red-500 transition"
                  >
                    Retract
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default NoticeTable;
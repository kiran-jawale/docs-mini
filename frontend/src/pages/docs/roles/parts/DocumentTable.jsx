import React from 'react';
import adminService from '../../../../services/admin.service';
import modService from '../../../../services/mod.service';
import { useDom } from '../../../../contexts/DomContext';

const DocumentTable = ({ docs, refresh, isAdmin = false }) => {
  const { toggleViewModal, addToast } = useDom();

  const handleToggleVisibility = async (id) => {
    try {
      await modService.toggleVisibility(id);
      addToast("Document visibility updated", "success");
      refresh();
    } catch (error) { 
      addToast("Visibility toggle failed", "error"); 
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Permanently delete this document from the system?")) return;
    try {
      await adminService.adminDeleteDocument(id);
      addToast("Document purged", "success");
      refresh();
    } catch (error) { 
      addToast("Deletion failed", "error"); 
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl overflow-hidden border border-zinc-100 dark:border-zinc-800">
      <table className="w-full text-left">
        <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-400 text-[10px] uppercase font-black">
          <tr>
            <th className="p-4">Document Metadata</th>
            <th className="p-4">Owner Identity</th>
            <th className="p-4">System Status</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y dark:divide-zinc-800">
          {docs.length === 0 ? (
            <tr>
              <td colSpan="4" className="p-10 text-center text-zinc-500 font-black text-xs uppercase tracking-widest">
                No public documents found
              </td>
            </tr>
          ) : (
            docs.map(d => (
              <tr key={d._id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition">
                <td className="p-4">
                  <p className="font-bold text-sm dark:text-white leading-tight">{d.title}</p>
                  <p className="text-[10px] font-mono text-zinc-500 uppercase mt-1">
                    {d.fileType?.split('/')[1] || d.fileType}
                  </p>
                </td>
                <td className="p-4">
                  <p className="text-xs font-bold dark:text-gray-300">{d.owner?.fullname || 'System Authored'}</p>
                  <p className="text-[10px] font-mono text-zinc-500">{d.owner?.email}</p>
                </td>
                <td className="p-4">
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-lg ${
                    d.isPublic ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                  }`}>
                    {d.isPublic ? 'Public' : 'Restricted'}
                  </span>
                </td>
                <td className="p-4 text-right flex justify-end gap-4 items-center">
                  <button 
                    onClick={() => toggleViewModal(d)} 
                    className="text-[10px] font-black uppercase tracking-widest text-blue-500/70 hover:text-blue-500 transition"
                  >
                    Inspect
                  </button>
                  <button 
                    onClick={() => handleToggleVisibility(d._id)} 
                    className="text-[10px] font-black uppercase tracking-widest text-orange-500/70 hover:text-orange-500 transition"
                  >
                    {d.isPublic ? 'Unpublish' : 'Publish'}
                  </button>
                  {isAdmin && (
                    <button 
                      onClick={() => handleDelete(d._id)} 
                      className="text-[10px] font-black uppercase tracking-widest text-red-500/40 hover:text-red-500 transition"
                    >
                      Purge
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DocumentTable;
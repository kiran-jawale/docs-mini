import React from 'react';
import adminService from '../../../../services/admin.service';
import modService from '../../../../services/mod.service';
import { useDom } from '../../../../contexts/DomContext';

const DocumentTable = ({ docs, refresh, isAdmin = false }) => {
  const { toggleViewModal } = useDom();

  const handleToggleVisibility = async (id) => {
    try {
      await modService.toggleVisibility(id);
      refresh();
    } catch (error) { alert("Failed"); }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Delete public doc?")) return;
    try {
      await adminService.adminDeleteDocument(id);
      refresh();
    } catch (error) { alert("Failed"); }
  };

  return (
    <div className="overflow-x-auto bg-white dark:bg-zinc-800 rounded-xl shadow">
      <table className="w-full text-left">
        <thead className="bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300">
          <tr>
            <th className="p-4">Title</th>
            <th className="p-4">Owner</th>
            <th className="p-4">Type</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {docs.map(d => (
            <tr key={d._id} className="border-b dark:border-zinc-700">
              <td className="p-4 font-medium">{d.title}</td>
              <td className="p-4 text-sm text-gray-500">{d.owner?.fullname || 'Unknown'}</td>
              <td className="p-4 text-xs">{d.fileType}</td>
              <td className="p-4 flex gap-3 text-sm">
                <button onClick={() => toggleViewModal(d)} className="text-blue-500 hover:underline">View</button>
                <button onClick={() => handleToggleVisibility(d._id)} className="text-orange-500 hover:underline">
                  {d.isPublic ? 'Unpublish' : 'Publish'}
                </button>
                {isAdmin && (
                  <button onClick={() => handleDelete(d._id)} className="text-red-500 hover:underline">Delete</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DocumentTable;
import React from 'react';
import adminService from '../../../../services/admin.service';
import { useDom } from '../../../../contexts/DomContext';
import { useSelector } from 'react-redux';

const UserTable = ({ users, onInfo, refresh, isModView = false }) => {
  const { addToast } = useDom();
  const { user: currentUser } = useSelector((state) => state.auth);

  const handleStatusChange = async (id, status) => {
    if (id === currentUser?._id) {
      addToast("Self-status modification blocked", "error");
      return;
    }

    try {
      await adminService.updateUserStatus(id, status);
      addToast("Status updated", "success");
      refresh();
    } catch (error) {
      addToast(error.friendlyMessage || "Update failed", "error");
    }
  };

  const handleWipeData = async (id, name) => {
    if (!window.confirm(`Wipe all data for ${name}?`)) return;

    try {
      await adminService.deleteUser(id);
      addToast("User purged", "success");
      refresh();
    } catch (error) {
      addToast("Unauthorized or failed", "error");
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl overflow-hidden border border-zinc-100 dark:border-zinc-800">
      <table className="w-full text-left">
        <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-400 text-[10px] uppercase font-black">
          <tr>
            <th className="p-4">Citizen Identity</th>
            <th className="p-4">Current Status</th>
            <th className="p-4 text-right">Operational Controls</th>
          </tr>
        </thead>
        <tbody className="divide-y dark:divide-zinc-800">
          {users.map(u => (
            <tr key={u._id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition">
              <td className="p-4">
                <p className="font-bold text-sm dark:text-white">{u.fullname}</p>
                <p className="text-[10px] font-mono text-zinc-500 uppercase">{u.areacode || 'No Zone'}</p>
              </td>
              <td className="p-4">
                <select 
                  value={u.status} 
                  onChange={(e) => handleStatusChange(u._id, e.target.value)}
                  className="bg-zinc-100 dark:bg-zinc-800 dark:text-white text-[10px] font-black uppercase py-1.5 px-2 rounded-lg border-none focus:ring-0 cursor-pointer"
                >
                  <option value="active" className="bg-white dark:bg-zinc-900 text-black dark:text-white">Active</option>
                  <option value="restricted" className="bg-white dark:bg-zinc-900 text-black dark:text-white">Restricted</option>
                  <option value="blocked" className="bg-white dark:bg-zinc-900 text-black dark:text-white">Blocked</option>
                  {!isModView && (
                    <option value="disabled" className="bg-white dark:bg-zinc-900 text-black dark:text-white">Disabled</option>
                  )}
                </select>
              </td>
              <td className="p-4 text-right flex justify-end gap-4">
                <button 
                  onClick={() => onInfo(u._id)} 
                  className="text-[10px] font-black uppercase text-zinc-400 hover:text-green-600 transition"
                >
                  Inspect
                </button>
                
                {currentUser?.role === 'admin' && u._id !== currentUser?._id && (
                  <button 
                    onClick={() => handleWipeData(u._id, u.fullname)}
                    className="text-[10px] font-black uppercase text-red-500/40 hover:text-red-500 transition"
                  >
                    Wipe
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
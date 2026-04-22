import React from 'react';
import adminService from '../../../../services/admin.service';
import modService from '../../../../services/mod.service';

const UserTable = ({ users, refresh, isAdmin = false }) => {
  const handleStatusChange = async (id, status) => {
    try {
      if (isAdmin) await adminService.updateUserStatus(id, status);
      else await modService.updateUserStatus(id, status);
      refresh();
    } catch (error) { alert("Action failed"); }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Delete User?")) return;
    try {
      await adminService.deleteUser(id);
      refresh();
    } catch (error) { alert("Delete failed"); }
  };

  return (
    <div className="overflow-x-auto bg-white dark:bg-zinc-800 rounded-xl shadow">
      <table className="w-full text-left">
        <thead className="bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300">
          <tr>
            <th className="p-4">Name</th>
            <th className="p-4">Role</th>
            <th className="p-4">Status</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id} className="border-b dark:border-zinc-700">
              <td className="p-4">
                <div className="font-bold">{u.fullname}</div>
                <div className="text-xs text-gray-500">{u.email}</div>
              </td>
              <td className="p-4 uppercase text-xs font-bold">{u.role}</td>
              <td className="p-4">
                <select 
                  value={u.status} 
                  onChange={(e) => handleStatusChange(u._id, e.target.value)}
                  disabled={u.role === 'admin'}
                  className="bg-transparent border border-gray-300 rounded px-2 py-1 text-sm dark:text-white"
                >
                  <option value="active">Active</option>
                  <option value="restricted">Restricted</option>
                  <option value="blocked">Blocked</option>
                  <option value="disabled">Disabled</option>
                </select>
              </td>
              <td className="p-4">
                {isAdmin && u.role !== 'admin' && (
                  <button onClick={() => handleDelete(u._id)} className="text-red-500 hover:text-red-700 text-sm">Delete</button>
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
import React from 'react';
import adminService from '../../../../services/admin.service';
import { useDom } from '../../../../contexts/DomContext';
import { useSelector } from 'react-redux';

const EmployeeTable = ({ employees, refresh }) => {
  const { addToast } = useDom();
  const currentUser = useSelector((state) => state.auth.user);

  const handleStatusToggle = async (id, currentStatus) => {
    // Prevent Self-Attack
    if (id === currentUser._id) {
      addToast("You cannot revoke your own access", "error");
      return;
    }

    const newStatus = currentStatus === 'active' ? 'disabled' : 'active';
    try {
      await adminService.updateEmployee(id, { status: newStatus });
      addToast(`Employee access ${newStatus === 'active' ? 'restored' : 'revoked'}`, "success");
      refresh();
    } catch (error) {
      addToast(error.friendlyMessage || "Failed to update employee", "error");
    }
  };

  return (
    <div className="overflow-x-auto bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-800">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-zinc-50 dark:bg-zinc-800/50 text-gray-400 uppercase text-[10px] font-black tracking-widest">
            <th className="p-5">Staff Member</th>
            <th className="p-5">Department</th>
            <th className="p-5">Role</th>
            <th className="p-5">Status</th>
            <th className="p-5 text-right">Controls</th>
          </tr>
        </thead>
        <tbody className="divide-y dark:divide-zinc-800">
          {employees.map(emp => (
            <tr key={emp._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition">
              <td className="p-5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-zinc-200 dark:bg-zinc-700 rounded-lg flex items-center justify-center font-bold text-zinc-500">
                    {emp?.fullname?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-sm dark:text-white">{emp.fullname}</p>
                    <p className="text-[10px] text-gray-500 font-mono">{emp.empCode}</p>
                  </div>
                </div>
              </td>
              <td className="p-5 text-sm font-medium text-gray-600 dark:text-gray-400">{emp.dept}</td>
              <td className="p-5">
                <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded text-[10px] font-black uppercase">
                  {emp.role}
                </span>
              </td>
              <td className="p-5">
                <span className={`flex items-center gap-1.5 text-[10px] font-bold ${emp.status === 'active' ? 'text-green-500' : 'text-red-500'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${emp.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  {emp.status?.toUpperCase()}
                </span>
              </td>
              <td className="p-5 text-right">
                {/* Hide controls for self or if target is Admin (unless current user is Admin) */}
                {emp._id !== currentUser._id && (currentUser.role === 'admin' || emp.role !== 'hr') && (
                  <button 
                    onClick={() => handleStatusToggle(emp._id, emp.status)}
                    className={`text-xs font-bold px-3 py-1 rounded-md transition ${
                      emp.status === 'active' 
                      ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20' 
                      : 'text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20'
                    }`}
                  >
                    {emp.status === 'active' ? 'Disable Access' : 'Enable Access'}
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

export default EmployeeTable;
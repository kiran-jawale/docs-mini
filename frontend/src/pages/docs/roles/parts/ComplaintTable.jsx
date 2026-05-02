import React from 'react';
import complaintService from '../../../../services/complaint.service';
import { useDom } from '../../../../contexts/DomContext';

const ComplaintTable = ({ complaints, refresh }) => {
  const { addToast } = useDom();

  const handleStatusChange = async (id, status) => {
    try {
      await complaintService.updateStatus(id, status);
      addToast(`Ticket marked as ${status}`, "success");
      refresh();
    } catch (error) {
      addToast(error.friendlyMessage, "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this ticket?")) return;
    try {
      await complaintService.deleteComplaint(id);
      addToast("Ticket deleted", "success");
      refresh();
    } catch (error) {
      addToast(error.friendlyMessage, "error");
    }
  };

  return (
    <div className="overflow-x-auto bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-800">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-zinc-50 dark:bg-zinc-800/50 text-gray-400 uppercase text-[10px] font-black tracking-widest">
            <th className="p-5">Issue Details</th>
            <th className="p-5">Raised By</th>
            <th className="p-5">Status</th>
            <th className="p-5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y dark:divide-zinc-800">
          {complaints.length === 0 ? (
            <tr><td colSpan="4" className="p-10 text-center text-gray-500">No active complaints.</td></tr>
          ) : (
            complaints.map(c => (
              <tr key={c._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition">
                <td className="p-5">
                  <p className="font-bold text-sm dark:text-white uppercase">{c.subject}</p>
                  <p className="text-xs text-gray-500 line-clamp-1">{c.description}</p>
                </td>
                <td className="p-5">
                  <p className="text-sm font-medium dark:text-gray-300">{c.raisedBy?.fullname}</p>
                  <p className="text-[10px] text-gray-500">{c.raisedBy?.email}</p>
                </td>
                <td className="p-5">
                  <select 
                    value={c.status} 
                    onChange={(e) => handleStatusChange(c._id, e.target.value)}
                    className={`bg-transparent text-xs font-bold rounded p-1 border-none cursor-pointer ${
                      c.status === 'resolved' ? 'text-green-500' : 'text-orange-500'
                    }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </td>
                <td className="p-5 text-right">
                  <button onClick={() => handleDelete(c._id)} className="text-xs font-bold text-red-500 hover:underline">Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ComplaintTable;
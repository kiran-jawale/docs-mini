import React, { useEffect, useState } from 'react';
import adminService from '../../../../services/admin.service';
import { useDom } from '../../../../contexts/DomContext';
import { getRegionLabel } from '../../../../constants/content.js'; // IMPORTED MAPPING

const UserInfoModal = ({ userId, onClose }) => {
  const { addToast } = useDom();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await adminService.getUserById(userId);
        setUserData(res.data.data);
      } catch (error) {
        addToast("Profile fetch failed", "error");
        onClose();
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchUser();
  }, [userId]);

  if (loading) return <div className="p-10 text-center dark:text-white font-black text-xs uppercase tracking-widest">Loading Identity...</div>;

  return (
    <div className="flex flex-col w-full max-w-sm bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden">
      <div className="p-8 flex flex-col items-center bg-zinc-50 dark:bg-zinc-800/30 border-b dark:border-zinc-800">
        <div className="w-16 h-16 bg-zinc-200 dark:bg-zinc-700 rounded-2xl flex items-center justify-center text-zinc-400 text-2xl font-black mb-4">
          {userData?.fullname?.charAt(0)}
        </div>
        <h2 className="text-lg font-black dark:text-white uppercase tracking-tight">{userData?.fullname}</h2>
        <p className="text-[10px] font-bold text-zinc-400 mt-1">{userData?.email}</p>
      </div>

      <div className="p-6 space-y-3">
        <div className="flex justify-between items-center py-2 border-b dark:border-zinc-800/50">
          <span className="text-[10px] font-black text-zinc-400 uppercase">System Status</span>
          <span className={`text-[10px] font-black uppercase ${userData?.status === 'active' ? 'text-green-500' : 'text-red-500'}`}>
            {userData?.status}
          </span>
        </div>

        <div className="flex justify-between items-center py-2 border-b dark:border-zinc-800/50">
          <span className="text-[10px] font-black text-zinc-400 uppercase">Region Assignment</span>
          <span className="text-xs font-bold dark:text-zinc-200 italic">
            {/* DYNAMIC MAPPING FROM CONTENT.JS */}
            {getRegionLabel(userData?.areacode)}
          </span>
        </div>

        <div className="flex justify-between items-center py-2">
          <span className="text-[10px] font-black text-zinc-400 uppercase">Account ID</span>
          <span className="text-[10px] font-mono text-zinc-500">
            {userData?._id?.slice(-12).toUpperCase()}
          </span>
        </div>

        <button 
          onClick={onClose} 
          className="w-full mt-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-black text-[10px] font-black uppercase rounded-xl hover:opacity-90 transition"
        >
          Exit Profile
        </button>
      </div>
    </div>
  );
};

export default UserInfoModal;
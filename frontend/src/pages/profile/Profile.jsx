import React from 'react';
import { useSelector } from 'react-redux';
import { getRegionLabel } from '../../constants/content.js';

const Profile = () => {
  const { user, type } = useSelector((state) => state.auth);

  if (!user) return (
    <div className="h-[60vh] flex items-center justify-center font-black text-xs uppercase tracking-widest text-zinc-400">
      Account data not found
    </div>
  );

  const isEmployee = type === 'employee';

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
      <div className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden">
        
        <div className="p-10 flex flex-col items-center bg-zinc-50 dark:bg-zinc-800/30 border-b dark:border-zinc-800">
          <div className="w-24 h-24 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-3xl flex items-center justify-center text-4xl font-black mb-6 shadow-xl shadow-zinc-900/10 transition-transform hover:scale-105">
            {user.fullname.charAt(0)}
          </div>
          <h1 className="text-2xl font-black dark:text-white uppercase tracking-tight text-center leading-none">
            {user.fullname}
          </h1>
          <p className="text-[10px] font-bold text-zinc-400 mt-4 tracking-widest uppercase bg-zinc-200/50 dark:bg-zinc-700/50 px-3 py-1 rounded-full">
            {type} Account
          </p>
        </div>

        <div className="p-8 space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Email Address</span>
            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
              {user.email}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Fast-Login ID</span>
            <span className="text-xs font-mono font-bold px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-md dark:text-zinc-200">
              {user.userID || "NOT SET"}
            </span>
          </div>

          {!isEmployee ? (
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Region</span>
              <span className="text-xs font-bold dark:text-zinc-200 italic">
                {getRegionLabel(user.areacode)}
              </span>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Employee Code</span>
              <span className="text-xs font-mono font-bold dark:text-zinc-200">
                {user.empCode}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center pt-5 border-t dark:border-zinc-800">
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">System Status</span>
            <span className={`text-[10px] font-black uppercase ${
              user.status === 'active' ? 'text-green-500' : 'text-red-500'
            }`}>
              ● {user.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
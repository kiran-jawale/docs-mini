// src/pages/analytics/parts/UserAnalytics.jsx
import React, { useState, useEffect } from "react";
import analyticsService from "../../../services/analytics.service";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

const UserAnalytics = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await analyticsService.getUserAnalytics();
        setData(res.data.data);
      } catch (error) { console.error(error); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  return (
    <div className="space-y-8">
      {loading ? <div className="animate-pulse font-black uppercase text-[10px] text-zinc-500">Syncing Identities...</div> : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data.map((item, idx) => (
              <div key={idx} className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-sm border dark:border-zinc-700">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{item._id || "Active"}</p>
                <p className="text-4xl font-black text-zinc-900 dark:text-white mt-2">{item.count}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-zinc-800 p-8 rounded-3xl h-[350px] border dark:border-zinc-700">
               <h3 className="font-black text-zinc-400 uppercase text-[10px] tracking-widest mb-6">Status Composition</h3>
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={data} dataKey="count" cx="50%" cy="50%" outerRadius={100} paddingAngle={5}>
                      {data.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
               </ResponsiveContainer>
            </div>
            <div className="bg-white dark:bg-zinc-800 p-8 rounded-3xl h-[350px] border dark:border-zinc-700">
               <h3 className="font-black text-zinc-400 uppercase text-[10px] tracking-widest mb-6">Population Density</h3>
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <XAxis dataKey="_id" axisLine={false} tickLine={false} />
                    <Bar dataKey="count" radius={[10, 10, 0, 0]}>
                       {data.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                    </Bar>
                  </BarChart>
               </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserAnalytics;
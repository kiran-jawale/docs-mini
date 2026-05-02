// src/pages/analytics/parts/ComplaintAnalytics.jsx
import React, { useState, useEffect } from "react";
import analyticsService from "../../../services/analytics.service";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, CartesianGrid } from 'recharts';

const COLORS = ['#ef4444', '#f59e0b', '#10b981'];

const ComplaintAnalytics = () => {
  const [data, setData] = useState({ statusCounts: [], priorityStats: [] });
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await analyticsService.getComplaintAnalytics({ userStatus: filter });
      setData(res.data.data[0]);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [filter]);

  const totalTickets = data.statusCounts.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="space-y-6">
      {/* <div className="flex justify-between items-center bg-white dark:bg-zinc-900 p-4 rounded-2xl border dark:border-zinc-800 shadow-sm">
        <p className="text-xs font-black uppercase text-zinc-400">Auto-Refresh Active</p>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="bg-transparent text-xs font-black uppercase text-green-600 outline-none cursor-pointer">
           <option value="">Raiser: All Tiers</option>
           <option value="active">Raiser: Active Only</option>
        </select>
      </div> */}

      {loading ? <div className="p-10 animate-pulse text-xs font-black uppercase text-zinc-500">Mapping Helpdesk...</div> : (
        <>
          <div className="grid md:grid-cols-2 gap-6">
             <div className="bg-zinc-900 text-white p-6 rounded-2xl shadow-xl">
               <p className="text-[10px] font-black uppercase opacity-60">Total Tickets</p>
               <p className="text-4xl font-black mt-2">{totalTickets}</p>
             </div>
             <div className="bg-green-600 text-white p-6 rounded-2xl shadow-xl">
               <p className="text-[10px] font-black uppercase opacity-60">Resolved Efficiency</p>
               <p className="text-4xl font-black mt-2">
                 {Math.round((data.statusCounts.find(s => s._id === 'resolved')?.count || 0) / totalTickets * 100) || 0}%
               </p>
             </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-zinc-800 p-8 rounded-3xl h-[350px] border dark:border-zinc-700 shadow-sm">
               <h3 className="font-black text-zinc-400 uppercase text-[10px] tracking-widest mb-6">Status Lifecycle</h3>
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie data={data.statusCounts} dataKey="count" cx="50%" cy="50%" innerRadius={70} outerRadius={100}>
                      {data.statusCounts.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                 </PieChart>
               </ResponsiveContainer>
            </div>
            <div className="bg-white dark:bg-zinc-800 p-8 rounded-3xl h-[350px] border dark:border-zinc-700 shadow-sm">
               <h3 className="font-black text-zinc-400 uppercase text-[10px] tracking-widest mb-6">Resolution Volume</h3>
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={data.statusCounts}>
                    <XAxis dataKey="_id" hide />
                    <Bar dataKey="count" radius={12}>
                      {data.statusCounts.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
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

export default ComplaintAnalytics;
// src/pages/analytics/parts/DocAnalytics.jsx
import React, { useState, useEffect } from "react";
import analyticsService from "../../../services/analytics.service";
import { userStatusOptions } from "../../../constants/forms";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#10b981', '#6366f1']; 

const DocAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ isPublic: "", userStatus: "" });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await analyticsService.getDocAnalytics(filters);
      setData(res.data.data);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [filters]);

  const visibilityData = data?.visibilityStats?.map(item => ({
    name: item._id ? 'Public' : 'Private',
    count: item.count
  })) || [];

  // Logic to translate Engineer-level MIME types to Human-readable labels
  const getHumanLabel = (mime) => {
    if (mime.includes('pdf')) return 'PDF Document';
    if (mime.includes('image')) return 'Image/Media';
    if (mime.includes('json')) return 'System Data';
    if (mime.includes('word') || mime.includes('msword')) return 'Word Doc';
    if (mime.includes('excel') || mime.includes('sheet')) return 'Spreadsheet';
    if (mime.includes('text')) return 'Text File';
    return 'Other Assets';
  };

  const storageData = data?.storageByType?.map(item => ({
    name: getHumanLabel(item._id),
    sizeMB: parseFloat((item.totalSize / (1024 * 1024)).toFixed(2))
  })) || [];

  return (
    <div className="space-y-8">
      <div className="flex gap-4 bg-white dark:bg-zinc-900 p-2 rounded-2xl border dark:border-zinc-800 w-fit">
        <select className="bg-transparent text-[10px] font-black uppercase px-4 py-2 text-zinc-500 outline-none" 
          value={filters.isPublic} onChange={(e) => setFilters({ ...filters, isPublic: e.target.value })}>
          <option value="">All Visibility</option>
          <option value="true">Public Only</option>
          <option value="false">Private Only</option>
        </select>
        <select className="bg-transparent text-[10px] font-black uppercase px-4 py-2 text-zinc-500 border-l dark:border-zinc-800 outline-none" 
          value={filters.userStatus} onChange={(e) => setFilters({ ...filters, userStatus: e.target.value })}>
          <option value="">All Owner Tiers</option>
          {userStatusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>

      {loading ? <div className="p-20 text-center animate-pulse font-black text-xs uppercase text-zinc-500">Mapping Vault...</div> : (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-600 p-8 rounded-3xl text-white shadow-xl">
              <p className="text-[10px] uppercase font-black opacity-70 tracking-widest">Total Asset Count</p>
              <p className="text-5xl font-black mt-2">{data?.totalStats[0]?.totalDocs || 0}</p>
            </div>
            <div className="bg-zinc-900 dark:bg-white p-8 rounded-3xl text-white dark:text-black shadow-xl">
              <p className="text-[10px] uppercase font-black opacity-70 tracking-widest">Global Storage</p>
              <p className="text-5xl font-black mt-2">{((data?.totalStats[0]?.totalBytes || 0) / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-zinc-800 p-8 rounded-3xl border dark:border-zinc-700 h-[350px]">
              <h3 className="font-black text-zinc-400 uppercase text-[10px] tracking-widest mb-6">Privacy Distribution</h3>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={visibilityData} dataKey="count" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5}>
                    {visibilityData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white dark:bg-zinc-800 p-8 rounded-3xl border dark:border-zinc-700 h-[350px]">
              <h3 className="font-black text-zinc-400 uppercase text-[10px] tracking-widest mb-6">Storage Volume by Type (MB)</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={storageData}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900}} />
                  <Tooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="sizeMB" fill="#10b981" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocAnalytics;
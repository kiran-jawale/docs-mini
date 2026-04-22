import React, { useState, useEffect } from "react";
import analyticsService from "../../../services/analytics.service";
import { userStatusOptions } from "../../../constants/forms";

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

  useEffect(() => { fetchData(); }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchData();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleFilter} className="flex flex-wrap gap-4 bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-700 items-end">
        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Visibility</label>
          <select className="input-field mt-0 py-2" value={filters.isPublic} onChange={(e) => setFilters({ ...filters, isPublic: e.target.value })}>
            <option value="">All</option>
            <option value="true">Public Only</option>
            <option value="false">Private Only</option>
          </select>
        </div>
        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Owner Status</label>
          <select className="input-field mt-0 py-2" value={filters.userStatus} onChange={(e) => setFilters({ ...filters, userStatus: e.target.value })}>
            <option value="">All</option>
            {userStatusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <button type="submit" className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition h-fit">Apply Filter</button>
      </form>

      {loading ? <p>Loading insights...</p> : (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-600 to-emerald-800 p-6 rounded-xl shadow-lg text-white flex justify-around">
            <div className="text-center">
              <p className="text-sm uppercase font-bold opacity-80">Total Documents</p>
              <p className="text-4xl font-black mt-1">{data?.totalStats[0]?.totalDocs || 0}</p>
            </div>
            <div className="text-center">
              <p className="text-sm uppercase font-bold opacity-80">Total Storage Used</p>
              <p className="text-4xl font-black mt-1">{((data?.totalStats[0]?.totalBytes || 0) / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
          </div>
          
          <h3 className="font-bold text-lg dark:text-white">Breakdown by File Type</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {data?.storageByType?.map(type => (
              <div key={type._id} className="bg-white dark:bg-zinc-800 p-4 rounded-xl shadow border border-gray-100 dark:border-zinc-700">
                <p className="text-xs text-gray-500 uppercase font-bold truncate">{type._id.split('/')[1] || type._id}</p>
                <p className="text-2xl font-black text-gray-800 dark:text-white mt-1">{type.count} Files</p>
                <p className="text-sm text-green-600 font-semibold mt-1">{(type.totalSize / 1024).toFixed(1)} KB</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocAnalytics;
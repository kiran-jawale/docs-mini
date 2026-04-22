import React, { useState, useEffect } from "react";
import analyticsService from "../../../services/analytics.service";
import { userStatusOptions } from "../../../constants/forms";

const UserAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ status: "" });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await analyticsService.getUserAnalytics(filters);
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
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">User Status</label>
          <select className="input-field mt-0 py-2" value={filters.status} onChange={(e) => setFilters({ status: e.target.value })}>
            <option value="">All Statuses</option>
            {userStatusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <button type="submit" className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition h-fit">Apply Filter</button>
      </form>

      {loading ? <p>Loading insights...</p> : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {data?.map(item => (
            <div key={item._id} className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow border border-gray-100 dark:border-zinc-700 text-center">
              <p className="text-sm text-gray-500 uppercase font-bold">{item._id || "Unknown"}</p>
              <p className="text-4xl font-black text-green-600 mt-2">{item.count}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserAnalytics;
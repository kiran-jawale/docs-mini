// src/pages/analytics/parts/FinanceAnalytics.jsx
import React, { useState, useEffect } from "react";
import financeService from "../../../services/finance.service";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

const FinanceAnalytics = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("all"); 
  const [mode, setMode] = useState("dashboard"); 

  const loadData = async () => {
    setLoading(true);
    try {
      let res = (view === "all") ? await financeService.getAllTransactions() : await financeService.getPayrollTransactions();
      setTransactions(res.data.data);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, [view]);

  const aggregateData = () => {
    let income = 0; let out = 0;
    transactions.forEach(t => {
      if (t.type === 'Income') income += t.amount;
      else out += t.amount; // Combines Expense and Payroll into Outflow
    });
    return [
      { name: 'Total Inflow', value: income, color: '#10b981' },
      { name: 'Total Outflow', value: out, color: '#ef4444' }
    ].filter(d => d.value > 0);
  };

  const chartData = aggregateData();
  const totalIn = chartData.find(d => d.name === 'Total Inflow')?.value || 0;
  const totalOut = chartData.find(d => d.name === 'Total Outflow')?.value || 0;

  return (
    <div className="space-y-8">
      {/* Tab Section Switches */}
      <div className="flex justify-between items-end border-b dark:border-zinc-800 pb-4">
        <div className="flex gap-8">
          <button onClick={() => setMode("dashboard")} className={`text-xs font-black uppercase tracking-widest pb-2 transition-all ${mode === 'dashboard' ? 'text-green-600 border-b-2 border-green-600' : 'text-zinc-500'}`}>Visual Metrics</button>
          <button onClick={() => setMode("ledger")} className={`text-xs font-black uppercase tracking-widest pb-2 transition-all ${mode === 'ledger' ? 'text-green-600 border-b-2 border-green-600' : 'text-zinc-500'}`}>Personnel Ledger</button>
        </div>
        
        <div className="flex gap-2 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
           <button onClick={() => setView("all")} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition ${view === 'all' ? 'bg-white dark:bg-zinc-700 text-black dark:text-white shadow-sm' : 'text-zinc-500'}`}>Global</button>
           <button onClick={() => setView("payroll")} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition ${view === 'payroll' ? 'bg-white dark:bg-zinc-700 text-black dark:text-white shadow-sm' : 'text-zinc-500'}`}>Payroll</button>
        </div>
      </div>

      {loading ? <div className="p-20 text-center animate-pulse font-black text-xs uppercase text-zinc-500">Syncing Ledger...</div> : (
        <>
          {/* ONLY SHOW CARDS ON DASHBOARD MODE */}
          {mode === "dashboard" && view !== "payroll" && (
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-green-600 p-8 rounded-3xl text-white shadow-xl">
                <p className="text-[10px] uppercase font-black opacity-70 tracking-widest">Inflow</p>
                <p className="text-4xl font-black mt-2">₹{totalIn.toLocaleString('en-IN')}</p>
              </div>
              <div className="bg-zinc-900 dark:bg-white p-8 rounded-3xl text-white dark:text-black shadow-xl">
                <p className="text-[10px] uppercase font-black opacity-70 tracking-widest">Outflow</p>
                <p className="text-4xl font-black mt-2">₹{totalOut.toLocaleString('en-IN')}</p>
              </div>
              <div className={`p-8 rounded-3xl border-2 ${totalIn - totalOut >= 0 ? 'border-green-600 bg-green-500/5 text-green-600' : 'border-red-600 bg-red-500/5 text-red-600'}`}>
                <p className="text-[10px] uppercase font-black tracking-widest">Profit/Loss</p>
                <p className="text-4xl font-black mt-2">₹{(totalIn - totalOut).toLocaleString('en-IN')}</p>
              </div>
            </div>
          )}

          {mode === "dashboard" ? (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-zinc-800 p-8 rounded-3xl border dark:border-zinc-700 h-[350px]">
                <h3 className="font-black text-zinc-400 uppercase text-[10px] tracking-widest mb-6">Cash Flow Proportion</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} dataKey="value" cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={8}>
                      {chartData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                    </Pie>
                    <Tooltip formatter={(val) => `₹${val.toLocaleString('en-IN')}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white dark:bg-zinc-800 p-8 rounded-3xl border dark:border-zinc-700 h-[350px]">
                <h3 className="font-black text-zinc-400 uppercase text-[10px] tracking-widest mb-6">Monthly Volume Overview</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900}} />
                    <Bar dataKey="value" radius={12}>
                      {chartData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-zinc-900 rounded-3xl border dark:border-zinc-800 overflow-hidden shadow-2xl">
              <table className="w-full text-left">
                 <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-[10px] font-black uppercase text-zinc-400 border-b dark:border-zinc-800">
                   <tr>
                     <th className="p-6">Execution Date</th>
                     <th className="p-6">Transaction Label</th>
                     <th className="p-6 text-right">Credit / Debit</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y dark:divide-zinc-800">
                   {transactions.map(t => (
                     <tr key={t._id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition">
                       <td className="p-6 text-xs font-mono font-bold dark:text-zinc-400">{new Date(t.date).toLocaleDateString()}</td>
                       <td className="p-6 text-xs font-black uppercase tracking-tight dark:text-zinc-200">{t.description}</td>
                       <td className={`p-6 text-right font-black ${t.type === 'Income' ? 'text-green-600' : 'text-red-500'}`}>₹{t.amount.toLocaleString('en-IN')}</td>
                     </tr>
                   ))}
                 </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FinanceAnalytics;
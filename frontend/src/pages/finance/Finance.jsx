import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Container from "../../components/Container";
import financeService from "../../services/finance.service";
import { useDom } from "../../contexts/DomContext";
import TransactionForm from "./parts/TransactionForm";

const Finance = () => {
  const user = useSelector((state) => state.auth.user);
  const { addToast } = useDom();
  const [transactions, setTransactions] = useState([]);
  const [view, setView] = useState("all"); // 'all' or 'payroll'
  const [showForm, setShowForm] = useState(false);

  const isAdmin = user?.role === 'admin';
  const isHR = user?.role === 'hr';

  const loadData = async () => {
    try {
      let res;
      if (isAdmin && view === "all") res = await financeService.getAllTransactions();
      else res = await financeService.getPayrollTransactions(); // HR fallback
      setTransactions(res.data.data);
    } catch (error) {
      addToast(error.friendlyMessage, "error");
    }
  };

  useEffect(() => {
    if (user) loadData();
  }, [view, user]);

  if (!isAdmin && !isHR) return <Container><h1>Access Denied</h1></Container>;

  return (
    <Container>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold dark:text-white">Financial Records</h1>
        
        <div className="flex gap-4">
          {isAdmin && (
            <div className="bg-zinc-200 dark:bg-zinc-700 p-1 rounded-lg flex">
              <button onClick={() => setView("all")} className={`px-4 py-2 rounded-md ${view === "all" ? "bg-white text-black shadow" : "text-gray-500"}`}>All Transactions</button>
              <button onClick={() => setView("payroll")} className={`px-4 py-2 rounded-md ${view === "payroll" ? "bg-white text-black shadow" : "text-gray-500"}`}>Payroll Only</button>
            </div>
          )}
          {isAdmin && (
             <button onClick={() => setShowForm(true)} className="btn-primary w-auto">Record Transaction</button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto bg-white dark:bg-zinc-800 rounded-xl shadow border border-gray-100 dark:border-zinc-700">
        <table className="w-full text-left">
          <thead className="bg-zinc-100 dark:bg-zinc-700 text-gray-500 uppercase text-xs font-bold">
            <tr>
              <th className="p-4">Date</th>
              <th className="p-4">Description</th>
              <th className="p-4">Type</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Processed By</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr><td colSpan="5" className="p-4 text-center text-gray-500">No records found.</td></tr>
            ) : (
              transactions.map(t => (
                <tr key={t._id} className="border-b dark:border-zinc-700 dark:text-gray-300">
                  <td className="p-4">{new Date(t.date).toLocaleDateString()}</td>
                  <td className="p-4 font-medium">{t.description}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${t.type === 'Income' ? 'bg-green-100 text-green-700' : t.type === 'Expense' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                      {t.type}
                    </span>
                  </td>
                  <td className={`p-4 font-bold ${t.type === 'Income' ? 'text-green-600' : 'text-red-500'}`}>
                    ${t.amount.toLocaleString()}
                  </td>
                  <td className="p-4 text-xs">{t.processedBy?.fullname || 'Unknown'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <TransactionForm onClose={() => setShowForm(false)} refresh={loadData} />
      )}
    </Container>
  );
};

export default Finance;
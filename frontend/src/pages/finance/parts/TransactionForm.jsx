import React, { useState, useEffect } from 'react';
import { useDom } from '../../../contexts/DomContext';
import financeService from '../../../services/finance.service';
import adminService from '../../../services/admin.service'; // To fetch employees for payroll

const TransactionForm = ({ onClose, refresh }) => {
  const { addToast } = useDom();
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({ amount: '', type: 'Income', description: '', recipientEmployee: '' });

  useEffect(() => {
    // If Admin selects Payroll, we need a list of employees to assign the payment to
    const fetchEmps = async () => {
      try {
        const res = await adminService.getAllEmployees();
        setEmployees(res.data.data);
      } catch (error) { console.error(error); }
    };
    fetchEmps();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await financeService.createTransaction({
        ...formData,
        amount: Number(formData.amount)
      });
      addToast("Transaction recorded successfully", "success");
      refresh();
      onClose();
    } catch (error) {
      addToast(error.friendlyMessage, "error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-zinc-800 p-8 rounded-2xl w-full max-w-md shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl">&times;</button>
        <h2 className="text-2xl font-bold mb-6 dark:text-white">Record Transaction</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Transaction Type</label>
            <select className="input-field mt-0" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
              <option value="Income">Income (Credit)</option>
              <option value="Expense">Expense (Debit)</option>
              <option value="Payroll">Payroll / Salary</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Amount ($)</label>
            <input type="number" min="1" className="input-field mt-0" required value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description / Memo</label>
            <input type="text" className="input-field mt-0" required placeholder="e.g. Server Hosting Fees" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
          </div>

          {formData.type === 'Payroll' && (
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Select Employee</label>
              <select className="input-field mt-0" required value={formData.recipientEmployee} onChange={(e) => setFormData({...formData, recipientEmployee: e.target.value})}>
                <option value="">-- Choose Employee --</option>
                {employees.map(emp => (
                  <option key={emp._id} value={emp._id}>{emp.fullname} ({emp.empCode})</option>
                ))}
              </select>
            </div>
          )}

          <button type="submit" className="btn-primary mt-4">Save Record</button>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
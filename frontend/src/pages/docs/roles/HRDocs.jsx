import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import adminService from '../../../services/admin.service';
import { useDom } from '../../../contexts/DomContext';
import EmployeeTable from './parts/EmployeeTable';

const HRDocs = () => {
  const { hash } = useLocation();
  const { addToast } = useDom();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // HR only manages employees in this view
  const loadHRData = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAllEmployees();
      setData(res?.data?.data || []);
    } catch (error) {
      addToast(error.friendlyMessage || "Failed to load staff records", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadHRData(); }, []);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-black dark:text-white uppercase tracking-tighter">
          Human Resources
        </h1>
        <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">Staff & Personnel Oversight</p>
      </div>

      {loading ? (
        <div className="p-20 text-center text-zinc-500 animate-pulse font-black uppercase text-xs">Accessing Personnel Files...</div>
      ) : (
        <EmployeeTable employees={data} refresh={loadHRData} />
      )}
    </div>
  );
};

export default HRDocs;
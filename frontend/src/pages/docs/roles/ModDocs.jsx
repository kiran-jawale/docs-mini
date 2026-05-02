import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import adminService from '../../../services/admin.service';
import complaintService from '../../../services/complaint.service';
import documentService from '../../../services/document.service';
import { useDom } from '../../../contexts/DomContext';

import UserTable from './parts/UserTable';
import ComplaintTable from './parts/ComplaintTable';
import DocumentTable from './parts/DocumentTable'; // REPLACED FOREGROUND

const ModDocs = () => {
  const { hash } = useLocation();
  const { addToast } = useDom();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentView = hash || '#users';

  const loadModData = async () => {
    setLoading(true);
    try {
      let res;
      if (currentView === '#users') res = await adminService.getAllUsers();
      else if (currentView === '#complaints') res = await complaintService.getAllComplaints();
      else if (currentView === '#documents') res = await documentService.getPublicDocuments();
      
      setData(res?.data?.data || []);
    } catch (error) {
      addToast(error.friendlyMessage || "Data load failed", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadModData(); }, [currentView]);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black dark:text-white uppercase tracking-tight">Staff Oversight</h1>
        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-1">Moderator Privileges</p>
      </div>
      
      {loading ? (
        <div className="p-20 text-center text-zinc-500 animate-pulse font-black text-xs uppercase tracking-widest">Loading modules...</div>
      ) : (
        <>
          {currentView === '#users' && <UserTable users={data} refresh={loadModData} isModView={true} />}
          {currentView === '#complaints' && <ComplaintTable complaints={data} refresh={loadModData} />}
          {currentView === '#documents' && <DocumentTable docs={data} refresh={loadModData} isAdmin={false} />} {/* MOUNTED TABLE */}
        </>
      )}
    </div>
  );
};

export default ModDocs;
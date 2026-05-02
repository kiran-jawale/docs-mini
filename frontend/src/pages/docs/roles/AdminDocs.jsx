import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import adminService from '../../../services/admin.service';
import complaintService from '../../../services/complaint.service';
import documentService from '../../../services/document.service';
import noticeService from '../../../services/notice.service';
import { useDom } from '../../../contexts/DomContext';

import UserTable from './parts/UserTable';
import EmployeeTable from './parts/EmployeeTable';
import ComplaintTable from './parts/ComplaintTable';
import NoticeTable from './parts/NoticeTable';
import NoticeForm from './parts/NoticeForm';
import DocumentTable from './parts/DocumentTable'; // REPLACED FOREGROUND
import UserInfoModal from './parts/UserInfoModal';
import ModalContainer from '../../../components/ModalContainer';

const AdminDocs = () => {
  const { hash } = useLocation();
  const { addToast } = useDom(); // Removed setDocs to prevent global state conflicts
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  
  const currentView = hash || '#users';

  const loadData = async () => {
    setLoading(true);
    try {
      let res;
      if (currentView === '#users') res = await adminService.getAllUsers();
      else if (currentView === '#employees') res = await adminService.getAllEmployees();
      else if (currentView === '#complaints') res = await complaintService.getAllComplaints();
      else if (currentView === '#notices') res = await noticeService.getNotices();
      else if (currentView === '#documents') res = await documentService.getPublicDocuments(); // Directly fetch
      
      setData(res?.data?.data || []);
    } catch (error) {
      addToast(error.friendlyMessage || "Ledger sync failed", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [currentView]);

  return (
    <div className="p-8 pb-24">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black dark:text-white uppercase tracking-tighter leading-none">
            {currentView.substring(1)} Management
          </h1>
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-2">Administrative Ledger</p>
        </div>
        
        {currentView === '#notices' && (
          <button 
            onClick={() => setIsNoticeModalOpen(true)}
            className="bg-zinc-900 dark:bg-white text-white dark:text-black px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-transform active:scale-95"
          >
            Broadcast Notice
          </button>
        )}
      </div>

      {loading ? (
        <div className="p-20 text-center text-zinc-500 animate-pulse font-black text-xs uppercase tracking-widest">Syncing Records...</div>
      ) : (
        <>
          {currentView === '#users' && <UserTable users={data} onInfo={setSelectedUserId} refresh={loadData} />}
          {currentView === '#employees' && <EmployeeTable employees={data} refresh={loadData} />}
          {currentView === '#complaints' && <ComplaintTable complaints={data} refresh={loadData} />}
          {currentView === '#notices' && <NoticeTable notices={data} refresh={loadData} />}
          {currentView === '#documents' && <DocumentTable docs={data} refresh={loadData} isAdmin={true} />} {/* MOUNTED TABLE */}
        </>
      )}

      <ModalContainer isOpen={!!selectedUserId} onClose={() => setSelectedUserId(null)}>
        <UserInfoModal userId={selectedUserId} onClose={() => setSelectedUserId(null)} />
      </ModalContainer>

      <ModalContainer isOpen={isNoticeModalOpen} onClose={() => setIsNoticeModalOpen(false)}>
        <NoticeForm refresh={loadData} onClose={() => setIsNoticeModalOpen(false)} />
      </ModalContainer>
    </div>
  );
};

export default AdminDocs;
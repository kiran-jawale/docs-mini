import React, { useEffect } from 'react';
import documentService from '../../../services/document.service';
import { useDom } from '../../../contexts/DomContext';
import Background from '../parts/Background';
import Foreground from '../parts/Foreground';

const UserDocs = () => {
  const { setDocs } = useDom();

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await documentService.getMyDocuments();
        setDocs(res.data.data);
      } catch (error) {
        console.error("Failed to fetch docs", error);
      }
    };
    fetchDocs();
  }, [setDocs]);

  // Removed 'overflow-hidden h-[calc...]', allowing natural scrolling
  return (
    <div className="relative w-full min-h-[calc(100vh-140px)] bg-zinc-800">
      <Background />
      <Foreground />
    </div>
  );
};

export default UserDocs;
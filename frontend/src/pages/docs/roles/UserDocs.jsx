import React, { useEffect } from 'react';
import documentService from '../../../services/document.service';
import { useSelector } from 'react-redux'; // For the owner check
import { useDom } from '../../../contexts/DomContext';
import Background from '../parts/Background';
import Foreground from '../parts/Foreground';

const UserDocs = () => {
  const { setDocs, addToast } = useDom();

  // Inside UserDocs.jsx useEffect
useEffect(() => {
  const fetchDocs = async () => {
    try {
      // This now hits the updated controller which returns Owner + Public docs
      const res = await documentService.getMyDocuments(); 
      setDocs(res.data.data);
    } catch (error) {
      addToast(getErrorMessage(error), "error");
    }
  };
  fetchDocs();
}, [setDocs]);

  return (
    <div className="relative w-full min-h-[calc(100vh-140px)] bg-zinc-800 overflow-hidden">
      <Background />
      {/* Foreground renders the draggable DocumentCards */}
      <Foreground /> 
    </div>
  );
};

export default UserDocs;
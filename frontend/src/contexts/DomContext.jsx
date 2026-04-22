import React, { createContext, useState, useContext } from "react";
import ModalContainer from "../components/ModalContainer";
import DocumentViewer from "../components/DocumentViewer";
import NotificationsPanel from "../components/NotificationsPanel"; // NEW

const DomContext = createContext();

export const DomProvider = ({ children }) => {
  const [docs, setDocs] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);

  // UI Visibility States
  const [isUploadFormVisible, setUploadFormVisible] = useState(false);
  const [isEditFormVisible, setEditFormVisible] = useState(false);
  const [isDeleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [isNotificationsVisible, setNotificationsVisible] = useState(false); // NEW
  const [viewingDoc, setViewingDoc] = useState(null);

  const toggleUploadForm = () => setUploadFormVisible(!isUploadFormVisible);
  const toggleEditForm = (doc = null) => { if(doc) setSelectedDoc(doc); setEditFormVisible(!isEditFormVisible); };
  const toggleDeleteConfirm = (doc = null) => { if(doc) setSelectedDoc(doc); setDeleteConfirmVisible(!isDeleteConfirmVisible); };
  const toggleNotifications = () => setNotificationsVisible(!isNotificationsVisible); // NEW
  const toggleViewModal = (doc = null) => setViewingDoc(doc);

  // Global overlay check (freezes background)
  const isAnySidebarOpen = isUploadFormVisible || isEditFormVisible || isNotificationsVisible;

  const closeAll = () => {
    setUploadFormVisible(false);
    setEditFormVisible(false);
    setNotificationsVisible(false);
  };

  return (
    <DomContext.Provider value={{
      docs, setDocs, selectedDoc, setSelectedDoc,
      isUploadFormVisible, isEditFormVisible, isDeleteConfirmVisible, isNotificationsVisible,
      toggleUploadForm, toggleEditForm, toggleDeleteConfirm, toggleViewModal, toggleNotifications
    }}>
      {children}

      {/* Global Background Freeze Overlay */}
      {isAnySidebarOpen && (
        <div 
          onClick={closeAll} 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] transition-opacity cursor-pointer"
        />
      )}

      {/* Global Modals & Panels */}
      <NotificationsPanel />
      
      <ModalContainer isOpen={!!viewingDoc} onClose={() => toggleViewModal(null)}>
        <DocumentViewer document={viewingDoc} />
      </ModalContainer>
    </DomContext.Provider>
  );
};

export const useDom = () => useContext(DomContext);
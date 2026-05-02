import React, { createContext, useState, useContext, useCallback, useEffect } from "react";
import ModalContainer from "../components/ModalContainer";
import DocumentViewer from "../components/DocumentViewer";
import NotificationsPanel from "../components/NotificationsPanel";
import ToastContainer from "../components/ToastContainer";

// Import the Forms here so they can live at the root level
import UploadForm from "../pages/docs/parts/UploadForm";
import EditForm from "../pages/docs/parts/EditForm";
import DeleteConfirm from "../pages/docs/parts/DeleteConfirm";

const DomContext = createContext();

export const DomProvider = ({ children }) => {
  const [docs, setDocs] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const [isUploadFormVisible, setUploadFormVisible] = useState(false);
  const [isEditFormVisible, setEditFormVisible] = useState(false);
  const [isDeleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [isNotificationsVisible, setNotificationsVisible] = useState(false);
  const [viewingDoc, setViewingDoc] = useState(null);
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "error") => {
    const id = `${Date.now()}-${ 99 + Math.random() * 99999}`
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    const handleGlobalToast = (e) => {
      const { message, type } = e.detail;
      addToast(message, type);
    };
    window.addEventListener("show-toast", handleGlobalToast);
    return () => window.removeEventListener("show-toast", handleGlobalToast);
  }, [addToast]);

  const toggleUploadForm = () => setUploadFormVisible(!isUploadFormVisible);
  const toggleEditForm = (doc = null) => { if(doc) setSelectedDoc(doc); setEditFormVisible(!isEditFormVisible); };
  const toggleDeleteConfirm = (doc = null) => { if(doc) setSelectedDoc(doc); setDeleteConfirmVisible(!isDeleteConfirmVisible); };
  const toggleNotifications = () => setNotificationsVisible(!isNotificationsVisible);
  const toggleViewModal = (doc = null) => setViewingDoc(doc);

  const isAnySidebarOpen = isUploadFormVisible || isEditFormVisible || isNotificationsVisible || isDeleteConfirmVisible;
  
  const closeAll = () => {
    setUploadFormVisible(false);
    setEditFormVisible(false);
    setNotificationsVisible(false);
    setDeleteConfirmVisible(false);
  };

  return (
    <DomContext.Provider value={{
      docs, setDocs, selectedDoc, setSelectedDoc,
      isUploadFormVisible, isEditFormVisible, isDeleteConfirmVisible, isNotificationsVisible,
      toggleUploadForm, toggleEditForm, toggleDeleteConfirm, toggleViewModal, toggleNotifications,
      addToast
    }}>
      {children}

      {/* 1. The Global Blur Layer (z-45) */}
      {isAnySidebarOpen && (
        <div 
          onClick={closeAll} 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] transition-opacity cursor-pointer"
        />
      )}

      {/* 2. The Forms (Now siblings to the blur, so z-50 works) */}
      {isUploadFormVisible && <UploadForm />}
      {isEditFormVisible && <EditForm />}
      {isDeleteConfirmVisible && <DeleteConfirm />}

      <NotificationsPanel />
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      <ModalContainer isOpen={!!viewingDoc} onClose={() => toggleViewModal(null)}>
        <DocumentViewer document={viewingDoc} />
      </ModalContainer>
    </DomContext.Provider>
  );
};

export const useDom = () => useContext(DomContext);
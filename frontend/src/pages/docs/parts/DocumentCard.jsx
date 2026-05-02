import React from 'react';
import { motion } from 'framer-motion';
import { useDom } from '../../../contexts/DomContext';
import {useSelector} from 'react-redux'
import documentService from '../../../services/document.service';

const DocumentCard = ({ data, reference }) => {
  const { toggleEditForm, toggleDeleteConfirm, toggleViewModal } = useDom();

  
const fileTypeColors = {
  // RED: PDFs
  'application/pdf': 'bg-red-600',
  
  // BLUE: Word / Docs
  'application/msword': 'bg-blue-600',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'bg-blue-600',
  
  // GOLDEN / YELLOW: JSON Data
  'application/json': 'bg-yellow-500 text-yellow-900',
  
  // ORANGE: PowerPoint / Presentations
  'application/vnd.ms-powerpoint': 'bg-orange-600',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'bg-orange-600',
  
  // GREEN: Excel / Spreadsheets
  'application/vnd.ms-excel': 'bg-green-600',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'bg-green-600',
  
  // DARK GREY: Text files
  'text/plain': 'bg-zinc-700',
  
  // SKY BLUE: Images
  'image/jpeg': 'bg-sky-500',
  'image/png': 'bg-sky-500',
  'image/jpg': 'bg-sky-500',
  'image/gif': 'bg-sky-500',
  
  // PURPLE: Other / Default
  'default': 'bg-purple-600'
};

// Ensure you update how the color is applied in the component:
// const colorClass = fileTypeColors[data.fileType] || fileTypeColors['default'];

  // Get current logged-in user details
  const { user } = useSelector((state) => state.auth);

  const isOwner = user?._id === (data.owner?._id || data.owner);
  const isStaff = ['admin', 'mod'].includes(user?.role);
  const colorClass = fileTypeColors[data.fileType] || 'bg-gray-600';

  const handleDownload = () => {
    const url = documentService.getDownloadUrl(data._id);
    window.open(url, '_blank');
  };

  return (
    <motion.div
      drag
      dragConstraints={reference}
      whileDrag={{ scale: 1.05 }}
      className="relative flex-shrink-0 w-60 h-72 rounded-[40px] bg-zinc-900/95 text-white px-8 py-10 overflow-hidden shadow-xl border border-zinc-700 cursor-grab active:cursor-grabbing"
    >
      <div className="flex justify-between items-start">
        <span className="text-xl">📄</span>
        {data.isPublic && (
          <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-1 rounded-full border border-green-500/30">
            Public
          </span>
        )}
      </div>

      <p className="text-sm leading-tight mt-5 font-semibold text-gray-200 line-clamp-2 uppercase">
        {data.title}
      </p>
      
      <div className="footer absolute bottom-0 w-full left-0">
        <div className="flex items-center justify-between px-8 py-3 mb-3">
          <h5 className="text-[10px] text-gray-500 font-mono">
            {isOwner ? "YOU" : data.owner?.fullname?.split(' ')[0].toUpperCase() || "STAFF"}
          </h5>
          
          <div className="flex gap-2">
             <button onClick={(e) => { e.stopPropagation(); toggleViewModal(data); }} className="w-7 h-7 bg-zinc-800 rounded-full flex items-center justify-center hover:bg-zinc-700 text-[10px]">👁️</button>
             
             {/* EDIT: ONLY OWNER */}
             {isOwner && (
               <button onClick={(e) => { e.stopPropagation(); toggleEditForm(data); }} className="w-7 h-7 bg-zinc-800 rounded-full flex items-center justify-center hover:bg-blue-600 text-[10px]">✏️</button>
             )}
             
             {/* DELETE: OWNER OR STAFF */}
             {(isOwner || isStaff) && (
               <button onClick={(e) => { e.stopPropagation(); toggleDeleteConfirm(data); }} className="w-7 h-7 bg-zinc-800 rounded-full flex items-center justify-center hover:bg-red-600 text-[10px]">🗑️</button>
             )}
          </div>
        </div>
        
        <div onClick={handleDownload} className={`w-full py-4 ${colorClass} flex items-center justify-center cursor-pointer hover:brightness-110 transition-all`}>
          <h3 className="text-[10px] font-black uppercase tracking-widest">Download</h3>
        </div>
      </div>
    </motion.div>
  );
};

export default DocumentCard
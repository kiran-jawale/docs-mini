import React, { useRef } from 'react';
import { useDom } from '../../../contexts/DomContext';
import DocumentCard from './DocumentCard';

const Foreground = () => {
  const ref = useRef(null);
  const { docs, toggleUploadForm } = useDom();

  return (
    <div ref={ref} className="relative z-[10] w-full min-h-full p-8 flex flex-wrap gap-8 items-start align-content-start pb-24">
      
      {/* Plus Button stays here */}
      <button 
        onClick={toggleUploadForm}
        className="fixed bottom-24 right-10 z-[40] bg-green-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-2xl hover:scale-110 transition-transform text-2xl border-2 border-zinc-800"
      >
        +
      </button>

      {docs.map((item) => (
        <DocumentCard key={item._id} data={item} reference={ref} />
      ))}
      
      {/* Forms are now handled by DomContext to prevent z-index issues */}
    </div>
  );
};

export default Foreground;
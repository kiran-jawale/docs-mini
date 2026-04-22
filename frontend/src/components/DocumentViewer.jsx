import React from "react";
import { DOCUMENT_PREVIEW_URL } from "../constants/api";
import documentService from "../services/document.service";

const DocumentViewer = ({ document }) => {
  if (!document) return null;

  const docUrl = `${DOCUMENT_PREVIEW_URL}/${document.filePath}`;

  // Check if the browser can natively render this inside an iframe
  const isPreviewable = [
    'application/pdf',
    'text/plain',
    'image/jpeg',
    'image/png',
    'image/gif'
  ].includes(document.fileType);

  const handleDownload = () => {
    window.open(documentService.getDownloadUrl(document._id), '_blank');
  };

  return (
    <div className="h-[75vh] w-full flex flex-col bg-zinc-100 dark:bg-zinc-900 rounded-lg overflow-hidden relative">
      
      {/* Viewer Header */}
      <div className="flex-none p-4 bg-white dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-gray-800 dark:text-white truncate max-w-md">{document.title}</h3>
          <p className="text-xs text-gray-500 uppercase">{document.fileType.split('/')[1] || 'Document'}</p>
        </div>
        <button 
          onClick={handleDownload}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded shadow transition"
        >
          Download File
        </button>
      </div>

      {/* Viewer Body */}
      <div className="flex-grow relative">
        {isPreviewable ? (
          <iframe 
            src={docUrl} 
            title={document.title}
            className="w-full h-full border-0 bg-white"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gray-50 dark:bg-zinc-900">
            <span className="text-6xl mb-4">📑</span>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Preview Not Available
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
              This file format (Word/Excel/PowerPoint) requires a desktop application or cloud service to render. 
              Please download the file to view its contents securely on your local machine.
            </p>
            <button 
              onClick={handleDownload}
              className="px-6 py-3 border-2 border-green-600 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg font-bold transition"
            >
              Download to View
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentViewer;
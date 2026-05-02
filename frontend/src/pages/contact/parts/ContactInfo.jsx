import React from 'react';

const ContactInfo = () => {
  return (
    <div className="p-8 rounded-3xl bg-zinc-900 text-white shadow-2xl h-full border border-zinc-800">
      <h3 className="text-2xl font-bold mb-8">Pune HQ</h3>
      <div className="space-y-8">
        <div className="flex gap-4">
          <span className="text-2xl">📍</span>
          <div>
            <p className="font-bold text-green-500 mb-1 uppercase tracking-widest text-[10px]">Location</p>
            <p className="text-gray-300 leading-relaxed">
              Docs Mini Tech Park, Phase 2,<br />
              Kharadi IT Hub, Pune,<br />
              Maharashtra 411014
            </p>
          </div>
        </div>
        
        <div className="flex gap-4">
          <span className="text-2xl">✉️</span>
          <div>
            <p className="font-bold text-green-500 mb-1 uppercase tracking-widest text-[10px]">Email</p>
            <p className="text-gray-300">support@docsmini.in</p>
          </div>
        </div>

        <div className="flex gap-4">
          <span className="text-2xl">📞</span>
          <div>
            <p className="font-bold text-green-500 mb-1 uppercase tracking-widest text-[10px]">Phone</p>
            <p className="text-gray-300">+91 20 6789 0000</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
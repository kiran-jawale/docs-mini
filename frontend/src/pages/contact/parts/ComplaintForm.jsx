import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useDom } from "../../../contexts/DomContext";
import api from "../../../constants/api";

const ComplaintForm = () => {
  const { user } = useSelector((state) => state.auth);
  const { addToast } = useDom();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    category: "Technical",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Backend expects: { subject, description, category, regionCode, user }
      const payload = { 
        ...formData, 
        regionCode: user?.regionCode 
      };
      
      await api.post("/complaints", payload);
      
      addToast("Ticket raised successfully! Check your notifications for updates.", "success");
      setFormData({ subject: "", description: "", category: "Technical" });
    } catch (err) {
      // Error toast handled by Axios interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-zinc-500 ml-2">Ticket Subject</label>
          <input 
            type="text" 
            placeholder="Quick summary of the issue" 
            className="input-field mt-0"
            value={formData.subject}
            onChange={(e) => setFormData({...formData, subject: e.target.value})}
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-zinc-500 ml-2">Category</label>
          <select 
            className="input-field mt-0"
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
          >
            <option value="Technical">Technical Issue</option>
            <option value="Billing">Billing & Finance</option>
            <option value="Account">Account Access</option>
            <option value="Legal">Legal/Compliance</option>
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase text-zinc-500 ml-2">Detailed Description</label>
        <textarea 
          placeholder="Please explain the problem in detail..." 
          className="input-field mt-0 h-32 resize-none"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          required
        />
      </div>

      <div className="flex items-center justify-between pt-2">
        <p className="text-[9px] text-zinc-400 max-w-[200px]">
          Your region (<span className="text-green-600 font-bold">{user?.regionCode}</span>) will be automatically tagged for faster routing.
        </p>
        <button 
          type="submit" 
          disabled={loading}
          className="btn-primary px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-50"
        >
          {loading ? "Transmitting..." : "Submit Ticket"}
        </button>
      </div>
    </form>
  );
};

export default ComplaintForm;
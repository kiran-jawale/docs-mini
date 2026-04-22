import React, { useState } from "react";
import Container from "../../components/Container";
import complaintService from "../../services/complaint.service";

const Contact = () => {
  const [view, setView] = useState("contact"); // 'contact' or 'complaint'
  
  // Complaint Form State
  const [complaintData, setComplaintData] = useState({ subject: '', description: '' });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append('subject', complaintData.subject);
    data.append('description', complaintData.description);
    for (let i = 0; i < files.length; i++) data.append('images', files[i]);

    try {
      await complaintService.createComplaint(data);
      alert("Ticket raised successfully! We will review it shortly.");
      setComplaintData({ subject: '', description: '' });
      setFiles([]);
    } catch (error) { alert("Failed to raise ticket"); }
    finally { setLoading(false); }
  };

  return (
    <Container>
      <div className="max-w-6xl mx-auto py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black mb-4 tracking-tight dark:text-white">How can we help?</h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Whether you have a general inquiry, feedback, or need to raise a technical support ticket, our team in Pune is ready to assist.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          {/* Left Column: Contact Info */}
          <div className="md:col-span-2 space-y-6">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 text-white shadow-xl">
              <h3 className="text-2xl font-bold mb-6">Our Headquarters</h3>
              <div className="space-y-4">
                <p className="flex items-start gap-4">
                  <span className="text-2xl">📍</span> 
                  <span className="leading-relaxed text-gray-300">
                    Docs Mini Tech Park,<br />
                    Kharadi IT Park Phase 2,<br />
                    Pune, Maharashtra 411014,<br />
                    India
                  </span>
                </p>
                <p className="flex items-center gap-4 text-gray-300">
                  <span className="text-xl">✉️</span> support@docsmini.in
                </p>
                <p className="flex items-center gap-4 text-gray-300">
                  <span className="text-xl">📞</span> +91 98765 43210
                </p>
              </div>
            </div>
            
            {/* Toggle Buttons */}
            <div className="flex gap-4">
              <button 
                onClick={() => setView("contact")} 
                className={`flex-1 py-4 rounded-xl font-bold transition ${view === 'contact' ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-100 dark:bg-zinc-800 text-gray-500'}`}
              >
                General Feedback
              </button>
              <button 
                onClick={() => setView("complaint")} 
                className={`flex-1 py-4 rounded-xl font-bold transition ${view === 'complaint' ? 'bg-red-600 text-white shadow-lg' : 'bg-gray-100 dark:bg-zinc-800 text-gray-500'}`}
              >
                Raise Ticket
              </button>
            </div>
          </div>

          {/* Right Column: Forms */}
          <div className="md:col-span-3 bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-zinc-700">
            {view === "contact" ? (
              <div>
                <h3 className="text-2xl font-bold mb-6 dark:text-white">Send us a Message</h3>
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Thanks for your feedback!"); }}>
                  <div className="grid grid-cols-2 gap-4">
                    <input placeholder="Your Name" className="input-field" required />
                    <input placeholder="Email Address" type="email" className="input-field" required />
                  </div>
                  <input placeholder="Subject" className="input-field" required />
                  <textarea placeholder="Write your message or review here..." className="input-field min-h-[150px]" required />
                  <button type="submit" className="btn-primary w-full py-4 text-lg">Send Message</button>
                </form>
              </div>
            ) : (
              <div>
                <h3 className="text-2xl font-bold mb-2 dark:text-white flex items-center gap-2">
                  <span className="text-red-500">🛠️</span> IT / Support Ticket
                </h3>
                <p className="text-sm text-gray-500 mb-6">Log an official complaint or issue. Our moderators will assign a priority and resolve it.</p>
                
                <form onSubmit={handleComplaintSubmit} className="space-y-4">
                  <input 
                    placeholder="Issue Subject (e.g. Cannot access file)" className="input-field" required
                    value={complaintData.subject} onChange={(e) => setComplaintData({...complaintData, subject: e.target.value})} 
                  />
                  <textarea 
                    placeholder="Provide detailed steps or description of the issue..." className="input-field min-h-[150px]" required
                    value={complaintData.description} onChange={(e) => setComplaintData({...complaintData, description: e.target.value})} 
                  />
                  
                  <div className="p-4 border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-xl">
                    <label className="block text-sm font-bold text-gray-600 dark:text-gray-300 mb-2">Attach Screenshots (Optional, Max 3)</label>
                    <input type="file" multiple accept="image/*" onChange={(e) => setFiles(e.target.files)} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100" />
                  </div>
                  
                  <button type="submit" disabled={loading} className="w-full py-4 rounded-xl shadow-lg text-lg font-bold text-white bg-red-600 hover:bg-red-700 transition">
                    {loading ? "Submitting..." : "Submit Formal Ticket"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Contact;
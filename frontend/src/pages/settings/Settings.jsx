import React, { useState } from "react";
import Container from "../../components/Container";
import authService from "../../services/auth.service";

const Settings = () => {
  const [passData, setPassData] = useState({ oldPassword: "", newPassword: "" });
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.changePassword(passData);
      alert("Password Changed Successfully");
      setPassData({ oldPassword: "", newPassword: "" });
    } catch (error) { 
      alert(error.response?.data?.message || "Failed to change password"); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="p-6 bg-white dark:bg-zinc-800 rounded-xl shadow border border-gray-100 dark:border-zinc-700">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <span>🛡️</span> Security
          </h2>
          
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Current Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="input-field" 
                value={passData.oldPassword} 
                onChange={(e) => setPassData({...passData, oldPassword: e.target.value})} 
                required
              />
            </div>
            
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">New Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="input-field" 
                value={passData.newPassword} 
                onChange={(e) => setPassData({...passData, newPassword: e.target.value})} 
                required
              />
            </div>
            
            <button disabled={loading} className="btn-primary">
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>

        {/* Future Settings Placeholders */}
        <div className="p-6 bg-gray-50 dark:bg-zinc-800/50 rounded-xl border border-dashed border-gray-300 dark:border-zinc-700 flex items-center justify-center text-center">
          <div>
            <h3 className="text-lg font-medium text-gray-400">Notification Settings</h3>
            <p className="text-sm text-gray-400 mt-2">Coming Soon</p>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Settings;
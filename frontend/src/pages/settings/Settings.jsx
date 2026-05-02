import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Container from "../../components/Container";
import authService from "../../services/auth.service";
import { login } from "../../redux/slices/authSlice";
import { useDom } from "../../contexts/DomContext";

const Settings = () => {
  const user = useSelector((state) => state.auth.user);
  const userType = useSelector((state) => state.auth.type);
  const dispatch = useDispatch();
  const { addToast } = useDom();

  const [email, setEmail] = useState(user?.email || "");
  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });
  const [newUserID, setNewUserID] = useState(user?.userID || "");
  const [loading, setLoading] = useState(null);

  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    setLoading("email");
    try {
      const res = await authService.updateEmail({ email });
      // Update global state with the new user object returned from backend
      dispatch(login({ user: res.data.data, type: userType }));
      addToast("Email updated successfully", "success");
    } catch (err) {
      addToast(err.response?.data?.message || "Email update failed", "error");
    } finally {
      setLoading(null);
    }
  };

  const handleSetUserID = async (e) => {
    e.preventDefault();
    if (newUserID.length !== 8) return addToast("User ID must be 8 characters", "error");
    setLoading("userid");
    try {
      const res = await authService.updateUserID({ newUserID });
      dispatch(login({ user: res.data.data, type: userType }));
      addToast("Fast-Login ID updated", "success");
    } catch (err) {
      addToast(err.response?.data?.message || "ID update failed", "error");
    } finally {
      setLoading(null);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading("password");
    try {
      await authService.changePassword(passwords);
      addToast("Password changed successfully", "success");
      setPasswords({ oldPassword: "", newPassword: "" });
    } catch (err) {
      addToast(err.response?.data?.message || "Password change failed", "error");
    } finally {
      setLoading(null);
    }
  };

  return (
    <Container>
      <div className="max-w-4xl mx-auto py-12 px-6">
        <h1 className="text-4xl font-black mb-10 dark:text-white tracking-tighter uppercase">Account Security</h1>

        <div className="grid md:grid-cols-2 gap-8">
          <section className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm">
            <h3 className="font-bold mb-4 dark:text-white flex items-center gap-2">📧 Update Email</h3>
            <form onSubmit={handleUpdateEmail} className="space-y-4">
              <input 
                type="email" className="input-field" value={email}
                onChange={(e) => setEmail(e.target.value)} required
              />
              <button type="submit" disabled={loading === 'email'} className="btn-primary py-2 text-[10px] font-black uppercase">
                {loading === 'email' ? 'Updating...' : 'Save Email'}
              </button>
            </form>
          </section>

          <section className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm">
            <h3 className="font-bold mb-4 dark:text-white flex items-center gap-2">🆔 Fast-Login ID</h3>
            <form onSubmit={handleSetUserID} className="space-y-4">
              <input 
                type="text" maxLength={8} className="input-field font-mono uppercase text-center" 
                value={newUserID} placeholder="8-CHAR ALPHANUMERIC"
                onChange={(e) => setNewUserID(e.target.value.toUpperCase())} required
              />
              <button type="submit" disabled={loading === 'userid'} className="btn-primary py-2 text-[10px] font-black uppercase">
                {loading === 'userid' ? 'Processing...' : 'Set Unique ID'}
              </button>
            </form>
          </section>

          <section className="md:col-span-2 bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm">
            <h3 className="font-bold mb-6 dark:text-white flex items-center gap-2">🔒 Security Credentials</h3>
            <form onSubmit={handleChangePassword} className="grid md:grid-cols-2 gap-6">
              <input 
                type="password" placeholder="Current Password" className="input-field" 
                value={passwords.oldPassword} required
                onChange={(e) => setPasswords({...passwords, oldPassword: e.target.value})}
              />
              <input 
                type="password" placeholder="New Password" className="input-field" 
                value={passwords.newPassword} required
                onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
              />
              <div className="md:col-span-2 flex justify-end">
                <button type="submit" disabled={loading === 'password'} className="btn-primary py-3 px-12 text-[10px] font-black uppercase">
                  {loading === 'password' ? 'Updating Security...' : 'Update Password'}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </Container>
  );
};

export default Settings;
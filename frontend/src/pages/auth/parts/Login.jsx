import React, { useState, useContext } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../../redux/slices/authSlice";
import authService from "../../../services/auth.service";
import { ThemeContext } from "../../../contexts/ThemeContext";
import { useDom } from "../../../contexts/DomContext";

const Login = ({ onToggleView }) => {
  const { theme } = useContext(ThemeContext);
  const { addToast } = useDom();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const res = await authService.login(formData);
    if (res.data.success) {
      // Redux update triggers AuthLayout's <Navigate to="/docs" />
      dispatch(login(res.data.data)); 
      addToast("Access Granted", "success");
    }
  } catch (err) {
    // API interceptor handles the toast
  } finally {
    setLoading(false);
  }
};

  return (
    <div className={`p-8 rounded-[2rem] shadow-2xl transition-all duration-300 border ${
      theme === 'dark' ? 'bg-zinc-800 text-white border-zinc-700' : 'bg-white text-gray-900 border-gray-100'
    }`}>
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-black tracking-tighter">Authorize</h2>
        <p className="text-zinc-500 text-xs mt-2 uppercase tracking-widest font-bold">Secure Enterprise Access</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-zinc-500 ml-2">Identifier</label>
          <input 
            type="text" 
            placeholder="Email or 8-char ID" 
            className="input-field mt-0 focus:ring-2 focus:ring-green-500 transition-all"
            value={formData.identifier}
            onChange={(e) => setFormData({...formData, identifier: e.target.value})}
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-zinc-500 ml-2">Password</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            className="input-field mt-0 focus:ring-2 focus:ring-green-500 transition-all"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-green-500/20 active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Sign In"}
        </button>
      </form>

      <p className="text-center mt-8 text-xs font-bold text-zinc-500 uppercase tracking-tighter">
        New here? <button onClick={onToggleView} className="text-green-500 hover:underline ml-1">Create Account</button>
      </p>
    </div>
  );
};

export default Login;
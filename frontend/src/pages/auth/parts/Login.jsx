import React, { useState, useContext } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../../redux/slices/authSlice";
import authService from "../../../services/auth.service";
import { ThemeContext } from "../../../contexts/ThemeContext";

const Login = ({ onToggleView }) => {
  const { theme } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await authService.login(formData);
      if (res.data.success) {
        dispatch(login(res.data.data.user));
        navigate("/docs");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className={`p-8 rounded-2xl shadow-xl ${theme === 'dark' ? 'bg-zinc-800 text-white' : 'bg-white text-gray-900'}`}>
      <h2 className="text-3xl font-bold text-center mb-6">Welcome Back</h2>
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="email" 
          placeholder="Email" 
          className="input-field"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />
        <input 
          type="password" 
          placeholder="Password" 
          className="input-field"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          required
        />
        <button type="submit" className="btn-primary">Sign In</button>
      </form>

      <p className="text-center mt-4 text-sm text-gray-500">
        New here? <button onClick={onToggleView} className="text-green-500 hover:underline">Create account</button>
      </p>
    </div>
  );
};

export default Login;
import React, { useState, useContext } from "react";
import authService from "../../../services/auth.service";
import { ThemeContext } from "../../../contexts/ThemeContext";
import { areaOptions } from "../../../constants/forms";

const Register = ({ onToggleView }) => {
  const { theme } = useContext(ThemeContext);
  const [formData, setFormData] = useState({
    fullname: "", email: "", password: "", contact: "", address: "", areacode: areaOptions[0].code, code: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.register(formData);
      setSuccess("Account created! Please login.");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className={`p-8 rounded-2xl shadow-xl ${theme === 'dark' ? 'bg-zinc-800 text-white' : 'bg-white text-gray-900'}`}>
      <h2 className="text-3xl font-bold text-center mb-6">Join Docs Mini</h2>
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="fullname" placeholder="Full Name" className="input-field" onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" className="input-field" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" className="input-field" onChange={handleChange} required />
        <input name="contact" placeholder="Contact" className="input-field" onChange={handleChange} />
        <input name="address" placeholder="Address" className="input-field" onChange={handleChange} />
        <select name="areacode" className="input-field" onChange={handleChange}>
          {areaOptions.map(opt => <option key={opt.code} value={opt.code}>{opt.address}</option>)}
        </select>
        <input name="code" placeholder="Secret Code (Optional)" className="input-field" onChange={handleChange} />
        
        <button type="submit" className="btn-primary mt-4">Register</button>
      </form>
      <p className="text-center mt-4 text-sm text-gray-500">
        Have an account? <button onClick={onToggleView} className="text-green-500 hover:underline">Login</button>
      </p>
    </div>
  );
};

export default Register;
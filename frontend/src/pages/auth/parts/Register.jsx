import React, { useState, useContext } from "react";
import authService from "../../../services/auth.service";
import { ThemeContext } from "../../../contexts/ThemeContext";
import { useDom } from "../../../contexts/DomContext";
import { areaOptions } from "../../../constants/forms";

const Register = ({ onToggleView }) => {
  const { theme } = useContext(ThemeContext);
  const { addToast } = useDom();
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    contact: "",
    address: "",
    areacode: areaOptions[0].code,
    secretCode: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.register(formData);
      addToast("Identity Created", "success");
      // Switch to login view; no navigation needed here
      onToggleView();
    } catch (err) {
      // API interceptor handles the toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`p-8 rounded-[2rem] shadow-2xl transition-all duration-300 border ${
        theme === "dark"
          ? "bg-zinc-800 text-white border-zinc-700"
          : "bg-white text-gray-900 border-gray-100"
      }`}
    >
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-black tracking-tighter">Register</h2>
        <p className="text-zinc-500 text-xs mt-1 uppercase tracking-widest font-bold">
          Join the Network
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="fullname"
          placeholder="Full Name"
          className="input-field"
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email Address"
          className="input-field"
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Create Password"
          className="input-field"
          onChange={handleChange}
          required
        />

        <div className="grid grid-cols-2 gap-2">
          <input
            name="contact"
            placeholder="Contact #"
            className="input-field"
            onChange={handleChange}
          />
          <select
            name="areacode"
            className="input-field"
            onChange={handleChange}
          >
            {areaOptions.map((opt) => (
              <option key={opt.code} value={opt.code}>
                {opt.address}
              </option>
            ))}
          </select>
        </div>

        <input
          name="address"
          placeholder="Residential Address"
          className="input-field"
          onChange={handleChange}
        />

        <div className="pt-2">
          <label className="text-[9px] font-black uppercase text-green-500 ml-1 mb-1 block">
            Staff Verification (Optional)
          </label>
          <input
            name="secretCode"
            placeholder="Secret Code"
            className="input-field mt-0 border-dashed border-2 border-green-500/20"
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs mt-4 active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? "Registering..." : "Initialize Account"}
        </button>
      </form>

      <p className="text-center mt-6 text-xs font-bold text-zinc-500 uppercase tracking-tighter">
        Have an account?{" "}
        <button
          onClick={onToggleView}
          className="text-green-500 hover:underline ml-1"
        >
          Sign In
        </button>
      </p>
    </div>
  );
};

export default Register;

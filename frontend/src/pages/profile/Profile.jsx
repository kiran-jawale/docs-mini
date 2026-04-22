import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Container from "../../components/Container";
import authService from "../../services/auth.service";
import { updateUser } from "../../redux/slices/authSlice";

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({ 
    fullname: user?.fullname || "", 
    contact: user?.contact || "", 
    address: user?.address || "",
    areacode: user?.areacode || "" 
  });
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.updateProfile(formData);
      dispatch(updateUser(res.data.data));
      alert("Profile Updated Successfully");
    } catch (error) { 
      alert("Failed to update profile"); 
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Container>
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      <div className="grid md:grid-cols-3 gap-8">
        {/* User Card */}
        <div className="col-span-1 bg-green-50 dark:bg-zinc-800 p-6 rounded-2xl h-fit shadow-md border border-green-100 dark:border-zinc-700">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-4xl text-white font-bold mb-4 mx-auto">
            {user.fullname?.charAt(0)}
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold">{user.fullname}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{user.email}</p>
            <div className="mt-4 inline-block px-3 py-1 bg-zinc-200 dark:bg-zinc-700 rounded text-xs uppercase font-bold tracking-wider">
              {user.role}
            </div>
            <div className={`mt-2 text-xs font-semibold uppercase ${user.status === 'active' ? 'text-green-500' : 'text-red-500'}`}>
              Status: {user.status}
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleUpdate} className="col-span-2 space-y-5 max-w-lg">
          <h3 className="text-xl font-semibold mb-2">Edit Details</h3>
          
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
            <input className="input-field" value={formData.fullname} onChange={(e) => setFormData({...formData, fullname: e.target.value})} />
          </div>
          
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Contact Number</label>
            <input className="input-field" value={formData.contact} onChange={(e) => setFormData({...formData, contact: e.target.value})} />
          </div>
          
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Address</label>
            <input className="input-field" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
          </div>
          
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Area Code</label>
            <input className="input-field" value={formData.areacode} onChange={(e) => setFormData({...formData, areacode: e.target.value})} />
          </div>

          <button disabled={loading} className="btn-primary w-fit px-8 mt-4">
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </Container>
  );
};

export default Profile;
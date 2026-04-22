import React from "react";
import { useSelector } from "react-redux";
import UserDocs from "./roles/UserDocs";
import AdminDocs from "./roles/AdminDocs";
import ModDocs from "./roles/ModDocs";

const Docs = () => {
  const user = useSelector((state) => state.auth.user);

  if (!user) return <div className="p-10 text-center">Loading User Data...</div>;

  // Render Dashboard based on Role
  switch (user.role) {
    case "admin":
      return <AdminDocs user={user} />;
    case "mod":
      return <ModDocs user={user} />;
    default:
      return <UserDocs user={user} />;
  }
};

export default Docs;
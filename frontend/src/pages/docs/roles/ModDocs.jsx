import React, { useState, useEffect } from "react";
import modService from "../../../services/mod.service";
import Container from "../../../components/Container";
import UserTable from "./parts/UserTable";
import DocumentTable from "./parts/DocumentTable";

const ModDocs = () => {
  const [view, setView] = useState("users");
  const [users, setUsers] = useState([]);
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    if (view === "users") loadUsers();
    else loadDocs();
  }, [view]);

  const loadUsers = async () => {
    const res = await modService.modGetAllUsers();
    setUsers(res.data.data);
  };

  const loadDocs = async () => {
    const res = await modService.modGetAllPublicDocuments();
    setDocs(res.data.data);
  };

  return (
    <Container>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Moderator Panel</h1>
        <div className="bg-zinc-200 dark:bg-zinc-700 p-1 rounded-lg flex">
          <button onClick={() => setView("users")} className={`px-4 py-2 rounded-md ${view === "users" ? "bg-white text-black shadow" : "text-gray-500"}`}>Users</button>
          <button onClick={() => setView("docs")} className={`px-4 py-2 rounded-md ${view === "docs" ? "bg-white text-black shadow" : "text-gray-500"}`}>Public Docs</button>
        </div>
      </div>

      {view === "users" ? (
        <UserTable users={users} refresh={loadUsers} />
      ) : (
        <DocumentTable docs={docs} refresh={loadDocs} />
      )}
    </Container>
  );
};

export default ModDocs;
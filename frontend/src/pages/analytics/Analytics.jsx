// src/pages/analytics/Analytics.jsx
import React from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Container from "../../components/Container";
import UserAnalytics from "./parts/UserAnalytics";
import DocAnalytics from "./parts/DocAnalytics";
import ComplaintAnalytics from "./parts/ComplaintAnalytics";
import FinanceAnalytics from "./parts/FinanceAnalytics";

const Analytics = () => {
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  
  const defaultHash = user?.role === 'hr' ? "#finance" : "#users";
  const currentHash = location.hash || defaultHash;

  return (
    <Container>
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase leading-none">BI Console</h1>
          <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest mt-2">Enterprise Performance Indicators</p>
        </div>
        <div className="bg-zinc-100 dark:bg-zinc-800 px-4 py-2 rounded-full border dark:border-zinc-700">
           <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Region: Global Server</p>
        </div>
      </div>

      <div className="mt-8">
        {currentHash === "#users" && user?.role === 'admin' && <UserAnalytics />}
        {currentHash === "#docs" && user?.role === 'admin' && <DocAnalytics />}
        {currentHash === "#complaints" && user?.role === 'admin' && <ComplaintAnalytics />}
        {currentHash === "#finance" && <FinanceAnalytics user={user} />}
      </div>
    </Container>
  );
};

export default Analytics;
import React from "react";
import { useLocation } from "react-router-dom";
import Container from "../../components/Container";
import UserAnalytics from "./parts/UserAnalytics";
import DocAnalytics from "./parts/DocAnalytics";
import ComplaintAnalytics from "./parts/ComplaintAnalytics";

const Analytics = () => {
  const location = useLocation();
  const currentHash = location.hash || "#users"; // Default view

  return (
    <Container>
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Business Intelligence</h1>

      {currentHash === "#users" && <UserAnalytics />}
      {currentHash === "#docs" && <DocAnalytics />}
      {currentHash === "#complaints" && <ComplaintAnalytics />}
    </Container>
  );
};

export default Analytics;
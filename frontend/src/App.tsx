import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ParseAndEdit from "./pages/parseAndEdit.tsx";
import DashboardPage from "./pages/dashboardPage.tsx";
import "./App.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ParseAndEdit />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </Router>
  );
};

export default App;

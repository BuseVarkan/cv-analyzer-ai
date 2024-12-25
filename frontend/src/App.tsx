import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ParseAndEdit from "./pages/parseAndEdit.tsx";
import SuggestionsPage from "./pages/suggestionsPage.tsx";
import DashboardPage from "./pages/dashboardPage.tsx";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ParseAndEdit />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/suggestions" element={<SuggestionsPage />} />
      </Routes>
    </Router>
  );
};

export default App;

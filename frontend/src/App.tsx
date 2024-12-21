import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ParseAndEdit from "../src/components/parseAndEdit.tsx";
import SuggestionsPage from "./components/suggestionsPage.tsx";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ParseAndEdit />} />
        <Route path="/suggestions" element={<SuggestionsPage />} />
      </Routes>
    </Router>
  );
};

export default App;

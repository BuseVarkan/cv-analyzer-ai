import React, { useState } from "react";
import axios from "axios";

const App: React.FC = () => {
  const [cvText, setCvText] = useState("");
  const [suggestions, setSuggestions] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/process-cv", {
        cvText,
      });
      setSuggestions(response.data.suggestions);
    } catch (error) {
      console.error("Error processing CV:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>CV Improvement Suggestions</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={cvText}
          onChange={(e) => setCvText(e.target.value)}
          placeholder="Paste your CV here"
          rows={10}
          style={{ width: "100%" }}
        ></textarea>
        <button type="submit" style={{ marginTop: "10px" }}>Submit</button>
      </form>
      {suggestions && (
        <div style={{ marginTop: "20px" }}>
          <h2>Suggestions:</h2>
          <p>{suggestions}</p>
        </div>
      )}
    </div>
  );
};

export default App;

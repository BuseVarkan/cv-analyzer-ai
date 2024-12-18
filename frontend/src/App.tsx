import React, { useState } from "react";
import axios from "axios";

const App: React.FC = () => {
  const [cvText, setCvText] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuggestions("");
    setError("");

    try {
      console.log("Submitting CV text:", cvText);
      const response = await axios.post(
        "http://127.0.0.1:5000/process-cv",
        { cvText },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Response received:", response.data);
      setSuggestions(response.data.suggestions);
    } catch (error: any) {
      console.error("Error occurred:", error.response || error.message);
      setError(
        error.response?.data?.error || "An unexpected error occurred. Check the backend."
      );
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
      {error && (
        <div style={{ marginTop: "20px", color: "red" }}>
          <h2>Error:</h2>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default App;

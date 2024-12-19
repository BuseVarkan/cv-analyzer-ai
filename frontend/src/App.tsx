import React, { useState } from "react";
import axios from "axios";

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [suggestions, setSuggestions] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuggestions("");
    setError("");

    if (!file) {
      setError("Please upload a PDF file.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("cvFile", file);

      const response = await axios.post(
        "http://127.0.0.1:5000/process-cv",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuggestions(response.data.suggestions);
    } catch (error: any) {
      setError(
        error.response?.data?.error || "An unexpected error occurred. Check the backend."
      );
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>CV Improvement Suggestions</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
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

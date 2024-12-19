import React, { useState } from "react";
import axios from "axios";
import { Container, Button, Typography, Paper, LinearProgress } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import "./App.css";

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [suggestions, setSuggestions] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuggestions("");
    setError("");
    setLoading(true);

    if (!file) {
      setError("Please upload a PDF file.");
      setLoading(false);
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
    } finally {
      setLoading(false);
    }
  };

  const escapeHtml = (text: string) => {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  };

  const formatSuggestions = (text: string) => {
    const lines = text.split('\n');

    let inCodeBlock = false;
    const htmlLines: string[] = [];

    for (let line of lines) {
      if (!inCodeBlock) {
        if (line.trim().startsWith('```')) {
          inCodeBlock = true;
          htmlLines.push('<pre><code>');
          continue; 
        }
      } else {
        if (line.trim() === '```') {
          inCodeBlock = false;
          htmlLines.push('</code></pre>');
          continue;
        } else {
          htmlLines.push(escapeHtml(line));
          continue;
        }
      }

      line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

      if (line.startsWith('### ')) {
        const headingText = line.replace('### ', '');
        htmlLines.push(`<h3>${headingText}</h3>`);
      } else if (line.trim() !== '') {
        htmlLines.push(`<p>${line}</p>`);
      }
    }

    if (inCodeBlock) {
      htmlLines.push('</code></pre>');
    }

    return htmlLines.join('\n');
  };

  return (
    <Container maxWidth="md" className="container">
      <Paper elevation={3} className="paper">
        <Typography variant="h4" align="center" gutterBottom>
          CV Improvement Suggestions
        </Typography>
        <form onSubmit={handleSubmit} className="form">
          <Button
            variant="outlined"
            component="label"
            startIcon={<UploadFileIcon />}
            className="uploadButton"
          >
            {file ? file.name : "Upload PDF File"}
            <input
              type="file"
              accept="application/pdf"
              hidden
              onChange={handleFileChange}
            />
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="submitButton"
            disabled={loading}
          >
            {loading ? "Processing..." : "Submit"}
          </Button>
        </form>
        {loading && <LinearProgress className="progressBar" />}
        {suggestions && (
          <div className="suggestions">
            <Typography variant="h5" gutterBottom className="suggestionsTitle">
              Suggestions:
            </Typography>
            <div
              className="suggestionsContent"
              dangerouslySetInnerHTML={{ __html: formatSuggestions(suggestions) }}
            />
          </div>
        )}
        {error && (
          <Typography
            variant="body1"
            color="error"
            className="errorText"
          >
            {error}
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default App;

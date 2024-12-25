import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Typography, Button, Container, Paper, LinearProgress } from "@mui/material";
import axios from "axios";
import './suggestionsPage.css';

const SuggestionsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { sections, jobDescription } = location.state || {};
  const [suggestions, setSuggestions] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          "http://127.0.0.1:5000/generate-suggestions",
          { cv_text: sections, job_description: jobDescription },
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        setSuggestions(response.data.suggestions);
      } catch (err) {
        setError(err.response?.data?.error || "An error occurred while fetching suggestions.");
      } finally {
        setLoading(false);
      }
    };

    if (sections && jobDescription) {
      fetchSuggestions();
    } else {
      navigate("/");
    }
  }, [sections, jobDescription, navigate]);

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
          htmlLines.push(line);
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
    <Container maxWidth="md">
      <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
        <Typography variant="h4" align="center" gutterBottom>
          Suggestions
        </Typography>
  
        {loading && <LinearProgress />}
        {error && <Typography color="error">{error}</Typography>}
        {!loading && suggestions && (
          <div
            dangerouslySetInnerHTML={{
              __html: formatSuggestions(suggestions),
            }}
          />
        )}
  
        <Button variant="outlined" onClick={() => 
        navigate("/", {
          state: {
            sections,
            jobDescription,
            showSaveButton: true,
          },
        })}>
          Back to CV Editor
        </Button>
      </Paper>
    </Container>
  );
};

export default SuggestionsPage;

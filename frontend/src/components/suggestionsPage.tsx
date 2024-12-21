import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Typography, Button, Container, Paper, LinearProgress } from "@mui/material";
import axios from "axios";

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

  return (
    <Container maxWidth="md">
      <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
        <Typography variant="h4" align="center" gutterBottom>
          Suggestions
        </Typography>

        {loading && <LinearProgress />}
        {error && <Typography color="error">{error}</Typography>}
        {!loading && suggestions && (
          <Typography variant="body1" align="center">
            {suggestions}
          </Typography>
        )}

        <Button variant="outlined" onClick={() => navigate("/")}>
          Back to CV Editor
        </Button>
      </Paper>
    </Container>
  );
};

export default SuggestionsPage;

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Typography, Button, Container, Paper, LinearProgress, CircularProgress } from "@mui/material";
import axios from "axios";
import OverallScore from "../components/circularProgress.tsx";
import Breakdown from "../components/breakdown.tsx";
import SampleQuestions from "../components/sampleQuestions.tsx";


const DashboardPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { sections, jobDescription } = location.state || {};

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          "http://127.0.0.1:5000/generate-suggestions",
          { cv_text: sections, job_description: jobDescription },
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        setData(response.data.suggestions);
        console.log(response.data);
      } catch (err) {
        setError(err.response?.data?.error || "An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    if (sections && jobDescription) {
      fetchData();
    } else {
      navigate("/");
    }
  }, [sections, jobDescription, navigate]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.post(
          "http://127.0.0.1:5000/generate-questions",
          { cv_text: sections, job_description: jobDescription },
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        setQuestions(response.data.questions);
      } catch (err) {
        console.error("Error fetching questions:", err);
      }
    };

    if (sections && jobDescription) {
      fetchQuestions();
    }
  }, [sections, jobDescription, navigate]);

  if (loading) {
    return (
      <Container >
        <Paper elevation={3} style={{ padding: "20px", marginTop: "20px", textAlign: "center" }}>
          <CircularProgress />
          <Typography variant="h6" style={{ marginTop: "10px" }}>
            Loading Dashboard...
          </Typography>
        </Paper>
      </Container>
    );
  }

  if (error) {
    return (
      <Container >
        <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
          <Typography variant="h4" align="center" gutterBottom>
            Dashboard
          </Typography>
          <Typography color="error">{error}</Typography>
          <Button
            variant="outlined"
            onClick={() =>
              navigate("/", {
                state: {
                  sections,
                  jobDescription,
                  showSaveButton: true,
                },
              })
            }
            style={{ marginTop: "20px" }}
          >
            Back to CV Editor
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container className="dashboardPage">
      <Paper elevation={3} className="dashboardPaper">
        <Typography variant="h4" align="center" gutterBottom>
          Dashboard
        </Typography>

        <div className="dashboardContent">
          {data && <OverallScore score={data["overall_score"]} />}
          <h2 className="info">Click on sections for details.</h2>
          {data && <Breakdown sections={data["sections"]} />}
          <h2 className="header">Sample Interview Questions</h2>
          {data && questions && <SampleQuestions sections={questions["questions"]} />}
        </div>

        <Button
          className="navigateButton"
          variant="outlined"
          onClick={() =>
            navigate("/", {
              state: {
                sections,
                jobDescription,
                showSaveButton: true,
              },
            })
          }
        >
          Back to CV Editor
        </Button>
      </Paper>
    </Container>

  );
};

export default DashboardPage;

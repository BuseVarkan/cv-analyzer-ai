import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Typography, Button, Container, Paper, LinearProgress, CircularProgress } from "@mui/material";
import axios from "axios";
import OverallScore from "../components/circularProgress.tsx";
import Breakdown from "../components/breakdown.tsx";
import "./dashboardPage.css";


const DashboardPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { sections, jobDescription } = location.state || {};

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    <Container>
      <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
        <Typography variant="h4" align="center" gutterBottom>
          Dashboard
        </Typography>

        <div className="dashboardContent">
          {data && <OverallScore score={data["overall_score"]} />}
          {data && <Breakdown sections={data["sections"]} />}
        </div>

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

export default DashboardPage;

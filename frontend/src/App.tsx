import React, { useState } from "react";
import axios from "axios";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  Button,
  IconButton,
  Paper,
  Container,
  LinearProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import "./App.css";

const sectionTitles: { [key: string]: string } = {
  personal_info: "Personal Information",
  work_experience: "Work Experience",
  education: "Education",
  skills: "Skills",
  certifications: "Certifications",
  languages: "Languages",
  projects: "Projects",
  volunteering: "Volunteering",
  unknown: "Additional Information",
};


const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [sections, setSections] = useState<{ [key: string]: string[] }>({});
  const [suggestions, setSuggestions] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [savingButton, setSavingButton] = useState(false);
  const [editingSections, setEditingSections] = useState<{ [key: string]: boolean }>({});
  const [jobDescription, setJobDescription] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError("");
      setLoading(true);
      setSuggestions("");
      
      try {
        const formData = new FormData();
        formData.append("cvFile", e.target.files[0]);

        const response = await axios.post(
          "http://127.0.0.1:5000/extract-text",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        
        setSections(response.data.structured_content || {});
      } catch (error: any) {
        setError(
          error.response?.data?.error || "An error occurred while extracting text."
        );
        setSections({});
      } finally {
        setLoading(false);
        setSavingButton(true);
      }
    }
  };

  const toggleSectionEdit = (section: string) => {
    setEditingSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleFieldChange = (
    section: string,
    index: number,
    key: string,
    value: string
  ) => {
    setSections((prevSections: any) => {
      const updatedSection = [...prevSections[section]];
      updatedSection[index] = {
        ...updatedSection[index],
        [key]: value,
      };
      return {
        ...prevSections,
        [section]: updatedSection,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuggestions("");
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/generate-suggestions",
        { cv_text: sections },
        {
          headers: {
            "Content-Type": "application/json",
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

  const formatLabel = (key: string) => {
    return key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <Container maxWidth="md" className="container">
      <Paper elevation={3} className="paper">
        <Typography variant="h4" align="center" gutterBottom>
          CV Improvement Suggestions
        </Typography>
        <form onSubmit={handleSubmit} className="form">
          {/* Job Description */}
          <TextField
          label="Job Description"
          variant="outlined"
          fullWidth
          margin="normal"
          placeholder="Enter the job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          />

          {/* File Upload Button */}
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

          {/* Error Message */}
          {error && <Typography color="error">{error}</Typography>}

          {/* Sections Editor */}
          <div className="sections-container">
            {Object.entries(sections).map(([section, contents]) => (
              <Accordion key={section} className="section-accordion">
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  className="section-header"
                >
                  <Typography variant="h6">
                    {sectionTitles[section as keyof typeof sectionTitles] || section}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSectionEdit(section);
                    }}
                    className="edit-button"
                  >
                    {editingSections[section] ? <SaveIcon /> : <EditIcon />}
                  </IconButton>
                </AccordionSummary>
                <AccordionDetails>
                  {Array.isArray(contents) ? (
                    contents.map((item: any, index: number) => (
                      <div key={index} style={{ marginBottom: "10px" }}>
                        {/* Group related keys */}
                        <Typography variant="body2">
                          {Object.keys(item)
                            .map(
                              (key) => (
                                <React.Fragment key={key}>
                                  <span style={{ fontWeight: "bold" }}>{formatLabel(key)}</span>
                                  {`: ${item[key] || "N/A"} `}
                                </React.Fragment>
                              )
                            )}
                        </Typography>
                        {editingSections[section] &&
                          Object.keys(item).map((key) => (
                            <TextField
                              key={key}
                              fullWidth
                              margin="dense"
                              label={formatLabel(key)}
                              value={item[key] || ""}
                              onChange={(e) =>
                                handleFieldChange(section, index, key, e.target.value)
                              }
                            />
                          ))}
                      </div>
                    ))
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No data available for this section.
                    </Typography>
                  )}
                </AccordionDetails>

              </Accordion>
            ))}
          </div>

          {/* Save Button */}
          {savingButton && <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ marginTop: "20px" }}
          >
            Save All Changes
          </Button>}
        </form>
        {/* Loading Indicator */}
        {loading && <LinearProgress className="progressBar" />}

      </Paper>
    </Container>
  );
};

export default App;
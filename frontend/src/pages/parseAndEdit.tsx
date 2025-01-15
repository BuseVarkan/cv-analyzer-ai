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
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";


const sectionTitles = {
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

const defaultSectionItem = {
  personal_info: { name: "", email: "", phone: "" },
  work_experience: { company: "", position: "", responsibilities: "", start_date: "", end_date: "" },
  education: {
    school: "",
    degree: "",
    field_of_study: "",
    institution: "",
    start_date: "",
    end_date: "",
    graduation_year: "",
  },
  skills: { skill: "" },
  certifications: { certification: "", issuer: "" },
  languages: { language: "", proficiency: "" },
  projects: { project_name: "", description: "" },
  volunteering: { organization: "", role: "" },
  unknown: { key: "", value: "" },
};

const ParseAndEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const savedState = location.state || {};

  const [file, setFile] = useState<File | null>(null);
  const [sections, setSections] = useState<Record<string, any>>(savedState.sections || {});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [savingButton, setSavingButton] = useState(
    savedState.showSaveButton || false
  );
  const [editingSections, setEditingSections] = useState<Record<string, boolean>>({});
  const [jobDescription, setJobDescription] = useState(savedState.jobDescription || "");
  const [jobDescriptionError, setJobDescriptionError] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError("");
      setLoading(true);

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
      } catch (error) {
        console.error(error);
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

  const handleFieldChange = (section: string, index: number, key: string, value: string) => {
    setSections((prevSections) => {
      const updatedSection = [...prevSections[section]];
      updatedSection[index] = {
        ...updatedSection[index],
        [key]: String(value),
      };
      return {
        ...prevSections,
        [section]: updatedSection,
      };
    });
  };

  const handleAddItem = (section: string) => {
    setSections((prevSections) => ({
      ...prevSections,
      [section]: prevSections[section]
        ? [...prevSections[section], { ...defaultSectionItem[section] }]
        : [{ ...defaultSectionItem[section] }],
    }));
  };

  const handleDeleteItem = (section: string, index: number) => {
    setSections((prevSections) => {
      const updatedSection = [...prevSections[section]];
      updatedSection.splice(index, 1);
      return {
        ...prevSections,
        [section]: updatedSection,
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescription.trim()) {
      setJobDescriptionError(true);
      return;
    }
    setJobDescriptionError(false);
    navigate("/dashboard", { state: { sections, jobDescription } });
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
          <TextField
            label="Job Description"
            variant="outlined"
            fullWidth
            margin="normal"
            placeholder="Enter the job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            error={jobDescriptionError}
            helperText={jobDescriptionError ? "Job description is required." : ""}
          />

          <Button
            variant="outlined"
            component="label"
            startIcon={<UploadFileIcon />}
            className="uploadButton"
          >
            {file?.name || "Upload PDF File"}
            <input
              type="file"
              accept="application/pdf"
              hidden
              onChange={handleFileChange}
            />
          </Button>

          {error && <Typography color="error">{error}</Typography>}

          <div className="sections-container">
            {Object.entries(sections).map(([section, contents]) => (
              <Accordion key={section} className="section-accordion">
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  className="section-header"
                >
                  <Typography variant="h6">
                    {sectionTitles[section] || section}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSectionEdit(section);
                    }}
                  >
                    {editingSections[section] ? <SaveIcon/> : <EditIcon />}
                  </IconButton>
                </AccordionSummary>
                <AccordionDetails>
                  {Array.isArray(contents) && contents.length > 0 ? (
                    contents.map((item, index) => (
                      <div
                        key={index}
                        style={{
                          marginBottom: "10px",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <div style={{ flexGrow: 1 }}>
                          {editingSections[section] ? (
                            Object.keys(item).map((key) => (
                              <TextField
                                key={key}
                                fullWidth
                                margin="dense"
                                label={formatLabel(key)}
                                value={item[key] || ""}
                                type={"text"}
                                onChange={(e) =>
                                  handleFieldChange(section, index, key, e.target.value)
                                }
                              />
                            ))
                          ) : (
                            Object.keys(item).map((key) => (
                              <Typography key={key} variant="body2">
                                <strong>{formatLabel(key)}</strong>: {item[key] || "N/A"}
                              </Typography>
                            ))
                          )}
                        </div>
                        {editingSections[section] && (
                          <IconButton
                            onClick={() => handleDeleteItem(section, index)}
                          >
                            <DeleteIcon/>
                          </IconButton>
                        )}
                      </div>
                    ))
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No data available for this section.
                    </Typography>
                  )}

                  {editingSections[section] && (
                    <Button
                      className="uploadButton"
                      variant="outlined"
                      onClick={() => handleAddItem(section)}
                      style={{ marginTop: "10px" }}
                    >
                      Add New Item
                    </Button>
                  )}
                </AccordionDetails>
              </Accordion>
            ))}
          </div>

          {savingButton && (
            <Button
             className="navigateButton"
              type="submit"
              variant="contained"
              style={{ marginTop: "20px" }}
            >
              Save All Changes
            </Button>
          )}
        </form>

        {loading && <LinearProgress className="progressBar" />}
      </Paper>
    </Container>
  );
};

export default ParseAndEdit;

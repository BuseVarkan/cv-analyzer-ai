import React, { useState } from "react";
import axios from "axios";
import { 
  Container, 
  Button, 
  Typography, 
  Paper, 
  LinearProgress,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import "./App.css";

const sectionTitles = {
  personal_info: "Personal Information",
  work_experience: "Work Experience",
  education: "Education",
  skills: "Skills",
  certifications: "Certifications",
  languages: "Languages",
  projects: "Projects",
  volunteering: "Volunteering",
  unknown: "Additional Information"
};

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [sections, setSections] = useState<{ [key: string]: string[] }>({});
  const [suggestions, setSuggestions] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingSections, setEditingSections] = useState<{ [key: string]: boolean }>({});

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
        // Initialize editing state for all sections
        const initialEditingState: { [key: string]: boolean } = {};
        Object.keys(response.data.structured_content || {}).forEach(section => {
          initialEditingState[section] = false;
        });
        setEditingSections(initialEditingState);

      } catch (error: any) {
        setError(
          error.response?.data?.error || "An error occurred while extracting text."
        );
        setSections({});
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleSectionEdit = (section: string) => {
    setEditingSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSectionChange = (section: string, index: number, value: string) => {
    setSections(prev => ({
      ...prev,
      [section]: prev[section].map((content, i) => i === index ? value : content)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuggestions("");
    setError("");
    setLoading(true);

    // Combine all sections into one text
    const combinedText = Object.entries(sections)
      .map(([section, contents]) => {
        return `### ${sectionTitles[section as keyof typeof sectionTitles] || section}\n${contents.join('\n\n')}`;
      })
      .join('\n\n');

    if (!combinedText.trim()) {
      setError("Please provide some text to analyze.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/generate-suggestions",
        { cv_text: combinedText },
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
                  {contents.map((content, index) => (
                    <TextField
                      key={`${section}-${index}`}
                      multiline
                      fullWidth
                      variant="outlined"
                      value={content}
                      onChange={(e) => handleSectionChange(section, index, e.target.value)}
                      disabled={!editingSections[section]}
                      className="section-content"
                      sx={{ mb: 2 }}
                    />
                  ))}
                </AccordionDetails>
              </Accordion>
            ))}
          </div>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="submitButton"
            disabled={loading}
          >
            {loading ? "Processing..." : "Get Suggestions"}
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
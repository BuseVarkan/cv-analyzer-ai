import React, { useState } from 'react';
import { Grid, Card, CardContent, Typography, Collapse } from '@mui/material';
import './breakdown.css';

const Breakdown = ({ sections }: { sections: Array<{ title: string, score: number, description: string, details: string }> }) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const handleCardClick = (title: string) => {
    setActiveSection((prev) => (prev === title ? null : title)); // Toggle active state
  };

  const getScoreClass = (score: number) => {
    if (score > 75) return 'high';
    if (score > 50) return 'medium';
    return 'low';
  };

  return (
    <div>
      <Grid container spacing={2} className="grid-container">
        {sections.map((section, index) => (
          <Grid item xs={6} md={3} key={index}>
            <Card
              onClick={() => handleCardClick(section["title"])}
              className={`card ${activeSection === section["title"] ? 'card-active' : ''}`}
            >
              <CardContent>
                <Typography variant="h6">{section["title"]}</Typography>
                <Typography
                  variant="h4"
                  className={`card-score ${getScoreClass(section["score"])}`}
                >
                  {section["score"]} / 100
                </Typography>
                <Typography>{section["description"]}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Detailed Text Section */}
      {sections.map((section, index) => (
        <Collapse in={activeSection === section["title"]} timeout="auto" unmountOnExit key={index}>
          <Card className="collapse-section">
            <Typography variant="h6">{section["title"]} Details</Typography>
            <Typography>{section["details"]}</Typography>
          </Card>
        </Collapse>
      ))}
    </div>
  );
};

export default Breakdown;

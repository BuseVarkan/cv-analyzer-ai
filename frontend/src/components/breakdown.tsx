import React, { useState } from 'react';
import { Grid2, Card, CardContent, Typography, Collapse } from '@mui/material';

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
    } else if (/^\d+\.\s/.test(line)) {
      htmlLines.push(`<li>${line.replace(/^\d+\.\s/, '')}</li>`);
    } else if (line.trim() !== '') {
      htmlLines.push(`<p>${line}</p>`);
    }
  }

  if (inCodeBlock) {
    htmlLines.push('</code></pre>');
  }

  if (htmlLines.some((htmlLine) => htmlLine.startsWith('<li>'))) {
    return htmlLines.join('\n').replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>');
  }

  return htmlLines.join('\n');
};




const Breakdown = ({ sections }: { sections: Array<{ title: string, score: number, suggestions: string }> }) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const handleCardClick = (title: string) => {
    setActiveSection((prev) => (prev === title ? null : title));
  };

  const getScoreClass = (score: number) => {
    if (score > 75) return 'high';
    if (score > 50) return 'medium';
    return 'low';
  };

  return (
    <div>
      <Grid2 container spacing={2} className="grid-container">
        {sections.map((section, index) => (
          <Grid2 size={{ xs: 6, md: 3 }} key={index}>
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
              </CardContent>
            </Card>
          </Grid2>
        ))}
      </Grid2>

      {sections.map((section, index) => (
        <Collapse in={activeSection === section["title"]} timeout="auto" unmountOnExit key={index}>
          <Card className="collapse-section">
            <Typography variant="h6">{section["title"]} Suggestions</Typography>
            <Typography
                  variant="body2"
                  dangerouslySetInnerHTML={{
                    __html: formatSuggestions(section["suggestions"]),
                  }}
                />
          </Card>
        </Collapse>
      ))}
    </div>
  );
};

export default Breakdown;

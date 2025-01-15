import React, { useState } from "react";
import { Card, CardContent, Typography, Collapse } from "@mui/material";
import { Grid2 } from '@mui/material';

const SampleQuestions = ({ sections }: { sections: Array<{ question: string, answer: string }> }) => {
    const [activeSection, setActiveSection] = useState<string | null>(null);

    const handleCardClick = (title: string) => {
        setActiveSection((prev) => (prev === title ? null : title));
    };

    return (
        <div>
            <Grid2 container direction="column" spacing={2}>
                {sections.map((section, index) => (
                    <Grid2 key={index} columns={12}>
                        <Card
                            onClick={() => handleCardClick(section["question"])}
                            className={`card ${activeSection === section["question"] ? 'card-active' : ''}`}
                        >
                            <CardContent>
                                <Typography variant="h6" sx={{ fontSize: '1.10rem' }}>{section["question"]}</Typography>
                                <Typography
                                    variant="h4"
                                    className={`card-score`}
                                >
                                </Typography>
                            </CardContent>
                        </Card>

                        <Collapse in={activeSection === section["question"]} timeout="auto" unmountOnExit>
                            <Card className="collapse-section">
                                <Typography variant="body2" sx={{ fontSize: '1rem' }}>{section["answer"]}</Typography>
                            </Card>
                        </Collapse>
                    </Grid2>
                ))}
            </Grid2>
        </div>
    );
};

export default SampleQuestions;

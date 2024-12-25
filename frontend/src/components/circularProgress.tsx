import { CircularProgress, Typography, Box } from '@mui/material';
import React from 'react';

const OverallScore = ({ score }: { score: number }) => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" style={{ marginBottom: '20px' }}>
      <CircularProgress
        variant="determinate"
        value={score}
        size={120}
        thickness={4}
        style={{ color: score > 75 ? '#4caf50' : '#f44336' }}
      />
      <Typography variant="h4" style={{ marginTop: '10px' }}>{score} / 100</Typography>
      <Typography>Your resume scored {score} out of 100.</Typography>
    </Box>
  );
};

export default OverallScore;
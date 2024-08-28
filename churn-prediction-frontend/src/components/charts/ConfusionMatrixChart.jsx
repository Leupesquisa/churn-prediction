import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import customerService from '../../services/CustomerServices';

const ConfusionMatrixChart = () => {
  const [confusionMatrix, setConfusionMatrix] = useState(null);

  useEffect(() => {
    const fetchConfusionMatrix = async () => {
      try {
        const response = await customerService.getConfusionMatrix();
        setConfusionMatrix(response.confusion_matrix_image);
      } catch (error) {
        console.error('Failed to fetch Confusion Matrix', error);
      }
    };

    fetchConfusionMatrix();
  }, []);

  return (
    <Paper elevation={1} style={{ padding: '20px', marginBottom: '20px' }}>
      <h3>Confusion Matrix</h3>
      {confusionMatrix ? (
        <img src={`data:image/png;base64,${confusionMatrix}`} alt="Confusion Matrix" style={{ width: '100%' }} />
      ) : (
        <p>Loading...</p>
      )}
    </Paper>
  );
};

export default ConfusionMatrixChart;

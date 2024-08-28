import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import customerService from '../../services/CustomerServices';

const ROCCurveChart = () => {
  const [rocCurve, setRocCurve] = useState(null);

  useEffect(() => {
    const fetchRocCurve = async () => {
      try {
        const response = await customerService.getROCCurve();
        setRocCurve(response.roc_curve_image);
      } catch (error) {
        console.error('Failed to fetch ROC Curve', error);
      }
    };

    fetchRocCurve();
  }, []);

  return (
    <Paper elevation={1} style={{ padding: '20px', marginBottom: '20px' }}>
      <h3>ROC Curve</h3>
      {rocCurve ? (
        <img src={`data:image/png;base64,${rocCurve}`} alt="ROC Curve" style={{ width: '100%' }} />
      ) : (
        <p>Loading...</p>
      )}
    </Paper>
  );
};

export default ROCCurveChart;

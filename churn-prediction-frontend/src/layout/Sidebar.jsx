import React from 'react';
import { Stepper, Step, StepLabel, Typography, Button } from '@mui/material';

const Sidebar = ({ selectedModel, setSelectedModel, onTrainModel }) => {
  const models = [
    {
      label: 'Logistic Regression',
      value: 'logistic_regression',
      description: 'Recall of 0.76: strong effectiveness in identifying churn'
    },
    {
      label: 'K-Nearest Neighbors',
      value: 'knn',
      description: 'Recall of 0.73: reasonable accuracy in recognizing churn'
    },
    {
      label: 'Decision Tree',
      value: 'decision_tree',
      description: 'Recall of 0.68: moderate success in identifying churn risks'
    },
    {
      label: 'Random Forest',
      value: 'random_forest',
      description: 'Recall of 0.75: reliable capabilities in churn prediction'
    },
    {
      label: 'Support Vector Machines',
      value: 'svm',
      description: 'Recall of 0.75: good performance in detecting churn risks'
    }
  ];

  const handleModelSelect = (model) => {
    setSelectedModel(model);
  };

  return (
    <div style={{ maxWidth: 400 }}>
      <Stepper activeStep={models.findIndex(model => model.value === selectedModel)} orientation="vertical">
        {models.map((model) => (
          <Step key={model.value} completed={selectedModel === model.value}>
            <StepLabel onClick={() => handleModelSelect(model.value)}>
              {model.label}
            </StepLabel>
            {selectedModel === model.value && (
              <div style={{ marginTop: 8 }}>
                <Typography variant="body2" gutterBottom style={{ fontSize: '12px', marginLeft: '30px' }}>
                  {model.description}
                </Typography>

              </div>
            )}
          </Step>
        ))}
      </Stepper>
    </div>
  );
};

export default Sidebar;

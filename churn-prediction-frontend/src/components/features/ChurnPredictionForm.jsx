import React, { useState } from 'react';
import { Stepper, Step, StepLabel, Button, Box, Typography, Paper } from '@mui/material';
import Step1 from './../steps/Step1';
import Step2 from './../steps/Step2';
import Step3 from './../steps/Step3';
import customerService from '../../services/CustomerServices';
import './ChurnPredictionForm.css';

const steps = ['Customer Details', 'Service Details', 'Billing & Contract', 'Prediction Result'];

const ChurnPredictionForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    customerID: '',
    gender: '',
    seniorCitizen: 0,
    partner: 'No',
    dependents: 'No',
    tenure: 1,
    phoneService: 'Yes',
    multipleLines: 'No',
    internetService: 'DSL',
    onlineSecurity: 'No',
    onlineBackup: 'No',
    deviceProtection: 'No',
    techSupport: 'No',
    streamingTV: 'No',
    streamingMovies: 'No',
    contract: 'Month-to-month',
    paperlessBilling: 'No',
    paymentMethod: 'Bank transfer (automatic)',
    monthlyCharges: 29.85,
    totalCharges: 29.85,
    churn: 'No',
    modelType: 'logistic_regression', // Default model
  });

  const [prediction, setPrediction] = useState(null);

  const handleNext = () => {
    if (activeStep === steps.length - 2) {
      handlePredict();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setFormData({
      customerID: '7590-VHVEG',
      gender: 'Male',
      seniorCitizen: 0,
      partner: 'No',
      dependents: 'No',
      tenure: 1,
      phoneService: 'Yes',
      multipleLines: 'No',
      internetService: 'DSL',
      onlineSecurity: 'No',
      onlineBackup: 'No',
      deviceProtection: 'No',
      techSupport: 'No',
      streamingTV: 'No',
      streamingMovies: 'No',
      contract: 'Month-to-month',
      paperlessBilling: 'No',
      paymentMethod: 'Bank transfer (automatic)',
      monthlyCharges: 29.85,
      totalCharges: 29.85,
      churn: 'No',
      modelType: 'logistic_regression',
    });
    setPrediction(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleModelChange = (event) => {
    setFormData({
      ...formData,
      modelType: event.target.value,
    });
  };

  const handlePredict = async () => {
    const customerData = {
      customer_data: {
        customerID: formData.customerID,
        gender: formData.gender,
        SeniorCitizen: formData.seniorCitizen,
        Partner: formData.partner,
        Dependents: formData.dependents,
        tenure: formData.tenure,
        PhoneService: formData.phoneService,
        MultipleLines: formData.multipleLines,
        InternetService: formData.internetService,
        OnlineSecurity: formData.onlineSecurity,
        OnlineBackup: formData.onlineBackup,
        DeviceProtection: formData.deviceProtection,
        TechSupport: formData.techSupport,
        StreamingTV: formData.streamingTV,
        StreamingMovies: formData.streamingMovies,
        Contract: formData.contract,
        PaperlessBilling: formData.paperlessBilling,
        PaymentMethod: formData.paymentMethod,
        MonthlyCharges: formData.monthlyCharges,
        TotalCharges: formData.totalCharges,
        Churn: formData.churn,
      },
      model_type: formData.modelType,
    };

    try {
      const response = await customerService.predictChurn(customerData);
      setPrediction(response.prediction);
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } catch (error) {
      console.error('Prediction error:', error);
    }
  };

  const renderStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return <Step1 formData={formData} handleInputChange={handleInputChange} />;
      case 1:
        return <Step2 formData={formData} handleInputChange={handleInputChange} />;
      case 2:
        return <Step3 formData={formData} handleInputChange={handleInputChange} />;
      case 3:
        return (
          <Paper elevation={3} sx={{ padding: 4, marginTop: 2, textAlign: 'center' }}>
            <Typography variant="h5" component="div" gutterBottom>
              Prediction Result
            </Typography>
            <Typography variant="h6">
              {prediction === 1 ? 'High Risk of Churn' : 'Low Risk of Churn'}
            </Typography>
            <Typography variant="subtitle1" component="div" sx={{ fontStyle: 'italic', marginTop: 2 }}>
              Churn: {prediction === 1 ? 'Yes' : 'No'}
            </Typography>
          </Paper>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        ) : (
          <div>
            {renderStepContent(activeStep)}
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              {activeStep !== 0 && (
                <Button
                  color="inherit"
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
              )}
              <Box sx={{ flex: '1 1 auto' }} />
              {activeStep !== steps.length - 1 && (
                <Button onClick={handleNext}>
                  {activeStep === steps.length - 2 ? 'Predict Churn' : 'Next'}
                </Button>
              )}
            </Box>
          </div>
        )}
      </div>
    </Box>
  );
};

export default ChurnPredictionForm;

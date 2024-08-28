import React from 'react';
import { TextField, Checkbox, FormControl, FormControlLabel, Box, Typography, FormLabel, Paper, Grid } from '@mui/material';

const Step1 = ({ formData, handleInputChange }) => {
  return (
    <Box component="form" noValidate autoComplete="off" sx={{ flexGrow: 1 }}>
      <Typography variant="h6" gutterBottom sx={{ fontSize: '16px' }}>
        Customer Information
      </Typography>

      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          label="Customer ID"
          name="customerID"
          value={formData.customerID}
          onChange={handleInputChange}
          margin="normal"
          sx={{ fontSize: '14px' }}
        />
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={1} sx={{ p: 2 }}>
            <FormControl fullWidth component="fieldset">
              <FormLabel component="legend" sx={{ color: 'black', fontSize: '14px' }}>Gender</FormLabel>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.gender === 'Male'}
                    onChange={(e) =>
                      handleInputChange({
                        target: { name: 'gender', value: e.target.checked ? 'Male' : 'Female' },
                      })
                    }
                  />
                }
                label="Male"
                sx={{ fontSize: '14px' }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.gender === 'Female'}
                    onChange={(e) =>
                      handleInputChange({
                        target: { name: 'gender', value: e.target.checked ? 'Female' : 'Male' },
                      })
                    }
                  />
                }
                label="Female"
                sx={{ fontSize: '14px' }}
              />
            </FormControl>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={1} sx={{ p: 2 }}>
            <FormControl fullWidth component="fieldset">
              <FormLabel component="legend" sx={{ color: 'black', fontSize: '14px' }}>Senior Citizen</FormLabel>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.seniorCitizen === 1}
                    onChange={(e) =>
                      handleInputChange({
                        target: { name: 'seniorCitizen', value: e.target.checked ? 1 : 0 },
                      })
                    }
                  />
                }
                label="Yes"
                sx={{ fontSize: '14px' }}
              />
            </FormControl>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={1} sx={{ p: 2 }}>
            <FormControl fullWidth component="fieldset">
              <FormLabel component="legend" sx={{ color: 'black', fontSize: '14px' }}>Partner</FormLabel>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.partner === 'Yes'}
                    onChange={(e) =>
                      handleInputChange({
                        target: { name: 'partner', value: e.target.checked ? 'Yes' : 'No' },
                      })
                    }
                  />
                }
                label="Yes"
                sx={{ fontSize: '14px' }}
              />
            </FormControl>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={1} sx={{ p: 2 }}>
            <FormControl fullWidth component="fieldset">
              <FormLabel component="legend" sx={{ color: 'black', fontSize: '14px' }}>Dependents</FormLabel>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.dependents === 'Yes'}
                    onChange={(e) =>
                      handleInputChange({
                        target: { name: 'dependents', value: e.target.checked ? 'Yes' : 'No' },
                      })
                    }
                  />
                }
                label="Yes"
                sx={{ fontSize: '14px' }}
              />
            </FormControl>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Step1;

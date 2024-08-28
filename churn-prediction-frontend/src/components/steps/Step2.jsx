import React from 'react';
import { TextField, Checkbox, FormControl, FormControlLabel, Box, Typography, FormLabel, Paper, Grid } from '@mui/material';

const Step2 = ({ formData, handleInputChange }) => {
  return (
    <Box component="form" noValidate autoComplete="off" sx={{ flexGrow: 1 }}>
      <Typography variant="h6" gutterBottom sx={{ fontSize: '16px' }}>
        Service Details
      </Typography>

      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          label="Tenure"
          name="tenure"
          type="number"
          value={formData.tenure}
          onChange={handleInputChange}
          margin="normal"
          sx={{ fontSize: '14px' }}
        />
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={1} sx={{ p: 2 }}>
            <FormControl fullWidth component="fieldset">
              <FormLabel component="legend" sx={{ color: 'black', fontSize: '14px' }}>Phone Service</FormLabel>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.phoneService === 'Yes'}
                    onChange={(e) =>
                      handleInputChange({
                        target: { name: 'phoneService', value: e.target.checked ? 'Yes' : 'No' },
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
              <FormLabel component="legend" sx={{ color: 'black', fontSize: '14px' }}>Multiple Lines</FormLabel>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.multipleLines === 'Yes'}
                    onChange={(e) =>
                      handleInputChange({
                        target: { name: 'multipleLines', value: e.target.checked ? 'Yes' : 'No' },
                      })
                    }
                  />
                }
                label="Yes"
                sx={{ fontSize: '14px' }}
              />
              {formData.phoneService === 'No' && (
                <Typography variant="body2">⚠️ No phone service</Typography>
              )}
            </FormControl>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={1} sx={{ p: 2 }}>
            <FormControl fullWidth component="fieldset">
              <FormLabel component="legend" sx={{ color: 'black', fontSize: '14px' }}>Internet Service</FormLabel>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.internetService === 'DSL'}
                    onChange={(e) =>
                      handleInputChange({
                        target: { name: 'internetService', value: e.target.checked ? 'DSL' : formData.internetService },
                      })
                    }
                  />
                }
                label="DSL"
                sx={{ fontSize: '14px' }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.internetService === 'Fiber optic'}
                    onChange={(e) =>
                      handleInputChange({
                        target: { name: 'internetService', value: e.target.checked ? 'Fiber optic' : formData.internetService },
                      })
                    }
                  />
                }
                label="Fiber optic"
                sx={{ fontSize: '14px' }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.internetService === 'No'}
                    onChange={(e) =>
                      handleInputChange({
                        target: { name: 'internetService', value: e.target.checked ? 'No' : formData.internetService },
                      })
                    }
                  />
                }
                label="No"
                sx={{ fontSize: '14px' }}
              />
            </FormControl>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={1} sx={{ p: 2 }}>
            <FormControl fullWidth component="fieldset">
              <FormLabel component="legend" sx={{ color: 'black', fontSize: '14px' }}>Online Security</FormLabel>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.onlineSecurity === 'Yes'}
                    onChange={(e) =>
                      handleInputChange({
                        target: { name: 'onlineSecurity', value: e.target.checked ? 'Yes' : 'No' },
                      })
                    }
                  />
                }
                label="Yes"
                sx={{ fontSize: '14px' }}
              />
              {formData.internetService === 'No' && (
                <Typography variant="body2">⚠️ No internet service</Typography>
              )}
            </FormControl>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Step2;

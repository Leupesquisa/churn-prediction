import React from 'react';
import { TextField, Checkbox, FormControl, FormControlLabel, Box, Typography, FormLabel, Paper, Grid } from '@mui/material';

const Step3 = ({ formData, handleInputChange }) => {
  return (
    <Box component="form" noValidate autoComplete="off" sx={{ flexGrow: 1 }}>
      <Typography variant="h6" gutterBottom sx={{ fontSize: '16px' }}>
        Billing & Contract
      </Typography>

      <Grid container spacing={2}>
        {/* Colocando os campos Monthly Charges e Total Charges na mesma linha */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Monthly Charges"
            name="monthlyCharges"
            type="number"
            value={formData.monthlyCharges}
            onChange={handleInputChange}
            margin="normal"
            sx={{ fontSize: '14px' }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Total Charges"
            name="totalCharges"
            type="number"
            value={formData.totalCharges}
            onChange={handleInputChange}
            margin="normal"
            sx={{ fontSize: '14px' }}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={1} sx={{ p: 2 }}>
            <FormControl fullWidth component="fieldset">
              <FormLabel component="legend" sx={{ color: 'black', fontSize: '14px' }}>Contract</FormLabel>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.contract === 'Month-to-month'}
                    onChange={(e) =>
                      handleInputChange({
                        target: { name: 'contract', value: e.target.checked ? 'Month-to-month' : formData.contract },
                      })
                    }
                  />
                }
                label="Month-to-month"
                sx={{ fontSize: '14px' }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.contract === 'One year'}
                    onChange={(e) =>
                      handleInputChange({
                        target: { name: 'contract', value: e.target.checked ? 'One year' : formData.contract },
                      })
                    }
                  />
                }
                label="One year"
                sx={{ fontSize: '14px' }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.contract === 'Two year'}
                    onChange={(e) =>
                      handleInputChange({
                        target: { name: 'contract', value: e.target.checked ? 'Two year' : formData.contract },
                      })
                    }
                  />
                }
                label="Two year"
                sx={{ fontSize: '14px' }}
              />
            </FormControl>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={1} sx={{ p: 2 }}>
            <FormControl fullWidth component="fieldset">
              <FormLabel component="legend" sx={{ color: 'black', fontSize: '14px' }}>Paperless Billing</FormLabel>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.paperlessBilling === 'Yes'}
                    onChange={(e) =>
                      handleInputChange({
                        target: { name: 'paperlessBilling', value: e.target.checked ? 'Yes' : 'No' },
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
              <FormLabel component="legend" sx={{ color: 'black', fontSize: '14px' }}>Payment Method</FormLabel>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.paymentMethod === 'Electronic check'}
                    onChange={(e) =>
                      handleInputChange({
                        target: { name: 'paymentMethod', value: e.target.checked ? 'Electronic check' : formData.paymentMethod },
                      })
                    }
                  />
                }
                label="Electronic check"
                sx={{ fontSize: '14px' }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.paymentMethod === 'Mailed check'}
                    onChange={(e) =>
                      handleInputChange({
                        target: { name: 'paymentMethod', value: e.target.checked ? 'Mailed check' : formData.paymentMethod },
                      })
                    }
                  />
                }
                label="Mailed check"
                sx={{ fontSize: '14px' }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.paymentMethod === 'Bank transfer (automatic)'}
                    onChange={(e) =>
                      handleInputChange({
                        target: { name: 'paymentMethod', value: e.target.checked ? 'Bank transfer (automatic)' : formData.paymentMethod },
                      })
                    }
                  />
                }
                label="Bank transfer (automatic)"
                sx={{ fontSize: '14px' }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.paymentMethod === 'Credit card (automatic)'}
                    onChange={(e) =>
                      handleInputChange({
                        target: { name: 'paymentMethod', value: e.target.checked ? 'Credit card (automatic)' : formData.paymentMethod },
                      })
                    }
                  />
                }
                label="Credit card (automatic)"
                sx={{ fontSize: '14px' }}
              />
            </FormControl>
          </Paper>
        </Grid>

        
      </Grid>
    </Box>
  );
};

export default Step3;

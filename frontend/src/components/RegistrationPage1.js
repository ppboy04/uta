import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  AppBar,
  Toolbar,
  IconButton,
  Alert,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';

const RegistrationPage1 = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    whatsappNumber: '',
    dateOfBirth: '',
    city: '',
    shirtSize: '',
    shortSize: '',
    foodPref: '',
    stayYorN: '',
    feePaid: 'No'
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.whatsappNumber.trim()) {
      newErrors.whatsappNumber = 'WhatsApp number is required';
    } else if (!/^[0-9]{10}$/.test(formData.whatsappNumber)) {
      newErrors.whatsappNumber = 'Please enter a valid 10-digit WhatsApp number';
    }
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.shirtSize) newErrors.shirtSize = 'Shirt size is required';
    if (!formData.shortSize) newErrors.shortSize = 'Short size is required';
    if (!formData.foodPref) newErrors.foodPref = 'Food preference is required';
    if (!formData.stayYorN) newErrors.stayYorN = 'Accommodation preference is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      // Store data in localStorage to pass to next page
      localStorage.setItem('registrationData', JSON.stringify(formData));
      navigate('/register/step2');
    }
  };

  const steps = ['Personal Details', 'Event Selection'];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)', color: 'white', py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <IconButton onClick={() => navigate('/')} sx={{ color: 'white' }}>
              <ArrowBack />
            </IconButton>
            <Box sx={{ textAlign: 'center', flex: 1 }}>
              <Typography variant="h3" gutterBottom>
                Player Registration
              </Typography>
              <Typography variant="h6">
                Step 1: Personal Details
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Progress Stepper */}
        <Box sx={{ mb: 4 }}>
          <Stepper activeStep={0} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Card>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom color="primary" textAlign="center">
              Personal Information
            </Typography>
            
            <Box component="form" onSubmit={(e) => e.preventDefault()}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={!!errors.name}
                    helperText={errors.name}
                    required
                    variant="outlined"
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="WhatsApp Number"
                    name="whatsappNumber"
                    value={formData.whatsappNumber}
                    onChange={handleChange}
                    error={!!errors.whatsappNumber}
                    helperText={errors.whatsappNumber}
                    required
                    variant="outlined"
                    inputProps={{ maxLength: 10 }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Date of Birth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    error={!!errors.dateOfBirth}
                    helperText={errors.dateOfBirth}
                    required
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    error={!!errors.city}
                    helperText={errors.city}
                    required
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required error={!!errors.shirtSize}>
                    <InputLabel>Shirt Size</InputLabel>
                    <Select
                      name="shirtSize"
                      value={formData.shirtSize}
                      onChange={handleChange}
                      label="Shirt Size"
                    >
                      <MenuItem value="XS">XS</MenuItem>
                      <MenuItem value="S">S</MenuItem>
                      <MenuItem value="M">M</MenuItem>
                      <MenuItem value="L">L</MenuItem>
                      <MenuItem value="XL">XL</MenuItem>
                      <MenuItem value="XXL">XXL</MenuItem>
                    </Select>
                    {errors.shirtSize && <Typography variant="caption" color="error">{errors.shirtSize}</Typography>}
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required error={!!errors.shortSize}>
                    <InputLabel>Short Size</InputLabel>
                    <Select
                      name="shortSize"
                      value={formData.shortSize}
                      onChange={handleChange}
                      label="Short Size"
                    >
                      <MenuItem value="XS">XS</MenuItem>
                      <MenuItem value="S">S</MenuItem>
                      <MenuItem value="M">M</MenuItem>
                      <MenuItem value="L">L</MenuItem>
                      <MenuItem value="XL">XL</MenuItem>
                      <MenuItem value="XXL">XXL</MenuItem>
                    </Select>
                    {errors.shortSize && <Typography variant="caption" color="error">{errors.shortSize}</Typography>}
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required error={!!errors.foodPref}>
                    <InputLabel>Food Preference</InputLabel>
                    <Select
                      name="foodPref"
                      value={formData.foodPref}
                      onChange={handleChange}
                      label="Food Preference"
                    >
                      <MenuItem value="Vegetarian">Vegetarian</MenuItem>
                      <MenuItem value="Non-Vegetarian">Non-Vegetarian</MenuItem>
                      <MenuItem value="Vegan">Vegan</MenuItem>
                      <MenuItem value="Jain">Jain</MenuItem>
                    </Select>
                    {errors.foodPref && <Typography variant="caption" color="error">{errors.foodPref}</Typography>}
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required error={!!errors.stayYorN}>
                    <InputLabel>Accommodation Required?</InputLabel>
                    <Select
                      name="stayYorN"
                      value={formData.stayYorN}
                      onChange={handleChange}
                      label="Accommodation Required?"
                    >
                      <MenuItem value="Yes">Yes, I need accommodation</MenuItem>
                      <MenuItem value="No">No, I'll arrange my own</MenuItem>
                    </Select>
                    {errors.stayYorN && <Typography variant="caption" color="error">{errors.stayYorN}</Typography>}
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Fee Payment Status</InputLabel>
                    <Select
                      name="feePaid"
                      value={formData.feePaid}
                      onChange={handleChange}
                      label="Fee Payment Status"
                    >
                      <MenuItem value="No">Not Paid</MenuItem>
                      <MenuItem value="Yes">Paid</MenuItem>
                      <MenuItem value="Partial">Partial Payment</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleNext}
                  endIcon={<ArrowForward />}
                  sx={{ px: 4, py: 1.5 }}
                >
                  Next: Select Events
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default RegistrationPage1;

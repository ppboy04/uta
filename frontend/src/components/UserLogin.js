import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Box,
  Alert,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Grid,
} from '@mui/material';
import {
  ArrowBack,
  Login,
  Phone,
  CalendarToday,
  PersonAdd,
  Security,
  Edit,
} from '@mui/icons-material';

const UserLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    whatsappNumber: '',
    dateOfBirth: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:5000/api/login', formData);
      
      // Store user data in localStorage
      localStorage.setItem('userData', JSON.stringify(response.data));
      
      // Navigate to user dashboard
      navigate('/user/dashboard');
      
    } catch (error) {
      console.error('Login error:', error);
      setMessage(error.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)', color: 'white', py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={() => navigate('/')} sx={{ color: 'white' }}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h3" sx={{ ml: 2 }}>
              Player Login
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h4" color="primary" gutterBottom textAlign="center">
                  Welcome Back, Player!
                </Typography>
                
                {message && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {message}
                  </Alert>
                )}
                
                <Box component="form" onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="WhatsApp Number"
                    name="whatsappNumber"
                    value={formData.whatsappNumber}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    InputProps={{ endAdornment: <Phone color="action" /> }}
                  />
                  
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Date of Birth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ endAdornment: <CalendarToday color="action" /> }}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={loading}
                    sx={{ mt: 2, py: 1.5 }}
                    endIcon={<Login />}
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Paper elevation={0} sx={{ textAlign: 'center', p: 2, background: 'transparent' }}>
              <Typography variant="body1" gutterBottom>
                Don't have an account?
              </Typography>
              <Button
                component={Link}
                to="/register"
                variant="outlined"
                color="secondary"
                startIcon={<PersonAdd />}
              >
                Register for Tournament
              </Button>
            </Paper>
          </Grid>
          
          <Grid item xs={12}>
            <Card sx={{ background: '#e3f2fd', p: 2 }}>
              <CardContent>
                <Typography variant="h5" color="primary" gutterBottom>
                  Login Instructions
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon><Security color="primary" /></ListItemIcon>
                    <ListItemText primary="Use your registered WhatsApp number and date of birth." />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><Edit color="primary" /></ListItemIcon>
                    <ListItemText primary="After login, you can view and edit your registration details." />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default UserLogin;

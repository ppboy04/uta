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
  AdminPanelSettings,
  Person,
  Lock,
  Dashboard,
  Analytics,
  EmojiEvents,
  Settings,
} from '@mui/icons-material';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
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
      const response = await axios.post('http://localhost:5000/api/admin/login', formData);
      
      // Store admin session
      localStorage.setItem('adminLoggedIn', 'true');
      
      // Navigate to admin dashboard
      navigate('/admin/dashboard');
      
    } catch (error) {
      console.error('Admin login error:', error);
      setMessage(error.response?.data?.error || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ background: 'linear-gradient(135deg, #dc3545 0%, #fd7e14 100%)', color: 'white', py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={() => navigate('/')} sx={{ color: 'white' }}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h3" sx={{ ml: 2 }}>
              Admin Portal
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <AdminPanelSettings sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h4" color="primary" gutterBottom>
                    Administrator Login
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Tournament Management Portal
                  </Typography>
                </Box>
                
                {message && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {message}
                  </Alert>
                )}
                
                <Box component="form" onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Admin Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    InputProps={{ endAdornment: <Person color="action" /> }}
                  />
                  
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    InputProps={{ endAdornment: <Lock color="action" /> }}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={loading}
                    sx={{ mt: 2, py: 1.5, bgcolor: '#dc3545', '&:hover': { bgcolor: '#c82333' } }}
                    endIcon={<AdminPanelSettings />}
                  >
                    {loading ? 'Logging in...' : 'Admin Login'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12}>
            <Card sx={{ background: '#fff3cd', border: '1px solid #ffeeba' }}>
              <CardContent>
                <Typography variant="h5" sx={{ color: '#856404' }} gutterBottom>
                  Admin Access Features
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon><Dashboard sx={{ color: '#856404' }} /></ListItemIcon>
                    <ListItemText primary="View all tournament registrations by event" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><Analytics sx={{ color: '#856404' }} /></ListItemIcon>
                    <ListItemText primary="Manage player rankings for each event" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><EmojiEvents sx={{ color: '#856404' }} /></ListItemIcon>
                    <ListItemText primary="Update tournament standings" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><Settings sx={{ color: '#856404' }} /></ListItemIcon>
                    <ListItemText primary="Export player and team data" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12}>
            <Paper sx={{ background: '#f8d7da', border: '1px solid #f5c6cb', p: 2, textAlign: 'center' }}>
              <Typography variant="body1" sx={{ color: '#721c24' }}>
                <strong>Demo Credentials:</strong> Username: admin, Password: uta2024
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AdminLogin;

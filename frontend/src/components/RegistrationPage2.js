import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Box,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';

const RegistrationPage2 = () => {
  const navigate = useNavigate();
  const [personalData, setPersonalData] = useState(null);
  const [events, setEvents] = useState([]);
  const [availablePartners, setAvailablePartners] = useState({});
  const [selectedEvents, setSelectedEvents] = useState([
    { eventName: '', partnerId: null },
    { eventName: '', partnerId: null }
  ]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [whatsappMessage, setWhatsappMessage] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Get personal data from localStorage
    const savedData = localStorage.getItem('registrationData');
    if (!savedData) {
      navigate('/register');
      return;
    }
    setPersonalData(JSON.parse(savedData));

    // Fetch available events
    fetchEvents();
  }, [navigate]);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      setMessage('Error loading events. Please try again.');
    }
  };

  const fetchPartnersForEvent = async (eventName, eventIndex) => {
    if (!eventName) return;
    
    try {
      const response = await axios.get(`http://localhost:5000/api/partners/${encodeURIComponent(eventName)}`);
      setAvailablePartners(prev => ({
        ...prev,
        [eventIndex]: response.data
      }));
    } catch (error) {
      console.error('Error fetching partners:', error);
    }
  };

  const handleEventChange = (eventIndex, eventName) => {
    const newSelectedEvents = [...selectedEvents];
    newSelectedEvents[eventIndex] = { eventName, partnerId: null };
    setSelectedEvents(newSelectedEvents);

    // Clear any existing error for this event
    if (errors[`event${eventIndex + 1}`]) {
      setErrors(prev => ({
        ...prev,
        [`event${eventIndex + 1}`]: ''
      }));
    }

    // Fetch partners for this event
    if (eventName) {
      fetchPartnersForEvent(eventName, eventIndex);
    }
  };

  const handlePartnerChange = (eventIndex, partnerId) => {
    const newSelectedEvents = [...selectedEvents];
    newSelectedEvents[eventIndex].partnerId = partnerId === 'null' ? null : parseInt(partnerId);
    setSelectedEvents(newSelectedEvents);
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Check if at least one event is selected
    const hasEvent1 = selectedEvents[0].eventName;
    const hasEvent2 = selectedEvents[1].eventName;
    
    if (!hasEvent1 && !hasEvent2) {
      newErrors.general = 'Please select at least one event';
    }

    // Check for duplicate events
    if (hasEvent1 && hasEvent2 && selectedEvents[0].eventName === selectedEvents[1].eventName) {
      newErrors.general = 'Cannot select the same event twice';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setMessage('');

    try {
      // Filter out empty events
      const validEvents = selectedEvents.filter(event => event.eventName);

      const registrationData = {
        ...personalData,
        events: validEvents
      };

      const response = await axios.post('http://localhost:5000/api/register', registrationData);
      
      setMessage('Registration successful! You can now login with your WhatsApp number and date of birth.');
      
      // Set WhatsApp group message if provided
      if (response.data.whatsappGroupMessage) {
        setWhatsappMessage(response.data.whatsappGroupMessage);
      }
      
      // Clear localStorage
      localStorage.removeItem('registrationData');
      
      // Redirect to login after 8 seconds (increased to allow time to read WhatsApp message)
      setTimeout(() => {
        navigate('/user/login');
      }, 8000);

    } catch (error) {
      console.error('Registration error:', error);
      setMessage(error.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!personalData) {
    return <div className="loading">Loading...</div>;
  }

  const steps = ['Personal Details', 'Event Selection'];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)', color: 'white', py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <IconButton onClick={() => navigate('/register')} sx={{ color: 'white' }}>
              <ArrowBack />
            </IconButton>
            <Box sx={{ textAlign: 'center', flex: 1 }}>
              <Typography variant="h3" gutterBottom>
                Player Registration
              </Typography>
              <Typography variant="h6">
                Step 2: Event Selection
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Progress Stepper */}
        <Box sx={{ mb: 4 }}>
          <Stepper activeStep={1} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            {/* Player Summary */}
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h4" gutterBottom color="primary">
                  Player Details
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1"><strong>Name:</strong> {personalData.name}</Typography>
                  <Typography variant="body1"><strong>WhatsApp:</strong> {personalData.whatsappNumber}</Typography>
                  <Typography variant="body1"><strong>City:</strong> {personalData.city}</Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card sx={{ background: '#e3f2fd' }}>
              <CardContent>
                <Typography variant="h5" gutterBottom color="primary">
                  Instructions:
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  • You can participate in maximum 2 events<br/>
                  • If your partner hasn't registered yet, select "Partner not registered yet"<br/>
                  • When your partner registers, they can select you from the dropdown<br/>
                  • Both players must be registered to form a complete pair<br/>
                  • You can login later to update your partner selection
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            {/* Event Selection */}
            <Card>
              <CardContent>
                <Typography variant="h4" gutterBottom color="primary">
                  Select Your Events
                </Typography>

                {message && (
                  <Alert severity={message.includes('successful') ? 'success' : 'error'} sx={{ mb: 2 }}>
                    {message}
                  </Alert>
                )}

                {whatsappMessage && (
                  <Alert 
                    severity="info" 
                    sx={{ mb: 2, backgroundColor: '#e8f5e8', border: '1px solid #4caf50' }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                      🎾 Join Our Tournament WhatsApp Group!
                    </Typography>
                    <Typography variant="body2">
                      {whatsappMessage}
                    </Typography>
                  </Alert>
                )}

                {errors.general && (
                  <Alert severity="error" sx={{ mb: 2 }}>{errors.general}</Alert>
                )}

                {selectedEvents.map((event, index) => (
                  <Box key={index} sx={{ mb: 3 }}>
                    <Typography variant="h6" color="text.primary" gutterBottom>
                      Event {index + 1} {index === 1 ? '(Optional)' : ''}
                    </Typography>
                    
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Select Event</InputLabel>
                      <Select
                        value={event.eventName}
                        onChange={(e) => handleEventChange(index, e.target.value)}
                        label="Select Event"
                      >
                        <MenuItem value="">Choose an event</MenuItem>
                        {events.map(ev => (
                          <MenuItem key={ev.id} value={ev.eventName}>
                            {ev.eventName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {event.eventName && (
                      <FormControl fullWidth>
                        <InputLabel>Select Partner</InputLabel>
                        <Select
                          value={event.partnerId || ''}
                          onChange={(e) => handlePartnerChange(index, e.target.value)}
                          label="Select Partner"
                        >
                          <MenuItem value="">Partner not registered yet</MenuItem>
                          {availablePartners[index]?.map(partner => (
                            <MenuItem key={partner.id} value={partner.id}>
                              {partner.name} ({partner.whatsappNumber})
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  </Box>
                ))}

                <Box sx={{ mt: 4, textAlign: 'center' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handleSubmit}
                    endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ArrowForward />}
                    disabled={loading}
                    fullWidth
                    sx={{ py: 1.5 }}
                  >
                    {loading ? 'Registering...' : 'Complete Registration'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default RegistrationPage2;

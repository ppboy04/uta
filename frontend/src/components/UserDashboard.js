import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
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
  IconButton,
  Alert,
  Paper,
  Divider,
  Chip,
  CardHeader,
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Save,
  Cancel,
  Logout,
  Person,
  Phone,
  LocationCity,
  Event,
  Group,
  Add,
  Delete,
  EmojiEvents,
  AccountCircle,
} from '@mui/icons-material';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [events, setEvents] = useState([]);
  const [availablePartners, setAvailablePartners] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const savedUserData = localStorage.getItem('userData');
    if (!savedUserData) {
      navigate('/user/login');
      return;
    }
    setUserData(JSON.parse(savedUserData));
    fetchEvents();
  }, [navigate]);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchPartnersForEvent = async (eventName, eventIndex) => {
    if (!eventName) return;
    try {
      const response = await axios.get(`http://localhost:5000/api/partners/${encodeURIComponent(eventName)}`);
      setAvailablePartners(prev => ({
        ...prev,
        [eventIndex]: response.data.filter(partner => partner.id !== userData.player.id)
      }));
    } catch (error) {
      console.error('Error fetching partners:', error);
    }
  };

  const handleEdit = () => {
    setEditMode(true);
    userData.events.forEach((event, index) => {
      if (event.eventName) {
        fetchPartnersForEvent(event.eventName, index);
      }
    });
  };

  const handlePlayerFieldChange = (field, value) => {
    setUserData(prev => ({
      ...prev,
      player: { ...prev.player, [field]: value }
    }));
  };

  const handleEventChange = (eventIndex, eventName) => {
    const newEvents = [...userData.events];
    if (eventIndex >= newEvents.length) {
      newEvents.push({ eventName, partnerId: null, partnerTableId: null });
    } else {
      newEvents[eventIndex] = { ...newEvents[eventIndex], eventName, partnerId: null };
    }
    setUserData(prev => ({ ...prev, events: newEvents }));
    if (eventName) {
      fetchPartnersForEvent(eventName, eventIndex);
    }
  };

  const handlePartnerChange = (eventIndex, partnerId) => {
    const newEvents = [...userData.events];
    newEvents[eventIndex].partnerId = partnerId === '' ? null : parseInt(partnerId);
    setUserData(prev => ({ ...prev, events: newEvents }));
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage('');
    try {
      const updateData = {
        ...userData.player,
        events: userData.events.filter(event => event.eventName)
      };
      await axios.put(`http://localhost:5000/api/player/${userData.player.id}`, updateData);
      setMessage('Profile updated successfully!');
      setEditMode(false);
    } catch (error) {
      console.error('Update error:', error);
      setMessage('Error updating profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userData');
    navigate('/');
  };

  const addNewEvent = () => {
    const newEvents = [...userData.events, { eventName: '', partnerId: null, partnerTableId: null }];
    setUserData(prev => ({ ...prev, events: newEvents }));
  };

  const removeEvent = (eventIndex) => {
    const newEvents = userData.events.filter((_, index) => index !== eventIndex);
    setUserData(prev => ({ ...prev, events: newEvents }));
  };

  const getPartnerName = (eventIndex, partnerId) => {
    if (!partnerId) return 'Partner not registered yet';
    const partner = availablePartners[eventIndex]?.find(p => p.id === partnerId);
    return partner ? `${partner.name} (${partner.whatsappNumber})` : 'Loading...';
  };

  if (!userData) {
    return <Box sx={{ textAlign: 'center', py: 4 }}>Loading...</Box>;
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)', color: 'white', py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton onClick={() => navigate('/')} sx={{ color: 'white' }}>
                <ArrowBack />
              </IconButton>
              <Typography variant="h3" sx={{ ml: 2 }}>
                Player Dashboard
              </Typography>
            </Box>
            <Button
              onClick={handleLogout}
              variant="outlined"
              sx={{ color: 'white', borderColor: 'white' }}
              startIcon={<Logout />}
            >
              Logout
            </Button>
          </Box>
          <Typography variant="h5" sx={{ mt: 2, opacity: 0.9 }}>
            Welcome back, {userData.player.name}!
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {message && (
          <Alert severity={message.includes('successfully') ? 'success' : 'error'} sx={{ mb: 3 }}>
            {message}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Personal Information Card */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardHeader
                avatar={<AccountCircle color="primary" sx={{ fontSize: 40 }} />}
                title="Personal Information"
                action={
                  !editMode ? (
                    <Button onClick={handleEdit} variant="outlined" startIcon={<Edit />}>
                      Edit Profile
                    </Button>
                  ) : (
                    <Box>
                      <Button
                        onClick={handleSave}
                        disabled={loading}
                        variant="contained"
                        startIcon={<Save />}
                        sx={{ mr: 1 }}
                      >
                        {loading ? 'Saving...' : 'Save'}
                      </Button>
                      <Button
                        onClick={() => setEditMode(false)}
                        variant="outlined"
                        startIcon={<Cancel />}
                      >
                        Cancel
                      </Button>
                    </Box>
                  )
                }
              />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={userData.player.name}
                      onChange={(e) => handlePlayerFieldChange('name', e.target.value)}
                      disabled={!editMode}
                      variant={editMode ? "outlined" : "filled"}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="WhatsApp Number"
                      value={userData.player.whatsappNumber}
                      disabled
                      variant="filled"
                      helperText="Cannot be changed"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Date of Birth"
                      value={userData.player.dateOfBirth}
                      disabled
                      variant="filled"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="City"
                      value={userData.player.city}
                      onChange={(e) => handlePlayerFieldChange('city', e.target.value)}
                      disabled={!editMode}
                      variant={editMode ? "outlined" : "filled"}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Shirt Size</InputLabel>
                      <Select
                        value={userData.player.shirtSize}
                        onChange={(e) => handlePlayerFieldChange('shirtSize', e.target.value)}
                        disabled={!editMode}
                        label="Shirt Size"
                      >
                        {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                          <MenuItem key={size} value={size}>{size}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Short Size</InputLabel>
                      <Select
                        value={userData.player.shortSize}
                        onChange={(e) => handlePlayerFieldChange('shortSize', e.target.value)}
                        disabled={!editMode}
                        label="Short Size"
                      >
                        {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                          <MenuItem key={size} value={size}>{size}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Food Preference</InputLabel>
                      <Select
                        value={userData.player.foodPref}
                        onChange={(e) => handlePlayerFieldChange('foodPref', e.target.value)}
                        disabled={!editMode}
                        label="Food Preference"
                      >
                        {['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Jain'].map(pref => (
                          <MenuItem key={pref} value={pref}>{pref}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Accommodation</InputLabel>
                      <Select
                        value={userData.player.stayYorN}
                        onChange={(e) => handlePlayerFieldChange('stayYorN', e.target.value)}
                        disabled={!editMode}
                        label="Accommodation"
                      >
                        <MenuItem value="Yes">Yes, I need accommodation</MenuItem>
                        <MenuItem value="No">No, I'll arrange my own</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Stats */}
          <Grid item xs={12} md={4}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Paper sx={{ p: 2, textAlign: 'center', background: '#e3f2fd' }}>
                  <EmojiEvents color="primary" sx={{ fontSize: 40 }} />
                  <Typography variant="h6" color="primary">
                    Registered Events
                  </Typography>
                  <Typography variant="h4">{userData.events.length}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper sx={{ p: 2, textAlign: 'center', background: userData.player.feePaid === 'Yes' ? '#e8f5e8' : '#fff3cd' }}>
                  <Typography variant="h6">Payment Status</Typography>
                  <Chip 
                    label={userData.player.feePaid} 
                    color={userData.player.feePaid === 'Yes' ? 'success' : 'warning'}
                    variant="outlined"
                  />
                </Paper>
              </Grid>
            </Grid>
          </Grid>

          {/* Tournament Events */}
          <Grid item xs={12}>
            <Card>
              <CardHeader
                avatar={<Event color="primary" sx={{ fontSize: 40 }} />}
                title="Tournament Events"
                action={
                  editMode && userData.events.length < 2 && (
                    <Button onClick={addNewEvent} variant="outlined" startIcon={<Add />}>
                      Add Event
                    </Button>
                  )
                }
              />
              <CardContent>
                {userData.events.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h6" color="text.secondary">
                      No events registered yet
                    </Typography>
                    {editMode && (
                      <Button onClick={addNewEvent} variant="contained" sx={{ mt: 2 }}>
                        Register for an Event
                      </Button>
                    )}
                  </Box>
                ) : (
                  <Grid container spacing={3}>
                    {userData.events.map((event, eventIndex) => (
                      <Grid item xs={12} md={6} key={eventIndex}>
                        <Paper sx={{ p: 2, border: '1px solid #e0e0e0' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6">Event {eventIndex + 1}</Typography>
                            {editMode && userData.events.length > 1 && (
                              <IconButton onClick={() => removeEvent(eventIndex)} color="error">
                                <Delete />
                              </IconButton>
                            )}
                          </Box>
                          
                          <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Event</InputLabel>
                            <Select
                              value={event.eventName}
                              onChange={(e) => handleEventChange(eventIndex, e.target.value)}
                              disabled={!editMode}
                              label="Event"
                            >
                              <MenuItem value="">Choose an event</MenuItem>
                              {events.map(ev => (
                                <MenuItem key={ev.id} value={ev.eventName}>
                                  {ev.eventName}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>

                          <FormControl fullWidth>
                            <InputLabel>Partner</InputLabel>
                            <Select
                              value={event.partnerId || ''}
                              onChange={(e) => handlePartnerChange(eventIndex, e.target.value)}
                              disabled={!editMode || !event.eventName}
                              label="Partner"
                            >
                              <MenuItem value="">Partner not registered yet</MenuItem>
                              {availablePartners[eventIndex]?.map(partner => (
                                <MenuItem key={partner.id} value={partner.id}>
                                  {partner.name} ({partner.whatsappNumber})
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default UserDashboard;

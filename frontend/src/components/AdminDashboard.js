import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  Alert,
  Paper,
  CardHeader,
  Grid,
  Chip,
} from '@mui/material';
import {
  ArrowBack,
  Logout,
  Visibility,
  Save,
  EmojiEvents,
  People,
  AdminPanelSettings,
  Analytics,
} from '@mui/icons-material';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [rankings, setRankings] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Check admin is logged in
    const isAdminLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isAdminLoggedIn) {
      navigate('/admin/login');
      return;
    }
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

  const fetchEventPairs = async (eventName) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/admin/event/${encodeURIComponent(eventName)}`);
      setRankings((prev) => ({
        ...prev,
        [eventName]: response.data
      }));
    } catch (error) {
      console.error('Error fetching event pairs:', error);
    }
  };

  const handleRankingChange = (eventName, pairId, ranking) => {
    const updatedRankings = rankings[eventName].map(pair => (
      pair.id === pairId ? { ...pair, ranking } : pair
    ));
    setRankings((prev) => ({
      ...prev,
      [eventName]: updatedRankings
    }));
  };

  const handleSaveRankings = async (eventName) => {
    setLoading(true);
    setMessage('');

    try {
      await axios.put('http://localhost:5000/api/admin/rankings', {
        rankings: rankings[eventName]
      });

      setMessage(`Rankings for ${eventName} saved successfully!`);
    } catch (error) {
      console.error('Error saving rankings:', error);
      setMessage('Error saving rankings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    navigate('/admin/login');
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ background: 'linear-gradient(135deg, #dc3545 0%, #fd7e14 100%)', color: 'white', py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton onClick={() => navigate('/')} sx={{ color: 'white' }}>
                <ArrowBack />
              </IconButton>
              <Typography variant="h3" sx={{ ml: 2 }}>
                Admin Dashboard
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
            Tournament Management Portal
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
          {/* Statistics Cards */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, textAlign: 'center', background: '#fff3cd' }}>
              <EmojiEvents sx={{ fontSize: 40, color: '#856404' }} />
              <Typography variant="h6" sx={{ color: '#856404' }}>Total Events</Typography>
              <Typography variant="h4">{events.length}</Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, textAlign: 'center', background: '#e3f2fd' }}>
              <People sx={{ fontSize: 40, color: 'primary.main' }} />
              <Typography variant="h6" color="primary">Active Pairs</Typography>
              <Typography variant="h4">
                {Object.values(rankings).reduce((total, pairs) => total + pairs.length, 0)}
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, textAlign: 'center', background: '#f8d7da' }}>
              <Analytics sx={{ fontSize: 40, color: '#721c24' }} />
              <Typography variant="h6" sx={{ color: '#721c24' }}>Ranked Pairs</Typography>
              <Typography variant="h4">
                {Object.values(rankings).reduce((total, pairs) => 
                  total + pairs.filter(pair => pair.ranking).length, 0
                )}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {events.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              Loading events...
            </Typography>
          </Box>
        ) : (
          events.map(event => (
            <Card key={event.id} sx={{ mb: 3 }}>
              <CardHeader
                avatar={<EmojiEvents color="primary" sx={{ fontSize: 40 }} />}
                title={event.eventName}
                subheader={`Tournament Category`}
                action={
                  <Button
                    onClick={() => fetchEventPairs(event.eventName)}
                    variant="outlined"
                    startIcon={<Visibility />}
                  >
                    View Participants
                  </Button>
                }
              />
              
              {rankings[event.eventName] && rankings[event.eventName].length > 0 && (
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Player Pairs & Rankings
                  </Typography>
                  
                  <TableContainer component={Paper} sx={{ mb: 2 }}>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ bgcolor: 'grey.100' }}>
                          <TableCell><strong>S.No.</strong></TableCell>
                          <TableCell><strong>Player 1</strong></TableCell>
                          <TableCell><strong>Player 2</strong></TableCell>
                          <TableCell><strong>Ranking</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rankings[event.eventName].map((pair, index) => (
                          <TableRow key={pair.id} hover>
                            <TableCell>
                              <Chip label={index + 1} color="primary" variant="outlined" />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body1">{pair.player1_name}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                ({pair.player1_phone})
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body1">{pair.player2_name}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                ({pair.player2_phone})
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <TextField
                                type="number"
                                value={pair.ranking || ''}
                                onChange={(e) => handleRankingChange(event.eventName, pair.id, parseInt(e.target.value, 10))}
                                size="small"
                                sx={{ width: 100 }}
                                placeholder="Rank"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Box sx={{ textAlign: 'center' }}>
                    <Button
                      onClick={() => handleSaveRankings(event.eventName)}
                      disabled={loading}
                      variant="contained"
                      color="success"
                      startIcon={<Save />}
                      size="large"
                    >
                      {loading ? 'Saving Rankings...' : 'Save Rankings'}
                    </Button>
                  </Box>
                </CardContent>
              )}
              
              {rankings[event.eventName] && rankings[event.eventName].length === 0 && (
                <CardContent>
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h6" color="text.secondary">
                      No complete pairs found for this event
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pairs will appear here when both players are registered
                    </Typography>
                  </Box>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </Container>
    </Box>
  );
};

export default AdminDashboard;

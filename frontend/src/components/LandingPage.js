import React from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Box,
  Chip,
  AppBar,
  Toolbar,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Sports,
  EmojiEvents,
  People,
  Security,
  Restaurant,
  LocalHospital,
  DirectionsCar,
  Videocam,
  Analytics,
  School,
  CardGiftcard,
  PhotoCamera,
  List as ListIcon,
  LocationOn,
  WhatsApp,
} from '@mui/icons-material';

const LandingPage = () => {
  const tournamentFeatures = [
    { icon: <Sports />, text: "Only Doubles Tournament - 5 Categories" },
    { icon: <People />, text: "Age Limit: 30 years minimum" },
    { icon: <EmojiEvents />, text: "Prize money: ₹21,000 (Winner), ₹11,000 (Runner-up)" },
    { icon: <School />, text: "Premium gear: T-Shirt, Shorts, Socks, Cap (₹3000+ value)" },
    { icon: <Security />, text: "Professional venue: Shanti Tennis Academy" },
    { icon: <Restaurant />, text: "Breakfast, Lunch & Gala Dinner included" },
    { icon: <LocalHospital />, text: "Double sharing accommodation available" },
    { icon: <DirectionsCar />, text: "4 hard courts + 4 additional courts nearby" },
    { icon: <Videocam />, text: "Head Tour balls for all matches" },
    { icon: <Analytics />, text: "Maximum 32 teams per category" },
    { icon: <CardGiftcard />, text: "Entry fee: ₹4,500 (2 events), ₹3,000 (1 event)" },
    { icon: <PhotoCamera />, text: "Tournament date: 9th December 2024" },
    { icon: <ListIcon />, text: "View Participants", button: true, link: 'https://tinyurl.com/UK2023ENTRIES' },
    { icon: <LocationOn />, text: "Venue: Shanti Tennis Academy", link: 'https://maps.app.goo.gl/fPLo9aK52WSihktY6' },
    { icon: <WhatsApp />, text: "Join WhatsApp Group", button: true, link: 'https://chat.whatsapp.com/JTvbjXSOolF7KI5ORr46DY' }
  ];

  const categories = [
    { 
      name: 'Category A (Open)', 
      description: 'Open category - No age restriction. Coaches allowed only in this category.',
      eligibility: 'All players (Coaches restricted to this category only)'
    },
    { 
      name: 'Category B (90+ combined)', 
      description: 'Combined age of both players must be 90+ years',
      eligibility: 'Combined age ≥ 90 years'
    },
    { 
      name: 'Category C (105+ combined)', 
      description: 'Combined age of both players must be 105+ years',
      eligibility: 'Combined age ≥ 105 years'
    },
    { 
      name: 'Category D (120+ combined)', 
      description: 'Combined age of both players must be 120+ years',
      eligibility: 'Combined age ≥ 120 years'
    },
    { 
      name: 'Lucky Doubles', 
      description: 'Special category for first-round losers. Pairing: One player ≤50 years + One player >50 years',
      eligibility: 'First round losers only'
    }
  ];

  const tournamentRules = [
    "Age calculated as running age on 9th December (e.g., turning 29 on 8th Dec = eligible as 30)",
    "Maximum 2 categories per player (Lucky Doubles can be 3rd)",
    "Coaches (earning via tennis coaching) allowed in Category A only",
    "Entry deadline: 7th December - NO EXTENSIONS",
    "Draws published: 8th December",
    "Walk-over given after 15 minutes delay",
    "Bring age proof documents",
    "Join WhatsApp group after registration"
  ];

  const prizeStructure = [
    { category: 'Regular Categories', winner: '₹21,000', runnerUp: '₹11,000', semiFinal: '₹4,000' },
    { category: 'Lucky Doubles', winner: '₹10,500', runnerUp: '₹5,500', semiFinal: '₹2,000' }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h1" gutterBottom>
            Uttaranchal Tennis Association
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
            Annual Doubles Tournament Registration 2024
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              component={Link}
              to="/register"
              variant="contained"
              color="secondary"
              size="large"
              sx={{ minWidth: 200 }}
            >
              Register Now
            </Button>
            <Button
              component={Link}
              to="/user/login"
              variant="outlined"
              sx={{ minWidth: 200, color: 'white', borderColor: 'white' }}
            >
              Player Login
            </Button>
            <Button
              component={Link}
              to="/admin/login"
              variant="outlined"
              sx={{ minWidth: 200, color: 'white', borderColor: 'white' }}
            >
              Admin Login
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Tournament Features */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h2" textAlign="center" gutterBottom>
            Tournament Features
          </Typography>
          <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 4 }}>
            Experience world-class tennis facilities and professional tournament management
          </Typography>
          
          <Grid container spacing={3}>
            {tournamentFeatures.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
                  <CardContent>
                    <Box sx={{ color: 'primary.main', mb: 2 }}>
                      {feature.icon}
                    </Box>
                    {feature.button ? (
                      <Button
                        variant="contained"
                        color="primary"
                        href={feature.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ mt: 1 }}
                      >
                        {feature.text}
                      </Button>
                    ) : feature.link ? (
                      <Typography variant="body1">
                        <a href={feature.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                          {feature.text}
                        </a>
                      </Typography>
                    ) : (
                      <Typography variant="body1">{feature.text}</Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Tournament Categories */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h2" textAlign="center" gutterBottom>
            Tournament Categories
          </Typography>
          <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 4 }}>
            Choose from 5 different categories - participate in up to 2 events
          </Typography>
          
          <Grid container spacing={3}>
            {categories.map((category, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    textAlign: 'left',
                    background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                    color: 'white',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      transition: 'transform 0.3s ease-in-out',
                    },
                    height: '100%'
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {category.name}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
                    {category.description}
                  </Typography>
                  <Chip 
                    label={category.eligibility} 
                    sx={{ 
                      backgroundColor: 'rgba(255,255,255,0.2)', 
                      color: 'white',
                      fontSize: '0.75rem'
                    }} 
                  />
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Additional Information */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h4" gutterBottom color="primary">
                  Registration Guidelines
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon><EmojiEvents color="primary" /></ListItemIcon>
                    <ListItemText primary="Maximum 2 events per player" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><People color="primary" /></ListItemIcon>
                    <ListItemText primary="Partner selection available" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><Analytics color="primary" /></ListItemIcon>
                    <ListItemText primary="Professional ranking system" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CardGiftcard color="primary" /></ListItemIcon>
                    <ListItemText primary="Early bird discounts available" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h4" gutterBottom color="primary">
                  Tournament Facilities
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon><Security color="primary" /></ListItemIcon>
                    <ListItemText primary="Professional umpires and officials" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><LocalHospital color="primary" /></ListItemIcon>
                    <ListItemText primary="Medical assistance on-site" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><Restaurant color="primary" /></ListItemIcon>
                    <ListItemText primary="Meals and refreshments provided" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><Videocam color="primary" /></ListItemIcon>
                    <ListItemText primary="Live streaming of matches" />
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

export default LandingPage;

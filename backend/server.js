const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { db, createTables } = require('./db/schema');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
createTables();

// Routes

// Get all events
app.get('/api/events', (req, res) => {
  db.all('SELECT * FROM tbl_eventName', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Player registration
app.post('/api/register', (req, res) => {
  const {
    name,
    whatsappNumber,
    dateOfBirth,
    city,
    shirtSize,
    shortSize,
    foodPref,
    stayYorN,
    feePaid,
    events
  } = req.body;

  // Insert player
  const playerQuery = `
    INSERT INTO tbl_players (name, whatsappNumber, dateOfBirth, city, shirtSize, shortSize, foodPref, stayYorN, feePaid)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(playerQuery, [name, whatsappNumber, dateOfBirth, city, shirtSize, shortSize, foodPref, stayYorN, feePaid], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        res.status(400).json({ error: 'WhatsApp number already registered' });
      } else {
        res.status(500).json({ error: err.message });
      }
      return;
    }

    const playerId = this.lastID;

    // Insert partner entries
    const partnerPromises = events.map(event => {
      return new Promise((resolve, reject) => {
        const partnerQuery = `
          INSERT INTO tbl_partners (eventName, userId, partnerId)
          VALUES (?, ?, ?)
        `;
        db.run(partnerQuery, [event.eventName, playerId, event.partnerId || null], function(err) {
          if (err) reject(err);
          else resolve();
        });
      });
    });

    Promise.all(partnerPromises)
      .then(() => {
        res.json({ 
          message: 'Registration successful', 
          playerId,
          whatsappGroupMessage: 'Please join our tournament WhatsApp group for updates and coordination. Click the WhatsApp button on the website to join!'
        });
      })
      .catch(err => {
        res.status(500).json({ error: err.message });
      });
  });
});

// Player login
app.post('/api/login', (req, res) => {
  const { whatsappNumber, dateOfBirth } = req.body;

  const query = `
    SELECT p.*, 
           GROUP_CONCAT(pt.eventName) as events,
           GROUP_CONCAT(pt.partnerId) as partnerIds,
           GROUP_CONCAT(pt.id) as partnerTableIds
    FROM tbl_players p
    LEFT JOIN tbl_partners pt ON p.id = pt.userId
    WHERE p.whatsappNumber = ? AND p.dateOfBirth = ?
    GROUP BY p.id
  `;

  db.get(query, [whatsappNumber, dateOfBirth], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Parse the concatenated data
    const events = row.events ? row.events.split(',') : [];
    const partnerIds = row.partnerIds ? row.partnerIds.split(',') : [];
    const partnerTableIds = row.partnerTableIds ? row.partnerTableIds.split(',') : [];

    const eventData = events.map((event, index) => ({
      eventName: event,
      partnerId: partnerIds[index] === 'null' ? null : parseInt(partnerIds[index]),
      partnerTableId: parseInt(partnerTableIds[index])
    }));

    res.json({
      player: {
        id: row.id,
        name: row.name,
        whatsappNumber: row.whatsappNumber,
        dateOfBirth: row.dateOfBirth,
        city: row.city,
        shirtSize: row.shirtSize,
        shortSize: row.shortSize,
        foodPref: row.foodPref,
        stayYorN: row.stayYorN,
        feePaid: row.feePaid
      },
      events: eventData
    });
  });
});

// Update player details
app.put('/api/player/:id', (req, res) => {
  const playerId = req.params.id;
  const {
    name,
    city,
    shirtSize,
    shortSize,
    foodPref,
    stayYorN,
    feePaid,
    events
  } = req.body;

  // Update player details
  const updatePlayerQuery = `
    UPDATE tbl_players 
    SET name = ?, city = ?, shirtSize = ?, shortSize = ?, foodPref = ?, stayYorN = ?, feePaid = ?
    WHERE id = ?
  `;

  db.run(updatePlayerQuery, [name, city, shirtSize, shortSize, foodPref, stayYorN, feePaid, playerId], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    // Update partner entries
    const updatePromises = events.map(event => {
      return new Promise((resolve, reject) => {
        if (event.partnerTableId) {
          // Update existing entry
          const updatePartnerQuery = `
            UPDATE tbl_partners 
            SET partnerId = ?
            WHERE id = ?
          `;
          db.run(updatePartnerQuery, [event.partnerId || null, event.partnerTableId], function(err) {
            if (err) reject(err);
            else resolve();
          });
        } else {
          // Insert new entry
          const insertPartnerQuery = `
            INSERT INTO tbl_partners (eventName, userId, partnerId)
            VALUES (?, ?, ?)
          `;
          db.run(insertPartnerQuery, [event.eventName, playerId, event.partnerId || null], function(err) {
            if (err) reject(err);
            else resolve();
          });
        }
      });
    });

    Promise.all(updatePromises)
      .then(() => {
        res.json({ message: 'Update successful' });
      })
      .catch(err => {
        res.status(500).json({ error: err.message });
      });
  });
});

// Get available partners for an event
app.get('/api/partners/:eventName', (req, res) => {
  const eventName = req.params.eventName;

  const query = `
    SELECT DISTINCT p.id, p.name, p.whatsappNumber
    FROM tbl_players p
    INNER JOIN tbl_partners pt ON p.id = pt.userId
    WHERE pt.eventName = ?
  `;

  db.all(query, [eventName], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Admin login (simple check - in production, use proper authentication)
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  
  // Simple admin credentials (in production, use proper authentication)
  if (username === 'admin' && password === 'uta2024') {
    res.json({ message: 'Admin login successful' });
  } else {
    res.status(401).json({ error: 'Invalid admin credentials' });
  }
});

// Get event pairs for admin
app.get('/api/admin/event/:eventName', (req, res) => {
  const eventName = req.params.eventName;

  const query = `
    SELECT 
      pt.id,
      p1.name as player1_name,
      p1.whatsappNumber as player1_phone,
      p2.name as player2_name,
      p2.whatsappNumber as player2_phone,
      pt.ranking
    FROM tbl_partners pt
    INNER JOIN tbl_players p1 ON pt.userId = p1.id
    LEFT JOIN tbl_players p2 ON pt.partnerId = p2.id
    WHERE pt.eventName = ? AND pt.partnerId IS NOT NULL
    ORDER BY pt.ranking ASC, p1.name ASC
  `;

  db.all(query, [eventName], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Update rankings
app.put('/api/admin/rankings', (req, res) => {
  const { rankings } = req.body;

  const updatePromises = rankings.map(ranking => {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE tbl_partners SET ranking = ? WHERE id = ?';
      db.run(query, [ranking.ranking, ranking.id], function(err) {
        if (err) reject(err);
        else resolve();
      });
    });
  });

  Promise.all(updatePromises)
    .then(() => {
      res.json({ message: 'Rankings updated successfully' });
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

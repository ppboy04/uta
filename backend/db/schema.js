const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database file path
const dbPath = path.join(__dirname, '../database.sqlite');

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Create tables
const createTables = () => {
  // Events table
  db.run(`
    CREATE TABLE IF NOT EXISTS tbl_eventName (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      eventName TEXT NOT NULL UNIQUE,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Players table
  db.run(`
    CREATE TABLE IF NOT EXISTS tbl_players (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      whatsappNumber TEXT NOT NULL UNIQUE,
      dateOfBirth DATE NOT NULL,
      city TEXT,
      shirtSize TEXT,
      shortSize TEXT,
      foodPref TEXT,
      stayYorN TEXT,
      feePaid TEXT DEFAULT 'No',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Partners table
  db.run(`
    CREATE TABLE IF NOT EXISTS tbl_partners (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      eventName TEXT NOT NULL,
      userId INTEGER NOT NULL,
      partnerId INTEGER,
      ranking INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES tbl_players(id),
      FOREIGN KEY (partnerId) REFERENCES tbl_players(id)
    )
  `);

  // Insert tournament categories
  db.run(`
    INSERT OR IGNORE INTO tbl_eventName (eventName, description) VALUES 
    ('Category A (Open)', 'Open category doubles - No age restriction'),
    ('Category B (90+ combined)', 'Combined age 90+ years doubles'),
    ('Category C (105+ combined)', 'Combined age 105+ years doubles'),
    ('Category D (120+ combined)', 'Combined age 120+ years doubles'),
    ('Lucky Doubles', 'Special category for first round losers')
  `);

  console.log('Database tables created successfully');
};

module.exports = { db, createTables };

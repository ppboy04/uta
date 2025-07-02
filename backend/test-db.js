const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database file path
const dbPath = path.join(__dirname, 'database.sqlite');

console.log('Database path:', dbPath);

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Check events table
db.all('SELECT * FROM tbl_eventName', (err, rows) => {
  if (err) {
    console.error('Error fetching events:', err);
  } else {
    console.log('Events in database:');
    console.log(rows);
  }
  
  // Close database connection
  db.close();
});

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create a new database object
const db = new sqlite3.Database(path.resolve(__dirname, 'tickets.db'), sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('Could not connect to database', err);
    } else {
        console.log('Connected to the SQLite database.');

        // Create Users table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE
        )`, (error) => {
            if (error) {
                console.error('Error creating users table:', error);
            } else {
                console.log('Users table created or already exists.');
            }
        });

        // Create Tickets table
        db.run(`CREATE TABLE IF NOT EXISTS tickets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            contactInfo TEXT NOT NULL,
            status TEXT DEFAULT 'pending',
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (error) => {
            if (error) {
                console.error('Error creating tickets table:', error);
            } else {
                console.log('Tickets table created or already exists.');
            }
        });
    }
});

// Export the database object
module.exports = db;

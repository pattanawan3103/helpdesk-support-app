const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database');
const ticketRoutes = require('./route/ticketRoutes'); 

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/', ticketRoutes); 

// Create a new ticket
app.post('/ticket', (req, res) => {
    const { title, description, contactInfo } = req.body;
    if (!title || !description || !contactInfo) {
        return res.status(400).json({ status: 'fail', error: 'Missing required fields.' });
    }

    const stmt = db.prepare('INSERT INTO tickets (title, description, contactInfo) VALUES (?, ?, ?)');
    stmt.run(title, description, contactInfo, function (err) {
        if (err) {
            return res.status(500).json({ status: 'fail', error: err.message });
        }
        res.status(201).json({ status: 'success', data: { id: this.lastID, title, description, contactInfo, status: 'pending' } });
    });
});

// Get all tickets
app.get('/tickets', (req, res) => {
    const sql = 'SELECT * FROM tickets';
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ tickets: rows });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.patch('/ticketlists/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, contactInfo, status, updatedAt } = req.body; // เอาข้อมูลที่ต้องการอัปเดต

    const sql = `UPDATE tickets SET title = ?, description = ?, contactInfo = ?, status = ?, updatedAt = ? WHERE id = ?`;
    
    db.run(sql, [title, description, contactInfo, status, updatedAt, id], function(err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Error updating ticket' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: "Ticket not found" });
        }
        res.status(200).json({ message: "Ticket updated successfully", id: id });
    });
});


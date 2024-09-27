const db = require('../database');

// สร้างตั๋วใหม่
const createTicket = (req, res) => {
    const { title, description, contactInfo } = req.body;
    if (!title || !description || !contactInfo) {
        return res.status(400).json({ error: 'ขาดฟิลด์ที่จำเป็น.' });
    }

    const stmt = db.prepare('INSERT INTO tickets (title, description, contactInfo, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)');
    stmt.run(title, description, contactInfo, 'pending', new Date(), new Date(), function(err) {
        if (err) {
            return res.status(500).json({ error: 'ไม่สามารถสร้างตั๋วได้.' });
        }
        res.status(201).json({ id: this.lastID, title, description, contactInfo, status: 'pending' });
    });
};

// ดึงตั๋วทั้งหมด
const getAllTickets = (req, res) => {
    const sql = 'SELECT * FROM tickets';
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'ไม่สามารถดึงตั๋วได้.' });
        }
        res.json(rows);
    });
};

// อัปเดตตั๋ว
const updateTicket = (req, res) => {
    const { id } = req.params;
    const { title, description, contactInfo, status } = req.body;

    // Ensure the SQL statement is a string
    const sql = 'UPDATE tickets SET title = ?, description = ?, contactInfo = ?, status = ?, updatedAt = ? WHERE id = ?';

    
    db.run(sql, [title, description, contactInfo, status, new Date(), id], function(err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Error updating ticket' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: "Ticket not found" });
        }
        res.status(200).json({ message: "Ticket updated successfully", id: id });
    });
};

// ดึงตั๋วตาม ID
const getTicketById = (req, res) => {
    const { id } = req.params;

    // ตรวจสอบว่า ID เป็นตัวเลขหรือไม่
    if (isNaN(id)) {
        return res.status(400).json({ error: 'ID ต้องเป็นตัวเลข.' });
    }

    db.get('SELECT * FROM tickets WHERE id = ?', [id], (err, row) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูล.' });
        }

        if (!row) {
            return res.status(404).json({ error: 'ไม่พบตั๋ว.' });
        }

        res.status(200).json(row);
    });
};

module.exports = {
    createTicket,
    getAllTickets,
    updateTicket,
    getTicketById,
};

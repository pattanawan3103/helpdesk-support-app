const express = require('express');
const ticketController = require('../controllers/ticketController');
const router = express.Router();

// เส้นทางจัดการตั๋ว
router.post('/tickets', ticketController.createTicket);
router.get('/tickets', ticketController.getAllTickets);
router.get('/tickets/:id', ticketController.getTicketById); // ใช้ /tickets/:id แทน /ticketlists/:id
router.put('/tickets/:id', ticketController.updateTicket);
router.delete('/tickets/:id', (req, res) => {
    res.status(403).json({ error: 'ไม่อนุญาตให้ลบตั๋ว.' });
});

module.exports = router;

const Ticket = require('../controllers/ticketController'); // สมมุติว่าคุณมีโมเดล Ticket

// ฟังก์ชันเพื่อดึงข้อมูลตั๋ว
async function getTickets() {
  try {
    const tickets = await Ticket.find(); // ใช้โมเดลที่เหมาะสมในการค้นหาตั๋ว
    return tickets;
  } catch (error) {
    throw new Error('Error fetching tickets');
  }
}

// ฟังก์ชันเพื่อสร้างตั๋วใหม่
async function createTicket(req, res) {
  const { title, description, contactInfo } = req.body;

  // ตรวจสอบว่ามีตั๋วที่มีชื่อเดียวกันอยู่ในระบบหรือไม่
  const existingTicket = await Ticket.findOne({ title, contactInfo });
  if (existingTicket) {
    return res.status(400).json({ error: 'Ticket with this title already exists.' });
  }

  // สร้างตั๋วใหม่
  const newTicket = new Ticket({
    title,
    description,
    contactInfo,
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await newTicket.save();
  res.status(201).json({ data: newTicket });
}

module.exports = {
  getTickets,
  createTicket,
};

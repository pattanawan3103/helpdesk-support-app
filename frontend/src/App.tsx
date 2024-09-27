import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import TicketForm from './components/TicketForm';
import TicketList from './components/TicketList';
import TicketService from './services';
import { Ticket } from './interfaces/ticket';
import KanbanBoard from './components/KanbanBoard';
import './App.css';

const App: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const data = await TicketService.GetTickets();
        if (Array.isArray(data)) {
          setTickets(data);
        } else {
          throw new Error("Invalid data format received from the server.");
        }
      } catch (error) {
        console.error("Failed to fetch tickets:", error);
        setError("Failed to fetch tickets. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const handleCreateTicket = async (newTicket: Ticket) => {
    const isDuplicate = tickets.some(ticket =>
      ticket.title === newTicket.title &&
      ticket.description === newTicket.description
    );

    if (isDuplicate) {
      setError('A ticket with the same title and description already exists.');
      return;
    }

    try {
      const response = await TicketService.CreateTicket(newTicket);
      if (response.status) {
        const createdTicket = { ...newTicket, id: response.message.id };
        setTickets(prevTickets => [...prevTickets, createdTicket]);
        setError(null);
      } else {
        setError(response.message || 'Failed to create ticket.');
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
      setError('An unexpected error occurred while creating the ticket.');
    }
  };

  const handleUpdateTicket = async (ticketId: string, updatedInfo: { title?: string; description?: string; status: string; }) => {
    const ticketToUpdate = tickets.find(ticket => ticket.id === ticketId);
  
    if (!ticketToUpdate) {
      console.error(`Ticket with ID ${ticketId} not found.`);
      return;
    }
  
    const updatedTicketData = {
      id: ticketId,
      status: updatedInfo.status,
      updatedAt: new Date().toISOString(),
      title: updatedInfo.title || ticketToUpdate.title,
      description: updatedInfo.description || ticketToUpdate.description,
      createdAt: ticketToUpdate.createdAt,
      contactInfo: ticketToUpdate.contactInfo
    };
  
    try {
      console.log('Updating ticket with data:', updatedTicketData);
      const response = await TicketService.UpdateTicket(ticketId, updatedTicketData);
      
      if (response.status) {
        setTickets(prevTickets =>
          prevTickets.map(ticket =>
            ticket.id === ticketId ? { ...ticket, ...updatedTicketData } : ticket
          )
        );
        console.log(`Ticket ${ticketId} updated successfully.`);
      } else {
        console.error('Failed to update ticket:', response.message);
      }
    } catch (error) {
      console.error('Error updating ticket:', error);
    }
  };

  return (
    <Router>
      <div className="container">
        <header>
          <h1>Support Ticket System</h1>
          <nav>
            <Link className="nav-link" to="/tickets">View Tickets</Link>
            <Link className="nav-link" to="/create">Create Ticket</Link>
            <Link className="nav-link" to="/kanban">Kanban Board</Link>
          </nav>
        </header>
        <main>
          {loading && <div>Loading...</div>}
          {error && <div className="error-message">{error}</div>}
          <Routes>
            <Route path="/tickets" element={<TicketList tickets={tickets} />} />
            <Route path="/create" element={<TicketForm onCreate={handleCreateTicket} />} />
            <Route path="/kanban" element={<KanbanBoard tickets={tickets} onUpdateTicket={handleUpdateTicket} />} />
          </Routes>
        </main>
        <footer>
          <p>&copy; 2024 Support Ticket System</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;

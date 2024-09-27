import React, { useState } from 'react';
import './TicketList.css';

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface TicketListProps {
  tickets: Ticket[];
}

const TicketList: React.FC<TicketListProps> = ({ tickets }) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<string>('latest');

  const filteredTickets = tickets.filter((ticket) => {
    if (statusFilter === 'all') return true;
    return ticket.status === statusFilter;
  });

  const sortedTickets = filteredTickets.sort((a, b) => {
    if (sortOrder === 'latest') {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    } else {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  return (
    <div className="ticket-list-container">
      <h5>Ticket List</h5>
      <div className="filter-sort-options">
        <select onChange={(e) => setStatusFilter(e.target.value)} value={statusFilter}>
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="resolved">Resolved</option>
          <option value="rejected">Rejected</option>
        </select>
        <select onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
          <option value="latest">Sort by Latest Update</option>
          <option value="created">Sort by Created Date</option>
        </select>
      </div>
      <ul className="ticket-list">
        {sortedTickets.length > 0 ? (
          sortedTickets.map(ticket => (
            <li key={ticket.id} className="ticket-list-item">
              <h2>{ticket.title}</h2>
              <p>{ticket.description}</p>
              <p>Status: <span className={`status status-${ticket.status}`}>{ticket.status}</span></p>
              <p>Last updated: {new Date(ticket.updatedAt).toLocaleString()}</p>
            </li>
          ))
        ) : (
          <li>No tickets found.</li>
        )}
      </ul>
    </div>
  );
};

export default TicketList;

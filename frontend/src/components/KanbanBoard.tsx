import React, { useState } from 'react'; 
import './KanbanBoard.css';

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface KanbanBoardProps {
  tickets: Ticket[];
  onUpdateTicket: (ticketId: string, updatedInfo: { title?: string; description?: string; status: string; }) => Promise<void>;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ tickets, onUpdateTicket }) => {
  const statuses = ['pending', 'accepted', 'resolved', 'rejected'];
  const [editingTicketId, setEditingTicketId] = useState<string | null>(null);
  const [updatedTitle, setUpdatedTitle] = useState<string>('');
  const [updatedDescription, setUpdatedDescription] = useState<string>('');
  const [updatedStatus, setUpdatedStatus] = useState<string>('');

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStatus: string) => {
    const ticketId = e.dataTransfer.getData('text/plain');
    onUpdateTicket(ticketId, { status: newStatus });
  };

  const startEditing = (ticket: Ticket) => {
    setEditingTicketId(ticket.id);
    setUpdatedTitle(ticket.title);
    setUpdatedDescription(ticket.description);
    setUpdatedStatus(ticket.status);
  };

  const handleUpdateSubmit = (e: React.FormEvent<HTMLFormElement>, ticketId: string) => {
    e.preventDefault();
    onUpdateTicket(ticketId, { title: updatedTitle, description: updatedDescription, status: updatedStatus });
    setEditingTicketId(null);
  };

  return (
    <div className="kanban-board">
      {statuses.map(status => (
        <div
          key={status}
          className={`kanban-column ${status}`}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, status)}
        >
          <h3>{status.charAt(0).toUpperCase() + status.slice(1)}</h3>
          <div className="ticket-list">
            {tickets
              .filter(ticket => ticket.status === status)
              .map(ticket => (
                <div key={ticket.id} className="ticket-item" draggable onDragStart={(e) => e.dataTransfer.setData('text/plain', ticket.id)}>
                  <h4>{ticket.title}</h4>
                  <p>{ticket.description}</p>
                  <p>Status: {ticket.status}</p>
                  <p>Last updated: {new Date(ticket.updatedAt).toLocaleString()}</p>

                  {editingTicketId === ticket.id ? (
                    <form onSubmit={(e) => handleUpdateSubmit(e, ticket.id)}>
                      <input
                        type="text"
                        value={updatedTitle}
                        onChange={(e) => setUpdatedTitle(e.target.value)}
                        placeholder="Title"
                        required
                      />
                      <textarea
                        value={updatedDescription}
                        onChange={(e) => setUpdatedDescription(e.target.value)}
                        placeholder="Description"
                        required
                      />
                      <select value={updatedStatus} onChange={(e) => setUpdatedStatus(e.target.value)} required>
                        {statuses.map(statusOption => (
                          <option key={statusOption} value={statusOption}>
                            {statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
                          </option>
                        ))}
                      </select>
                      <button type="submit" className="btn update">Update Ticket</button>
                      <button type="button" className="btn cancel" onClick={() => setEditingTicketId(null)}>Cancel</button>
                    </form>
                  ) : (
                    <button className="btn edit" onClick={() => startEditing(ticket)}>Edit</button>
                  )}
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;

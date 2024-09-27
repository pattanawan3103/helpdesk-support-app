import React, { useState } from 'react';
import TicketService from '../services/index';
import './TicketForm.css';
import { Ticket } from '../interfaces/ticket';

interface TicketFormProps {
  onCreate: (ticket: Ticket) => void;
}

const TicketForm: React.FC<TicketFormProps> = ({ onCreate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // เพิ่มสถานะการส่ง

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setter(e.target.value);
    if (error) {
      setError(''); // Reset error when user starts typing
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!title || !description || !contactInfo) {
        setError('All fields are required.');
        return;
    }

    // Check if contactInfo is a valid email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(contactInfo)) {
        setError('Please enter a valid email address.');
        return;
    }

    const newTicket: Ticket = {
        id: '',
        title,
        description,
        contactInfo,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    // Prevent multiple submissions
    if (isSubmitting) return;

    setIsSubmitting(true);
    console.log('Submitting Ticket:', newTicket);

    try {
        await onCreate(newTicket); // เรียกใช้งาน handleCreateTicket ที่ส่งมา
        setTitle('');
        setDescription('');
        setContactInfo('');
        setError('');
    } catch (error) {
        setError('An unexpected error occurred. Please try again later.');
        console.error('Error creating ticket:', error);
    } finally {
        setIsSubmitting(false);
    }
};

  

  return (
    <form className="ticket-form" onSubmit={handleSubmit}>
      <h5>Create a New Ticket</h5>
      {error && <div className="error-message">{error}</div>}
      <div className="form-group">
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={handleInputChange(setTitle)}
          required
        />
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea
          value={description}
          onChange={handleInputChange(setDescription)}
          required
        />
      </div>
      <div className="form-group">
        <label>Contact Info (Email)</label>
        <input
          type="email"
          value={contactInfo}
          onChange={handleInputChange(setContactInfo)}
          required
        />
      </div>
      <button type="submit" className="submit-button" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create Ticket'}
      </button>
    </form>
  );
};

export default TicketForm;

// src/components/dashboard/AdminEvents.jsx
import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    type: 'webinar',
    date: '',
    time: '',
    duration: 60,
    speaker: '',
    venue: 'Online',
    maxAttendees: 100,
    price: 0,
    isFree: true,
    status: 'upcoming'
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/admin/events');
      setEvents(res.data.data || []);
    } catch (err) {
      setEvents([
        { id: 1, title: 'Cybersecurity Webinar 2026', type: 'webinar', date: '2026-07-20', status: 'upcoming', registrations: 45, isFree: true, speaker: 'Dr. Ali' },
        { id: 2, title: 'Ethical Hacking Workshop', type: 'workshop', date: '2026-07-25', status: 'upcoming', registrations: 30, isFree: false, speaker: 'Sarah Khan' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/events', eventForm);
      setEvents([res.data.data, ...events]);
      setShowCreateModal(false);
      alert('✅ Event created successfully!');
    } catch (err) {
      alert('❌ Failed to create event');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!confirm('Delete this event?')) return;
    try {
      await api.delete(`/admin/events/${eventId}`);
      setEvents(events.filter(e => e.id !== eventId));
      alert('✅ Event deleted successfully!');
    } catch (err) {
      alert('❌ Failed to delete event');
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 100 }}>Loading...</div>;
  }

  return (
    <div style={{ padding: '40px 32px', maxWidth: 1200, margin: '0 auto', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#0f172a', margin: 0 }}>📅 Events</h1>
          <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>Manage all events</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} style={{
          padding: '10px 24px',
          background: '#6366f1',
          color: '#fff',
          border: 'none',
          borderRadius: 10,
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer'
        }}>
          + New Event
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 20 }}>
        {events.map((event) => (
          <div key={event.id} style={{ background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0', padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 32 }}>{event.type === 'webinar' ? '🎥' : event.type === 'workshop' ? '🔧' : '🏆'}</span>
              <span style={{ padding: '4px 12px', background: event.status === 'upcoming' ? '#dbeafe' : '#dcfce7', borderRadius: 20, fontSize: 11 }}>{event.status}</span>
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#0f172a', marginBottom: 4 }}>{event.title}</h3>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 8 }}>🎤 {event.speaker || 'TBD'}</p>
            <div style={{ display: 'flex', gap: 12, fontSize: 12, color: '#94a3b8', marginBottom: 12 }}>
              <span>📅 {event.date}</span>
              <span>👥 {event.registrations || 0}</span>
              <span>{event.isFree ? '🆓 Free' : `💰 $${event.price}`}</span>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button style={{ padding: '5px 14px', background: '#dbeafe', color: '#1d4ed8', border: 'none', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>✏️ Edit</button>
              <button onClick={() => handleDeleteEvent(event.id)} style={{ padding: '5px 14px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>🗑️ Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminEvents;
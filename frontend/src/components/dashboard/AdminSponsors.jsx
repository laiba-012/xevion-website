// src/components/dashboard/AdminSponsors.jsx
import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const AdminSponsors = () => {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [sponsorForm, setSponsorForm] = useState({
    name: '',
    logo: '',
    website: '',
    description: '',
    level: 'silver',
    isActive: true
  });

  useEffect(() => {
    fetchSponsors();
  }, []);

  const fetchSponsors = async () => {
    try {
      const res = await api.get('/admin/sponsors');
      setSponsors(res.data.data || []);
    } catch (err) {
      setSponsors([
        { id: 1, name: 'TechCorp', logo: '🏢', website: 'https://techcorp.com', level: 'platinum', isActive: true },
        { id: 2, name: 'CyberSec Solutions', logo: '🔒', website: 'https://cybersec.com', level: 'gold', isActive: true }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSponsor = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/sponsors', sponsorForm);
      setSponsors([res.data.data, ...sponsors]);
      setShowCreateModal(false);
      alert('✅ Sponsor added successfully!');
    } catch (err) {
      alert('❌ Failed to add sponsor');
    }
  };

  const handleDeleteSponsor = async (sponsorId) => {
    if (!confirm('Delete this sponsor?')) return;
    try {
      await api.delete(`/admin/sponsors/${sponsorId}`);
      setSponsors(sponsors.filter(s => s.id !== sponsorId));
      alert('✅ Sponsor deleted successfully!');
    } catch (err) {
      alert('❌ Failed to delete sponsor');
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 100 }}>Loading...</div>;
  }

  return (
    <div style={{ padding: '40px 32px', maxWidth: 1200, margin: '0 auto', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#0f172a', margin: 0 }}>🤝 Sponsors</h1>
          <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>Manage all sponsors</p>
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
          + Add Sponsor
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
        {sponsors.map((sponsor) => (
          <div key={sponsor.id} style={{ background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0', padding: 24, textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>{sponsor.logo || '🏢'}</div>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#0f172a' }}>{sponsor.name}</h3>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 8 }}>{sponsor.website}</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ padding: '4px 12px', background: sponsor.level === 'platinum' ? '#e5e7eb' : '#fef3c7', borderRadius: 20, fontSize: 11 }}>{sponsor.level}</span>
              <span style={{ padding: '4px 12px', background: sponsor.isActive ? '#dcfce7' : '#fee2e2', borderRadius: 20, fontSize: 11 }}>
                {sponsor.isActive ? '✅ Active' : '❌ Inactive'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
              <button style={{ padding: '5px 14px', background: '#dbeafe', color: '#1d4ed8', border: 'none', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>✏️ Edit</button>
              <button onClick={() => handleDeleteSponsor(sponsor.id)} style={{ padding: '5px 14px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>🗑️ Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSponsors;
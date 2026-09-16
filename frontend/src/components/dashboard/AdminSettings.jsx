// src/components/dashboard/AdminSettings.jsx
import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    siteName: 'Xevion',
    siteEmail: 'admin@xevion.com',
    siteDescription: 'Cybersecurity Learning Platform',
    twoFactorAuth: false,
    allowFreeCourses: true,
    defaultCurrency: 'USD',
    emailNotifications: true,
    pushNotifications: true
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/admin/settings');
      setSettings(res.data.data || settings);
    } catch (err) {
      console.error('Error fetching settings:', err);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      await api.put('/admin/settings', settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert('❌ Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: '40px 32px', maxWidth: 1200, margin: '0 auto', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#0f172a', margin: 0 }}>⚙️ Settings</h1>
        <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>Manage platform settings</p>
      </div>

      {success && (
        <div style={{ padding: '12px 20px', background: '#dcfce7', color: '#065f46', borderRadius: 8, marginBottom: 24 }}>
          ✅ Settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSaveSettings}>
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 32 }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: '#0f172a', marginBottom: 24 }}>⚙️ General Settings</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#334155', marginBottom: 6 }}>Site Name</label>
              <input type="text" value={settings.siteName} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14 }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#334155', marginBottom: 6 }}>Site Email</label>
              <input type="email" value={settings.siteEmail} onChange={(e) => setSettings({ ...settings, siteEmail: e.target.value })} style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14 }} />
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#334155', marginBottom: 6 }}>Site Description</label>
            <textarea value={settings.siteDescription} onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })} style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, minHeight: 80 }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" checked={settings.twoFactorAuth} onChange={(e) => setSettings({ ...settings, twoFactorAuth: e.target.checked })} />
                <span style={{ fontSize: 14 }}>Two-Factor Authentication</span>
              </label>
            </div>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" checked={settings.allowFreeCourses} onChange={(e) => setSettings({ ...settings, allowFreeCourses: e.target.checked })} />
                <span style={{ fontSize: 14 }}>Allow Free Courses</span>
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 32, paddingTop: 24, borderTop: '1px solid #e2e8f0' }}>
            <button type="submit" disabled={saving} style={{
              padding: '12px 32px',
              background: '#6366f1',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.7 : 1
            }}>
              {saving ? 'Saving...' : '💾 Save Settings'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../utils/api';
import {
  MdPhotoCamera,
  MdPerson,
  MdEmail,
  MdLock,
  MdPhone,
  MdEditNote,
  MdCheckCircle,
  MdErrorOutline,
  MdSecurity,
  MdDashboard,
  MdCloudUpload,
  MdLink,
  MdDeleteOutline,
  MdPalette,
  MdVerified,
  MdRefresh
} from 'react-icons/md';

// Preset cyber avatars for instant 1-click selection
const PRESET_AVATARS = [
  {
    id: 'cyber-1',
    name: 'Cyber Cadet',
    url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&q=80',
  },
  {
    id: 'cyber-2',
    name: 'Security Specialist',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80',
  },
  {
    id: 'cyber-3',
    name: 'Ethical Hacker',
    url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=300&q=80',
  },
  {
    id: 'cyber-4',
    name: 'Tech Engineer',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&q=80',
  },
  {
    id: 'cyber-5',
    name: 'Defense Analyst',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80',
  },
  {
    id: 'cyber-6',
    name: 'Cyber Sentinel',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80',
  },
  {
    id: 'cyber-7',
    name: 'AI Sentinel',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=XevionCyber',
  },
  {
    id: 'cyber-8',
    name: 'Matrix Agent',
    url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=CyberStudent',
  },
];

const UserProfile = ({ embedded = false, onBackToDashboard = null }) => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    phone: '',
    image: '',
  });

  // UI state
  const [showPresets, setShowPresets] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [statusMessage, setStatusMessage] = useState(null); // { type: 'success' | 'error', text: string }

  useEffect(() => {
    fetchProfile();
  }, []);

  const showToast = (type, text) => {
    setStatusMessage({ type, text });
    setTimeout(() => {
      setStatusMessage(null);
    }, 4500);
  };

  const fetchProfile = async () => {
    try {
      const response = await api.get('/users/profile');
      const data = response.data?.data || response.data?.user || response.data;
      if (data) {
        setProfile(data);
        setFormData({
          name: data.name || '',
          bio: data.bio || '',
          phone: data.phone || '',
          image: data.image || '',
        });
      }
    } catch (error) {
      console.warn('Backend profile fetch failed, falling back to session user:', error);
      // Fallback gracefully to AuthContext user or localStorage
      const storedUser = user || JSON.parse(localStorage.getItem('user') || '{}');
      if (storedUser) {
        setProfile(storedUser);
        setFormData({
          name: storedUser.name || '',
          bio: storedUser.bio || '',
          phone: storedUser.phone || '',
          image: storedUser.image || '',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle local file selection and upload
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 8MB)
    if (file.size > 8 * 1024 * 1024) {
      showToast('error', 'File size exceeds 8MB. Please choose a smaller image.');
      return;
    }

    // Live preview via FileReader
    const reader = new FileReader();
    reader.onload = (event) => {
      const previewUrl = event.target.result;
      setFormData((prev) => ({ ...prev, image: previewUrl }));
    };
    reader.readAsDataURL(file);

    // Upload immediately to backend avatar endpoint
    setUploadingAvatar(true);
    const uploadData = new FormData();
    uploadData.append('avatar', file);

    try {
      const res = await api.post('/users/profile/avatar', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data?.url || res.data?.data?.image) {
        const savedUrl = res.data.url || res.data.data.image;
        setFormData((prev) => ({ ...prev, image: savedUrl }));
        if (updateUser) {
          updateUser({ image: savedUrl });
        }
        showToast('success', 'Profile photo uploaded successfully!');
      }
    } catch (error) {
      console.warn('Avatar endpoint failed, preserving base64 preview:', error);
      showToast('success', 'Image preview loaded. Click "Save Changes" to apply.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Select preset avatar
  const handleSelectPreset = (url) => {
    setFormData((prev) => ({ ...prev, image: url }));
    setShowPresets(false);
    showToast('success', 'Preset avatar selected! Remember to save changes.');
  };

  // Apply custom URL
  const handleApplyCustomUrl = (e) => {
    e.preventDefault();
    if (!customUrl.trim()) return;
    setFormData((prev) => ({ ...prev, image: customUrl.trim() }));
    setCustomUrl('');
    setShowUrlInput(false);
    showToast('success', 'Custom image URL applied! Remember to save changes.');
  };

  // Remove photo
  const handleRemovePhoto = () => {
    setFormData((prev) => ({ ...prev, image: '' }));
    showToast('success', 'Photo removed. Displaying initial fallback.');
  };

  // Save changes
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('error', 'Full Name is required.');
      return;
    }

    setSaving(true);
    try {
      const response = await api.put('/users/profile', formData);
      const updated = response.data?.data || { ...profile, ...formData };
      
      setProfile(updated);
      if (updateUser) {
        updateUser(updated);
      }
      showToast('success', 'Profile & picture saved successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      // Fallback: save to client state and localStorage
      if (updateUser) {
        updateUser(formData);
      }
      setProfile((prev) => ({ ...prev, ...formData }));
      showToast('success', 'Profile changes saved to your session!');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: embedded ? '350px' : '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: embedded ? 'transparent' : '#070d18',
        color: '#e2e8f0',
        padding: embedded ? '40px 20px' : '120px 20px 60px'
      }}>
        <div style={{
          width: 48,
          height: 48,
          border: '3px solid rgba(0, 132, 255, 0.2)',
          borderTop: '3px solid #0084ff',
          borderRadius: '50%',
          animation: 'xvProfileSpin 0.8s linear infinite',
          boxShadow: '0 0 20px rgba(0, 132, 255, 0.4)'
        }} />
        <p style={{ color: '#64748b', marginTop: 18, fontSize: 14, fontFamily: 'JetBrains Mono, monospace' }}>
          INITIALIZING CYBER TERMINAL...
        </p>
        <style>{`
          @keyframes xvProfileSpin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  const activeImage = formData.image || profile?.image;
  const initial = (formData.name || profile?.name || 'U').charAt(0).toUpperCase();

  return (
    <div style={{
      minHeight: embedded ? 'auto' : '100vh',
      background: embedded ? 'transparent' : 'radial-gradient(circle at 50% 12%, rgba(0, 132, 255, 0.12) 0%, #070d18 70%)',
      padding: embedded ? '0 0 40px' : '110px 20px 80px',
      color: '#e2e8f0',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: embedded ? '100%' : 880, margin: '0 auto' }}>
        
        {/* Top Breadcrumb / Navigation */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20,
          flexWrap: 'wrap',
          gap: 12
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {onBackToDashboard ? (
              <button
                type="button"
                onClick={onBackToDashboard}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 14px',
                  background: 'rgba(0, 132, 255, 0.08)',
                  border: '1px solid rgba(0, 132, 255, 0.25)',
                  borderRadius: 8,
                  color: '#38bdf8',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0, 132, 255, 0.18)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0, 132, 255, 0.08)'}
              >
                <MdDashboard style={{ fontSize: 16 }} />
                <span>&larr; Back to Overview</span>
              </button>
            ) : !embedded ? (
              <Link
                to="/dashboard"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 14px',
                  background: 'rgba(0, 132, 255, 0.08)',
                  border: '1px solid rgba(0, 132, 255, 0.25)',
                  borderRadius: 8,
                  color: '#38bdf8',
                  fontSize: 13,
                  textDecoration: 'none',
                  fontWeight: 600,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0, 132, 255, 0.18)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0, 132, 255, 0.08)'}
              >
                <MdDashboard style={{ fontSize: 16 }} />
                <span>Student Dashboard</span>
              </Link>
            ) : null}
            {(!embedded || onBackToDashboard) && <span style={{ color: '#334155' }}>/</span>}
            <span style={{ color: '#94a3b8', fontSize: 13, fontFamily: 'JetBrains Mono, monospace' }}>
              PROFILE CONFIGURATION
            </span>
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 12px',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 20,
            fontSize: 12,
            color: '#10b981',
            fontWeight: 600,
            fontFamily: 'JetBrains Mono, monospace'
          }}>
            <span style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: '#10b981',
              boxShadow: '0 0 8px #10b981'
            }} />
            <span>SECURE SYSTEM ACTIVE</span>
          </div>
        </div>

        {/* Toast Status Alert */}
        {statusMessage && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '14px 20px',
            borderRadius: 12,
            marginBottom: 24,
            background: statusMessage.type === 'success' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
            border: `1px solid ${statusMessage.type === 'success' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
            color: statusMessage.type === 'success' ? '#34d399' : '#f87171',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
            animation: 'xvFadeIn 0.3s ease'
          }}>
            {statusMessage.type === 'success' ? (
              <MdCheckCircle style={{ fontSize: 20, flexShrink: 0 }} />
            ) : (
              <MdErrorOutline style={{ fontSize: 20, flexShrink: 0 }} />
            )}
            <span style={{ fontSize: 14, fontWeight: 500 }}>{statusMessage.text}</span>
          </div>
        )}

        {/* Main Card Container */}
        <div style={{
          background: 'rgba(10, 18, 36, 0.88)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 132, 255, 0.22)',
          borderRadius: 20,
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 35px rgba(0, 132, 255, 0.08)',
          overflow: 'hidden'
        }}>
          {/* Header Banner */}
          <div style={{
            padding: '24px 32px',
            borderBottom: '1px solid rgba(0, 132, 255, 0.15)',
            background: 'linear-gradient(90deg, rgba(0, 132, 255, 0.1) 0%, transparent 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16
          }}>
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                color: '#38bdf8',
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 1.5,
                textTransform: 'uppercase',
                fontFamily: 'JetBrains Mono, monospace',
                marginBottom: 4
              }}>
                <MdSecurity style={{ fontSize: 15 }} />
                <span>Identification Terminal</span>
              </div>
              <h1 style={{
                fontSize: 26,
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '-0.02em',
                margin: 0
              }}>
                Personal Profile & Avatar
              </h1>
              <p style={{ color: '#8baac8', fontSize: 14, margin: '6px 0 0' }}>
                Update your identity, upload a custom picture, and personalize your student profile.
              </p>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              borderRadius: 30,
              background: 'rgba(0, 132, 255, 0.12)',
              border: '1px solid rgba(0, 132, 255, 0.3)',
              color: '#38bdf8',
              fontSize: 12,
              fontWeight: 700,
              fontFamily: 'JetBrains Mono, monospace'
            }}>
              <MdVerified style={{ color: '#0084ff', fontSize: 16 }} />
              <span>{profile?.role ? profile.role.toUpperCase() : 'STUDENT'} CLEARANCE</span>
            </div>
          </div>

          <div style={{ padding: '36px 32px' }}>
            
            {/* AVATAR MANAGEMENT SECTION */}
            <div style={{
              padding: '28px',
              borderRadius: 16,
              background: 'rgba(5, 11, 22, 0.7)',
              border: '1px solid rgba(0, 132, 255, 0.18)',
              marginBottom: 36,
              boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.4)'
            }}>
              <div style={{
                fontSize: 12,
                fontWeight: 700,
                color: '#38bdf8',
                letterSpacing: 1.2,
                textTransform: 'uppercase',
                fontFamily: 'JetBrains Mono, monospace',
                marginBottom: 18,
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}>
                <MdPhotoCamera style={{ fontSize: 15 }} />
                <span>Profile Picture Customization</span>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 28,
                flexWrap: 'wrap'
              }}>
                
                {/* Large Interactive Avatar */}
                <div style={{ position: 'relative' }}>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    title="Click to change photo from device"
                    style={{
                      width: 108,
                      height: 108,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #0084ff, #0052cc)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: 42,
                      cursor: 'pointer',
                      boxShadow: '0 0 25px rgba(0, 132, 255, 0.35)',
                      border: '3px solid #0084ff',
                      overflow: 'hidden',
                      position: 'relative',
                      transition: 'all 0.25s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.03)';
                      e.currentTarget.style.boxShadow = '0 0 35px rgba(0, 132, 255, 0.6)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0 0 25px rgba(0, 132, 255, 0.35)';
                    }}
                  >
                    {activeImage ? (
                      <img
                        src={activeImage}
                        alt={formData.name || 'User Avatar'}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      initial
                    )}

                    {/* Camera hover badge overlay */}
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 36,
                      background: 'rgba(5, 11, 24, 0.75)',
                      backdropFilter: 'blur(4px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#38bdf8',
                      transition: 'all 0.2s'
                    }}>
                      <MdPhotoCamera style={{ fontSize: 18 }} />
                    </div>
                  </div>

                  {/* Hidden File Input for Direct Device Upload */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/png, image/jpeg, image/webp, image/gif"
                    style={{ display: 'none' }}
                  />
                </div>

                {/* Avatar Action Buttons */}
                <div style={{ flex: '1 1 300px' }}>
                  <div style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: '#ffffff',
                    marginBottom: 6
                  }}>
                    {formData.name || profile?.name || 'User Avatar'}
                  </div>
                  <p style={{
                    fontSize: 13,
                    color: '#8baac8',
                    marginBottom: 16,
                    lineHeight: 1.5
                  }}>
                    Upload an image from your computer, choose from high-tech avatar presets, or provide an image link.
                  </p>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    flexWrap: 'wrap'
                  }}>
                    {/* Upload from PC Button */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingAvatar}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '9px 18px',
                        background: 'linear-gradient(135deg, #0084ff, #0052cc)',
                        border: 'none',
                        borderRadius: 8,
                        color: '#ffffff',
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: uploadingAvatar ? 'wait' : 'pointer',
                        boxShadow: '0 0 16px rgba(0, 132, 255, 0.35)',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 0 24px rgba(0, 132, 255, 0.6)'}
                      onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 0 16px rgba(0, 132, 255, 0.35)'}
                    >
                      <MdCloudUpload style={{ fontSize: 16 }} />
                      <span>{uploadingAvatar ? 'Uploading...' : 'Upload Image'}</span>
                    </button>

                    {/* Presets Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setShowPresets(!showPresets);
                        setShowUrlInput(false);
                      }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '9px 16px',
                        background: showPresets ? 'rgba(0, 132, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                        border: `1px solid ${showPresets ? '#0084ff' : 'rgba(0, 132, 255, 0.25)'}`,
                        borderRadius: 8,
                        color: '#e2e8f0',
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0, 132, 255, 0.15)'}
                      onMouseLeave={(e) => {
                        if (!showPresets) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                      }}
                    >
                      <MdPalette style={{ fontSize: 16, color: '#38bdf8' }} />
                      <span>Preset Avatars</span>
                    </button>

                    {/* URL Input Toggle Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setShowUrlInput(!showUrlInput);
                        setShowPresets(false);
                      }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '9px 16px',
                        background: showUrlInput ? 'rgba(0, 132, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                        border: `1px solid ${showUrlInput ? '#0084ff' : 'rgba(0, 132, 255, 0.25)'}`,
                        borderRadius: 8,
                        color: '#e2e8f0',
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0, 132, 255, 0.15)'}
                      onMouseLeave={(e) => {
                        if (!showUrlInput) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                      }}
                    >
                      <MdLink style={{ fontSize: 16, color: '#38bdf8' }} />
                      <span>Image Link</span>
                    </button>

                    {/* Remove Photo */}
                    {activeImage && (
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        title="Remove custom photo"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '9px 14px',
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid rgba(239, 68, 68, 0.25)',
                          borderRadius: 8,
                          color: '#f87171',
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                      >
                        <MdDeleteOutline style={{ fontSize: 16 }} />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Preset Avatars Drawer */}
              {showPresets && (
                <div style={{
                  marginTop: 22,
                  padding: 18,
                  borderRadius: 12,
                  background: 'rgba(2, 6, 16, 0.9)',
                  border: '1px solid rgba(0, 132, 255, 0.3)',
                  animation: 'xvFadeIn 0.25s ease'
                }}>
                  <div style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#94a3b8',
                    marginBottom: 12,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span>SELECT A CYBER AVATAR:</span>
                    <span style={{ fontSize: 11, color: '#38bdf8' }}>Click to apply instantly</span>
                  </div>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                    gap: 12
                  }}>
                    {PRESET_AVATARS.map((preset) => {
                      const isSelected = formData.image === preset.url;
                      return (
                        <div
                          key={preset.id}
                          onClick={() => handleSelectPreset(preset.url)}
                          title={preset.name}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 6,
                            padding: 8,
                            borderRadius: 10,
                            background: isSelected ? 'rgba(0, 132, 255, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                            border: `2px solid ${isSelected ? '#0084ff' : 'transparent'}`,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.borderColor = '#38bdf8';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.borderColor = isSelected ? '#0084ff' : 'transparent';
                          }}
                        >
                          <img
                            src={preset.url}
                            alt={preset.name}
                            style={{
                              width: 52,
                              height: 52,
                              borderRadius: '50%',
                              objectFit: 'cover',
                              boxShadow: '0 0 10px rgba(0,0,0,0.5)'
                            }}
                          />
                          <span style={{
                            fontSize: 10,
                            color: isSelected ? '#38bdf8' : '#8baac8',
                            textAlign: 'center',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: 70
                          }}>
                            {preset.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* URL Input Form */}
              {showUrlInput && (
                <form
                  onSubmit={handleApplyCustomUrl}
                  style={{
                    marginTop: 20,
                    padding: 16,
                    borderRadius: 12,
                    background: 'rgba(2, 6, 16, 0.9)',
                    border: '1px solid rgba(0, 132, 255, 0.3)',
                    animation: 'xvFadeIn 0.25s ease'
                  }}
                >
                  <label style={{
                    display: 'block',
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#94a3b8',
                    marginBottom: 8
                  }}>
                    PASTE DIRECT IMAGE URL (JPG, PNG, WEBP, SVG):
                  </label>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <input
                      type="url"
                      value={customUrl}
                      onChange={(e) => setCustomUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/... or https://..."
                      style={{
                        flex: 1,
                        padding: '10px 14px',
                        background: 'rgba(10, 18, 36, 0.8)',
                        border: '1px solid rgba(0, 132, 255, 0.3)',
                        borderRadius: 8,
                        color: '#f8fafc',
                        fontSize: 13,
                        outline: 'none'
                      }}
                    />
                    <button
                      type="submit"
                      style={{
                        padding: '10px 20px',
                        background: '#0084ff',
                        border: 'none',
                        borderRadius: 8,
                        color: '#ffffff',
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Apply
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* EDITABLE PROFILE FORM */}
            <form onSubmit={handleUpdate}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: 24,
                marginBottom: 28
              }}>
                
                {/* Full Name */}
                <div>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#cbd5e1',
                    marginBottom: 8,
                    letterSpacing: 0.3
                  }}>
                    <MdPerson style={{ color: '#0084ff', fontSize: 16 }} />
                    <span>Full Name *</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your name"
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(5, 11, 24, 0.75)',
                        border: '1px solid rgba(0, 132, 255, 0.25)',
                        borderRadius: 10,
                        color: '#ffffff',
                        fontSize: 14,
                        outline: 'none',
                        transition: 'all 0.2s',
                        boxSizing: 'border-box'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#0084ff';
                        e.target.style.boxShadow = '0 0 14px rgba(0, 132, 255, 0.3)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(0, 132, 255, 0.25)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>

                {/* Email (Read-Only & Verified) */}
                <div>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#cbd5e1',
                    marginBottom: 8,
                    letterSpacing: 0.3
                  }}>
                    <MdEmail style={{ color: '#0084ff', fontSize: 16 }} />
                    <span>Email Address (Verified)</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      value={profile?.email || user?.email || ''}
                      disabled
                      style={{
                        width: '100%',
                        padding: '12px 42px 12px 16px',
                        background: 'rgba(5, 11, 24, 0.4)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: 10,
                        color: '#64748b',
                        fontSize: 14,
                        cursor: 'not-allowed',
                        boxSizing: 'border-box'
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      right: 14,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#10b981',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}>
                      <MdLock style={{ fontSize: 16 }} />
                    </div>
                  </div>
                  <span style={{ fontSize: 11, color: '#64748b', marginTop: 4, display: 'block' }}>
                    Security protected • Contact administration to update email
                  </span>
                </div>

                {/* Phone / Contact */}
                <div>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#cbd5e1',
                    marginBottom: 8,
                    letterSpacing: 0.3
                  }}>
                    <MdPhone style={{ color: '#0084ff', fontSize: 16 }} />
                    <span>Contact Phone (Optional)</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'rgba(5, 11, 24, 0.75)',
                      border: '1px solid rgba(0, 132, 255, 0.25)',
                      borderRadius: 10,
                      color: '#ffffff',
                      fontSize: 14,
                      outline: 'none',
                      transition: 'all 0.2s',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#0084ff';
                      e.target.style.boxShadow = '0 0 14px rgba(0, 132, 255, 0.3)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(0, 132, 255, 0.25)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* Role / Clearance */}
                <div>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#cbd5e1',
                    marginBottom: 8,
                    letterSpacing: 0.3
                  }}>
                    <MdSecurity style={{ color: '#0084ff', fontSize: 16 }} />
                    <span>Role & Security Level</span>
                  </label>
                  <div style={{
                    padding: '12px 16px',
                    background: 'rgba(5, 11, 24, 0.4)',
                    border: '1px solid rgba(0, 132, 255, 0.15)',
                    borderRadius: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxSizing: 'border-box'
                  }}>
                    <span style={{ color: '#38bdf8', fontWeight: 600, fontSize: 14 }}>
                      {profile?.role === 'admin' ? 'Security Administrator' : 
                       profile?.role === 'instructor' ? 'Lead Cyber Instructor' : 'Enrolled Student'}
                    </span>
                    <span style={{
                      padding: '3px 10px',
                      borderRadius: 12,
                      background: 'rgba(0, 132, 255, 0.15)',
                      color: '#0084ff',
                      fontSize: 11,
                      fontWeight: 700,
                      fontFamily: 'JetBrains Mono, monospace'
                    }}>
                      LEVEL 1 AUTHORIZED
                    </span>
                  </div>
                </div>

              </div>

              {/* Bio Field */}
              <div style={{ marginBottom: 32 }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 8
                }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#cbd5e1',
                    letterSpacing: 0.3
                  }}>
                    <MdEditNote style={{ color: '#0084ff', fontSize: 18 }} />
                    <span>Bio / Learning Goals</span>
                  </label>
                  <span style={{ fontSize: 12, color: '#64748b' }}>
                    {formData.bio.length} / 500 characters
                  </span>
                </div>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value.slice(0, 500) })}
                  rows={4}
                  placeholder="Share a short bio, your cybersecurity interests, certifications, or targets..."
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    background: 'rgba(5, 11, 24, 0.75)',
                    border: '1px solid rgba(0, 132, 255, 0.25)',
                    borderRadius: 10,
                    color: '#ffffff',
                    fontSize: 14,
                    outline: 'none',
                    lineHeight: 1.6,
                    resize: 'vertical',
                    boxSizing: 'border-box',
                    transition: 'all 0.2s'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#0084ff';
                    e.target.style.boxShadow = '0 0 14px rgba(0, 132, 255, 0.3)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(0, 132, 255, 0.25)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Form Action Controls */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                paddingTop: 24,
                borderTop: '1px solid rgba(0, 132, 255, 0.15)',
                flexWrap: 'wrap'
              }}>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '12px 32px',
                    background: saving ? '#475569' : 'linear-gradient(135deg, #0084ff, #0052cc)',
                    border: 'none',
                    borderRadius: 10,
                    color: '#ffffff',
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: saving ? 'not-allowed' : 'pointer',
                    boxShadow: '0 0 20px rgba(0, 132, 255, 0.4)',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (!saving) e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 132, 255, 0.7)';
                  }}
                  onMouseLeave={(e) => {
                    if (!saving) e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 132, 255, 0.4)';
                  }}
                >
                  {saving ? (
                    <>
                      <div style={{
                        width: 16,
                        height: 16,
                        border: '2px solid rgba(255,255,255,0.3)',
                        borderTop: '2px solid #fff',
                        borderRadius: '50%',
                        animation: 'xvProfileSpin 0.8s linear infinite'
                      }} />
                      <span>Saving Profile...</span>
                    </>
                  ) : (
                    <>
                      <MdCheckCircle style={{ fontSize: 18 }} />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => fetchProfile()}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '12px 22px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 10,
                    color: '#94a3b8',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.color = '#94a3b8';
                  }}
                >
                  <MdRefresh style={{ fontSize: 18 }} />
                  <span>Reset Form</span>
                </button>

                {onBackToDashboard ? (
                  <button
                    type="button"
                    onClick={onBackToDashboard}
                    style={{
                      marginLeft: 'auto',
                      background: 'none',
                      border: 'none',
                      color: '#38bdf8',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                    onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                  >
                    Return to Overview &rarr;
                  </button>
                ) : (
                  <Link
                    to="/dashboard"
                    style={{
                      marginLeft: 'auto',
                      color: '#38bdf8',
                      fontSize: 13,
                      textDecoration: 'none',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                    onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                  >
                    Return to Dashboard &rarr;
                  </Link>
                )}
              </div>

            </form>

          </div>
        </div>

      </div>

      <style>{`
        @keyframes xvProfileSpin {
          to { transform: rotate(360deg); }
        }
        @keyframes xvFadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default UserProfile;
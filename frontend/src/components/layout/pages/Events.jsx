import React, { useState } from 'react';

const TYPES = ['all', 'ctf', 'workshop', 'webinar', 'conference', 'hackathon', 'meetup'];

const staticEvents = [
  {
    _id: 1,
    title: "National CTF Championship 2024",
    type: "ctf",
    status: "upcoming",
    isVirtual: false,
    startDate: "2024-12-15T09:00:00",
    location: "Islamabad, Pakistan (Hybrid)",
    shortDescription: "The biggest CTF competition of the year. Open to all university students and professionals.",
    registrationUrl: "#"
  },
  {
    _id: 2,
    title: "Web Security Workshop",
    type: "workshop",
    status: "upcoming",
    isVirtual: true,
    startDate: "2024-11-20T14:00:00",
    location: "Online (Zoom)",
    shortDescription: "Learn web application security, OWASP Top 10, and how to find vulnerabilities.",
    registrationUrl: "#"
  },
  {
    _id: 3,
    title: "AI in Cybersecurity Webinar",
    type: "webinar",
    status: "ongoing",
    isVirtual: true,
    startDate: "2024-11-10T11:00:00",
    location: "Online (YouTube Live)",
    shortDescription: "Exploring how artificial intelligence is transforming security operations.",
    registrationUrl: "#"
  },
  {
    _id: 4,
    title: "Cybersecurity Conference 2024",
    type: "conference",
    status: "completed",
    isVirtual: false,
    startDate: "2024-10-05T09:00:00",
    location: "Lahore, Pakistan",
    shortDescription: "Annual cybersecurity conference with industry experts and hands-on sessions.",
    registrationUrl: null
  },
  {
    _id: 5,
    title: "Hackathon: Secure The Future",
    type: "hackathon",
    status: "upcoming",
    isVirtual: true,
    startDate: "2024-12-01T08:00:00",
    location: "Online (Global)",
    shortDescription: "48-hour hackathon to build innovative security solutions.",
    registrationUrl: "#"
  },
  {
    _id: 6,
    title: "Karachi Cyber Meetup",
    type: "meetup",
    status: "upcoming",
    isVirtual: false,
    startDate: "2024-11-25T18:00:00",
    location: "Karachi, Pakistan",
    shortDescription: "Monthly meetup for cybersecurity enthusiasts in Karachi.",
    registrationUrl: "#"
  }
];

const Events = () => {
  const [filter, setFilter] = useState('all');

  const filteredEvents = staticEvents.filter(event => {
    return filter === 'all' || event.type === filter;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <>
      {/* Hero Section */}
      <div style={{
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border)',
        padding: '80px 0 40px'
      }}>
        <div className="container" style={{
          maxWidth: 1200,
          margin: '0 auto',
          paddingLeft: 24,
          paddingRight: 24
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            color: 'var(--accent)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          }}>Community Events</span>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(36px, 5vw, 56px)',
            fontWeight: 700,
            marginTop: 12,
            marginBottom: 16,
            color: 'var(--text-primary)'
          }}>Events & CTFs</h1>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: 18,
            maxWidth: 600
          }}>Compete, learn, and connect through our cybersecurity events, CTF competitions, workshops and more.</p>
        </div>
      </div>

      {/* Main Content */}
      <section style={{ padding: '60px 0' }}>
        <div className="container" style={{
          maxWidth: 1200,
          margin: '0 auto',
          paddingLeft: 24,
          paddingRight: 24
        }}>
          {/* Filter Buttons */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 36 }}>
            {TYPES.map(t => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                style={{
                  padding: '8px 20px',
                  background: filter === t ? 'var(--accent)' : 'transparent',
                  border: filter === t ? 'none' : '1px solid var(--border)',
                  color: filter === t ? 'var(--bg-primary)' : 'var(--text-secondary)',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: filter === t ? 600 : 400
                }}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* Events Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: 24
          }}>
            {filteredEvents.map(event => (
              <EventCard key={event._id} event={event} formatDate={formatDate} />
            ))}
            {filteredEvents.length === 0 && (
              <p style={{ color: 'var(--text-muted)', gridColumn: '1/-1', textAlign: 'center', padding: 60 }}>
                No events found.
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

// Event Card Component
const EventCard = ({ event, formatDate }) => {
  const getStatusColor = () => {
    switch(event.status) {
      case 'upcoming': return '#0084ff';
      case 'ongoing': return '#ff8c00';
      case 'completed': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusLabel = () => {
    switch(event.status) {
      case 'upcoming': return 'Upcoming';
      case 'ongoing': return 'Ongoing';
      case 'completed': return 'Completed';
      default: return event.status;
    }
  };

  const getTypeColor = () => {
    switch(event.type) {
      case 'ctf': return '#0084ff';
      case 'workshop': return '#a78bfa';
      case 'webinar': return '#fbbf24';
      case 'conference': return '#ef4444';
      case 'hackathon': return '#10b981';
      case 'meetup': return '#f97316';
      default: return '#6b7280';
    }
  };

  return (
    <div style={{
      background: 'var(--bg-card)',
      borderRadius: 12,
      border: '1px solid var(--border)',
      overflow: 'hidden',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Badges */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
          <span style={{
            padding: '4px 10px',
            background: `rgba(${getTypeColor() === '#0084ff' ? '0,212,255' : 
                         getTypeColor() === '#a78bfa' ? '167,139,250' :
                         getTypeColor() === '#fbbf24' ? '251,191,36' :
                         getTypeColor() === '#ef4444' ? '239,68,68' :
                         getTypeColor() === '#10b981' ? '16,185,129' : '249,115,22'}, 0.1)`,
            color: getTypeColor(),
            borderRadius: 20,
            fontSize: 11,
            fontFamily: 'var(--font-mono)'
          }}>
            {event.type.toUpperCase()}
          </span>
          <span style={{
            padding: '4px 10px',
            background: `rgba(${getStatusColor() === '#0084ff' ? '0,212,255' :
                         getStatusColor() === '#ff8c00' ? '255,140,0' : '107,114,128'}, 0.1)`,
            color: getStatusColor(),
            borderRadius: 20,
            fontSize: 11
          }}>
            {getStatusLabel()}
          </span>
          {event.isVirtual && (
            <span style={{
              padding: '4px 10px',
              background: 'rgba(100, 116, 139,0.1)',
              color: '#a78bfa',
              borderRadius: 20,
              fontSize: 11
            }}>
              Virtual
            </span>
          )}
        </div>

        {/* Title */}
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 18,
          fontWeight: 600,
          marginBottom: 12,
          color: 'var(--text-primary)',
          lineHeight: 1.4
        }}>{event.title}</h3>

        {/* Description */}
        <p style={{
          fontSize: 14,
          color: 'var(--text-muted)',
          lineHeight: 1.6,
          marginBottom: 16,
          flex: 1
        }}>{event.shortDescription}</p>

        {/* Date & Location */}
        <div style={{
          fontSize: 13,
          color: 'var(--text-secondary)',
          marginBottom: 16,
          paddingBottom: 16,
          borderBottom: '1px solid var(--border)'
        }}>
          <div style={{ marginBottom: 4 }}>📅 {formatDate(event.startDate)}</div>
          <div>📍 {event.location}</div>
        </div>

        {/* Register Button */}
        {event.registrationUrl && event.status === 'upcoming' && (
          <a
            href={event.registrationUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px 20px',
              background: 'var(--accent)',
              color: 'var(--bg-primary)',
              textDecoration: 'none',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600
            }}
          >
            Register Now →
          </a>
        )}
      </div>
    </div>
  );
};

export default Events;
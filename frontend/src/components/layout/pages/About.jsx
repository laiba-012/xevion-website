import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
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
          }}>About Xevion</span>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(36px, 5vw, 56px)',
            fontWeight: 700,
            marginTop: 12,
            marginBottom: 16,
            color: 'var(--text-primary)'
          }}>Who We Are</h1>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: 18,
            maxWidth: 600
          }}>A global community dedicated to cybersecurity education, programming, and AI innovation.</p>
        </div>
      </div>

      {/* Main Content */}
      <section style={{ padding: '80px 0' }}>
        <div className="container" style={{
          maxWidth: 1200,
          margin: '0 auto',
          paddingLeft: 24,
          paddingRight: 24
        }}>
          {/* Mission and Vision */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 32,
            marginBottom: 64
          }}>
            <div>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                color: 'var(--accent)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}>Our Mission</span>
              <h2 style={{
                fontSize: 28,
                fontFamily: 'var(--font-display)',
                marginBottom: 16,
                marginTop: 8,
                color: 'var(--text-primary)'
              }}>Educate. Protect. Empower.</h2>
              <p style={{
                color: 'var(--text-secondary)',
                lineHeight: 1.8
              }}>Xevion was founded to bridge the gap between cybersecurity theory and real-world application. We provide free, high-quality education to individuals who want to protect themselves, their organizations, and contribute to a safer digital ecosystem.</p>
            </div>
            <div>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                color: 'var(--accent)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}>Our Vision</span>
              <h2 style={{
                fontSize: 28,
                fontFamily: 'var(--font-display)',
                marginBottom: 16,
                marginTop: 8,
                color: 'var(--text-primary)'
              }}>A Safer Digital World</h2>
              <p style={{
                color: 'var(--text-secondary)',
                lineHeight: 1.8
              }}>We envision a world where cybersecurity knowledge is accessible to everyone — from students in schools to professionals in enterprise environments. Every person who learns to protect themselves makes the internet safer for all.</p>
            </div>
          </div>

          {/* Core Values */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 24
          }}>
            {[
              ['Transparency', 'We operate openly, sharing our processes and results with the community.'],
              ['Collaboration', 'We believe the best security solutions come from working together.'],
              ['Accessibility', 'Security education should be free and available to everyone.'],
              ['Innovation', 'We embrace new technologies and approaches to stay ahead of threats.']
            ].map(([title, desc]) => (
              <div key={title} style={{
                background: 'var(--bg-card)',
                borderRadius: 12,
                border: '1px solid var(--border)',
                padding: 24,
                transition: 'transform 0.3s'
              }}>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  color: 'var(--accent)',
                  marginBottom: 8,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em'
                }}>Core Value</div>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 18,
                  fontWeight: 600,
                  marginBottom: 10,
                  color: 'var(--text-primary)'
                }}>{title}</h3>
                <p style={{
                  fontSize: 14,
                  color: 'var(--text-muted)',
                  lineHeight: 1.6
                }}>{desc}</p>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div style={{ textAlign: 'center', marginTop: 64 }}>
            <Link to="/get-involved" style={{
              display: 'inline-block',
              padding: '14px 32px',
              background: 'var(--accent)',
              color: 'var(--bg-primary)',
              textDecoration: 'none',
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 600,
              transition: 'all 0.3s'
            }}>
              Join Our Community →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdWorkspacePremium, MdEmojiEvents, MdBolt, MdMilitaryTech, MdGroups, MdEmail } from 'react-icons/md';

// ============================================
// SPONSOR TIERS WITH UNIQUE COLORS
// ============================================

const SPONSOR_TIERS = [
  { 
    id: 'platinum', 
    label: 'PLATINUM', 
    icon: <MdWorkspacePremium style={{ fontSize: 22, color: '#111' }} />,
    gradient: 'linear-gradient(135deg, #e8e8e8, #b8b8b8, #e8e8e8)',
    bgGradient: 'linear-gradient(135deg, rgba(232,232,232,0.15), rgba(184,184,184,0.05))',
    borderColor: '#e8e8e8',
    textColor: '#e8e8e8',
    badgeColor: '#c0c0c0'
  },
  { 
    id: 'gold', 
    label: 'GOLD', 
    icon: <MdEmojiEvents style={{ fontSize: 22, color: '#111' }} />,
    gradient: 'linear-gradient(135deg, #ffd700, #ff8c00, #ffd700)',
    bgGradient: 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,140,0,0.05))',
    borderColor: '#ffd700',
    textColor: '#ffd700',
    badgeColor: '#ffd700'
  },
  { 
    id: 'silver', 
    label: 'SILVER', 
    icon: <MdBolt style={{ fontSize: 22, color: '#111' }} />,
    gradient: 'linear-gradient(135deg, #c0c0c0, #808080, #c0c0c0)',
    bgGradient: 'linear-gradient(135deg, rgba(192,192,192,0.15), rgba(128,128,128,0.05))',
    borderColor: '#c0c0c0',
    textColor: '#c0c0c0',
    badgeColor: '#a0a0a0'
  },
  { 
    id: 'bronze', 
    label: 'BRONZE', 
    icon: <MdMilitaryTech style={{ fontSize: 22, color: '#fff' }} />,
    gradient: 'linear-gradient(135deg, #cd7f32, #8b4513, #cd7f32)',
    bgGradient: 'linear-gradient(135deg, rgba(205,127,50,0.15), rgba(139,69,19,0.05))',
    borderColor: '#cd7f32',
    textColor: '#cd7f32',
    badgeColor: '#cd7f32'
  },
  { 
    id: 'community', 
    label: 'COMMUNITY', 
    icon: <MdGroups style={{ fontSize: 22, color: '#fff' }} />,
    gradient: 'linear-gradient(135deg, #6366f1, #4f46e5, #6366f1)',
    bgGradient: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(79,70,229,0.05))',
    borderColor: '#6366f1',
    textColor: '#6366f1',
    badgeColor: '#818cf8'
  }
];

// ============================================
// SPONSORS DATA
// ============================================

const SPONSORS_DATA = [
  // Platinum Sponsors
  {
    id: 1,
    name: "TechCorp International",
    tier: "platinum",
    website: "#",
    logo: null,
    description: "Leading technology solutions provider committed to cybersecurity innovation.",
    founded: "2010",
    type: "Enterprise"
  },
  {
    id: 2,
    name: "SecureNet Solutions",
    tier: "platinum",
    website: "#",
    logo: null,
    description: "Enterprise security solutions for global organizations protecting millions of users.",
    founded: "2015",
    type: "Enterprise"
  },
  
  // Gold Sponsors
  {
    id: 3,
    name: "CyberDefense Systems",
    tier: "gold",
    website: "#",
    logo: null,
    description: "Advanced threat detection and response platforms powered by AI.",
    founded: "2018",
    type: "Corporate"
  },
  {
    id: 4,
    name: "DataShield Corp",
    tier: "gold",
    website: "#",
    logo: null,
    description: "Protecting data across cloud and on-premise environments worldwide.",
    founded: "2012",
    type: "Corporate"
  },
  {
    id: 5,
    name: "InfoSec Academy",
    tier: "gold",
    website: "#",
    logo: null,
    description: "Training the next generation of security professionals.",
    founded: "2016",
    type: "Education"
  },
  
  // Silver Sponsors
  {
    id: 6,
    name: "CloudSecure Technologies",
    tier: "silver",
    website: "#",
    logo: null,
    description: "Cloud-native security solutions for modern enterprises.",
    founded: "2019",
    type: "Startup"
  },
  {
    id: 7,
    name: "PenTest Labs",
    tier: "silver",
    website: "#",
    logo: null,
    description: "Professional penetration testing and security assessment services.",
    founded: "2017",
    type: "Consulting"
  },
  
  // Bronze Sponsors
  {
    id: 8,
    name: "SecurityFirst Consulting",
    tier: "bronze",
    website: "#",
    logo: null,
    description: "Cybersecurity consulting and compliance services.",
    founded: "2020",
    type: "Consulting"
  },
  {
    id: 9,
    name: "RedTeam Security",
    tier: "bronze",
    website: "#",
    logo: null,
    description: "Red teaming and adversary simulation experts.",
    founded: "2021",
    type: "Startup"
  },
  
  // Community Sponsors
  {
    id: 10,
    name: "OpenSec Initiative",
    tier: "community",
    website: "#",
    logo: null,
    description: "Promoting open-source security tools and education.",
    founded: "2019",
    type: "Non-profit"
  },
  {
    id: 11,
    name: "Women in Cyber",
    tier: "community",
    website: "#",
    logo: null,
    description: "Empowering women in cybersecurity careers globally.",
    founded: "2018",
    type: "Non-profit"
  },
  {
    id: 12,
    name: "CyberPeace Alliance",
    tier: "community",
    website: "#",
    logo: null,
    description: "Building a safer internet through collaboration.",
    founded: "2020",
    type: "Non-profit"
  }
];

// ============================================
// MAIN COMPONENT
// ============================================

const Sponsors = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredTier, setHoveredTier] = useState(null);

  // Group sponsors by tier
  const groupedSponsors = SPONSOR_TIERS.reduce((acc, tier) => {
    acc[tier.id] = SPONSORS_DATA.filter(s => s.tier === tier.id);
    return acc;
  }, {});

  const getTierStyle = (tierId) => {
    return SPONSOR_TIERS.find(t => t.id === tierId);
  };

  return (
    <>
      {/* Hero Section */}
      <div style={styles.hero}>
        <div style={styles.heroContainer}>
          <span style={styles.heroBadge}>Support Xevion</span>
          <h1 style={styles.heroTitle}>Sponsors & Partners</h1>
          <p style={styles.heroDesc}>
            Organizations and individuals who believe in our mission to democratize cybersecurity education.
          </p>
        </div>
      </div>

      {/* Main Section */}
      <section style={styles.section}>
        <div style={styles.container}>
          
          {/* Sponsors by Tier */}
          {SPONSOR_TIERS.map(tier => {
            const sponsors = groupedSponsors[tier.id];
            if (sponsors.length === 0) return null;
            
            const isHovered = hoveredTier === tier.id;
            
            return (
              <div 
                key={tier.id} 
                style={{
                  ...styles.tierSection,
                  background: isHovered ? tier.bgGradient : 'transparent',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={() => setHoveredTier(tier.id)}
                onMouseLeave={() => setHoveredTier(null)}
              >
                {/* Tier Header with Unique Design */}
                <div style={styles.tierHeader}>
                  <div style={{
                    ...styles.tierIcon,
                    background: tier.gradient,
                    boxShadow: `0 0 20px ${tier.borderColor}40`
                  }}>
                    {tier.icon}
                  </div>
                  <div style={styles.tierInfo}>
                    <h2 style={{
                      ...styles.tierLabel,
                      color: tier.textColor,
                      background: tier.bgGradient,
                      border: `1px solid ${tier.borderColor}40`
                    }}>
                      {tier.label}
                    </h2>
                    <div style={styles.tierStats}>
                      <span style={styles.tierCount}>{sponsors.length} Partners</span>
                    </div>
                  </div>
                  <div style={styles.tierLine}>
                    <span style={{
                      ...styles.tierLineGlow,
                      background: tier.gradient
                    }} />
                  </div>
                </div>
                
                {/* Sponsors Grid */}
                <div style={styles.grid}>
                  {sponsors.map(sponsor => (
                    <SponsorCard
                      key={sponsor.id}
                      sponsor={sponsor}
                      tier={tier}
                      isHovered={hoveredCard === sponsor.id}
                      onHover={() => setHoveredCard(sponsor.id)}
                      onLeave={() => setHoveredCard(null)}
                    />
                  ))}
                </div>
              </div>
            );
          })}

          {/* CTA Section */}
          <div style={styles.ctaSection}>
            <div style={styles.ctaContent}>
              <span style={styles.ctaBadge}>Join Our Mission</span>
              <h2 style={styles.ctaTitle}>Become a Sponsor</h2>
              <p style={styles.ctaDesc}>
                Support cybersecurity education and gain visibility in our growing community 
                of security professionals and enthusiasts.
              </p>
              <div style={styles.ctaButtons}>
                <Link to="/contact" style={styles.btnPrimary}>
                  <span>Get in Touch</span>
                  <span style={styles.btnArrow}>→</span>
                </Link>
                <a href="mailto:sponsors@xevion.io" style={{ ...styles.btnSecondary, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <MdEmail style={{ fontSize: 18, color: '#38bdf8' }} /> sponsors@xevion.io
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

// ============================================
// SPONSOR CARD COMPONENT
// ============================================

const SponsorCard = ({ sponsor, tier, isHovered, onHover, onLeave }) => {
  const getInitials = (name) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <a
      href={sponsor.website}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{
        ...styles.card,
        borderColor: isHovered ? tier.borderColor : 'var(--border)',
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
        boxShadow: isHovered ? `0 20px 40px -12px ${tier.borderColor}40` : 'none'
      }}
    >
      {/* Logo / Placeholder */}
      <div style={{
        ...styles.logoContainer,
        background: tier.bgGradient,
        border: `2px solid ${tier.borderColor}30`
      }}>
        {sponsor.logo ? (
          <img src={sponsor.logo} alt={sponsor.name} style={styles.logoImage} />
        ) : (
          <span style={{
            ...styles.logoPlaceholder,
            color: tier.textColor,
            background: `linear-gradient(135deg, ${tier.textColor}20, transparent)`
          }}>
            {getInitials(sponsor.name)}
          </span>
        )}
      </div>
      
      {/* Sponsor Info */}
      <div style={styles.cardContent}>
        <h3 style={styles.sponsorName}>{sponsor.name}</h3>
        <div style={styles.sponsorMeta}>
          <span style={{
            ...styles.sponsorType,
            background: tier.bgGradient,
            color: tier.textColor
          }}>
            {sponsor.type}
          </span>
          <span style={styles.sponsorFounded}>Est. {sponsor.founded}</span>
        </div>
        <p style={styles.sponsorDesc}>{sponsor.description}</p>
      </div>
      
      {/* Visit Link */}
      <div style={styles.cardFooter}>
        <span style={{
          ...styles.visitLink,
          color: isHovered ? tier.textColor : 'var(--accent)'
        }}>
          Partner Website
          <span style={styles.visitArrow}>→</span>
        </span>
      </div>
    </a>
  );
};

// ============================================
// STYLES
// ============================================

const colors = {
  accent: 'var(--accent, #0084ff)',
  bgPrimary: 'var(--bg-primary, #0a0f1a)',
  bgSecondary: 'var(--bg-secondary, #111827)',
  bgCard: 'var(--bg-card, #1a2332)',
  textPrimary: 'var(--text-primary, #ffffff)',
  textSecondary: 'var(--text-secondary, #9ca3af)',
  textMuted: 'var(--text-muted, #6b7280)',
  border: 'var(--border, #1f2937)'
};

const styles = {
  // Hero Section
  hero: {
    background: colors.bgSecondary,
    borderBottom: `1px solid ${colors.border}`,
    padding: '80px 0 60px'
  },
  heroContainer: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '0 24px',
    textAlign: 'center'
  },
  heroBadge: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: colors.accent,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    display: 'inline-block',
    padding: '4px 12px',
    background: 'rgba(0, 132, 255,0.1)',
    borderRadius: 20,
    marginBottom: 16
  },
  heroTitle: {
    fontFamily: 'sans-serif',
    fontSize: 'clamp(36px, 5vw, 56px)',
    fontWeight: 700,
    marginBottom: 16,
    color: colors.textPrimary,
    background: `linear-gradient(135deg, ${colors.textPrimary}, ${colors.accent})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  heroDesc: {
    color: colors.textSecondary,
    fontSize: 18,
    maxWidth: 600,
    margin: '0 auto',
    lineHeight: 1.6
  },

  // Main Section
  section: {
    padding: '60px 0'
  },
  container: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '0 24px'
  },

  // Tier Section
  tierSection: {
    marginBottom: 80,
    padding: '20px',
    borderRadius: 24,
    transition: 'all 0.3s ease'
  },
  tierHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 20,
    marginBottom: 40,
    flexWrap: 'wrap'
  },
  tierIcon: {
    width: 60,
    height: 60,
    borderRadius: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 32,
    background: 'var(--bg-card)'
  },
  tierInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8
  },
  tierLabel: {
    fontSize: 24,
    fontWeight: 700,
    letterSpacing: '2px',
    margin: 0,
    padding: '8px 20px',
    borderRadius: 40,
    display: 'inline-block'
  },
  tierStats: {
    display: 'flex',
    gap: 16
  },
  tierCount: {
    fontSize: 13,
    color: colors.textMuted,
    fontFamily: 'monospace'
  },
  tierLine: {
    flex: 1,
    height: 2,
    background: colors.border,
    position: 'relative'
  },
  tierLineGlow: {
    position: 'absolute',
    left: 0,
    top: -1,
    width: '30%',
    height: 4,
    borderRadius: 2
  },

  // Grid
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: 24
  },

  // Card
  card: {
    background: colors.bgCard,
    borderRadius: 20,
    border: `1px solid ${colors.border}`,
    padding: '24px',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    background: colors.bgSecondary
  },
  logoImage: {
    width: 50,
    height: 50,
    objectFit: 'contain'
  },
  logoPlaceholder: {
    fontSize: 32,
    fontWeight: 700,
    fontFamily: 'sans-serif'
  },
  cardContent: {
    flex: 1
  },
  sponsorName: {
    fontSize: 18,
    fontWeight: 600,
    color: colors.textPrimary,
    marginBottom: 8
  },
  sponsorMeta: {
    display: 'flex',
    gap: 12,
    marginBottom: 12,
    flexWrap: 'wrap'
  },
  sponsorType: {
    fontSize: 10,
    padding: '4px 10px',
    borderRadius: 12,
    fontWeight: 600,
    letterSpacing: '0.5px'
  },
  sponsorFounded: {
    fontSize: 11,
    color: colors.textMuted,
    fontFamily: 'monospace'
  },
  sponsorDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 1.6,
    marginBottom: 16
  },
  cardFooter: {
    paddingTop: 16,
    borderTop: `1px solid ${colors.border}`,
    marginTop: 'auto'
  },
  visitLink: {
    fontSize: 13,
    fontWeight: 500,
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    transition: 'all 0.2s ease'
  },
  visitArrow: {
    transition: 'transform 0.2s ease',
    display: 'inline-block'
  },

  // CTA Section
  ctaSection: {
    marginTop: 60,
    background: `linear-gradient(135deg, ${colors.bgSecondary}, ${colors.bgCard})`,
    borderRadius: 24,
    border: `1px solid ${colors.border}`,
    overflow: 'hidden'
  },
  ctaContent: {
    padding: '60px 48px',
    textAlign: 'center'
  },
  ctaBadge: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: colors.accent,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    display: 'inline-block',
    padding: '4px 12px',
    background: 'rgba(0, 132, 255,0.1)',
    borderRadius: 20,
    marginBottom: 16
  },
  ctaTitle: {
    fontSize: 'clamp(24px, 4vw, 36px)',
    fontWeight: 700,
    color: colors.textPrimary,
    marginBottom: 16
  },
  ctaDesc: {
    fontSize: 16,
    color: colors.textSecondary,
    maxWidth: 500,
    margin: '0 auto 32px',
    lineHeight: 1.7
  },
  ctaButtons: {
    display: 'flex',
    gap: 16,
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  btnPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '12px 28px',
    background: colors.accent,
    color: colors.bgPrimary,
    textDecoration: 'none',
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 600,
    transition: 'all 0.3s ease'
  },
  btnArrow: {
    transition: 'transform 0.2s ease',
    display: 'inline-block'
  },
  btnSecondary: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '12px 28px',
    background: 'transparent',
    border: `1px solid ${colors.border}`,
    color: colors.textSecondary,
    textDecoration: 'none',
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 500,
    transition: 'all 0.3s ease'
  }
};

// Add hover effects
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(0, 132, 255,0.3);
  }
  
  .btn-secondary:hover {
    border-color: var(--accent);
    color: var(--accent);
    transform: translateY(-2px);
  }
  
  .visit-link:hover .visit-arrow {
    transform: translateX(4px);
  }
  
  .btn-primary:hover .btn-arrow {
    transform: translateX(4px);
  }
`;
document.head.appendChild(styleSheet);

export default Sponsors;
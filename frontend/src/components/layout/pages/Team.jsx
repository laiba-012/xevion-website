import React, { useState } from 'react';

// ============================================
// CONSTANTS
// ============================================

const DEPARTMENTS = [
  { id: 'all', label: 'ALL' },
  { id: 'leadership', label: 'LEADERSHIP' },
  { id: 'cybersecurity', label: 'CYBERSECURITY' },
  { id: 'programming', label: 'PROGRAMMING' },
  { id: 'ai-ml', label: 'AI & ML' },
  { id: 'community', label: 'COMMUNITY' },
  { id: 'media', label: 'MEDIA' },
  { id: 'operations', label: 'OPERATIONS' }
];

// ============================================
// TEAM MEMBERS DATA
// ============================================

const TEAM_MEMBERS = [
  // Leadership
  {
    id: 1,
    name: "Sarah Khan",
    role: "CEO & Founder",
    department: "leadership",
    bio: "Cybersecurity expert with 10+ years experience. Previously led security teams at top tech companies.",
    skills: ["Security Architecture", "Risk Management", "Leadership"],
    social: { linkedin: "#", twitter: "#", github: "#" }
  },
  
  // Cybersecurity Department
  {
    id: 2,
    name: "Ali Raza",
    role: "Head of Cybersecurity",
    department: "cybersecurity",
    bio: "Certified ethical hacker and penetration testing specialist. CTF champion.",
    skills: ["Penetration Testing", "Network Security", "Ethical Hacking"],
    social: { linkedin: "#", twitter: "#" }
  },
  {
    id: 8,
    name: "Bilal Ahmed",
    role: "Security Researcher",
    department: "cybersecurity",
    bio: "Vulnerability researcher and bug bounty hunter. Finds security flaws.",
    skills: ["Vulnerability Research", "Bug Bounty", "Reverse Engineering"],
    social: { github: "#", twitter: "#" }
  },
  
  // Programming Department
  {
    id: 3,
    name: "Zainab Ahmed",
    role: "Lead Developer",
    department: "programming",
    bio: "Full-stack developer passionate about security and open source.",
    skills: ["React", "Python", "Node.js", "Security"],
    social: { github: "#", linkedin: "#" }
  },
  {
    id: 9,
    name: "Mariam Tariq",
    role: "Python Instructor",
    department: "programming",
    bio: "Teaches programming to beginners. Creates hands-on coding challenges.",
    skills: ["Python", "Teaching", "Curriculum Design"],
    social: { github: "#", linkedin: "#" }
  },
  
  // AI/ML Department
  {
    id: 4,
    name: "Dr. Usman Chaudhry",
    role: "AI Research Lead",
    department: "ai-ml",
    bio: "PhD in Machine Learning. Specializes in AI for threat detection.",
    skills: ["Machine Learning", "Deep Learning", "NLP"],
    social: { linkedin: "#", twitter: "#" }
  },
  
  // Community Department
  {
    id: 5,
    name: "Fatima Malik",
    role: "Community Manager",
    department: "community",
    bio: "Building and growing cybersecurity communities. Organizes events and meetups.",
    skills: ["Community Building", "Event Management", "Social Media"],
    social: { linkedin: "#", twitter: "#" }
  },
  
  // Media Department
  {
    id: 6,
    name: "Hamza Ali",
    role: "Media Lead",
    department: "media",
    bio: "Content creator and cybersecurity educator. Creates tutorials and writeups.",
    skills: ["Content Creation", "Video Production", "Technical Writing"],
    social: { github: "#", linkedin: "#" }
  },
  
  // Operations Department
  {
    id: 7,
    name: "Ayesha Siddiqui",
    role: "Operations Manager",
    department: "operations",
    bio: "Ensures smooth operations and project delivery.",
    skills: ["Project Management", "Operations", "Planning"],
    social: { linkedin: "#" }
  }
];

// ============================================
// STYLES (Professional Inline Styles)
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
    padding: '80px 0 40px'
  },
  heroContainer: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '0 24px'
  },
  heroBadge: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: colors.accent,
    textTransform: 'uppercase',
    letterSpacing: '0.1em'
  },
  heroTitle: {
    fontFamily: 'sans-serif',
    fontSize: 'clamp(36px, 5vw, 56px)',
    fontWeight: 700,
    marginTop: 12,
    marginBottom: 16,
    color: colors.textPrimary
  },
  heroDesc: {
    color: colors.textSecondary,
    fontSize: 18,
    maxWidth: 600
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

  // Filters
  filters: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 40
  },
  filterBtn: (isActive) => ({
    padding: '8px 20px',
    background: isActive ? colors.accent : 'transparent',
    border: isActive ? 'none' : `1px solid ${colors.border}`,
    color: isActive ? colors.bgPrimary : colors.textSecondary,
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: isActive ? 600 : 400,
    transition: 'all 0.2s ease'
  }),

  // Department Section
  deptSection: {
    marginBottom: 60
  },
  deptHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24
  },
  deptLine: {
    height: 1,
    flex: 1,
    background: colors.border
  },
  deptTitle: {
    fontFamily: 'sans-serif',
    fontSize: 22,
    fontWeight: 700,
    textTransform: 'capitalize',
    color: colors.accent,
    margin: 0
  },

  // Grid
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 24
  },

  // Card
  card: {
    background: colors.bgCard,
    borderRadius: 12,
    border: `1px solid ${colors.border}`,
    padding: 24,
    textAlign: 'center',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  },
  cardHover: {
    transform: 'translateY(-4px)',
    borderColor: colors.accent
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: '50%',
    margin: '0 auto 16px',
    overflow: 'hidden',
    border: `2px solid ${colors.border}`,
    background: colors.bgSecondary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarInitial: {
    fontSize: 36,
    fontWeight: 700,
    color: colors.accent,
    fontFamily: 'sans-serif'
  },
  name: {
    fontFamily: 'sans-serif',
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 4,
    color: colors.textPrimary
  },
  role: {
    fontSize: 13,
    color: colors.accent,
    marginBottom: 12,
    fontFamily: 'monospace'
  },
  bio: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 1.6,
    marginBottom: 12
  },
  skills: {
    display: 'flex',
    gap: 6,
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 16
  },
  skillTag: {
    padding: '4px 10px',
    background: `rgba(0, 132, 255, 0.1)`,
    color: colors.accent,
    borderRadius: 12,
    fontSize: 10,
    fontFamily: 'monospace'
  },
  social: {
    display: 'flex',
    justifyContent: 'center',
    gap: 16
  },
  socialLink: {
    color: colors.textMuted,
    fontSize: 12,
    textDecoration: 'none',
    transition: 'color 0.2s ease'
  },
  emptyState: {
    color: colors.textMuted,
    textAlign: 'center',
    padding: 60
  }
};

// ============================================
// MAIN COMPONENT
// ============================================

const Team = () => {
  const [activeDept, setActiveDept] = useState('all');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredFilter, setHoveredFilter] = useState(null);

  // Filter logic
  const getFilteredMembers = () => {
    if (activeDept === 'all') return TEAM_MEMBERS;
    return TEAM_MEMBERS.filter(m => m.department === activeDept);
  };

  // Group logic
  const getGroupedMembers = () => {
    const grouped = {};
    TEAM_MEMBERS.forEach(member => {
      if (!grouped[member.department]) grouped[member.department] = [];
      grouped[member.department].push(member);
    });
    return grouped;
  };

  const filteredMembers = getFilteredMembers();
  const groupedMembers = getGroupedMembers();

  // Helper functions
  const getInitial = (name) => name.charAt(0).toUpperCase();
  const formatDeptName = (dept) => {
    const names = {
      leadership: 'Leadership',
      cybersecurity: 'Cybersecurity',
      programming: 'Programming',
      'ai-ml': 'AI & Machine Learning',
      community: 'Community',
      media: 'Media',
      operations: 'Operations'
    };
    return names[dept] || dept;
  };

  return (
    <>
      {/* Hero Section */}
      <div style={styles.hero}>
        <div style={styles.heroContainer}>
          <span style={styles.heroBadge}>The People</span>
          <h1 style={styles.heroTitle}>Our Team</h1>
          <p style={styles.heroDesc}>
            Meet the dedicated individuals driving Xevion's mission forward.
          </p>
        </div>
      </div>

      {/* Main Section */}
      <section style={styles.section}>
        <div style={styles.container}>
          
          {/* Filters */}
          <div style={styles.filters}>
            {DEPARTMENTS.map(dept => (
              <button
                key={dept.id}
                onClick={() => setActiveDept(dept.id)}
                onMouseEnter={() => setHoveredFilter(dept.id)}
                onMouseLeave={() => setHoveredFilter(null)}
                style={{
                  ...styles.filterBtn(activeDept === dept.id),
                  ...(hoveredFilter === dept.id && activeDept !== dept.id && {
                    background: 'rgba(0, 132, 255, 0.1)',
                    borderColor: colors.accent,
                    color: colors.accent
                  })
                }}
              >
                {dept.label}
              </button>
            ))}
          </div>

          {/* Content */}
          {activeDept === 'all' ? (
            Object.entries(groupedMembers).map(([dept, members]) => (
              <div key={dept} style={styles.deptSection}>
                <div style={styles.deptHeader}>
                  <span style={styles.deptLine} />
                  <h2 style={styles.deptTitle}>{formatDeptName(dept)}</h2>
                  <span style={styles.deptLine} />
                </div>
                <div style={styles.grid}>
                  {members.map(member => (
                    <MemberCard
                      key={member.id}
                      member={member}
                      isHovered={hoveredCard === member.id}
                      onHover={() => setHoveredCard(member.id)}
                      onLeave={() => setHoveredCard(null)}
                      getInitial={getInitial}
                    />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div style={styles.grid}>
              {filteredMembers.map(member => (
                <MemberCard
                  key={member.id}
                  member={member}
                  isHovered={hoveredCard === member.id}
                  onHover={() => setHoveredCard(member.id)}
                  onLeave={() => setHoveredCard(null)}
                  getInitial={getInitial}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {filteredMembers.length === 0 && (
            <p style={styles.emptyState}>No team members found in this department.</p>
          )}
        </div>
      </section>
    </>
  );
};

// ============================================
// MEMBER CARD COMPONENT
// ============================================

const MemberCard = ({ member, isHovered, onHover, onLeave, getInitial }) => {
  const [hoveredSocial, setHoveredSocial] = useState(null);

  const socialLinks = [
    { key: 'github', label: 'GitHub' },
    { key: 'linkedin', label: 'LinkedIn' },
    { key: 'twitter', label: 'Twitter' }
  ];

  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{
        ...styles.card,
        ...(isHovered && styles.cardHover)
      }}
    >
      {/* Avatar */}
      <div style={styles.avatar}>
        <span style={styles.avatarInitial}>{getInitial(member.name)}</span>
      </div>

      {/* Info */}
      <h3 style={styles.name}>{member.name}</h3>
      <p style={styles.role}>{member.role}</p>
      
      {member.bio && (
        <p style={styles.bio}>{member.bio}</p>
      )}

      {/* Skills */}
      {member.skills && member.skills.length > 0 && (
        <div style={styles.skills}>
          {member.skills.slice(0, 3).map(skill => (
            <span key={skill} style={styles.skillTag}>{skill}</span>
          ))}
        </div>
      )}

      {/* Social Links */}
      {member.social && (
        <div style={styles.social}>
          {socialLinks.map(({ key, label }) => (
            member.social[key] && (
              <a
                key={key}
                href={member.social[key]}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setHoveredSocial(key)}
                onMouseLeave={() => setHoveredSocial(null)}
                style={{
                  ...styles.socialLink,
                  ...(hoveredSocial === key && { color: colors.accent })
                }}
              >
                {label}
              </a>
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default Team;
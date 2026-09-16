import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MdSecurity, MdShield, MdVerifiedUser, MdLock, MdWorkspacePremium, 
  MdSchool, MdCheckCircle, MdTerminal, MdArrowForward, MdCalendarToday, 
  MdPeople, MdMenuBook, MdEmojiEvents, MdArticle, MdGroups, MdPerson, MdEditNote,
  MdSmartToy, MdLanguage, MdSearch
} from 'react-icons/md';
import api from '../../../utils/api';  // ✅ API import for real stats
import Cyber3DScene from './Cyber3DScene';

const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  bg: ['#0084ff', '#38bdf8', '#64748b', '#0052cc'][i % 4],
  left: `${(i * 17) % 100}%`,
  top: `${(i * 23) % 100}%`,
  size: 2 + (i % 4),
  delay: (i * 0.7) % 10,
  duration: 15 + (i % 15),
  opacity: 0.15 + (i % 3) * 0.1
}));

const Home = () => {
  // ✅ Real stats ke liye state (database se aayenge)
  const [stats, setStats] = useState({
    community: 0,
    courses: 0,
    events: 0,
    blogs: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // ✅ Database se stats fetch karein
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/stats/home');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  // ✅ Hero section mein loading state ke hisaab se dikhega
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  
  const [featuredCourses, setFeaturedCourses] = useState([
    {
      id: 1,
      title: "Cybersecurity Fundamentals & Threat Defense",
      category: "cybersecurity",
      level: "Beginner",
      instructor: "Dr. Sarah Vance",
      shortDescription: "Master the core concepts of cybersecurity, threat detection, and defense strategies.",
      enrollments: 4200,
      duration: "8 weeks",
      price: 0
    },
    {
      id: 2,
      title: "Ethical Hacking & Penetration Testing",
      category: "cybersecurity",
      level: "Intermediate",
      instructor: "Dr. Sarah Vance",
      shortDescription: "Hands-on practical exploitation, vulnerability assessment, and active defense.",
      enrollments: 3500,
      duration: "10 weeks",
      price: 49
    },
    {
      id: 3,
      title: "Artificial Intelligence & Neural Networks",
      category: "ai-ml",
      level: "Advanced",
      instructor: "Prof. David Chen",
      shortDescription: "Leverage AI and machine learning for threat detection, neural networks, and response.",
      enrollments: 2800,
      duration: "14 weeks",
      price: 89
    }
  ]);

  useEffect(() => {
    api.get('/courses')
      .then(res => {
        if (res.data?.success && res.data?.courses?.length > 0) {
          setFeaturedCourses(res.data.courses.slice(0, 3));
        }
      })
      .catch(() => {});
  }, []);

  const blogPosts = [
    {
      id: 1,
      title: "The Future of Cybersecurity: AI-Powered Defense",
      category: "Insights",
      author: "Dr. Sarah Chen",
      excerpt: "Discover how artificial intelligence is revolutionizing threat detection and response...",
      readTime: 8,
      date: "Dec 15, 2024"
    },
    {
      id: 2,
      title: "CTF Competition: Lessons from Champions",
      category: "CTF",
      author: "Mike Rodriguez",
      excerpt: "Learn strategies and techniques from top CTF competitors worldwide...",
      readTime: 6,
      date: "Dec 12, 2024"
    },
    {
      id: 3,
      title: "Zero Trust Architecture Explained",
      category: "Tutorial",
      author: "Emma Watson",
      excerpt: "A comprehensive guide to implementing Zero Trust security models...",
      readTime: 10,
      date: "Dec 10, 2024"
    }
  ];

  const testimonials = [
    { name: "John Davis", role: "Security Analyst", text: "Xevion transformed my career. The courses are practical and industry-relevant.", rating: 5 },
    { name: "Lisa Wang", role: "Student", text: "Best free cybersecurity resource I've found. The CTF events are amazing!", rating: 5 },
    { name: "Mark Thompson", role: "IT Manager", text: "Our team has greatly benefited from Xevion's training programs.", rating: 5 }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <>
      {/* ============================================
          HERO SECTION - FULLY ANIMATED
          ============================================ */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: '#0a0e17',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* ===== ANIMATED GRID BACKGROUND ===== */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(rgba(0, 132, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 132, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          pointerEvents: 'none',
          animation: 'gridMove 20s linear infinite'
        }} />



        {/* ===== FLOATING ORBS ===== */}
        <div style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(0, 132, 255, 0.10) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'orbFloat 15s ease-in-out infinite',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-20%',
          left: '-10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(100, 116, 139, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'orbFloat 20s ease-in-out infinite reverse',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '800px',
          height: '800px',
          background: 'radial-gradient(circle, rgba(0, 132, 255, 0.03) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'pulseGlow 8s ease-in-out infinite',
          pointerEvents: 'none'
        }} />

        {/* ===== FLOATING PARTICLES ===== */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          overflow: 'hidden'
        }}>
          {PARTICLES.map((p) => (
            <div key={p.id} style={{
              position: 'absolute',
              background: p.bg,
              borderRadius: '50%',
              left: p.left,
              top: p.top,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: p.opacity,
              animation: `floatParticle ${p.duration}s ease-in-out infinite`,
              animationDelay: `${p.delay}s`
            }} />
          ))}
        </div>

        {/* ===== HERO CONTENT ===== */}
        <div className="container" style={{
          maxWidth: 1240,
          margin: '0 auto',
          padding: '110px 24px 80px',
          position: 'relative',
          zIndex: 2,
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 0.95fr)',
          gap: 48,
          alignItems: 'center',
        }}>
          {/* Left Column: Headline & Action */}
          <div style={{ maxWidth: 660 }}>
            
            {/* ===== ANIMATED BADGE ===== */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              background: 'rgba(0, 132, 255, 0.08)',
              border: '1px solid rgba(0, 132, 255, 0.22)',
              padding: '8px 20px',
              borderRadius: 50,
              marginBottom: 28,
              animation: 'fadeInUp 0.8s ease'
            }}>
              <span style={{
                width: 8,
                height: 8,
                background: '#0084ff',
                borderRadius: '50%',
                animation: 'blink 1.2s infinite',
                boxShadow: '0 0 15px rgba(0, 132, 255, 0.8)'
              }} />
              <span style={{
                fontSize: 13,
                color: '#38bdf8',
                fontWeight: 600,
                letterSpacing: '0.4px',
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                <MdShield style={{ verticalAlign: 'middle', marginRight: 6, fontSize: 16 }} />
                Next-Gen Cybersecurity Platform • {statsLoading ? '...' : stats.community.toLocaleString() + '+'} Members
              </span>
            </div>

            {/* ===== MAIN HEADING ===== */}
            <div style={{ animation: 'fadeInUp 1s ease 0.2s both' }}>
              <h1 style={{
                fontSize: 'clamp(40px, 5.5vw, 68px)',
                fontWeight: 800,
                lineHeight: 1.1,
                marginBottom: 22,
                color: '#fff',
                letterSpacing: '-0.02em'
              }}>
                <span style={{ display: 'inline-block', animation: 'slideInLeft 0.8s ease' }}>
                  Master
                </span>
                <br />
                <span style={{
                  background: 'linear-gradient(135deg, #0084ff 0%, #38bdf8 50%, #ffffff 100%)',
                  backgroundSize: '200% 200%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: 'gradientShift 4s ease-in-out infinite, glowPulse 3s ease-in-out infinite',
                  display: 'inline-block'
                }}>
                  Cybersecurity
                </span>
                <br />
                <span style={{ 
                  color: '#94a3b8', 
                  fontWeight: 400,
                  display: 'inline-block',
                  animation: 'slideInRight 0.8s ease 0.3s both'
                }}>
                  & Secure the Future
                </span>
              </h1>
            </div>

            {/* ===== SUBTITLE ===== */}
            <p style={{
              fontSize: 'clamp(15px, 1.8vw, 17px)',
              color: '#94a3b8',
              lineHeight: 1.75,
              marginBottom: 32,
              maxWidth: 560,
              animation: 'fadeInUp 1s ease 0.4s both'
            }}>
              Join the fastest-growing cybersecurity ecosystem. Access free verified courses, 
              participate in live CTF challenges, and build skills certified by industry leaders.
            </p>

            {/* ===== BUTTONS ===== */}
            <div style={{ 
              display: 'flex', 
              gap: 16, 
              flexWrap: 'wrap',
              animation: 'fadeInUp 1s ease 0.6s both'
            }}>
              <Link to="/courses" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '14px 34px',
                background: 'linear-gradient(135deg, #0084ff, #0052cc)',
                color: '#ffffff',
                textDecoration: 'none',
                borderRadius: 12,
                fontWeight: 700,
                fontSize: 15,
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                boxShadow: '0 6px 28px rgba(0, 132, 255, 0.35)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <span style={{ position: 'relative', zIndex: 2 }}>Start Learning Free</span>
                <MdArrowForward style={{ fontSize: 18, position: 'relative', zIndex: 2 }} />
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)',
                  animation: 'shimmer 3s infinite'
                }} />
              </Link>
              
              <Link to="/events" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '14px 30px',
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(0, 132, 255, 0.2)',
                color: '#f8fafc',
                textDecoration: 'none',
                borderRadius: 12,
                fontWeight: 600,
                fontSize: 15,
                transition: 'all 0.3s ease',
              }}>
                <MdCalendarToday style={{ fontSize: 16, color: '#38bdf8' }} />
                Upcoming Events
              </Link>
            </div>

            {/* ===== TRUST BADGES ===== */}
            <div style={{
              display: 'flex',
              gap: 24,
              marginTop: 40,
              flexWrap: 'wrap',
              alignItems: 'center',
              animation: 'fadeInUp 1s ease 0.8s both'
            }}>
              {[
                { label: 'ISO 27001 Certified', icon: <MdLock style={{ color: '#0084ff', fontSize: 17 }} /> },
                { label: 'Industry Recognized', icon: <MdWorkspacePremium style={{ color: '#f59e0b', fontSize: 17 }} /> },
                { label: '100% Free Access', icon: <MdSchool style={{ color: '#10b981', fontSize: 17 }} /> }
              ].map((badge, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  color: '#94a3b8',
                  fontSize: 13,
                  fontWeight: 500,
                  background: 'rgba(255,255,255,0.02)',
                  padding: '6px 14px',
                  borderRadius: 20,
                  border: '1px solid rgba(255,255,255,0.05)',
                  transition: 'all 0.3s ease'
                }}>
                  {badge.icon}
                  <span>{badge.label}</span>
                </div>
              ))}
            </div>

            {/* ===== ANIMATED STATS BAR ===== */}
            <div style={{
              display: 'flex',
              gap: 36,
              marginTop: 34,
              paddingTop: 28,
              borderTop: '1px solid rgba(0, 132, 255, 0.12)',
              animation: 'fadeInUp 1s ease 1s both',
              flexWrap: 'wrap'
            }}>
              {[
                { value: statsLoading ? '...' : stats.community.toLocaleString() + '+', label: 'Students' },
                { value: statsLoading ? '...' : stats.courses + '+', label: 'Courses' },
                { value: '4.8 ★', label: 'Student Rating' }
              ].map((stat, i) => (
                <div key={i} style={{ textAlign: 'left' }}>
                  <div style={{
                    fontSize: 24,
                    fontWeight: 800,
                    color: '#fff',
                    background: 'linear-gradient(135deg, #ffffff, #38bdf8)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontFamily: 'Space Grotesk, sans-serif'
                  }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: 3D Holographic Interactive Cyber Defense Scene */}
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 520,
            width: '100%',
          }} className="hero-visual-col">
            <Cyber3DScene />
          </div>
        </div>
      </section>

      {/* ============================================
          STATS SECTION - REAL DATA FROM DATABASE
          ============================================ */}
      <section style={{
        padding: '60px 0',
        background: '#0f172a',
        borderTop: '1px solid rgba(0, 132, 255,0.05)',
        borderBottom: '1px solid rgba(0, 132, 255,0.05)'
      }}>
        <div className="container" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          {statsLoading ? (
            // Loading skeleton
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 32,
              textAlign: 'center'
            }}>
              {[1, 2, 3, 4].map((_, idx) => (
                <div key={idx} style={{ padding: '24px', background: 'rgba(255,255,255,0.02)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{
                    width: '60%',
                    height: 40,
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: 8,
                    margin: '0 auto 12px',
                    animation: 'pulse 1.5s ease-in-out infinite'
                  }} />
                  <div style={{
                    width: '40%',
                    height: 20,
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: 8,
                    margin: '0 auto',
                    animation: 'pulse 1.5s ease-in-out infinite 0.5s'
                  }} />
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 32,
              textAlign: 'center'
            }}>
              {[
                { value: stats.community.toLocaleString() + '+', label: 'Active Learners', icon: <MdPeople style={{ fontSize: 28, color: '#0084ff' }} />, color: '#0084ff', rgb: '0, 132, 255' },
                { value: stats.courses + '+', label: 'Free Courses', icon: <MdMenuBook style={{ fontSize: 28, color: '#38bdf8' }} />, color: '#38bdf8', rgb: '56, 189, 248' },
                { value: stats.events + '+', label: 'CTF Events', icon: <MdEmojiEvents style={{ fontSize: 28, color: '#f59e0b' }} />, color: '#f59e0b', rgb: '245, 158, 11' },
                { value: stats.blogs + '+', label: 'Articles', icon: <MdArticle style={{ fontSize: 28, color: '#10b981' }} />, color: '#10b981', rgb: '16, 185, 129' }
              ].map((stat, idx) => (
                <div key={idx} style={{
                  padding: '28px 24px',
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: 16,
                  border: '1px solid rgba(255,255,255,0.05)',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}>
                  <div style={{
                    width: 56,
                    height: 56,
                    borderRadius: 14,
                    background: `rgba(${stat.rgb}, 0.12)`,
                    border: `1px solid rgba(${stat.rgb}, 0.25)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 16,
                    boxShadow: `0 4px 16px rgba(${stat.rgb}, 0.15)`
                  }}>
                    {stat.icon}
                  </div>
                  <div style={{
                    fontSize: 'clamp(32px, 4vw, 44px)',
                    fontWeight: 800,
                    background: `linear-gradient(135deg, ${stat.color}, #fff)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    lineHeight: 1
                  }}>{stat.value}</div>
                  <div style={{ marginTop: 8, color: '#94a3b8', fontSize: 14, fontWeight: 500 }}>{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============================================
          FEATURED COURSES
          ============================================ */}
      <section style={{ padding: '100px 0', background: '#0a0e17' }}>
        <div className="container" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{
              color: '#0084ff',
              fontSize: 13,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '3px',
              background: 'rgba(0, 132, 255,0.08)',
              padding: '4px 16px',
              borderRadius: 20
            }}>Start Learning</span>
            <h2 style={{
              fontSize: 'clamp(32px, 5vw, 44px)',
              fontWeight: 700,
              marginTop: 16,
              marginBottom: 16,
              color: '#fff'
            }}>
              Featured <span style={{ color: '#0084ff' }}>Courses</span>
            </h2>
            <p style={{ color: '#94a3b8', fontSize: 18, maxWidth: 600, margin: '0 auto' }}>
              Industry-relevant curriculum designed by experts
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: 32
          }}>
            {featuredCourses.map((course, idx) => (
              <CourseCard key={course.id} course={course} index={idx} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 56 }}>
            <Link to="/courses" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 32px',
              border: '1px solid #0084ff',
              color: '#0084ff',
              textDecoration: 'none',
              borderRadius: 10,
              fontWeight: 600,
              transition: 'all 0.3s ease'
            }}>
              Explore All Courses
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================
          MISSION SECTION
          ============================================ */}
      <section style={{ padding: '100px 0', background: '#0f172a' }}>
        <div className="container" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 48,
            alignItems: 'center'
          }}>
            <div>
              <span style={{
                color: '#0084ff',
                fontSize: 13,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '3px',
                background: 'rgba(0, 132, 255,0.08)',
                padding: '4px 16px',
                borderRadius: 20
              }}>Our Mission</span>
              <h2 style={{
                fontSize: 'clamp(32px, 5vw, 44px)',
                fontWeight: 700,
                marginTop: 16,
                marginBottom: 20,
                color: '#fff'
              }}>
                Democratizing <span style={{ color: '#64748b' }}>Cybersecurity</span> Education
              </h2>
              <p style={{ color: '#94a3b8', fontSize: 16, lineHeight: 1.8, marginBottom: 28 }}>
                Xevion is on a mission to make world-class cybersecurity education accessible to everyone, 
                regardless of their background or financial situation.
              </p>
              <Link to="/about" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 28px',
                background: 'linear-gradient(135deg, #0084ff, #0052cc)',
                boxShadow: '0 4px 20px rgba(0, 132, 255, 0.35)',
                color: '#fff',
                textDecoration: 'none',
                borderRadius: 10,
                fontWeight: 600
              }}>
                Learn More About Us
                <span>→</span>
              </Link>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 20
            }}>
              {[
                { icon: <MdSecurity style={{ fontSize: 24, color: '#0084ff' }} />, title: 'Practical Skills', desc: 'Hands-on labs and real-world scenarios', rgb: '0, 132, 255' },
                { icon: <MdGroups style={{ fontSize: 24, color: '#38bdf8' }} />, title: 'Expert Mentors', desc: 'Learn from industry professionals', rgb: '56, 189, 248' },
                { icon: <MdEmojiEvents style={{ fontSize: 24, color: '#f59e0b' }} />, title: 'CTF Competitions', desc: 'Test your skills against peers', rgb: '245, 158, 11' },
                { icon: <MdWorkspacePremium style={{ fontSize: 24, color: '#10b981' }} />, title: 'Certificates', desc: 'Earn verifiable achievements', rgb: '16, 185, 129' }
              ].map((item, idx) => (
                <div key={idx} style={{
                  padding: 24,
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: 16,
                  border: '1px solid rgba(255,255,255,0.05)',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{
                    width: 46,
                    height: 46,
                    borderRadius: 12,
                    background: `rgba(${item.rgb}, 0.12)`,
                    border: `1px solid rgba(${item.rgb}, 0.25)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 14
                  }}>
                    {item.icon}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6, color: '#fff' }}>{item.title}</div>
                  <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          BLOG SECTION
          ============================================ */}
      <section style={{ padding: '100px 0', background: '#0a0e17' }}>
        <div className="container" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{
              color: '#0084ff',
              fontSize: 13,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '3px',
              background: 'rgba(0, 132, 255,0.08)',
              padding: '4px 16px',
              borderRadius: 20
            }}>Latest Insights</span>
            <h2 style={{
              fontSize: 'clamp(32px, 5vw, 44px)',
              fontWeight: 700,
              marginTop: 16,
              marginBottom: 16,
              color: '#fff'
            }}>
              From Our <span style={{ color: '#f59e0b' }}>Blog</span>
            </h2>
            <p style={{ color: '#94a3b8', fontSize: 18, maxWidth: 600, margin: '0 auto' }}>
              Stay updated with the latest trends and insights
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: 32
          }}>
            {blogPosts.map(post => <BlogCard key={post.id} post={post} />)}
          </div>

          <div style={{ textAlign: 'center', marginTop: 56 }}>
            <Link to="/blog" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 32px',
              border: '1px solid #f59e0b',
              color: '#f59e0b',
              textDecoration: 'none',
              borderRadius: 10,
              fontWeight: 600,
              transition: 'all 0.3s ease'
            }}>
              Read All Articles
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================
          TESTIMONIALS
          ============================================ */}
      <section style={{ padding: '100px 0', background: '#0f172a' }}>
        <div className="container" style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <span style={{
            color: '#0084ff',
            fontSize: 13,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '3px',
            background: 'rgba(0, 132, 255,0.08)',
            padding: '4px 16px',
            borderRadius: 20
          }}>Testimonials</span>
          <h2 style={{
            fontSize: 'clamp(32px, 5vw, 44px)',
            fontWeight: 700,
            marginTop: 16,
            marginBottom: 48,
            color: '#fff'
          }}>
            What Our <span style={{ color: '#10b981' }}>Community</span> Says
          </h2>
          
          <div style={{ maxWidth: 700, margin: '0 auto' }}>
            <div style={{ fontSize: 48, marginBottom: 24, color: '#0084ff', opacity: 0.5 }}>“</div>
            <p style={{
              fontSize: 20,
              color: '#e2e8f0',
              lineHeight: 1.6,
              marginBottom: 32,
              fontStyle: 'italic'
            }}>
              {testimonials[activeTestimonial].text}
            </p>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: '#fff' }}>{testimonials[activeTestimonial].name}</div>
              <div style={{ color: '#94a3b8', fontSize: 13, marginTop: 4 }}>{testimonials[activeTestimonial].role}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32 }}>
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTestimonial(idx)}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: idx === activeTestimonial ? '#0084ff' : '#334155',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    boxShadow: idx === activeTestimonial ? '0 0 20px rgba(0, 132, 255,0.5)' : 'none'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          CTA SECTION
          ============================================ */}
      <section style={{
        padding: '80px 0',
        background: 'linear-gradient(135deg, #0a0e17, #1a1a2e)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid rgba(0, 132, 255,0.05)',
        borderBottom: '1px solid rgba(0, 132, 255,0.05)'
      }}>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(0, 132, 255,0.05) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />
        <div className="container" style={{ maxWidth: 700, margin: '0 auto', padding: '0 24px', position: 'relative' }}>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: 700,
            marginBottom: 16,
            color: '#fff'
          }}>
            Ready to Start Your <span style={{ color: '#0084ff' }}>Journey</span>?
          </h2>
          <p style={{
            fontSize: 16,
            color: '#94a3b8',
            marginBottom: 32,
            lineHeight: 1.7
          }}>
            Join {statsLoading ? '...' : stats.community.toLocaleString() + '+'} learners already building their cybersecurity careers with Xevion.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/signup" style={{
              padding: '14px 36px',
              background: 'linear-gradient(135deg, #0084ff, #0052cc)',
              color: '#0a0e17',
              textDecoration: 'none',
              borderRadius: 10,
              fontWeight: 700,
              boxShadow: '0 4px 30px rgba(0, 132, 255,0.3)',
              transition: 'all 0.3s'
            }}>
              Create Free Account →
            </Link>
            <Link to="/contact" style={{
              padding: '14px 32px',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#e2e8f0',
              textDecoration: 'none',
              borderRadius: 10,
              fontWeight: 500,
              transition: 'all 0.3s'
            }}>
              Contact Team
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================
          ANIMATION STYLES
          ============================================ */}
      <style>{`
        /* Fade In Up */
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Slide In Left */
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to { opacity: 1; transform: translateX(0); }
        }

        /* Slide In Right */
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }

        /* Shimmer Effect */
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 200%; }
        }

        /* Glow Pulse */
        @keyframes glowPulse {
          0%, 100% { text-shadow: 0 0 30px rgba(0, 132, 255,0.1); }
          50% { text-shadow: 0 0 60px rgba(0, 132, 255,0.2); }
        }

        /* Gradient Shift */
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        /* Blink */
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }

        /* Grid Move */
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(60px, 60px); }
        }

        /* Orb Float */
        @keyframes orbFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-30px, -30px) scale(1.1); }
        }

        /* Pulse Glow */
        @keyframes pulseGlow {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
          50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.6; }
        }

        /* Float 3D */
        @keyframes float3D {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }

        /* Particle Float */
        @keyframes floatParticle {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.2; }
          50% { transform: translateY(-40px) translateX(30px); opacity: 0.6; }
        }

        /* Course Card */
        .course-card:hover {
          transform: translateY(-8px);
          border-color: #0084ff !important;
          box-shadow: 0 20px 40px -12px rgba(0, 132, 255,0.15);
        }
        .course-card {
          transition: all 0.3s ease;
          border-color: rgba(255,255,255,0.05);
        }

        /* Blog Card */
        .blog-card:hover {
          transform: translateY(-4px);
          border-color: #f59e0b !important;
          box-shadow: 0 10px 30px -8px rgba(245,158,11,0.1);
        }
        .blog-card {
          transition: all 0.3s ease;
          border-color: rgba(255,255,255,0.05);
        }

        /* Button Hover */
        .hero-btn-primary:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 8px 40px rgba(0, 132, 255,0.4);
        }
        
        .hero-btn-secondary:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.2);
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.3);
        }

        /* Trust Badge Hover */
        .trust-badge:hover {
          color: #e2e8f0;
          transform: translateY(-2px);
        }
        .trust-badge {
          transition: all 0.3s ease;
        }

        /* Pulse animation for loading */
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.2; }
        }
      `}</style>
    </>
  );
};

// ============================================
// COURSE CARD COMPONENT
// ============================================

const CourseCard = ({ course }) => {
  const courseId = course._id || course.id;
  const instructorName = typeof course.instructor === 'object'
    ? (course.instructor?.name || 'Dr. Sarah Vance')
    : (course.instructor || 'Dr. Sarah Vance');
  const courseDesc = course.shortDescription || course.description || '';

  return (
    <Link to={`/courses/${courseId}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div className="course-card" style={{
        background: '#0f172a',
        borderRadius: 16,
        border: '1px solid rgba(255,255,255,0.05)',
        overflow: 'hidden',
        transition: 'all 0.3s ease'
      }}>
        <div style={{
          height: 180,
          background: 'radial-gradient(circle at center, rgba(0, 132, 255, 0.12) 0%, rgba(15, 23, 42, 0.85) 100%)',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column'
        }}>
          <div style={{
            width: 72,
            height: 72,
            borderRadius: 18,
            background: 'rgba(0, 132, 255, 0.08)',
            border: '1px solid rgba(0, 132, 255, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
            marginBottom: 8
          }}>
            {getCategoryIcon(course.category)}
          </div>
          <span style={{
            position: 'absolute',
            top: 16,
            right: 16,
            padding: '4px 12px',
            background: course.price === 0 ? 'rgba(16,185,129,0.15)' : 'rgba(0,132,255,0.15)',
            color: course.price === 0 ? '#10b981' : '#38bdf8',
            borderRadius: 20,
            fontSize: 11,
            fontWeight: 600,
            border: `1px solid ${course.price === 0 ? 'rgba(16,185,129,0.2)' : 'rgba(0,132,255,0.3)'}`
          }}>
            {course.price === 0 ? 'FREE' : `$${course.price}`}
          </span>
          <span style={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            padding: '4px 12px',
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(10px)',
            color: '#fff',
            borderRadius: 20,
            fontSize: 11,
            fontWeight: 500
          }}>{course.level || 'Beginner'}</span>
        </div>
        <div style={{ padding: 24 }}>
          <div style={{
            color: '#0084ff',
            fontSize: 12,
            fontWeight: 600,
            textTransform: 'uppercase',
            marginBottom: 8,
            letterSpacing: '1px'
          }}>
            {course.category}
          </div>
          <h3 style={{
            fontSize: 18,
            fontWeight: 700,
            marginBottom: 12,
            color: '#fff',
            lineHeight: 1.3
          }}>{course.title}</h3>
          <p style={{
            fontSize: 14,
            color: '#94a3b8',
            lineHeight: 1.6,
            marginBottom: 20
          }}>{courseDesc.length > 120 ? courseDesc.substring(0, 120) + '...' : courseDesc}</p>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 16,
            borderTop: '1px solid rgba(255,255,255,0.05)'
          }}>
            <span style={{ fontSize: 13, color: '#94a3b8', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <MdPerson style={{ color: '#0084ff', fontSize: 16 }} />
              {instructorName}
            </span>
            <span style={{ fontSize: 13, color: '#0084ff', fontWeight: 600 }}>{course.duration || '8 Weeks'}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

// ============================================
// BLOG CARD COMPONENT
// ============================================

const BlogCard = ({ post }) => (
  <Link to={`/blog/${post.id}`} style={{ textDecoration: 'none', display: 'block' }}>
    <div className="blog-card" style={{
      background: '#0f172a',
      borderRadius: 16,
      border: '1px solid rgba(255,255,255,0.05)',
      padding: 28,
      transition: 'all 0.3s ease'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16
      }}>
        <span style={{
          padding: '4px 12px',
          background: 'rgba(251,191,36,0.1)',
          color: '#fbbf24',
          borderRadius: 20,
          fontSize: 11,
          fontWeight: 600,
          border: '1px solid rgba(251,191,36,0.15)'
        }}>{post.category}</span>
        <span style={{ fontSize: 12, color: '#64748b' }}>{post.date}</span>
      </div>
      <h3 style={{
        fontSize: 18,
        fontWeight: 700,
        marginBottom: 12,
        color: '#fff',
        lineHeight: 1.4
      }}>{post.title}</h3>
      <p style={{
        fontSize: 14,
        color: '#94a3b8',
        lineHeight: 1.6,
        marginBottom: 20
      }}>{post.excerpt}</p>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span style={{ fontSize: 13, color: '#94a3b8', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <MdEditNote style={{ color: '#38bdf8', fontSize: 18 }} />
          {post.author}
        </span>
        <span style={{ fontSize: 13, color: '#fbbf24' }}>{post.readTime} min read</span>
      </div>
    </div>
  </Link>
);

// ============================================
// HELPER FUNCTION
// ============================================

const getCategoryIcon = (cat) => {
  const iconStyle = { fontSize: 36 };
  switch (cat?.toLowerCase()) {
    case 'cybersecurity':
      return <MdSecurity style={{ ...iconStyle, color: '#0084ff' }} />;
    case 'programming':
      return <MdTerminal style={{ ...iconStyle, color: '#38bdf8' }} />;
    case 'ai-ml':
      return <MdSmartToy style={{ ...iconStyle, color: '#a855f7' }} />;
    case 'networking':
      return <MdLanguage style={{ ...iconStyle, color: '#10b981' }} />;
    case 'osint':
      return <MdSearch style={{ ...iconStyle, color: '#f59e0b' }} />;
    case 'ctf':
      return <MdEmojiEvents style={{ ...iconStyle, color: '#eab308' }} />;
    default:
      return <MdSchool style={{ ...iconStyle, color: '#0084ff' }} />;
  }
};

export default Home;
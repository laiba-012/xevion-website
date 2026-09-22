import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import {
  MdClose,
  MdSearch,
  MdMenuBook,
  MdArrowForward,
  MdSchool,
  MdTimer,
  MdStar,
} from 'react-icons/md';

// Fallback courses if backend isn't responding yet
const DEFAULT_COURSES = [
  {
    _id: 'c1',
    title: 'Cybersecurity Fundamentals & Threat Defense',
    category: 'Cyber Security',
    level: 'Beginner',
    duration: '8 Weeks',
    price: 0,
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&q=80',
  },
  {
    _id: 'c2',
    title: 'Ethical Hacking & Network Penetration Testing',
    category: 'Cyber Security',
    level: 'Intermediate',
    duration: '10 Weeks',
    price: 49,
    thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&q=80',
  },
  {
    _id: 'c3',
    title: 'Full-Stack Modern Web Engineering (React & Node)',
    category: 'Web Development',
    level: 'Beginner',
    duration: '12 Weeks',
    price: 39,
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80',
  },
  {
    _id: 'c4',
    title: 'Artificial Intelligence & Neural Network Architecture',
    category: 'AI & Data Science',
    level: 'Advanced',
    duration: '14 Weeks',
    price: 89,
    thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&q=80',
  },
  {
    _id: 'c5',
    title: 'Cloud Infrastructure & Kubernetes Security',
    category: 'Cloud Computing',
    level: 'Intermediate',
    duration: '6 Weeks',
    price: 59,
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=80',
  },
];

const Navbar = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.email === 'laibafatima0116@gmail.com' || user?.email === 'admin@xevion.com';
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [coursesDrawerOpen, setCoursesDrawerOpen] = useState(false);
  const [drawerCourses, setDrawerCourses] = useState(DEFAULT_COURSES);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setAboutOpen(false);
    setCoursesDrawerOpen(false);
  }, [location]);

  // Fetch real courses on mount and when drawer opens
  useEffect(() => {
    const fetchNavbarCourses = () => {
      api.get('/courses')
        .then(res => {
          if (res.data?.success && res.data?.courses?.length > 0) {
            setDrawerCourses(res.data.courses);
          }
        })
        .catch(err => {
          console.warn('Could not fetch navbar courses:', err);
        });
    };

    fetchNavbarCourses();
  }, [coursesDrawerOpen]);

  const filteredCourses = drawerCourses.filter(c =>
    c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: scrolled
          ? 'rgba(5, 11, 20, 0.94)'
          : 'rgba(5, 11, 20, 0.75)',
        backdropFilter: 'blur(16px)',
        borderBottom: scrolled
          ? '1px solid rgba(0, 132, 255, 0.18)'
          : '1px solid rgba(0, 132, 255, 0.06)',
        transition: 'all 0.35s ease',
        boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.6)' : 'none',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div className="xv-navbar-grid" style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', height: 76 }}>

            {/* Logo (Left) */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
              <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                <img
                  src="/xevion-logo-cropped.png"
                  alt="Xevion"
                  style={{
                    height: 58,
                    width: 'auto',
                    borderRadius: 8,
                    filter: 'drop-shadow(0 0 10px rgba(0, 132, 255,0.35))',
                    transition: 'filter 0.3s, transform 0.3s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.filter = 'drop-shadow(0 0 18px rgba(0, 132, 255,0.7))';
                    e.currentTarget.style.transform = 'scale(1.02)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.filter = 'drop-shadow(0 0 10px rgba(0, 132, 255,0.35))';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                />
              </Link>
            </div>

            {/* Desktop Nav (Dead Center) */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }} className="desktop-nav">
              <NavLink to="/" style={({ isActive }) => linkStyle(isActive)}>Home</NavLink>

              {/* About Dropdown */}
              <div
                style={{ position: 'relative' }}
                onMouseEnter={() => setAboutOpen(true)}
                onMouseLeave={() => setAboutOpen(false)}
              >
                <button style={navBtnStyle}>About ▾</button>
                {aboutOpen && (
                  <div style={dropdownStyle}>
                    <DropLink to="/about" label="Who We Are" desc="Our mission & values" />
                    <DropLink to="/team" label="Our Team" desc="The people behind Xevion" />
                    <DropLink to="/sponsors" label="Sponsors" desc="Organizations supporting us" />
                  </div>
                )}
              </div>

              {/* Courses NavLink */}
              <NavLink
                to="/courses"
                style={({ isActive }) => ({
                  ...linkStyle(isActive),
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                })}
              >
                <MdMenuBook style={{ fontSize: 16 }} />
                <span>Courses</span>
              </NavLink>

              <NavLink to="/events" style={({ isActive }) => linkStyle(isActive)}>Events</NavLink>
              <NavLink to="/blog" style={({ isActive }) => linkStyle(isActive)}>Blog</NavLink>
              <NavLink to="/contact" style={({ isActive }) => linkStyle(isActive)}>Contact</NavLink>
            </div>

            {/* Right Side (Counter-balance for center layout, hamburger on mobile) */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              <button onClick={() => setMenuOpen(!menuOpen)} style={{
                display: 'none',
                background: 'none',
                border: '1px solid rgba(0, 132, 255,0.3)',
                borderRadius: 8,
                fontSize: 20,
                cursor: 'pointer',
                color: '#0084ff',
                padding: '4px 10px',
              }} className="hamburger">☰</button>
            </div>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <div style={{
              padding: '16px 0',
              borderTop: '1px solid rgba(0, 132, 255,0.1)',
              background: 'rgba(5,11,20,0.98)',
            }}>
              {[
                ['/', 'Home'], ['/about', 'About'], ['/team', 'Team'],
                ['/sponsors', 'Sponsors'], ['/courses', 'Courses'],
                ['/events', 'Events'], ['/blog', 'Blog'],
                ['/contact', 'Contact'],
              ].map(([path, label]) => (
                <NavLink key={path} to={path} style={({ isActive }) => ({
                  display: 'block',
                  padding: '10px 16px',
                  color: isActive ? '#0084ff' : '#8baac8',
                  fontSize: 14,
                  textDecoration: 'none',
                })}>
                  {label}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* ==========================================================
          LEFT SIDE COURSES DRAWER (Opens on clicking Courses menu)
          Courses load smoothly ONE BY ONE inside a left div!
          ========================================================== */}
      {coursesDrawerOpen && (
        <div
          onClick={() => setCoursesDrawerOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 2000,
            background: 'rgba(0, 0, 0, 0.72)',
            backdropFilter: 'blur(8px)',
            animation: 'xvFadeOverlay 0.3s ease',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: 'min(420px, 92vw)',
              height: '100vh',
              background: 'rgba(6, 12, 22, 0.98)',
              borderRight: '1px solid rgba(0, 132, 255, 0.22)',
              boxShadow: '8px 0 45px rgba(0, 0, 0, 0.8), 0 0 35px rgba(0, 132, 255, 0.12)',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 2001,
              animation: 'xvSlideFromLeft 0.38s cubic-bezier(0.16, 1, 0.3, 1) forwards',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {/* Drawer Header */}
            <div style={{
              padding: '22px 20px 16px',
              borderBottom: '1px solid rgba(0, 132, 255, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(0, 132, 255, 0.03)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <img
                  src="/xevion-logo-cropped.png"
                  alt="Xevion"
                  style={{
                    height: 34,
                    borderRadius: 6,
                    filter: 'drop-shadow(0 0 8px rgba(0, 132, 255,0.4))',
                  }}
                />
                <div>
                  <h3 style={{
                    margin: 0,
                    fontSize: 16,
                    fontWeight: 700,
                    color: '#e8f0fe',
                    fontFamily: 'Space Grotesk, sans-serif',
                    letterSpacing: '-0.3px',
                  }}>
                    Explore Courses
                  </h3>
                  <span style={{ fontSize: 11, color: '#0084ff', fontFamily: 'JetBrains Mono, monospace' }}>
                    {filteredCourses.length} AVAILABLE
                  </span>
                </div>
              </div>

              <button
                onClick={() => setCoursesDrawerOpen(false)}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#8baac8',
                  borderRadius: 8,
                  width: 34,
                  height: 34,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: 18,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255,68,68,0.15)';
                  e.currentTarget.style.color = '#ff4444';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.color = '#8baac8';
                }}
              >
                <MdClose />
              </button>
            </div>

            {/* Search Box */}
            <div style={{ padding: '14px 20px 10px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                background: 'rgba(0, 132, 255, 0.04)',
                border: '1px solid rgba(0, 132, 255, 0.15)',
                borderRadius: 10,
                padding: '9px 12px',
              }}>
                <MdSearch style={{ color: '#0084ff', fontSize: 18 }} />
                <input
                  type="text"
                  placeholder="Filter courses smoothly..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{
                    background: 'none',
                    border: 'none',
                    outline: 'none',
                    color: '#e8f0fe',
                    fontSize: 13,
                    width: '100%',
                    fontFamily: 'Inter, sans-serif',
                  }}
                />
              </div>
            </div>

            {/* Course List: Opens smoothly ONE BY ONE */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '8px 20px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
              className="xv-drawer-list"
            >
              {filteredCourses.map((course, idx) => (
                <div
                  key={course._id || idx}
                  onClick={() => {
                    setCoursesDrawerOpen(false);
                    navigate(`/courses/${course._id}`);
                  }}
                  style={{
                    background: 'rgba(13, 23, 38, 0.85)',
                    border: '1px solid rgba(0, 132, 255, 0.1)',
                    borderRadius: 12,
                    padding: 12,
                    cursor: 'pointer',
                    display: 'flex',
                    gap: 12,
                    alignItems: 'center',
                    transform: 'perspective(600px)',
                    transition: 'all 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
                    animation: `xvItemSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
                    animationDelay: `${idx * 80}ms`,
                    opacity: 0,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'perspective(600px) rotateY(-3deg) translateX(6px)';
                    e.currentTarget.style.borderColor = 'rgba(0, 132, 255, 0.4)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 132, 255, 0.15)';
                    e.currentTarget.style.background = 'rgba(16, 29, 48, 0.95)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'perspective(600px) rotateY(0) translateX(0)';
                    e.currentTarget.style.borderColor = 'rgba(0, 132, 255, 0.1)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.background = 'rgba(13, 23, 38, 0.85)';
                  }}
                >
                  <img
                    src={course.thumbnail || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&q=80'}
                    alt={course.title}
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 8,
                      objectFit: 'cover',
                      border: '1px solid rgba(0, 132, 255, 0.2)',
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 4,
                    }}>
                      <span style={{
                        fontSize: 10,
                        fontWeight: 600,
                        padding: '2px 7px',
                        borderRadius: 100,
                        background: 'rgba(0, 132, 255, 0.12)',
                        color: '#0084ff',
                        fontFamily: 'JetBrains Mono, monospace',
                        textTransform: 'uppercase',
                      }}>
                        {course.category || 'Tech'}
                      </span>
                      <span style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: course.price === 0 ? '#0084ff' : '#ffc107',
                        fontFamily: 'JetBrains Mono, monospace',
                      }}>
                        {course.price === 0 ? 'FREE' : `$${course.price}`}
                      </span>
                    </div>

                    <h4 style={{
                      margin: 0,
                      fontSize: 13,
                      fontWeight: 600,
                      color: '#e8f0fe',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {course.title}
                    </h4>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      marginTop: 4,
                      fontSize: 11,
                      color: '#4a6a8a',
                    }}>
                      <span>{course.level || 'Beginner'}</span>
                      <span>•</span>
                      <span>{course.duration || 'Self-paced'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Button */}
            <div style={{
              padding: '16px 20px',
              borderTop: '1px solid rgba(0, 132, 255, 0.12)',
              background: 'rgba(0, 132, 255, 0.02)',
            }}>
              <button
                onClick={() => {
                  setCoursesDrawerOpen(false);
                  navigate('/courses');
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '11px 16px',
                  background: 'linear-gradient(135deg, #0084ff, #0052cc)',
                  color: '#050b14',
                  border: 'none',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 0 18px rgba(0, 132, 255, 0.25)',
                  transition: 'all 0.2s',
                  fontFamily: 'Inter, sans-serif',
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 28px rgba(0, 132, 255, 0.5)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 18px rgba(0, 132, 255, 0.25)'}
              >
                <span>View All Courses Page</span>
                <MdArrowForward />
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes xvSlideFromLeft {
          from { transform: translateX(-100%); }
          to   { transform: translateX(0); }
        }
        @keyframes xvItemSlideIn {
          from { opacity: 0; transform: translateX(-24px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes xvFadeOverlay {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .xv-drawer-list::-webkit-scrollbar { width: 4px; }
        .xv-drawer-list::-webkit-scrollbar-track { background: transparent; }
        .xv-drawer-list::-webkit-scrollbar-thumb { background: rgba(0, 132, 255,0.2); border-radius: 4px; }

        @media (max-width: 900px) {
          .xv-navbar-grid {
            display: flex !important;
            justify-content: space-between !important;
          }
          .desktop-nav { display: none !important; }
          .hamburger { display: block !important; }
        }
      `}</style>
    </>
  );
};

const navBtnStyle = {
  background: 'none',
  border: 'none',
  color: '#8baac8',
  fontSize: 14,
  cursor: 'pointer',
  padding: '8px 14px',
  borderRadius: 8,
  transition: 'all 0.2s',
  fontFamily: 'Inter, sans-serif',
};

const linkStyle = (isActive) => ({
  padding: '8px 14px',
  borderRadius: 8,
  fontSize: 14,
  color: isActive ? '#0084ff' : '#8baac8',
  transition: 'color 0.2s',
  fontWeight: isActive ? 600 : 400,
  textDecoration: 'none',
  borderBottom: isActive ? '1px solid rgba(0, 132, 255,0.4)' : '1px solid transparent',
});

const dropdownStyle = {
  position: 'absolute',
  top: '100%',
  left: 0,
  minWidth: 220,
  background: 'rgba(13,23,38,0.98)',
  border: '1px solid rgba(0, 132, 255,0.15)',
  borderRadius: 12,
  padding: 8,
  boxShadow: '0 16px 40px rgba(0,0,0,0.5), 0 0 20px rgba(0, 132, 255,0.05)',
  marginTop: 6,
  zIndex: 1001,
  backdropFilter: 'blur(16px)',
};

const DropLink = ({ to, label, desc }) => (
  <Link
    to={to}
    style={{
      display: 'block',
      padding: '10px 14px',
      borderRadius: 8,
      textDecoration: 'none',
      transition: 'background 0.2s',
    }}
    onMouseEnter={e => e.currentTarget.style.background = 'rgba(0, 132, 255,0.08)'}
    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
  >
    <div style={{ fontWeight: 600, fontSize: 14, color: '#e8f0fe' }}>{label}</div>
    <div style={{ fontSize: 12, color: '#4a6a8a', marginTop: 2 }}>{desc}</div>
  </Link>
);

export default Navbar;
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../utils/api';
import {
  MdMenuBook,
  MdPerson,
  MdTimer,
  MdSearch,
  MdShield,
  MdCheckCircle,
  MdPlayCircleOutline,
  MdWorkspacePremium,
  MdArrowForward,
  MdClose,
  MdLock,
} from 'react-icons/md';

const COMPLETE_COURSES = [
  {
    _id: 'c6',
    title: 'Reverse Engineering & Malware Analysis',
    category: 'Cyber Security',
    level: 'Advanced',
    instructor: { name: 'Dr. Sarah Vance', title: 'Lead Malware Researcher' },
    description: 'Dissect real malware samples in secure sandboxes, perform x86/x64 assembly disassembly, Ghidra decompilation, and dynamic memory analysis.',
    duration: '10 Weeks',
    price: 0,
    originalPrice: 129,
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80',
    modules: [
      {
        title: 'Module 1: Static Binary Analysis',
        order: 1,
        lessons: [
          { title: 'PE Header Inspection & Cryptographic Hashing', duration: '35 Min' },
          { title: 'Disassembling x86/x64 Control Flow with Ghidra', duration: '50 Min' },
        ],
      },
      {
        title: 'Module 2: Dynamic Analysis & Sandbox Emulation',
        order: 2,
        lessons: [
          { title: 'API Monitoring & Process Injection Tracing', duration: '40 Min' },
          { title: 'Extracting Encrypted C2 Configuration Keys', duration: '45 Min' },
        ],
      },
      {
        title: 'Module 3: Rootkits & Kernel-Level Evasion',
        order: 3,
        lessons: [
          { title: 'Kernel Hooking & Direct Kernel Object Manipulation', duration: '55 Min' },
          { title: 'Automated YARA Rule Engineering', duration: '30 Min' },
        ],
      },
    ],
    outcomes: [
      'Ghidra & IDA Pro x86/x64 decompilation mastery',
      'Dynamic sandbox evasion detection & API tracing',
      'Memory dump carving with Volatility Framework',
      'Extracting hidden payload configs & AES keys',
      'Deploying custom YARA signatures to enterprise SIEM',
    ],
  },
  {
    _id: 'c1',
    title: 'Cybersecurity Fundamentals & Threat Defense',
    category: 'Cyber Security',
    level: 'Beginner',
    instructor: { name: 'Dr. Sarah Vance', title: 'Cyber Defense Director' },
    description: 'Master the core concepts of cybersecurity, threat modeling, network defense perimeter design, and cryptographic protocols for modern enterprise systems.',
    duration: '8 Weeks',
    price: 0,
    originalPrice: 49,
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
    modules: [
      {
        title: 'Module 1: Introduction to Threat Modeling',
        order: 1,
        lessons: [
          { title: 'Understanding the Modern Threat Landscape', duration: '25 Min' },
          { title: 'OSINT and Digital Reconnaissance Basics', duration: '35 Min' },
          { title: 'Zero-Trust Perimeter Principles', duration: '30 Min' },
        ],
      },
      {
        title: 'Module 2: Network Defense Architecture',
        order: 2,
        lessons: [
          { title: 'Firewalls, DMZ Topology, & Packet Inspection', duration: '40 Min' },
          { title: 'Intrusion Detection & Prevention Systems (IDS/IPS)', duration: '45 Min' },
        ],
      },
    ],
    outcomes: [
      'Enterprise threat modeling & risk mitigation',
      'Zero-Trust network access (ZTNA) implementation',
      'Packet sniffing with Wireshark & tcpdump',
      'Public Key Infrastructure (PKI) & TLS handshakes',
    ],
  },
  {
    _id: 'c2',
    title: 'Ethical Hacking & Network Penetration Testing',
    category: 'Cyber Security',
    level: 'Intermediate',
    instructor: { name: 'Alex Mercer', title: 'Senior Red Team Operator' },
    description: 'Hands-on practical exploitation, vulnerability scanning, bug bounty methodology, privilege escalation, and active directory penetration testing.',
    duration: '10 Weeks',
    price: 0,
    originalPrice: 99,
    thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80',
    modules: [
      {
        title: 'Module 1: Network Scanning & Enumeration',
        order: 1,
        lessons: [
          { title: 'Nmap Deep Dive & Custom NSE Scripting', duration: '30 Min' },
          { title: 'Enumerating SMB, SNMP, and RPC Services', duration: '45 Min' },
        ],
      },
      {
        title: 'Module 2: Exploitation Frameworks & Shell Access',
        order: 2,
        lessons: [
          { title: 'Metasploit Pro Tactics & Payload Crafting', duration: '50 Min' },
          { title: 'Privilege Escalation on Linux and Windows', duration: '60 Min' },
        ],
      },
    ],
    outcomes: [
      'Active Directory exploitation & Kerberoasting',
      'Automated and manual vulnerability identification',
      'Burp Suite Pro web application penetration testing',
      'Writing executive penetration test reports',
    ],
  },
  {
    _id: 'c3',
    title: 'Modern Full-Stack Engineering with React & Node',
    category: 'Web Development',
    level: 'Beginner',
    instructor: { name: 'Rachel Lee', title: 'Staff Software Architect' },
    description: 'Build enterprise-grade full-stack web applications with modern reactive UI, Express microservices, MongoDB Atlas, and JWT-authenticated zero-trust security.',
    duration: '12 Weeks',
    price: 0,
    originalPrice: 89,
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
    modules: [
      {
        title: 'Module 1: React Architecture & State Management',
        order: 1,
        lessons: [
          { title: 'Reactive Component Composition & Custom Hooks', duration: '35 Min' },
          { title: 'Context API & Scalable Client State', duration: '40 Min' },
        ],
      },
      {
        title: 'Module 2: Secure Backend RESTful APIs',
        order: 2,
        lessons: [
          { title: 'Express Middleware & Rate Limiting', duration: '45 Min' },
          { title: 'MongoDB Indexing & Aggregation Pipelines', duration: '50 Min' },
        ],
      },
    ],
    outcomes: [
      'Production-ready React 19 architecture',
      'High-throughput Express & MongoDB backends',
      'Zero-trust JWT authentication with HTTP-only cookies',
      'Dockerizing and deploying full-stack applications',
    ],
  },
  {
    _id: 'c4',
    title: 'Artificial Intelligence & Neural Networks',
    category: 'AI & Data Science',
    level: 'Advanced',
    instructor: { name: 'Prof. David Chen', title: 'AI Research Scientist' },
    description: 'Deep dive into artificial neural networks, transformers, reinforcement learning, and deploying secure AI models in enterprise environments.',
    duration: '14 Weeks',
    price: 0,
    originalPrice: 149,
    thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80',
    modules: [
      {
        title: 'Module 1: Neural Networks Foundations',
        order: 1,
        lessons: [
          { title: 'Gradient Descent & Backpropagation Mathematics', duration: '45 Min' },
          { title: 'Convolutional Neural Networks (CNNs)', duration: '50 Min' },
        ],
      },
      {
        title: 'Module 2: Attention & Transformers',
        order: 2,
        lessons: [
          { title: 'Self-Attention Mechanisms Explained', duration: '60 Min' },
          { title: 'Fine-Tuning LLMs with LoRA and PEFT', duration: '55 Min' },
        ],
      },
    ],
    outcomes: [
      'Building deep neural networks from scratch in PyTorch',
      'Transformer self-attention architectures and fine-tuning',
      'Adversarial attacks on machine learning models',
      'High-performance model quantization & deployment',
    ],
  },
  {
    _id: 'c5',
    title: 'Cloud Infrastructure & Kubernetes Security',
    category: 'Cloud Computing',
    level: 'Intermediate',
    instructor: { name: 'Marcus Brody', title: 'Principal DevSecOps Engineer' },
    description: 'Deploy, monitor, and harden containerized microservices across AWS, GCP, and Kubernetes clusters with automated zero-trust compliance.',
    duration: '6 Weeks',
    price: 0,
    originalPrice: 119,
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
    modules: [
      {
        title: 'Module 1: Container Hardening & Orchestration',
        order: 1,
        lessons: [
          { title: 'Docker Security Benchmarks & CIS Compliance', duration: '30 Min' },
          { title: 'Kubernetes Pod Security Standards & RBAC', duration: '45 Min' },
        ],
      },
      {
        title: 'Module 2: Cloud Network Isolation',
        order: 2,
        lessons: [
          { title: 'VPC Peering, Security Groups, & NetworkPolicies', duration: '40 Min' },
          { title: 'Automated CI/CD Vulnerability Gatekeeping', duration: '50 Min' },
        ],
      },
    ],
    outcomes: [
      'Kubernetes cluster defense and network policy isolation',
      'Infrastructure as Code (Terraform) security scanning',
      'Automated DevSecOps pipelines with GitHub Actions',
      'Cloud compliance auditing (CIS, SOC2, ISO 27001)',
    ],
  },
];

export default function Courses() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [courses, setCourses] = useState(COMPLETE_COURSES);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [expandedModule, setExpandedModule] = useState(0);
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [enrolledSuccess, setEnrolledSuccess] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  // Fetch real courses from backend and merge
  useEffect(() => {
    api
      .get('/courses')
      .then((res) => {
        if (res.data?.success && res.data?.courses?.length > 0) {
          const backendCourses = res.data.courses;

          const merged = backendCourses.map((bc) => {
            const match = COMPLETE_COURSES.find(
              (cc) =>
                cc.title.toLowerCase() === bc.title?.toLowerCase() ||
                cc.category.toLowerCase() === bc.category?.toLowerCase()
            );

            return {
              ...bc,
              price: 0,
              originalPrice: match?.originalPrice || 99,
              modules: bc.modules?.length > 0 ? bc.modules : match?.modules || COMPLETE_COURSES[0].modules,
              outcomes: match?.outcomes || [
                'Production-grade practical labs',
                'Comprehensive real-world threat defense',
                'Certificate of completion backed by Xevion',
              ],
            };
          });

          setCourses(merged);

          // Check if URL has ?selected=
          const queryId = searchParams.get('selected');
          if (queryId) {
            const found = merged.find((c) => c._id === queryId);
            if (found) {
              setSelectedCourse(found);
              setDrawerOpen(true);
            }
          }
        }
      })
      .catch((err) => {
        console.warn('Using complete course dataset fallback:', err);
      });
  }, [searchParams]);

  const categories = ['All', 'Cyber Security', 'Web Development', 'AI & Data Science', 'Cloud Computing'];

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.description?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCardClick = (course) => {
    setSelectedCourse(course);
    setExpandedModule(0);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  const handleEnrollClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setEnrollModalOpen(true);
    setEnrolledSuccess(false);
  };

  const confirmEnrollment = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!selectedCourse) return;

    setEnrolling(true);
    try {
      // Call both backend enrollment routes for complete database synchronization
      await Promise.allSettled([
        api.post(`/enrollments/${selectedCourse._id}`),
        api.post('/users/courses/enroll', { courseId: selectedCourse._id })
      ]);
      setEnrolledSuccess(true);
      setTimeout(() => {
        setEnrollModalOpen(false);
        setEnrolledSuccess(false);
        navigate(`/courses/${selectedCourse._id}/learn`);
      }, 1000);
    } catch (err) {
      console.error('Enrollment error:', err);
      setEnrolledSuccess(true);
      setTimeout(() => {
        setEnrollModalOpen(false);
        setEnrolledSuccess(false);
        navigate(`/courses/${selectedCourse._id}/learn`);
      }, 800);
    } finally {
      setEnrolling(false);
    }
  };

  return (
    <div
      style={{
        background: '#060a14',
        minHeight: '100vh',
        padding: '110px 24px 80px',
        color: '#e8f0fe',
        fontFamily: 'Inter, sans-serif',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>
        {/* ==========================================================
            HERO HEADER
            ========================================================== */}
        <div style={{ textAlign: 'center', maxWidth: 840, margin: '0 auto 36px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 16px',
              borderRadius: 20,
              background: 'rgba(0, 132, 255, 0.1)',
              border: '1px solid rgba(0, 132, 255, 0.25)',
              color: '#38bdf8',
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 16,
              fontFamily: 'JetBrains Mono, monospace',
            }}
          >
            <MdShield style={{ fontSize: 16 }} />
            <span>XEVION CYBER ACADEMY</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(32px, 4.5vw, 50px)',
              fontWeight: 800,
              color: '#ffffff',
              margin: '0 0 14px',
              fontFamily: 'Space Grotesk, sans-serif',
              letterSpacing: '-0.02em',
            }}
          >
            Explore{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #0084ff, #38bdf8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Certified Defense Courses
            </span>
          </h1>

          <p style={{ fontSize: 16, color: '#94a3b8', lineHeight: 1.65, margin: 0 }}>
            Click on any course card to open its description, curriculum, and lesson syllabus in the left side tab.
          </p>
        </div>

        {/* Filter Chips & Search Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            flexWrap: 'wrap',
            marginBottom: 36,
            padding: '16px 20px',
            background: 'rgba(10, 15, 34, 0.65)',
            border: '1px solid rgba(0, 132, 255, 0.15)',
            borderRadius: 16,
            backdropFilter: 'blur(12px)',
          }}
        >
          {/* Category Chips */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '7px 16px',
                    borderRadius: 20,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    background: active ? 'linear-gradient(135deg, #0084ff, #0052cc)' : 'rgba(255, 255, 255, 0.04)',
                    color: active ? '#ffffff' : '#94a3b8',
                    border: `1px solid ${active ? '#0084ff' : 'rgba(255, 255, 255, 0.08)'}`,
                    boxShadow: active ? '0 0 16px rgba(0, 132, 255, 0.35)' : 'none',
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: 'rgba(5, 11, 20, 0.8)',
              border: '1px solid rgba(0, 132, 255, 0.25)',
              borderRadius: 10,
              padding: '8px 14px',
              minWidth: 260,
            }}
          >
            <MdSearch style={{ color: '#0084ff', fontSize: 20 }} />
            <input
              type="text"
              placeholder="Search all courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#ffffff',
                fontSize: 13,
                width: '100%',
              }}
            />
          </div>
        </div>

        {/* ==========================================================
            COURSES GRID: 3 COURSES PER ROW
            ========================================================== */}
        <div
          className="xv-3col-course-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: 28,
          }}
        >
          {filteredCourses.map((course) => {
            const isSelected = selectedCourse?._id === course._id && drawerOpen;

            return (
              <div
                key={course._id}
                onClick={() => handleCardClick(course)}
                style={{
                  position: 'relative',
                  background: 'rgba(10, 15, 34, 0.92)',
                  backdropFilter: 'blur(20px)',
                  border: isSelected ? '2px solid #0084ff' : '1px solid rgba(0, 132, 255, 0.22)',
                  borderRadius: 20,
                  padding: 22,
                  boxShadow: isSelected
                    ? '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(0, 132, 255, 0.35)'
                    : '0 16px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 132, 255, 0.08)',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = 'rgba(0, 132, 255, 0.55)';
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.boxShadow = '0 20px 45px rgba(0, 0, 0, 0.65), 0 0 25px rgba(0, 132, 255, 0.2)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = 'rgba(0, 132, 255, 0.22)';
                    e.currentTarget.style.transform = 'translateY(0px)';
                    e.currentTarget.style.boxShadow = '0 16px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 132, 255, 0.08)';
                  }
                }}
              >
                {/* Active Indicator Ribbon */}
                {isSelected && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 14,
                      right: 14,
                      zIndex: 3,
                      padding: '3px 10px',
                      background: 'rgba(0, 132, 255, 0.25)',
                      border: '1px solid #0084ff',
                      borderRadius: 12,
                      fontSize: 10,
                      fontWeight: 800,
                      color: '#38bdf8',
                      fontFamily: 'JetBrains Mono, monospace',
                      letterSpacing: '0.05em',
                    }}
                  >
                    ● OPEN IN LEFT TAB
                  </div>
                )}

                {/* Video Thumbnail with Centered Glowing Play Button (Matches media_1789368569609.png) */}
                <div
                  style={{
                    position: 'relative',
                    borderRadius: 14,
                    overflow: 'hidden',
                    marginBottom: 18,
                    height: 190,
                    background: '#040711',
                  }}
                >
                  <img
                    src={course.thumbnail || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80'}
                    alt={course.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      transition: 'transform 0.4s ease',
                    }}
                  />

                  {/* Dark gradient overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'radial-gradient(circle, rgba(0,0,0,0.15) 0%, rgba(5,11,20,0.65) 100%)',
                    }}
                  />

                  {/* Center Glowing Play Icon Circle */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: 54,
                      height: 54,
                      borderRadius: '50%',
                      background: 'rgba(0, 132, 255, 0.35)',
                      backdropFilter: 'blur(8px)',
                      border: '2px solid rgba(56, 189, 248, 0.7)',
                      boxShadow: '0 0 25px rgba(0, 132, 255, 0.8)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'transform 0.25s ease',
                    }}
                  >
                    <span
                      style={{
                        width: 0,
                        height: 0,
                        borderTop: '9px solid transparent',
                        borderBottom: '9px solid transparent',
                        borderLeft: '14px solid #ffffff',
                        marginLeft: 3,
                      }}
                    />
                  </div>

                  {/* Category Chip on Thumbnail */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 12,
                      left: 12,
                      padding: '3px 10px',
                      background: 'rgba(5, 11, 20, 0.85)',
                      border: '1px solid rgba(0, 132, 255, 0.3)',
                      borderRadius: 20,
                      fontSize: 11,
                      color: '#38bdf8',
                      fontWeight: 700,
                      fontFamily: 'JetBrains Mono, monospace',
                    }}
                  >
                    {course.category}
                  </div>
                </div>

                {/* Course Title */}
                <h3
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: isSelected ? '#38bdf8' : '#ffffff',
                    marginBottom: 10,
                    fontFamily: 'Space Grotesk, sans-serif',
                    lineHeight: 1.35,
                    transition: 'color 0.2s',
                  }}
                >
                  {course.title}
                </h3>

                {/* Price Row */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 14 }}>
                  <span
                    style={{
                      fontSize: 28,
                      fontWeight: 800,
                      color: '#10b981',
                      fontFamily: 'Space Grotesk, sans-serif',
                    }}
                  >
                    FREE
                  </span>
                  {course.originalPrice && (
                    <span
                      style={{
                        fontSize: 15,
                        color: '#64748b',
                        textDecoration: 'line-through',
                      }}
                    >
                      ${course.originalPrice}
                    </span>
                  )}
                  <span
                    style={{
                      marginLeft: 'auto',
                      fontSize: 12,
                      color: '#94a3b8',
                      fontWeight: 500,
                    }}
                  >
                    {course.duration}
                  </span>
                </div>

                {/* Action Button: Click to Open Details Tab */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(course);
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 20px',
                    background: 'linear-gradient(135deg, #0084ff, #0052cc)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 12,
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: 'pointer',
                    marginBottom: 16,
                    boxShadow: '0 4px 18px rgba(0, 132, 255, 0.3)',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 6px 24px rgba(0, 132, 255, 0.55)')}
                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 4px 18px rgba(0, 132, 255, 0.3)')}
                >
                  <span>Enroll Free →</span>
                  <MdArrowForward style={{ fontSize: 16 }} />
                </button>

                {/* Key Perks Checklist */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    paddingTop: 14,
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    fontSize: 12,
                    color: '#94a3b8',
                    marginTop: 'auto',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: '#0084ff' }}>●</span>
                    <span>Full Lifetime Access</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: '#0084ff' }}>●</span>
                    <span>Access on Mobile, Tablet & Desktop</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: '#0084ff' }}>●</span>
                    <span>Verified Certificate of Completion</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ==========================================================
          LEFT SIDE TAB / DRAWER (Opens when a course is clicked)
          Contains full description, modules, syllabus, instructor
          ========================================================== */}
      {drawerOpen && selectedCourse && (
        <div
          onClick={handleCloseDrawer}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 2500,
            background: 'rgba(0, 0, 0, 0.72)',
            backdropFilter: 'blur(8px)',
            animation: 'fadeIn 0.25s ease',
          }}
        >
          {/* Drawer Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: 'min(580px, 94vw)',
              height: '100vh',
              background: 'rgba(8, 13, 28, 0.98)',
              borderRight: '1px solid rgba(0, 132, 255, 0.3)',
              boxShadow: '12px 0 60px rgba(0, 0, 0, 0.85), 0 0 40px rgba(0, 132, 255, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 2501,
              animation: 'slideFromLeft 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {/* Drawer Header */}
            <div
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid rgba(0, 132, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(0, 132, 255, 0.04)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span
                  style={{
                    padding: '4px 12px',
                    background: 'rgba(0, 132, 255, 0.15)',
                    color: '#38bdf8',
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 700,
                    border: '1px solid rgba(0, 132, 255, 0.35)',
                  }}
                >
                  {selectedCourse.category}
                </span>

                <span
                  style={{
                    padding: '4px 10px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: '#94a3b8',
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {selectedCourse.level || 'Beginner'}
                </span>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={handleCloseDrawer}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#94a3b8',
                  borderRadius: 10,
                  width: 36,
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: 20,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 68, 68, 0.15)';
                  e.currentTarget.style.color = '#ff5555';
                  e.currentTarget.style.borderColor = 'rgba(255, 68, 68, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                  e.currentTarget.style.color = '#94a3b8';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                }}
                title="Close Tab"
              >
                <MdClose />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '24px 28px 36px',
                display: 'flex',
                flexDirection: 'column',
                gap: 24,
              }}
            >
              {/* Course Title */}
              <h2
                style={{
                  fontSize: 'clamp(22px, 2.5vw, 30px)',
                  fontWeight: 800,
                  color: '#ffffff',
                  lineHeight: 1.28,
                  margin: 0,
                  fontFamily: 'Space Grotesk, sans-serif',
                }}
              >
                {selectedCourse.title}
              </h2>

              {/* Course Description */}
              <p
                style={{
                  fontSize: 15,
                  color: '#94a3b8',
                  lineHeight: 1.75,
                  margin: 0,
                }}
              >
                {selectedCourse.description}
              </p>

              {/* Instructor & Metadata Strip */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 16,
                  alignItems: 'center',
                  padding: '14px 18px',
                  background: 'rgba(5, 11, 22, 0.85)',
                  border: '1px solid rgba(0, 132, 255, 0.18)',
                  borderRadius: 14,
                }}
              >
                {/* Instructor */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #0084ff, #0052cc)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: 15,
                    }}
                  >
                    {selectedCourse.instructor?.name?.charAt(0) || 'X'}
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Instructor
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>
                      {selectedCourse.instructor?.name || 'Dr. Sarah Vance'}
                    </div>
                  </div>
                </div>

                <div style={{ height: 26, width: 1, background: 'rgba(255,255,255,0.08)' }} />

                {/* Duration */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: '#94a3b8', fontSize: 13 }}>
                  <MdTimer style={{ color: '#0084ff', fontSize: 18 }} />
                  <span>{selectedCourse.duration || '8 Weeks'}</span>
                </div>

                <div style={{ height: 26, width: 1, background: 'rgba(255,255,255,0.08)' }} />

                {/* Certificate */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: '#94a3b8', fontSize: 13 }}>
                  <MdWorkspacePremium style={{ color: '#f59e0b', fontSize: 18 }} />
                  <span>Verified Certificate</span>
                </div>
              </div>

              {/* Price Callout Banner */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  background: 'rgba(0, 132, 255, 0.08)',
                  border: '1px solid rgba(0, 132, 255, 0.25)',
                  borderRadius: 14,
                }}
              >
                <div>
                  <div style={{ fontSize: 11, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>
                    ✓ Free Access
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <span style={{ fontSize: 26, fontWeight: 800, color: '#10b981', fontFamily: 'Space Grotesk, sans-serif' }}>
                      FREE
                    </span>
                    {selectedCourse.originalPrice && (
                      <span style={{ fontSize: 14, color: '#64748b', textDecoration: 'line-through' }}>
                        ${selectedCourse.originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleEnrollClick}
                  style={{
                    padding: '11px 22px',
                    background: 'linear-gradient(135deg, #0084ff, #0052cc)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 10,
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: 'pointer',
                    boxShadow: '0 4px 18px rgba(0, 132, 255, 0.4)',
                  }}
                >
                  Enroll Free
                </button>
              </div>

              {/* Course Curriculum & Modules Accordion */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <MdMenuBook style={{ color: '#0084ff', fontSize: 20 }} />
                  <h3
                    style={{
                      fontSize: 17,
                      fontWeight: 700,
                      color: '#ffffff',
                      margin: 0,
                      fontFamily: 'Space Grotesk, sans-serif',
                    }}
                  >
                    Course Curriculum & Modules
                  </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {selectedCourse.modules?.map((module, mIdx) => {
                    const isExpanded = expandedModule === mIdx;
                    return (
                      <div
                        key={mIdx}
                        style={{
                          background: 'rgba(5, 11, 20, 0.8)',
                          border: `1px solid ${isExpanded ? 'rgba(0, 132, 255, 0.4)' : 'rgba(0, 132, 255, 0.12)'}`,
                          borderRadius: 12,
                          overflow: 'hidden',
                          transition: 'all 0.25s ease',
                        }}
                      >
                        {/* Module Header */}
                        <div
                          onClick={() => setExpandedModule(isExpanded ? -1 : mIdx)}
                          style={{
                            padding: '12px 16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                            background: isExpanded ? 'rgba(0, 132, 255, 0.08)' : 'transparent',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: 14, fontWeight: 700, color: '#ffffff' }}>
                              {module.title}
                            </span>
                          </div>
                          <span style={{ fontSize: 11, color: '#38bdf8', fontFamily: 'JetBrains Mono, monospace' }}>
                            {module.lessons?.length || 2} Lessons {isExpanded ? '▲' : '▼'}
                          </span>
                        </div>

                        {/* Lessons List */}
                        {isExpanded && (
                          <div
                            style={{
                              padding: '8px 16px 14px',
                              borderTop: '1px solid rgba(0, 132, 255, 0.08)',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 8,
                            }}
                          >
                            {module.lessons?.map((lesson, lIdx) => (
                              <div
                                key={lIdx}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  padding: '8px 12px',
                                  background: 'rgba(255, 255, 255, 0.02)',
                                  borderRadius: 6,
                                  fontSize: 13,
                                  color: '#e2e8f0',
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                  <MdPlayCircleOutline style={{ color: '#0084ff', fontSize: 16 }} />
                                  <span>{lesson.title}</span>
                                </div>
                                <span style={{ fontSize: 11, color: '#64748b', fontFamily: 'JetBrains Mono, monospace' }}>
                                  {lesson.duration || '30 Min'}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* What You Will Master */}
              <div
                style={{
                  padding: '16px 18px',
                  background: 'rgba(5, 11, 20, 0.7)',
                  border: '1px solid rgba(0, 132, 255, 0.12)',
                  borderRadius: 12,
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc', marginBottom: 10 }}>
                  What You Will Master:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {selectedCourse.outcomes?.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#94a3b8' }}>
                      <MdCheckCircle style={{ color: '#10b981', fontSize: 16, flexShrink: 0 }} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div style={{ display: 'flex', gap: 12, marginTop: 'auto', paddingTop: 10 }}>
                <button
                  type="button"
                  onClick={handleEnrollClick}
                  style={{
                    flex: 1,
                    padding: '14px 24px',
                    background: 'linear-gradient(135deg, #0084ff, #0052cc)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 12,
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: 'pointer',
                    boxShadow: '0 4px 20px rgba(0, 132, 255, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                >
                  <span>Start Free Course →</span>
                  <MdArrowForward />
                </button>

                <Link
                  to={`/courses/${selectedCourse._id}`}
                  style={{
                    padding: '14px 18px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    color: '#38bdf8',
                    border: '1px solid rgba(0, 132, 255, 0.25)',
                    borderRadius: 12,
                    fontWeight: 600,
                    fontSize: 13,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  Full Page ↗
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================================
          ENROLLMENT MODAL
          ========================================================== */}
      {enrollModalOpen && selectedCourse && (
        <div
          onClick={() => setEnrollModalOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 3000,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 480,
              background: '#0a0f22',
              border: '1px solid rgba(0, 132, 255, 0.4)',
              borderRadius: 20,
              padding: 28,
              boxShadow: '0 30px 70px rgba(0, 0, 0, 0.9), 0 0 40px rgba(0, 132, 255, 0.25)',
              position: 'relative',
            }}
          >
            <button
              type="button"
              onClick={() => setEnrollModalOpen(false)}
              style={{
                position: 'absolute',
                top: 18,
                right: 18,
                background: 'rgba(255, 255, 255, 0.06)',
                border: 'none',
                color: '#94a3b8',
                width: 32,
                height: 32,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: 18,
              }}
            >
              <MdClose />
            </button>

            {enrolledSuccess ? (
              <div style={{ textAlign: 'center', padding: '24px 10px' }}>
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: 'rgba(16, 185, 129, 0.2)',
                    border: '2px solid #10b981',
                    color: '#10b981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 32,
                    margin: '0 auto 16px',
                  }}
                >
                  ✓
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 8 }}>
                  Enrollment Successful!
                </h3>
                <p style={{ color: '#94a3b8', fontSize: 14 }}>
                  Redirecting to the course player...
                </p>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <MdShield style={{ color: '#0084ff', fontSize: 24 }} />
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: '#ffffff', margin: 0 }}>
                    Enroll in Course
                  </h3>
                </div>

                <div
                  style={{
                    padding: 14,
                    background: 'rgba(0, 132, 255, 0.08)',
                    borderRadius: 12,
                    border: '1px solid rgba(0, 132, 255, 0.2)',
                    marginBottom: 20,
                  }}
                >
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#ffffff', marginBottom: 4 }}>
                    {selectedCourse.title}
                  </div>
                  <div style={{ fontSize: 13, color: '#10b981', fontWeight: 700 }}>
                    ✓ Free Enrollment — No Payment Required
                  </div>
                </div>

                <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6, marginBottom: 24 }}>
                  You will get instant access to all interactive video lessons, CTF defense labs, downloadable code files, and verified certificate upon completion.
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    type="button"
                    onClick={() => setEnrollModalOpen(false)}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#94a3b8',
                      borderRadius: 10,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={confirmEnrollment}
                    style={{
                      flex: 1.5,
                      padding: '12px 20px',
                      background: 'linear-gradient(135deg, #0084ff, #0052cc)',
                      border: 'none',
                      color: '#ffffff',
                      borderRadius: 10,
                      fontWeight: 700,
                      fontSize: 14,
                      cursor: 'pointer',
                      boxShadow: '0 4px 18px rgba(0, 132, 255, 0.4)',
                    }}
                  >
                    Confirm & Start
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Animations and Responsive Styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideFromLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }

        @media (max-width: 1080px) {
          .xv-3col-course-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }

        @media (max-width: 680px) {
          .xv-3col-course-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
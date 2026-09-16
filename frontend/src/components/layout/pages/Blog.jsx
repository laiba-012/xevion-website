import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CATEGORIES = ['all', 'cybersecurity', 'programming', 'ai-ml', 'news', 'tutorial', 'ctf-writeup', 'community'];

// Static blog data
const staticPosts = [
  {
    _id: 1,
    slug: "cybersecurity-basics-2024",
    title: "Cybersecurity Basics: A Beginner's Guide for 2024",
    category: "cybersecurity",
    author: "Sarah Secure",
    excerpt: "Learn the fundamentals of cybersecurity including threat detection, password security, and safe browsing habits.",
    readTime: 8,
    views: 1240,
    isFeatured: true,
  },
  {
    _id: 2,
    slug: "python-for-security",
    title: "Python for Security Professionals",
    category: "programming",
    author: "Alex Code",
    excerpt: "Master Python programming for automation, security tools, and penetration testing.",
    readTime: 12,
    views: 890,
    isFeatured: false,
  },
  {
    _id: 3,
    slug: "ctf-writeup-2024",
    title: "CTF Writeup: How We Won the National Competition",
    category: "ctf-writeup",
    author: "Team Xevion",
    excerpt: "A detailed walkthrough of our approach to solving challenges in the recent CTF competition.",
    readTime: 15,
    views: 2100,
    isFeatured: true,
  },
  {
    _id: 4,
    slug: "ai-in-cybersecurity",
    title: "How AI is Transforming Cybersecurity",
    category: "ai-ml",
    author: "Dr. AI",
    excerpt: "Explore the role of artificial intelligence in modern security operations and threat detection.",
    readTime: 10,
    views: 1560,
    isFeatured: false,
  },
  {
    _id: 5,
    slug: "ransomware-protection",
    title: "Ransomware Protection: Complete Guide 2024",
    category: "cybersecurity",
    author: "Mike Secure",
    excerpt: "Learn how to protect your organization from ransomware attacks with these proven strategies.",
    readTime: 14,
    views: 3420,
    isFeatured: true,
  },
  {
    _id: 6,
    slug: "web-security-basics",
    title: "Web Security Basics for Developers",
    category: "tutorial",
    author: "Jane Dev",
    excerpt: "Essential web security practices every developer should know: XSS, CSRF, SQL Injection, and more.",
    readTime: 11,
    views: 980,
    isFeatured: false,
  }
];

const Blog = () => {
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');

  // Filter posts based on category and search
  const filteredPosts = staticPosts.filter(post => {
    const matchesCategory = category === 'all' || post.category === category;
    const matchesSearch = search === '' || 
      post.title.toLowerCase().includes(search.toLowerCase()) || 
      post.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
          }}>Knowledge Base</span>
          <h1 style={{ 
            fontFamily: 'var(--font-display)', 
            fontSize: 'clamp(36px, 5vw, 56px)', 
            fontWeight: 700, 
            marginTop: 12, 
            marginBottom: 16, 
            color: 'var(--text-primary)' 
          }}>Blog & Articles</h1>
          <p style={{ 
            color: 'var(--text-secondary)', 
            fontSize: 18, 
            maxWidth: 600 
          }}>Cybersecurity news, tutorials, CTF writeups, and community updates.</p>
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
          {/* Search and Filters */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 32 }}>
            <input 
              type="text" 
              placeholder="Search articles..." 
              style={{ 
                maxWidth: 280, 
                flex: 1, 
                padding: '10px 16px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                color: 'var(--text-primary)',
                fontSize: 14
              }}
              value={search} 
              onChange={e => setSearch(e.target.value)} 
            />
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {CATEGORIES.map(c => (
                <button 
                  key={c} 
                  style={{
                    padding: '8px 16px',
                    background: category === c ? 'var(--accent)' : 'transparent',
                    border: category === c ? 'none' : '1px solid var(--border)',
                    color: category === c ? 'var(--bg-primary)' : 'var(--text-secondary)',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontSize: 13,
                    transition: 'all 0.2s'
                  }}
                  onClick={() => setCategory(c)}>
                  {c.replace('-', ' ').toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>
            {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
          </p>

          {/* Posts Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
            gap: 24 
          }}>
            {filteredPosts.map(post => (
              <Link to={`/blog/${post.slug}`} key={post._id} style={{ textDecoration: 'none' }}>
                <div style={{ 
                  background: 'var(--bg-card)', 
                  borderRadius: 12, 
                  border: '1px solid var(--border)', 
                  padding: 24,
                  transition: 'transform 0.3s, border-color 0.3s',
                  height: '100%'
                }}>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                    <span style={{ 
                      padding: '4px 10px', 
                      background: 'rgba(0,212,255,0.1)', 
                      color: 'var(--accent)', 
                      borderRadius: 20, 
                      fontSize: 11,
                      fontFamily: 'var(--font-mono)'
                    }}>{post.category}</span>
                    {post.isFeatured && (
                      <span style={{ 
                        padding: '4px 10px', 
                        background: 'rgba(0,255,0,0.1)', 
                        color: '#00ff00', 
                        borderRadius: 20, 
                        fontSize: 11 
                      }}>Featured</span>
                    )}
                  </div>
                  <h3 style={{ 
                    fontFamily: 'var(--font-display)', 
                    fontSize: 18, 
                    fontWeight: 600, 
                    marginBottom: 12, 
                    color: 'var(--text-primary)', 
                    lineHeight: 1.4 
                  }}>{post.title}</h3>
                  <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 16 }}>
                    {post.excerpt}
                  </p>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    fontSize: 12, 
                    color: 'var(--text-muted)', 
                    paddingTop: 12, 
                    borderTop: '1px solid var(--border)' 
                  }}>
                    <span>✍️ {post.author}</span>
                    <span>⏱ {post.readTime} min · 👁 {post.views}</span>
                  </div>
                </div>
              </Link>
            ))}
            {filteredPosts.length === 0 && (
              <p style={{ color: 'var(--text-muted)', gridColumn: '1/-1', textAlign: 'center', padding: 60 }}>
                No articles found.
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Blog;
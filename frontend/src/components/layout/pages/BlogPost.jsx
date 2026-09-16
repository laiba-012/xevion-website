import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// Static blog data - same as Blog.jsx but with full content
const blogPostsData = {
  "cybersecurity-basics-2024": {
    _id: 1,
    slug: "cybersecurity-basics-2024",
    title: "Cybersecurity Basics: A Beginner's Guide for 2024",
    category: "cybersecurity",
    author: "Sarah Secure",
    content: `
      <h2>Introduction to Cybersecurity</h2>
      <p>Cybersecurity is the practice of protecting systems, networks, and programs from digital attacks. These attacks are usually aimed at accessing, changing, or destroying sensitive information; extorting money from users; or interrupting normal business processes.</p>
      
      <h2>Why Cybersecurity Matters</h2>
      <p>In today's connected world, everyone benefits from advanced cyberdefense programs. At an individual level, a cybersecurity attack can result in everything from identity theft to extortion attempts, to the loss of important data like family photos. Everyone relies on critical infrastructure like power plants, hospitals, and financial service companies. Securing these and other organizations is essential to keeping our society functioning.</p>
      
      <h2>Key Cybersecurity Concepts</h2>
      <h3>Confidentiality</h3>
      <p>Ensuring that information is not disclosed to unauthorized individuals. This is why you have passwords, encryption, and access controls.</p>
      
      <h3>Integrity</h3>
      <p>Maintaining the accuracy and completeness of data. This ensures that information hasn't been tampered with or altered by unauthorized parties.</p>
      
      <h3>Availability</h3>
      <p>Ensuring that information and resources are accessible to authorized users when needed. This is why we have backups and redundancy.</p>
      
      <h2>Common Cyber Threats</h2>
      <ul>
        <li><strong>Malware:</strong> Malicious software including viruses, worms, ransomware, and spyware</li>
        <li><strong>Phishing:</strong> Fraudulent attempts to obtain sensitive information by disguising as trustworthy entities</li>
        <li><strong>Man-in-the-Middle (MitM) Attacks:</strong> When attackers intercept communication between two parties</li>
        <li><strong>Denial-of-Service (DoS) Attacks:</strong> Overwhelming systems with traffic to make them unavailable</li>
        <li><strong>SQL Injection:</strong> Inserting malicious code into databases through vulnerable input fields</li>
        <li><strong>Zero-Day Exploits:</strong> Attacks on previously unknown vulnerabilities</li>
      </ul>
      
      <h2>Best Practices for Staying Secure</h2>
      <ul>
        <li>Use strong, unique passwords for every account</li>
        <li>Enable two-factor authentication (2FA) wherever possible</li>
        <li>Keep all software and systems updated</li>
        <li>Be cautious of suspicious emails, links, and attachments</li>
        <li>Use a reputable VPN on public Wi-Fi</li>
        <li>Regularly backup important data</li>
        <li>Use antivirus and anti-malware software</li>
      </ul>
      
      <h2>Getting Started in Cybersecurity</h2>
      <p>If you're interested in pursuing a career in cybersecurity, start with these steps:</p>
      <ul>
        <li>Learn networking fundamentals (TCP/IP, DNS, HTTP)</li>
        <li>Study operating systems (Windows, Linux, macOS)</li>
        <li>Learn a programming language (Python is highly recommended)</li>
        <li>Get certified (CompTIA Security+, CEH, CISSP)</li>
        <li>Practice on platforms like TryHackMe, Hack The Box, and CTF competitions</li>
        <li>Join cybersecurity communities and attend conferences</li>
      </ul>
      
      <p>Remember, cybersecurity is a journey, not a destination. Stay curious, keep learning, and always think about security first!</p>
    `,
    readTime: 8,
    views: 1240,
    image: null,
    tags: ["cybersecurity", "beginners", "security", "guide"],
    createdAt: "2024-01-15T10:00:00Z"
  },
  "python-for-security": {
    _id: 2,
    slug: "python-for-security",
    title: "Python for Security Professionals",
    category: "programming",
    author: "Alex Code",
    content: `
      <h2>Why Python for Cybersecurity?</h2>
      <p>Python has become the go-to language for cybersecurity professionals due to its simplicity, readability, and extensive library ecosystem. Whether you're a penetration tester, security analyst, or malware researcher, Python can supercharge your workflow.</p>
      
      <h2>Essential Python Libraries for Security</h2>
      <ul>
        <li><strong>Scapy:</strong> Packet manipulation and network scanning</li>
        <li><strong>Requests:</strong> Making HTTP requests for web security testing</li>
        <li><strong>BeautifulSoup:</strong> Web scraping for OSINT and data gathering</li>
        <li><strong>Cryptography:</strong> Implementing encryption and decryption</li>
        <li><strong>Paramiko:</strong> SSH protocol implementation</li>
        <li><strong>Socket:</strong> Low-level networking for custom tools</li>
        <li><strong>Impacket:</strong> Working with network protocols</li>
      </ul>
      
      <h2>Example 1: Simple Port Scanner</h2>
      <pre><code>import socket
from datetime import datetime

def scan_port(host, port):
    """Scan a single port on a host"""
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(1)
    result = sock.connect_ex((host, port))
    sock.close()
    return result == 0

def scan_ports(host, start_port, end_port):
    """Scan a range of ports"""
    print(f"Scanning {host} from port {start_port} to {end_port}")
    start_time = datetime.now()
    
    open_ports = []
    for port in range(start_port, end_port + 1):
        if scan_port(host, port):
            open_ports.append(port)
            print(f"Port {port}: OPEN")
    
    end_time = datetime.now()
    print(f"Scan completed in {end_time - start_time}")
    return open_ports

# Usage
if __name__ == "__main__":
    target = "scanme.nmap.org"
    open_ports = scan_ports(target, 20, 100)
    print(f"\nOpen ports: {open_ports}")</code></pre>
      
      <h2>Example 2: Password Strength Checker</h2>
      <pre><code>import re

def check_password_strength(password):
    """Check password strength and return score"""
    score = 0
    feedback = []
    
    # Length check
    if len(password) >= 12:
        score += 2
    elif len(password) >= 8:
        score += 1
    else:
        feedback.append("Password too short (minimum 8 characters)")
    
    # Uppercase check
    if re.search(r'[A-Z]', password):
        score += 1
    else:
        feedback.append("Add uppercase letters")
    
    # Lowercase check
    if re.search(r'[a-z]', password):
        score += 1
    else:
        feedback.append("Add lowercase letters")
    
    # Digit check
    if re.search(r'\d', password):
        score += 1
    else:
        feedback.append("Add numbers")
    
    # Special character check
    if re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        score += 1
    else:
        feedback.append("Add special characters")
    
    # Rating
    if score >= 6:
        rating = "Very Strong"
    elif score >= 4:
        rating = "Strong"
    elif score >= 2:
        rating = "Weak"
    else:
        rating = "Very Weak"
    
    return rating, score, feedback

# Test
password = input("Enter password to check: ")
rating, score, feedback = check_password_strength(password)
print(f"\nRating: {rating} (Score: {score}/6)")
if feedback:
    print("Suggestions:", ", ".join(feedback))</code></pre>
      
      <h2>Best Practices for Security Scripts</h2>
      <ul>
        <li>Always handle exceptions gracefully</li>
        <li>Use logging instead of print statements for production tools</li>
        <li>Implement rate limiting to avoid being blocked</li>
        <li>Never hardcode credentials - use environment variables</li>
        <li>Validate and sanitize all input</li>
        <li>Follow ethical guidelines - only test systems you own or have permission to test</li>
      </ul>
      
      <h2>Next Steps</h2>
      <p>Start building your own security tools! Begin with simple scripts like log analyzers, file integrity checkers, or automated backup tools. As you gain confidence, move on to more complex projects like network monitors or vulnerability scanners.</p>
      
      <p>Remember: With great power comes great responsibility. Always use your skills ethically and legally.</p>
    `,
    readTime: 12,
    views: 890,
    image: null,
    tags: ["python", "programming", "automation", "scripting"],
    createdAt: "2024-01-20T10:00:00Z"
  },
  "ctf-writeup-2024": {
    _id: 3,
    slug: "ctf-writeup-2024",
    title: "CTF Writeup: How We Won the National Competition",
    category: "ctf-writeup",
    author: "Team Xevion",
    content: `
      <h2>Introduction</h2>
      <p>Last month, Team Xevion participated in the National Cybersecurity Challenge, a 48-hour Capture The Flag (CTF) competition with over 200 teams from across the country. We're excited to share our journey, strategies, and solutions for some of the most challenging problems.</p>
      
      <h2>Our Team Strategy</h2>
      <p>Success in CTF competitions isn't just about technical skills - it's about teamwork, organization, and strategy. Here's how we approached the competition:</p>
      <ul>
        <li><strong>Role Assignment:</strong> Each team member focused on specific categories (web, pwn, crypto, forensics, OSINT)</li>
        <li><strong>Communication:</strong> Used Discord for real-time coordination and shared notes</li>
        <li><strong>Time Management:</strong> Prioritized easier challenges first to build momentum</li>
        <li><strong>Documentation:</strong> Maintained detailed notes of all attempts and solutions</li>
        <li><strong>Rest Periods:</strong> Scheduled breaks to avoid burnout during the 48-hour period</li>
      </ul>
      
      <h2>Challenge 1: Web Exploitation - "Login Bypass" (500 points)</h2>
      <p><strong>Challenge Description:</strong> A login page with SQL injection vulnerability. Find a way to bypass authentication and retrieve the flag.</p>
      
      <h3>Solution Approach:</h3>
      <p>We identified that the login form was vulnerable to SQL injection. After testing various payloads, we discovered that the application was using vulnerable SQL queries.</p>
      
      <p><strong>Step 1:</strong> Tested for basic injection by entering <code>' OR '1'='1</code> in the username field</p>
      <p><strong>Step 2:</strong> Got access but needed to extract the flag from the database</p>
      <p><strong>Step 3:</strong> Used UNION-based injection to extract data:</p>
      <pre><code>' UNION SELECT null, username, password, flag FROM users --</code></pre>
      <p><strong>Step 4:</strong> Retrieved the flag: <code>CTF{sql_injection_ftw_2024}</code></p>
      
      <h2>Challenge 2: Cryptography - "RSA Oracle" (750 points)</h2>
      <p><strong>Challenge Description:</strong> We're given an RSA encryption oracle that can decrypt anything except the flag itself. How can we get the flag?</p>
      
      <h3>Solution Approach:</h3>
      <p>This is a classic RSA blinding attack. The vulnerability comes from the multiplicative property of RSA:</p>
      <p><code>E(m1) * E(m2) = E(m1 * m2)</code></p>
      
      <p><strong>Step 1:</strong> Choose a random number r and calculate <code>c' = c * r^e mod n</code></p>
      <p><strong>Step 2:</strong> Send c' to the oracle to get <code>m' = (m * r) mod n</code></p>
      <p><strong>Step 3:</strong> Calculate <code>m = m' * r^(-1) mod n</code></p>
      
      <p>Using this method, we successfully recovered the flag: <code>CTF{rsa_blinding_is_fun}</code></p>
      
      <h2>Challenge 3: Forensics - "Hidden in Plain Sight" (600 points)</h2>
      <p><strong>Challenge Description:</strong> A disk image containing deleted files. Recover the flag.</p>
      
      <h3>Solution Approach:</h3>
      <p>We used various forensics tools to analyze the disk image:</p>
      <pre><code># Analyze with Autopsy
autopsy disk_image.dd

# Use foremost to recover deleted files
foremost -i disk_image.dd -o recovered

# Check for hidden partitions
fdisk -l disk_image.dd

# Extract hidden data with binwalk
binwalk -e disk_image.dd</code></pre>
      
      <p>After extensive analysis, we found a hidden partition containing a text file with the flag: <code>CTF{forensics_master_2024}</code></p>
      
      <h2>Key Takeaways</h2>
      <ul>
        <li>Preparation is crucial - practice different categories before competition</li>
        <li>Team communication can make or break your performance</li>
        <li>Don't get stuck on one challenge - rotate and come back with fresh perspective</li>
        <li>Document everything - you'll thank yourself later</li>
        <li>Learn from writeups of previous CTFs</li>
      </ul>
      
      <h2>Resources We Recommend</h2>
      <ul>
        <li>TryHackMe - Great for beginners</li>
        <li>Hack The Box - More advanced challenges</li>
        <li>picoCTF - Excellent educational platform</li>
        <li>CTFtime - Find upcoming competitions</li>
        <li>YouTube channels: IppSec, John Hammond, LiveOverflow</li>
      </ul>
      
      <p>Ready to start your CTF journey? Join our community and practice with us!</p>
    `,
    readTime: 15,
    views: 2100,
    image: null,
    tags: ["ctf", "writeup", "competition", "hacking"],
    createdAt: "2024-02-01T10:00:00Z"
  }
};

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      const foundPost = blogPostsData[slug];
      setPost(foundPost || null);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [slug]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner" style={{
          width: 50,
          height: 50,
          border: '3px solid var(--border)',
          borderTopColor: 'var(--accent)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 24px', color: 'var(--text-secondary)' }}>
        <h2 style={{ marginBottom: 20, color: 'var(--text-primary)' }}>Article not found</h2>
        <p style={{ marginBottom: 30 }}>The blog post you're looking for doesn't exist or has been moved.</p>
        <Link to="/blog" style={{
          display: 'inline-block',
          padding: '12px 28px',
          background: 'var(--accent)',
          color: 'var(--bg-primary)',
          textDecoration: 'none',
          borderRadius: 8,
          fontWeight: 600
        }}>← Back to Blog</Link>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <div style={{
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border)',
        padding: '80px 0 40px'
      }}>
        <div className="container" style={{
          maxWidth: 800,
          margin: '0 auto',
          paddingLeft: 24,
          paddingRight: 24
        }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{
              padding: '4px 10px',
              background: 'rgba(0,212,255,0.1)',
              color: 'var(--accent)',
              borderRadius: 20,
              fontSize: 12,
              fontFamily: 'var(--font-mono)'
            }}>{post.category}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>
              {post.readTime} min read · {post.views.toLocaleString()} views
            </span>
          </div>
          <h1 style={{
            fontSize: 'clamp(28px, 4vw, 48px)',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            marginBottom: 20,
            lineHeight: 1.15,
            color: 'var(--text-primary)'
          }}>{post.title}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              color: 'var(--bg-primary)',
              fontSize: 18
            }}>
              {post.author?.[0]?.toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-primary)' }}>{post.author}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                {new Date(post.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article style={{ padding: '60px 0' }}>
        <div className="container" style={{
          maxWidth: 800,
          margin: '0 auto',
          paddingLeft: 24,
          paddingRight: 24
        }}>
          {post.image && (
            <img
              src={post.image}
              alt={post.title}
              style={{
                width: '100%',
                borderRadius: 12,
                marginBottom: 40,
                maxHeight: 400,
                objectFit: 'cover'
              }}
            />
          )}
          <div
                style={{
                  color: 'var(--text-secondary)',
                  lineHeight: 1.9,
                  fontSize: 17
                }}
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
              {post.tags?.length > 0 && (
                <div style={{
                  marginTop: 48,
                  paddingTop: 32,
                  borderTop: '1px solid var(--border)',
                  display: 'flex',
                  gap: 10,
                  flexWrap: 'wrap'
                }}>
                  {post.tags.map(tag => (
                    <span
                      key={tag}
                      style={{
                        padding: '6px 14px',
                        background: 'rgba(0,212,255,0.1)',
                        color: 'var(--accent)',
                        borderRadius: 20,
                        fontSize: 12
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              <div style={{
                marginTop: 48,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 16,
                paddingTop: 32,
                borderTop: '1px solid var(--border)'
              }}>
                <Link
                  to="/blog"
                  style={{
                    padding: '10px 24px',
                    background: 'transparent',
                    border: '1px solid var(--border)',
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    borderRadius: 8,
                    transition: 'all 0.2s'
                  }}
                >
                  ← Back to Blog
                </Link>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    onClick={() => {
                      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`;
                      window.open(twitterUrl, '_blank');
                    }}
                    style={{
                      padding: '10px 20px',
                      background: 'transparent',
                      border: '1px solid var(--border)',
                      color: 'var(--text-secondary)',
                      borderRadius: 8,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    Share on Twitter
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link copied to clipboard!');
                    }}
                    style={{
                      padding: '10px 20px',
                      background: 'transparent',
                      border: '1px solid var(--border)',
                      color: 'var(--text-secondary)',
                      borderRadius: 8,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    Copy Link
                  </button>
                </div>
              </div>
            </div>
          </article>
        </>
      );
    };
    
    export default BlogPost;
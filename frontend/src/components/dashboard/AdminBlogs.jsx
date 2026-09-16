// src/components/dashboard/AdminBlogs.jsx
import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);

  const [blogForm, setBlogForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'general',
    tags: '',
    isPublished: false,
    isFeatured: false
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await api.get('/admin/blogs');
      setBlogs(res.data.data || []);
    } catch (err) {
      console.error('Error fetching blogs:', err);
      // Sample data
      setBlogs([
        { 
          id: 1, 
          title: 'Top 10 Cybersecurity Tips for 2026', 
          excerpt: 'Essential tips for staying safe online',
          content: 'Full content here...',
          category: 'security',
          isPublished: true,
          isFeatured: true,
          createdAt: new Date().toISOString()
        },
        { 
          id: 2, 
          title: 'AI in Cybersecurity: The Future is Here', 
          excerpt: 'How AI is changing the security landscape',
          content: 'Full content here...',
          category: 'ai',
          isPublished: false,
          isFeatured: false,
          createdAt: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBlog = async (e) => {
    e.preventDefault();
    try {
      const tagsArray = blogForm.tags.split(',').map(t => t.trim()).filter(t => t);
      const res = await api.post('/admin/blogs', { ...blogForm, tags: tagsArray });
      setBlogs([res.data.data, ...blogs]);
      setShowCreateModal(false);
      setBlogForm({ title: '', excerpt: '', content: '', category: 'general', tags: '', isPublished: false, isFeatured: false });
      alert('✅ Blog created successfully!');
    } catch (err) {
      alert('❌ Failed to create blog');
    }
  };

  const handleDeleteBlog = async (blogId) => {
    if (!confirm('Delete this blog?')) return;
    try {
      await api.delete(`/admin/blogs/${blogId}`);
      setBlogs(blogs.filter(b => b.id !== blogId));
      alert('✅ Blog deleted successfully!');
    } catch (err) {
      alert('❌ Failed to delete blog');
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 100 }}>Loading...</div>;
  }

  return (
    <div style={{ padding: '40px 32px', maxWidth: 1200, margin: '0 auto', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#0f172a', margin: 0 }}>📝 Blogs</h1>
          <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>Manage all blog posts</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} style={{
          padding: '10px 24px',
          background: '#6366f1',
          color: '#fff',
          border: 'none',
          borderRadius: 10,
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer'
        }}>
          + New Blog
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 20 }}>
        {blogs.map((blog) => (
          <div key={blog.id} style={{ background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0', padding: 20 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
              <span style={{ padding: '4px 12px', background: '#eef2ff', color: '#6366f1', borderRadius: 20, fontSize: 11 }}>{blog.category}</span>
              {blog.isPublished ? (
                <span style={{ padding: '4px 12px', background: '#dcfce7', color: '#065f46', borderRadius: 20, fontSize: 11 }}>✅ Published</span>
              ) : (
                <span style={{ padding: '4px 12px', background: '#fef3c7', color: '#92400e', borderRadius: 20, fontSize: 11 }}>📝 Draft</span>
              )}
              {blog.isFeatured && (
                <span style={{ padding: '4px 12px', background: '#fef3c7', color: '#92400e', borderRadius: 20, fontSize: 11 }}>⭐ Featured</span>
              )}
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#0f172a', marginBottom: 4 }}>{blog.title}</h3>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 12 }}>{blog.excerpt}</p>
            <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 12 }}>
              📅 {new Date(blog.createdAt).toLocaleDateString()}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => { setSelectedBlog(blog); setShowEditModal(true); }} style={{ padding: '5px 14px', background: '#dbeafe', color: '#1d4ed8', border: 'none', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>✏️ Edit</button>
              <button onClick={() => handleDeleteBlog(blog.id)} style={{ padding: '5px 14px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>🗑️ Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div style={modalStyles.overlay} onClick={() => setShowCreateModal(false)}>
          <div style={{ ...modalStyles.modal, maxWidth: 560 }} onClick={(e) => e.stopPropagation()}>
            <div style={modalStyles.header}>
              <h2 style={modalStyles.title}>📝 Create New Blog</h2>
              <button style={modalStyles.close} onClick={() => setShowCreateModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreateBlog}>
              <div style={modalStyles.group}>
                <label style={modalStyles.label}>Title *</label>
                <input type="text" value={blogForm.title} onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })} style={modalStyles.input} required />
              </div>
              <div style={modalStyles.group}>
                <label style={modalStyles.label}>Excerpt</label>
                <input type="text" value={blogForm.excerpt} onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })} style={modalStyles.input} />
              </div>
              <div style={modalStyles.group}>
                <label style={modalStyles.label}>Content *</label>
                <textarea value={blogForm.content} onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })} style={{ ...modalStyles.input, minHeight: 120 }} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={modalStyles.group}>
                  <label style={modalStyles.label}>Category</label>
                  <select value={blogForm.category} onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })} style={modalStyles.input}>
                    <option value="general">General</option>
                    <option value="security">Security</option>
                    <option value="ai">AI</option>
                    <option value="news">News</option>
                    <option value="tutorial">Tutorial</option>
                  </select>
                </div>
                <div style={modalStyles.group}>
                  <label style={modalStyles.label}>Tags (comma separated)</label>
                  <input type="text" value={blogForm.tags} onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value })} style={modalStyles.input} placeholder="cybersecurity, hacking, tips" />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" checked={blogForm.isPublished} onChange={(e) => setBlogForm({ ...blogForm, isPublished: e.target.checked })} />
                  <span style={{ fontSize: 14 }}>Publish</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" checked={blogForm.isFeatured} onChange={(e) => setBlogForm({ ...blogForm, isFeatured: e.target.checked })} />
                  <span style={{ fontSize: 14 }}>Feature</span>
                </label>
              </div>
              <div style={modalStyles.actions}>
                <button type="button" style={modalStyles.cancel} onClick={() => setShowCreateModal(false)}>Cancel</button>
                <button type="submit" style={modalStyles.save}>Create Blog</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modal: {
    background: '#fff',
    borderRadius: 16,
    padding: 32,
    maxWidth: 480,
    width: '90%',
    maxHeight: '90vh',
    overflow: 'auto'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    color: '#0f172a',
    margin: 0
  },
  close: {
    background: 'none',
    border: 'none',
    fontSize: 28,
    color: '#64748b',
    cursor: 'pointer'
  },
  group: {
    marginBottom: 16
  },
  label: {
    display: 'block',
    fontSize: 14,
    fontWeight: 500,
    color: '#334155',
    marginBottom: 6
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    fontSize: 14,
    color: '#0f172a',
    background: '#fff',
    boxSizing: 'border-box'
  },
  actions: {
    display: 'flex',
    gap: 12,
    marginTop: 24,
    justifyContent: 'flex-end'
  },
  cancel: {
    padding: '8px 20px',
    background: '#f1f5f9',
    border: 'none',
    borderRadius: 8,
    color: '#0f172a',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 500
  },
  save: {
    padding: '8px 20px',
    background: '#6366f1',
    border: 'none',
    borderRadius: 8,
    color: '#fff',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 500
  }
};

export default AdminBlogs;
// src/components/dashboard/AdminBlogs.jsx
import React, { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const EMPTY_FORM = {
  title: '',
  excerpt: '',
  content: '',
  category: 'general',
  tags: '',
  isPublished: false,
  isFeatured: false,
};

// Quill toolbar config
const QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    ['blockquote', 'code-block'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    ['clean'],
  ],
};

const QUILL_FORMATS = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'color', 'background', 'blockquote', 'code-block',
  'list', 'bullet', 'link', 'image',
];

const AdminBlogs = () => {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => { fetchBlogs(); }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/blogs');
      setBlogs(res.data.data || []);
    } catch (err) {
      // Demo fallback
      setBlogs([
        {
          _id: 'demo1',
          title: 'Top 10 Cybersecurity Tips for 2026',
          excerpt: 'Essential tips for staying safe online in the modern threat landscape.',
          category: 'security',
          isPublished: true,
          featured: true,
          createdAt: new Date().toISOString(),
        },
        {
          _id: 'demo2',
          title: 'AI in Cybersecurity: The Future is Here',
          excerpt: 'How artificial intelligence is reshaping threat detection and response.',
          category: 'ai',
          isPublished: false,
          featured: false,
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingBlog(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (blog) => {
    setEditingBlog(blog);
    setForm({
      title: blog.title || '',
      excerpt: blog.excerpt || '',
      content: blog.content || '',
      category: blog.category || 'general',
      tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : blog.tags || '',
      isPublished: blog.isPublished || false,
      isFeatured: blog.featured || false,
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return showToast('❌ Title required!');
    if (!form.content || form.content === '<p><br></p>') return showToast('❌ Content required!');

    setSaving(true);
    try {
      const payload = {
        ...form,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      };

      if (editingBlog) {
        await api.put('/blogs/' + editingBlog._id, payload);
        showToast('✅ Blog updated!');
      } else {
        await api.post('/blogs', payload);
        showToast('✅ Blog created!');
      }
      setShowModal(false);
      fetchBlogs();
    } catch (err) {
      showToast('❌ ' + (err.response?.data?.message || 'Save failed'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this blog?')) return;
    try {
      await api.delete('/blogs/' + id);
      showToast('✅ Deleted!');
      fetchBlogs();
    } catch (err) {
      showToast('❌ Delete failed');
    }
  };

  const CATS = {
    general: { bg: '#e0e7ff', color: '#4338ca' },
    security: { bg: '#dcfce7', color: '#166534' },
    ai: { bg: '#fce7f3', color: '#9d174d' },
    news: { bg: '#fef3c7', color: '#92400e' },
    tutorial: { bg: '#dbeafe', color: '#1d4ed8' },
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400, color: '#38bdf8', fontSize: 18 }}>
      Loading blogs...
    </div>
  );

  return (
    <>
      {/* Quill dark override */}
      <style>{`
        .ql-toolbar { background: #1e293b !important; border: 1px solid rgba(0,132,255,0.25) !important; border-radius: 10px 10px 0 0 !important; }
        .ql-toolbar .ql-stroke { stroke: #94a3b8 !important; }
        .ql-toolbar .ql-fill { fill: #94a3b8 !important; }
        .ql-toolbar .ql-picker-label { color: #94a3b8 !important; }
        .ql-toolbar .ql-picker-label:hover { color: #38bdf8 !important; }
        .ql-toolbar button:hover .ql-stroke { stroke: #38bdf8 !important; }
        .ql-toolbar button:hover .ql-fill { fill: #38bdf8 !important; }
        .ql-toolbar button.ql-active .ql-stroke { stroke: #0084ff !important; }
        .ql-toolbar .ql-picker-options { background: #1e293b !important; border: 1px solid rgba(0,132,255,0.25) !important; color: #94a3b8 !important; }
        .ql-toolbar .ql-picker-item:hover { color: #38bdf8 !important; }
        .ql-container { background: #0f172a !important; border: 1px solid rgba(0,132,255,0.25) !important; border-top: none !important; border-radius: 0 0 10px 10px !important; min-height: 260px; color: #e2e8f0 !important; font-size: 15px; }
        .ql-editor { min-height: 240px; padding: 16px; }
        .ql-editor::before { color: #475569 !important; font-style: normal !important; }
        .ql-editor code, .ql-editor pre { background: #1e3a5f !important; color: #7dd3fc !important; border-radius: 6px !important; }
        .ql-editor a { color: #38bdf8 !important; }
        .ql-editor blockquote { border-left: 4px solid #0084ff !important; color: #94a3b8 !important; }
        .ql-picker-label::before { color: #94a3b8 !important; }
      `}</style>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 24, right: 24, zIndex: 9999,
          padding: '12px 24px', borderRadius: 12,
          background: toast.startsWith('✅') ? '#022c22' : '#2d0a0a',
          border: `1px solid ${toast.startsWith('✅') ? '#10b981' : '#ef4444'}`,
          color: toast.startsWith('✅') ? '#10b981' : '#ef4444',
          fontWeight: 600, fontSize: 14, boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
        }}>
          {toast}
        </div>
      )}

      <div style={{ padding: '32px', maxWidth: 1200, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: '#f8fafc', margin: 0, fontFamily: 'Space Grotesk, sans-serif' }}>
              📝 Blog Management
            </h1>
            <p style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>{blogs.length} total blogs</p>
          </div>
          <button onClick={openCreate} style={{
            padding: '10px 22px',
            background: 'linear-gradient(135deg, #0084ff, #0052cc)',
            border: 'none', borderRadius: 10,
            color: '#fff', fontSize: 14, fontWeight: 700,
            cursor: 'pointer', boxShadow: '0 4px 18px rgba(0,132,255,0.4)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            + New Blog Post
          </button>
        </div>

        {/* Blog Cards */}
        {blogs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 80, color: '#475569', fontSize: 16 }}>
            No blogs yet. Create your first blog post!
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
            {blogs.map(blog => (
              <div key={blog._id} style={{
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(0,132,255,0.15)',
                borderRadius: 16, padding: 22,
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,132,255,0.4)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(0,132,255,0.15)'}
              >
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                  <span style={{
                    padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                    background: CATS[blog.category]?.bg || '#e0e7ff',
                    color: CATS[blog.category]?.color || '#4338ca',
                  }}>{blog.category}</span>
                  <span style={{
                    padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                    background: blog.isPublished ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                    color: blog.isPublished ? '#10b981' : '#f59e0b',
                  }}>{blog.isPublished ? '✅ Published' : '📝 Draft'}</span>
                  {blog.featured && (
                    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: 'rgba(251,191,36,0.15)', color: '#fbbf24' }}>⭐ Featured</span>
                  )}
                </div>

                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', marginBottom: 6, lineHeight: 1.4 }}>
                  {blog.title}
                </h3>
                <p style={{ fontSize: 13, color: '#64748b', marginBottom: 14, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {blog.excerpt}
                </p>
                <div style={{ fontSize: 12, color: '#475569', marginBottom: 14 }}>
                  📅 {new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => openEdit(blog)} style={{
                    flex: 1, padding: '7px 0',
                    background: 'rgba(59,130,246,0.15)',
                    border: '1px solid rgba(59,130,246,0.35)',
                    borderRadius: 8, color: '#60a5fa',
                    fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  }}>✏️ Edit</button>
                  <button onClick={() => handleDelete(blog._id)} style={{
                    flex: 1, padding: '7px 0',
                    background: 'rgba(239,68,68,0.1)',
                    border: '1px solid rgba(239,68,68,0.3)',
                    borderRadius: 8, color: '#f87171',
                    fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  }}>🗑️ Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div onClick={() => setShowModal(false)} style={{
          position: 'fixed', inset: 0, zIndex: 2000,
          background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: '#0a0f1e',
            border: '1px solid rgba(0,132,255,0.25)',
            borderRadius: 20, padding: 32,
            width: '100%', maxWidth: 820,
            maxHeight: '90vh', overflowY: 'auto',
            boxShadow: '0 25px 80px rgba(0,0,0,0.8)',
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                {editingBlog ? '✏️ Edit Blog Post' : '📝 Create New Blog Post'}
              </h2>
              <button onClick={() => setShowModal(false)} style={{
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8, color: '#94a3b8', fontSize: 20, cursor: 'pointer',
                width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>×</button>
            </div>

            <form onSubmit={handleSave}>
              {/* Title */}
              <div style={{ marginBottom: 16 }}>
                <label style={LS.label}>Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="Enter blog title..."
                  style={LS.input}
                  required
                />
              </div>

              {/* Excerpt */}
              <div style={{ marginBottom: 16 }}>
                <label style={LS.label}>Excerpt (short description)</label>
                <input
                  type="text"
                  value={form.excerpt}
                  onChange={e => setForm({ ...form, excerpt: e.target.value })}
                  placeholder="Brief summary of the blog..."
                  style={LS.input}
                />
              </div>

              {/* ===== REACT QUILL RICH TEXT EDITOR ===== */}
              <div style={{ marginBottom: 20 }}>
                <label style={LS.label}>Content * <span style={{ color: '#475569', fontWeight: 400 }}>(Rich Text Editor)</span></label>
                <ReactQuill
                  theme="snow"
                  value={form.content}
                  onChange={(val) => setForm({ ...form, content: val })}
                  modules={QUILL_MODULES}
                  formats={QUILL_FORMATS}
                  placeholder="Write your blog content here... Use the toolbar for formatting!"
                />
              </div>

              {/* Category + Tags row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={LS.label}>Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={LS.input}>
                    <option value="general">General</option>
                    <option value="security">Security</option>
                    <option value="ai">AI & ML</option>
                    <option value="news">News</option>
                    <option value="tutorial">Tutorial</option>
                  </select>
                </div>
                <div>
                  <label style={LS.label}>Tags (comma separated)</label>
                  <input
                    type="text"
                    value={form.tags}
                    onChange={e => setForm({ ...form, tags: e.target.value })}
                    placeholder="cybersecurity, hacking, tips"
                    style={LS.input}
                  />
                </div>
              </div>

              {/* Checkboxes */}
              <div style={{ display: 'flex', gap: 24, marginBottom: 28 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: '#94a3b8', fontSize: 14 }}>
                  <input type="checkbox" checked={form.isPublished} onChange={e => setForm({ ...form, isPublished: e.target.checked })} style={{ width: 16, height: 16, accentColor: '#0084ff' }} />
                  Publish immediately
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: '#94a3b8', fontSize: 14 }}>
                  <input type="checkbox" checked={form.isFeatured} onChange={e => setForm({ ...form, isFeatured: e.target.checked })} style={{ width: 16, height: 16, accentColor: '#f59e0b' }} />
                  ⭐ Feature this blog
                </label>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{
                  padding: '10px 22px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 10, color: '#94a3b8',
                  fontSize: 14, fontWeight: 600, cursor: 'pointer',
                }}>Cancel</button>
                <button type="submit" disabled={saving} style={{
                  padding: '10px 28px',
                  background: saving ? '#1e3a5f' : 'linear-gradient(135deg, #0084ff, #0052cc)',
                  border: 'none', borderRadius: 10,
                  color: '#fff', fontSize: 14, fontWeight: 700,
                  cursor: saving ? 'not-allowed' : 'pointer',
                  boxShadow: saving ? 'none' : '0 4px 18px rgba(0,132,255,0.4)',
                }}>
                  {saving ? 'Saving...' : editingBlog ? '💾 Update Blog' : '🚀 Create Blog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

// Label + Input Styles
const LS = {
  label: {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: '#94a3b8',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    background: 'rgba(15,23,42,0.8)',
    border: '1px solid rgba(0,132,255,0.2)',
    borderRadius: 10,
    fontSize: 14,
    color: '#f1f5f9',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },
};

export default AdminBlogs;

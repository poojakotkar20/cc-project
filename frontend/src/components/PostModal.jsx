import React, { useState, useEffect } from 'react';
import { 
  X, 
  Clock, 
  User, 
  Calendar, 
  Heart, 
  Edit3, 
  Trash2, 
  Send, 
  AlertCircle,
  Tag,
  BookOpen
} from 'lucide-react';

const CATEGORIES = [
  'Technology & AI',
  'Web Development',
  'Productivity & Life',
  'Design & UI/UX',
  'Cloud & Architecture',
  'Career & Learning',
];

const PRESET_IMAGES = [
  { label: 'Technology', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Writing & Desk', url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Design & Creative', url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Architecture', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80' },
];

export default function PostModal({
  isOpen,
  mode, // 'view' | 'create' | 'edit'
  post,
  onClose,
  onSubmit,
  onEditTrigger,
  onDeleteTrigger,
  onLikeTrigger,
  submitting
}) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: 'Technology & AI',
    tags: '',
    coverImage: PRESET_IMAGES[0].url,
    content: '',
  });

  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (post && (mode === 'edit' || mode === 'view')) {
      setFormData({
        title: post.title || '',
        author: post.author || '',
        category: post.category || 'Technology & AI',
        tags: Array.isArray(post.tags) ? post.tags.join(', ') : (post.tags || ''),
        coverImage: post.coverImage || PRESET_IMAGES[0].url,
        content: post.content || '',
      });
    } else if (mode === 'create') {
      setFormData({
        title: '',
        author: 'Pooja',
        category: 'Technology & AI',
        tags: 'Reading, Learning, BlogSpace',
        coverImage: PRESET_IMAGES[0].url,
        content: '',
      });
    }
    setFormError('');
  }, [post, mode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFormError('Please enter a title for your story.');
      return;
    }
    if (!formData.content.trim()) {
      setFormError('Please write some content for your story.');
      return;
    }
    setFormError('');
    onSubmit(formData);
  };

  const formattedDate = post?.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {mode === 'view' ? 'Story' : (mode === 'create' ? 'Write a Story' : 'Edit Story')}
            </span>
          </div>
          <button onClick={onClose} className="btn-icon" style={{ borderRadius: '50%' }}>
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem' }}>
          {formError && (
            <div style={{ 
              backgroundColor: 'rgba(239, 68, 68, 0.15)', 
              color: '#fca5a5', 
              padding: '0.75rem 1rem', 
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.88rem'
            }}>
              <AlertCircle size={16} />
              <span>{formError}</span>
            </div>
          )}

          {/* VIEW MODE: Natural Article Reader */}
          {mode === 'view' && post && (
            <div>
              {post.coverImage && (
                <div style={{ 
                  borderRadius: 'var(--radius-md)', 
                  overflow: 'hidden', 
                  maxHeight: '300px', 
                  marginBottom: '1.5rem',
                  backgroundColor: '#1e293b'
                }}>
                  <img 
                    src={post.coverImage} 
                    alt={post.title} 
                    style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                  />
                </div>
              )}

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', alignItems: 'center', marginBottom: '0.85rem' }}>
                <span className="badge badge-cloud">{post.category}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Clock size={13} /> {post.readTime || '3 min read'}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Calendar size={13} /> {formattedDate}
                </span>
              </div>

              <h1 style={{ fontSize: '1.85rem', fontWeight: 800, lineHeight: 1.3, marginBottom: '1.25rem' }}>
                {post.title}
              </h1>

              {/* Author & Controls Strip */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.75rem',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{ 
                    width: '36px', 
                    height: '36px', 
                    borderRadius: '50%', 
                    background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    color: '#ffffff'
                  }}>
                    {(post.author || 'A')[0].toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{post.author}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Published author on BlogSpace</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={() => onLikeTrigger(post._id)}
                    className="btn btn-secondary btn-sm"
                    style={{ gap: '0.4rem' }}
                    title="Like article"
                  >
                    <Heart size={15} color={post.likes > 0 ? '#ec4899' : 'currentColor'} fill={post.likes > 0 ? '#ec4899' : 'none'} />
                    <span>{post.likes || 0}</span>
                  </button>
                  <button 
                    onClick={() => onEditTrigger(post)}
                    className="btn btn-secondary btn-sm"
                    title="Edit article"
                  >
                    <Edit3 size={15} />
                    <span>Edit</span>
                  </button>
                  <button 
                    onClick={() => onDeleteTrigger(post)}
                    className="btn btn-outline-danger btn-sm"
                    title="Delete article"
                  >
                    <Trash2 size={15} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>

              {/* Article Content */}
              <div style={{ 
                fontSize: '1.05rem', 
                lineHeight: 1.8, 
                color: '#e2e8f0', 
                whiteSpace: 'pre-line',
                marginBottom: '1.75rem' 
              }}>
                {post.content}
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
                  {post.tags.map((tag, idx) => (
                    <span key={idx} className="badge badge-cloud" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CREATE / EDIT FORM */}
          {(mode === 'create' || mode === 'edit') && (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Article Title</label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. 5 Habits That Transformed My Daily Creative Routine"
                  className="form-input"
                  style={{ fontSize: '1.05rem', fontWeight: 600 }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Author Name</label>
                  <input 
                    type="text" 
                    value={formData.author} 
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="Your name"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Topic / Category</label>
                  <select 
                    value={formData.category} 
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="form-select"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Tags (comma-separated)</label>
                <input 
                  type="text" 
                  value={formData.tags} 
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="e.g. Productivity, Mindset, Writing"
                  className="form-input"
                />
              </div>

              {/* Cover Image Presets */}
              <div className="form-group">
                <label className="form-label">Cover Image URL</label>
                <input 
                  type="url" 
                  value={formData.coverImage} 
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="form-input"
                  style={{ marginBottom: '0.5rem' }}
                />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cover themes:</span>
                  {PRESET_IMAGES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData({ ...formData, coverImage: preset.url })}
                      className="btn btn-secondary btn-sm"
                      style={{ 
                        fontSize: '0.72rem', 
                        padding: '0.2rem 0.55rem',
                        border: formData.coverImage === preset.url ? '1px solid var(--primary)' : '1px solid var(--border-subtle)' 
                      }}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Story Content</label>
                <textarea 
                  rows={8}
                  value={formData.content} 
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write your story here... Share insights, tutorials, or perspectives with readers."
                  className="form-textarea"
                  style={{ lineHeight: 1.7 }}
                  required
                />
              </div>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'flex-end', 
                gap: '0.75rem', 
                borderTop: '1px solid var(--border-subtle)', 
                paddingTop: '1.25rem' 
              }}>
                <button type="button" onClick={onClose} className="btn btn-secondary" disabled={submitting}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  <Send size={15} />
                  <span>{submitting ? 'Publishing...' : (mode === 'create' ? 'Publish Story' : 'Save Changes')}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

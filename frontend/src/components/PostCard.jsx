import React from 'react';
import { 
  Heart, 
  Clock, 
  Calendar, 
  Edit3, 
  Trash2, 
  ArrowRight, 
  Tag, 
  User 
} from 'lucide-react';

export default function PostCard({ post, onSelect, onEdit, onDelete, onLike }) {
  const formattedDate = new Date(post.createdAt || Date.now()).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'Cloud Architecture': return 'badge-cloud';
      case 'DevOps & CI/CD': return 'badge-netlify';
      case 'Database Design': return 'badge-mongo';
      default: return 'badge-render';
    }
  };

  return (
    <article 
      className="glass-panel" 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        overflow: 'hidden',
        height: '100%',
        position: 'relative',
        transition: 'var(--transition)'
      }}
    >
      {/* Cover Image */}
      <div 
        onClick={() => onSelect(post)}
        style={{ 
          position: 'relative', 
          height: '190px', 
          overflow: 'hidden', 
          cursor: 'pointer',
          backgroundColor: '#1e293b'
        }}
      >
        <img 
          src={post.coverImage || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80'} 
          alt={post.title}
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            transition: 'transform 0.4s ease'
          }}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80';
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.04)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
        <div style={{
          position: 'absolute',
          top: '0.85rem',
          left: '0.85rem',
          zIndex: 2
        }}>
          <span className={`badge ${getCategoryColor(post.category)}`}>
            {post.category || 'Cloud'}
          </span>
        </div>
        <div style={{
          position: 'absolute',
          top: '0.85rem',
          right: '0.85rem',
          zIndex: 2,
          background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(6px)',
          borderRadius: 'var(--radius-full)',
          padding: '0.2rem 0.6rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.3rem',
          fontSize: '0.72rem',
          color: '#e2e8f0'
        }}>
          <Clock size={12} />
          <span>{post.readTime || '3 min read'}</span>
        </div>
      </div>

      {/* Card Content */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 
          onClick={() => onSelect(post)}
          style={{ 
            fontSize: '1.12rem', 
            fontWeight: 700, 
            lineHeight: 1.4, 
            marginBottom: '0.6rem',
            cursor: 'pointer',
            color: 'var(--text-main)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {post.title}
        </h3>

        <p style={{ 
          fontSize: '0.88rem', 
          color: 'var(--text-secondary)', 
          lineHeight: 1.5,
          marginBottom: '1rem',
          flex: 1,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {post.excerpt || post.content.substring(0, 120) + '...'}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
            {post.tags.slice(0, 3).map((tag, idx) => (
              <span 
                key={idx}
                style={{ 
                  fontSize: '0.72rem', 
                  color: 'var(--text-muted)',
                  background: 'rgba(255, 255, 255, 0.04)',
                  padding: '0.15rem 0.45rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Author & Date Footer */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '0.85rem',
          marginTop: 'auto'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ 
              width: '28px', 
              height: '28px', 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#ffffff'
            }}>
              {(post.author || 'A')[0].toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{post.author || 'Anonymous'}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{formattedDate}</div>
            </div>
          </div>

          {/* Action Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <button 
              onClick={(e) => { e.stopPropagation(); onLike(post._id); }}
              className="btn-icon"
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.35rem 0.6rem' }}
              title="Like Post"
            >
              <Heart size={14} color={post.likes > 0 ? '#ec4899' : 'currentColor'} fill={post.likes > 0 ? '#ec4899' : 'none'} />
              <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{post.likes || 0}</span>
            </button>

            <button 
              onClick={(e) => { e.stopPropagation(); onEdit(post); }}
              className="btn-icon"
              title="Edit Post (PUT /api/posts/:id)"
            >
              <Edit3 size={14} />
            </button>

            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(post); }}
              className="btn-icon"
              style={{ color: '#f87171' }}
              title="Delete Post (DELETE /api/posts/:id)"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

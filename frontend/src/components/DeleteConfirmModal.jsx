import React from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';

export default function DeleteConfirmModal({ isOpen, post, onConfirm, onCancel, deleting }) {
  if (!isOpen || !post) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '440px' }}
      >
        <div style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ 
            width: '52px', 
            height: '52px', 
            borderRadius: '50%', 
            background: 'rgba(239, 68, 68, 0.15)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 1.25rem auto',
            color: 'var(--danger)'
          }}>
            <AlertTriangle size={28} />
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Delete Blog Post?
          </h3>

          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
            Are you sure you want to delete <strong style={{ color: 'var(--text-main)' }}>"{post.title}"</strong>?
            This will permanently remove the document from <strong style={{ color: 'var(--tier-mongo)' }}>MongoDB Atlas</strong> via the Render API.
          </p>

          <div style={{ 
            background: 'rgba(0, 0, 0, 0.3)', 
            padding: '0.6rem 0.8rem', 
            borderRadius: 'var(--radius-sm)', 
            fontSize: '0.75rem', 
            fontFamily: 'var(--font-mono)', 
            color: 'var(--text-muted)',
            marginBottom: '1.5rem',
            textAlign: 'left'
          }}>
            DELETE {`/api/posts/${post._id}`}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button 
              type="button" 
              onClick={onCancel} 
              className="btn btn-secondary" 
              disabled={deleting}
              style={{ flex: 1 }}
            >
              Cancel
            </button>
            <button 
              type="button" 
              onClick={() => onConfirm(post._id)} 
              className="btn btn-danger" 
              disabled={deleting}
              style={{ flex: 1 }}
            >
              <Trash2 size={16} />
              <span>{deleting ? 'Deleting...' : 'Delete'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
